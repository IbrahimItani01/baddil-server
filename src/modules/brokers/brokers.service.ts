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
  
}
