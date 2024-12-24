import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/database/prisma.service';

@Injectable()
export class ManagementService {
  constructor(private readonly prisma: PrismaService) {}

  async createSubscriptionPlan(data: {
    name: string;
    price: number;
    targetUserTypeId: string; // Updated to handle foreign key
    criteria?: string;
  }) {
    return this.prisma.subscriptionPlan.create({
      data: {
        name: data.name,
        price: data.price,
        criteria: data.criteria,
        user_type: {
          connect: { id: data.targetUserTypeId }, // Relates to UserType by ID
        },
      },
    });
  }

