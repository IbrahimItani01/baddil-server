import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/database/prisma.service';
import { DisputeStatus } from '@prisma/client';

@Injectable()
export class DisputesService {
  constructor(private readonly prisma: PrismaService) {}

  // Create a new dispute
  async createDispute(data: {
    adminId: string;
    user1Id: string;
    user2Id: string;
    details: string;
  }) {
    return this.prisma.dispute.create({
      data: {
        admin_id: data.adminId,
        user1_id: data.user1Id,
        user2_id: data.user2Id,
        details: data.details,
        status: DisputeStatus.ongoing, // Default status is "ongoing"
      },
    });
  }

