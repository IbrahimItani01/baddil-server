import {
  Injectable,
  NotFoundException,
  InternalServerErrorException,
} from '@nestjs/common'; // 📦 Importing necessary exceptions
import { PrismaService } from 'src/database/prisma.service'; // 🗄️ Importing PrismaService for database access
import { DisputeStatus } from '@prisma/client'; // 📜 Importing Dispute Status enum from Prisma

@Injectable()
export class DisputesService {
  constructor(private readonly prisma: PrismaService) {} // 🏗️ Injecting PrismaService

  /**
   * ➕ Create a new dispute
   * @param data - The dispute details including admin ID, user IDs, and details.
   * @returns The created dispute record.
   * @throws InternalServerErrorException if there is an error creating the dispute.
   */
  async createDispute(data: {
    adminId: string;
    user1Id: string;
    user2Id: string;
    details: string;
  }) {
    try {
      return await this.prisma.dispute.create({
        data: {
          admin_id: data.adminId,
          user1_id: data.user1Id,
          user2_id: data.user2Id,
          details: data.details,
          status: DisputeStatus.ongoing, // Default status is "ongoing"
        },
      });
    } catch (error) {
      throw new InternalServerErrorException(
        'Failed to create dispute: ' + error.message,
      ); // 🚫 Error handling
    }
  }

  /**
   * 📜 Get all disputes with optional filters
   * @param query - Optional filters for status and user ID.
   * @returns An array of disputes matching the filters.
   */
  async getDisputes(query: { status?: DisputeStatus; userId?: string }) {
    const { status, userId } = query;
    return this.prisma.dispute.findMany({
      where: {
        status,
        OR: [{ user1_id: userId }, { user2_id: userId }, { admin_id: userId }],
      },
      include: {
        admin: true,
        user1: true,
        user2: true,
      },
    });
  }

  /**
   * 📜 Get a specific dispute by ID
   * @param id - The ID of the dispute to retrieve.
   * @returns The dispute record.
   * @throws NotFoundException if the dispute is not found.
   */
  async getDispute(id: string) {
    const dispute = await this.prisma.dispute.findUnique({
      where: { id },
      include: {
        admin: true,
        user1: true,
        user2: true,
      },
    });

    if (!dispute) {
      throw new NotFoundException('Dispute not found'); // 🚫 Error handling for not found
    }

    return dispute;
  }

  /**
   * ✏️ Resolve a dispute (update the status and resolved_at date)
   * @param id - The ID of the dispute to resolve.
   * @returns The updated dispute record.
   * @throws InternalServerErrorException if there is an error resolving the dispute.
   */
  async resolveDispute(id: string) {
    try {
      return await this.prisma.dispute.update({
        where: { id },
        data: {
          status: DisputeStatus.resolved,
          resolved_at: new Date(),
        },
      });
    } catch (error) {
      throw new InternalServerErrorException(
        'Failed to resolve dispute: ' + error.message,
      ); // 🚫 Error handling
    }
  }
}
