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
    private readonly usersService: UsersService, // 🏗️ Injecting UsersService
  ) {}

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

  async hireBroker(userId: string, body) {
    const { brokerEmail, budget, targetItemId } = body;
    const broker = await this.prisma.user.findUnique({
      where: { email: brokerEmail },
    });

    if (!broker) {
      throw new NotFoundException(`Broker with email ${brokerEmail} not found`); // 🚫 Broker not found
    }

    const hire = await this.prisma.hire.create({
      data: {
        client_id: userId,
        broker_id: broker.id,
        target_item_id: targetItemId,
        budget,
      },
    });

    return hire; // 🎉 Returning the created hire record
  }

  async terminateBrokerContract(userId: string, brokerEmail: string) {
    const broker = await this.usersService.findByEmail(brokerEmail);

    if (!broker) {
      throw new NotFoundException(`Broker with email ${brokerEmail} not found`); // 🚫 Broker not found
    }

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

    const updatedHire = await this.prisma.hire.update({
      where: { id: hire.id },
      data: { status: 'cancelled' },
    });

    return updatedHire; // 🎉 Returning the updated hire record
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
