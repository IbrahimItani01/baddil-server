// src/brokers/brokers.service.ts

import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common'; // 📦 Importing necessary exceptions
import { PrismaService } from 'src/database/prisma.service'; // 🗄️ Importing PrismaService for database access
import { findUserByEmail } from 'src/utils/modules/users/users.utils';
import { checkItemInUserWallet } from 'src/utils/modules/wallet/wallet.utils';
import { handleError } from 'src/utils/general/error.utils';

@Injectable()
export class BrokerService {
  constructor(
    private readonly prisma: PrismaService, // 🏗️ Injecting PrismaService
  ) {}

  async getHiredBrokers(userId: string) {
    try {
      // Fetch hired brokers for the specified user
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

      // Throw an error if no hired brokers are found
      if (!hiredBrokers.length) {
        throw new NotFoundException('No hired brokers found for this user'); // 🚫 No brokers found
      }

      // Map and return the result in the required format
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
    } catch (error) {
      // Handle errors using the utility function
      handleError(error, 'Failed to retrieve hired brokers');
    }
  }

  async hireBroker(userId: string, body: any) {
    try {
      const { brokerEmail, budget, targetItemId } = body;

      // Find the broker by email using the external function
      const broker = await findUserByEmail(this.prisma, brokerEmail);

      // Check if the target item is in the user's wallet
      await checkItemInUserWallet(this.prisma, userId, targetItemId);

      // Create the hire record
      const hire = await this.prisma.hire.create({
        data: {
          client_id: userId,
          broker_id: broker.id,
          target_item_id: targetItemId,
          budget,
        },
      });

      return hire; // 🎉 Returning the created hire record
    } catch (error) {
      handleError(error, 'Failed to hire broker');
    }
  }

  async terminateBrokerContract(userId: string, brokerEmail: string) {
    try {
      // Find the broker by email using the external function
      const broker = await findUserByEmail(this.prisma, brokerEmail);

      // Find the active hire contract between the user and the broker
      const hire = await this.prisma.hire.findFirst({
        where: {
          client_id: userId,
          broker_id: broker.id,
          status: { not: 'cancelled' },
        },
      });

      if (!hire) {
        throw new NotFoundException(
          'No active hire contract found between the client and broker',
        ); // 🚫 No active contract found
      }

      // Update the hire contract's status to 'cancelled'
      const updatedHire = await this.prisma.hire.update({
        where: { id: hire.id },
        data: { status: 'cancelled' },
      });

      return updatedHire; // 🎉 Returning the updated hire record
    } catch (error) {
      handleError(error, 'Failed to terminate broker contract');
    }
  }

  async getHireContractStatus(userId: string, hireId: string) {
    const hire = await this.prisma.hire.findUnique({
      where: { id: hireId },
      select: {
        id: true,
        status: true,
        budget: true,
        created_at: true,
        completed_at: true,
        broker: { select: { email: true } },
        client: { select: { id: true } },
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
