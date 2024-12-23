import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/database/prisma.service';
import { UsersService } from '../users/users.service';

@Injectable()
export class BrokerService {
  constructor(private readonly prisma: PrismaService,private readonly usersService: UsersService) {}

  async getHiredBrokers(userId: string) {
      const hiredBrokers = await this.prisma.hire.findMany({
        where: { client_id: userId },
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
        throw new NotFoundException('No hired brokers found for this user');
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
  
    async hireBroker(userId: string, brokerEmail: string, targetItemId: string, budget: number) {
      // Step 1: Find the broker by email
      const broker = await this.prisma.user.findUnique({
        where: { email: brokerEmail },
      });
  
      if (!broker) {
        throw new NotFoundException(`Broker with email ${brokerEmail} not found`);
      }
  
      // Step 2: Create a new hire record in the hires table
      const hire = await this.prisma.hire.create({
        data: {
          client_id: userId,
          broker_id: broker.id,
          target_item_id: targetItemId,
          budget,
        },
      });
  
      return hire;
    }
  
    async terminateBrokerContract(userId: string, brokerEmail: string) {
      // Step 1: Find the broker by email using the existing service method
      const broker = await this.usersService.findByEmail(brokerEmail);
  
      if (!broker) {
        throw new NotFoundException(`Broker with email ${brokerEmail} not found`);
      }
  
      // Step 2: Find the hire contract between the client and the broker
      const hire = await this.prisma.hire.findFirst({
        where: {
          client_id: userId,
          broker_id: broker.id, // Use the broker's ID
          status: {
            not: 'cancelled', // Ensure the status is not already cancelled
          },
        },
      });
  
      if (!hire) {
        throw new NotFoundException(`No active hire contract found between the client and broker`);
      }
  
      // Step 3: Update the hire record's status to 'cancelled'
      const updatedHire = await this.prisma.hire.update({
        where: { id: hire.id },
        data: {
          status: 'cancelled', // Mark the contract as cancelled
        },
      });
  
      return updatedHire;
    }
}
