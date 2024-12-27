import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common'; // 📦 Importing necessary exceptions
import { PrismaService } from 'src/database/prisma.service'; // 🗄️ Importing PrismaService for database access
import { UsersService } from '../users/users.service'; // 👤 Importing UsersService for user-related operations

@Injectable()
export class BrokerService {
  constructor(
    private readonly prisma: PrismaService, // 🏗️ Injecting PrismaService
    private readonly usersService: UsersService, // 🏗️ Injecting UsersService
  ) {}

  /**
   * 📜 Get Hired Brokers
   * Fetches all brokers hired by the specified user.
   * @param userId - The ID of the user requesting the information.
   * @returns An array of hired brokers.
   * @throws NotFoundException if no hired brokers are found.
   */
  async getHiredBrokers(userId: string) {
    const hiredBrokers = await this.prisma.hire.findMany({
      where: { client_id: userId }, // 🔍 Filtering by user ID
      select: {
        id: true,
        broker: {
          select: {
            id: true,
            name: true,
            profile_picture: true,
            email: true,
          },
        },
        budget: true,
        status: true,
        created_at: true,
        completed_at: true,
      },
    });

    if (!hiredBrokers.length) {
      throw new NotFoundException('No hired brokers found for this user'); // 🚫 No brokers found
    }

    return hiredBrokers.map((hire) => ({
      hireId: hire.id,
      broker: {
        id: hire.broker.id,
        name: hire.broker.name,
        profilePicture: hire.broker.profile_picture,
        email: hire.broker.email,
      },
      budget: hire.budget,
      status: hire.status,
      createdAt: hire.created_at,
      completedAt: hire.completed_at,
    }));
  }

  /**
   * ➕ Hire Broker
   * Hires a broker for a specific item with a given budget.
   * @param userId - The ID of the user hiring the broker.
   * @param brokerEmail - The email of the broker to hire.
   * @param targetItemId - The ID of the item the broker will target.
   * @param budget - The budget for hiring the broker.
   * @returns The created hire record.
   * @throws NotFoundException if the broker is not found.
   */
  async hireBroker(
    userId: string,
    brokerEmail: string,
    targetItemId: string,
    budget: number,
  ) {
    // Step 1: Find the broker by email
    const broker = await this.prisma.user.findUnique({
      where: { email: brokerEmail }, // 🔍 Finding broker by email
    });

    if (!broker) {
      throw new NotFoundException(`Broker with email ${brokerEmail} not found`); // 🚫 Broker not found
    }

    // Step 2: Create a new hire record in the hires table
    const hire = await this.prisma.hire.create({
      data: {
        client_id: userId, // 🏷️ User ID of the client
        broker_id: broker.id, // 🏷️ Broker ID
        target_item_id: targetItemId, // 🏷️ Target item ID
        budget, // 💰 Budget for the hire
      },
    });

    return hire; // 🎉 Returning the created hire record
  }

  /**
   * ❌ Terminate Broker Contract
   * Terminates the contract with a hired broker.
   * @param userId - The ID of the user terminating the contract.
   * @param brokerEmail - The email of the broker whose contract is being terminated.
   * @returns The updated hire record.
   * @throws NotFoundException if the broker or hire contract is not found.
   */
  async terminateBrokerContract(userId: string, brokerEmail: string) {
    // Step 1: Find the broker by email using the existing service method
    const broker = await this.usersService.findByEmail(brokerEmail); // 🔍 Finding broker by email

    if (!broker) {
      throw new NotFoundException(`Broker with email ${brokerEmail} not found`); // 🚫 Broker not found
    }

    // Step 2: Find the hire contract between the client and the broker
    const hire = await this.prisma.hire.findFirst({
      where: {
        client_id: userId, // 🏷️ User ID of the client
        broker_id: broker.id, // 🏷️ Broker ID
        status: {
          not: 'cancelled', // Ensure the status is not already cancelled
        },
      },
    });

    if (!hire) {
      throw new NotFoundException(
        `No active hire contract found between the client and broker`,
      ); // 🚫 No active contract found
    }

    // Step 3: Update the hire record's status to 'cancelled'
    const updatedHire = await this.prisma.hire.update({
      where: { id: hire.id }, // 🏷️ Updating the hire record by ID
      data: {
        status: 'cancelled', // 🛑 Marking the contract as cancelled
      },
    });

    return updatedHire; // 🎉 Returning the updated hire record
  }

  /**
   * 📄 Get Hire Contract Status
   * Retrieves the status of a specific hire contract.
   * @param userId - The ID of the user requesting the status.
   * @param hireId - The ID of the hire contract.
   * @returns The status and details of the hire contract.
   * @throws NotFoundException if the hire contract is not found.
   * @throws ForbiddenException if the user does not have permission to view the contract.
   */
  async getHireContractStatus(userId: string, hireId: string) {
    // Step 1: Retrieve the hire contract by hireId and ensure it belongs to the user
    const hire = await this.prisma.hire.findUnique({
      where: { id: hireId }, // 🔍 Finding hire by ID
      select: {
        id: true,
        status: true,
        budget: true,
        created_at: true,
        completed_at: true,
        broker: { select: { email: true } }, // 📧 Selecting broker's email
        client: { select: { id: true } }, // 🏷️ Selecting client's ID
      },
    });

    if (!hire) {
      throw new NotFoundException('Hire contract not found'); // 🚫 Contract not found
    }

    if (hire.client.id !== userId) {
      throw new ForbiddenException(
        'You do not have permission to view this hire contract',
      ); // 🚫 Permission denied
    }

    // Return the hire contract details
    return {
      hireId: hire.id,
      status: hire.status,
      budget: hire.budget,
      createdAt: hire.created_at,
      completedAt: hire.completed_at,
      brokerEmail: hire.broker.email, // 📧 Returning broker's email
    };
  }
}
