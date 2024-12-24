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

  // Get all disputes with optional filters
  async getDisputes(query: { status?: DisputeStatus; userId?: string }) {
    const { status, userId } = query;
    return this.prisma.dispute.findMany({
      where: {
        status,
        OR: [
          { user1_id: userId },
          { user2_id: userId },
          { admin_id: userId },
        ],
      },
      include: {
        admin: true,
        user1: true,
        user2: true,
      },
    });
  }

  // Get a specific dispute by ID
  async getDispute(id: string) {
    return this.prisma.dispute.findUnique({
      where: { id },
      include: {
        admin: true,
        user1: true,
        user2: true,
      },
    });
  }

  // Resolve a dispute (update the status and resolved_at date)
  async resolveDispute(id: string) {
    return this.prisma.dispute.update({
      where: { id },
      data: {
        status: DisputeStatus.resolved,
        resolved_at: new Date(),
      },
    });
  }
}
