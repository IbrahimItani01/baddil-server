import { Injectable, NotFoundException } from '@nestjs/common'; // 📦 Importing necessary exceptions
import { PrismaService } from 'src/database/prisma.service'; // 🗄️ Importing PrismaService for database access
import { DisputeStatus } from '@prisma/client'; // 📜 Importing DisputeStatus enum from Prisma
import {
  CreateDisputeDto,
  DisputeDto,
  ResolveDisputeDto,
} from './dto/disputes.dto'; // 📥 Importing DTOs
import { handleError } from 'src/utils/general/error.utils';

@Injectable()
export class DisputesService {
  constructor(private readonly prisma: PrismaService) {} // 🏗️ Injecting PrismaService

  /**
   * ➕ Create a new dispute
   * @param data - The dispute details including admin ID, user IDs, and details.
   * @returns The created dispute record.
   * @throws InternalServerErrorException if there is an error creating the dispute.
   */
  async createDispute(data: CreateDisputeDto): Promise<DisputeDto> {
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
      handleError(error, 'Failed to create dispute');
    }
  }

  /**
   * 📜 Get all disputes with optional filters
   * @param query - Optional filters for status and user ID.
   * @returns An array of disputes matching the filters.
   */
  async getDisputes(query: {
    status?: DisputeStatus;
    userId?: string;
  }): Promise<DisputeDto[]> {
    const { status, userId } = query;
    try {
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
    } catch (error) {
      handleError(error, 'Failed to retrieve disputes');
    }
  }

  /**
   * 📜 Get a specific dispute by ID
   * @param id - The ID of the dispute to retrieve.
   * @returns The dispute record.
   * @throws NotFoundException if the dispute is not found.
   */
  async getDispute(id: string): Promise<DisputeDto> {
    try {
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
    } catch (error) {
      handleError(error, 'Failed to retrieve dispute');
    }
  }

  /**
   * ✏️ Resolve a dispute (update the status and resolved_at date)
   * @param id - The ID of the dispute to resolve.
   * @returns The updated dispute record.
   * @throws InternalServerErrorException if there is an error resolving the dispute.
   */
  async resolveDispute(
    id: string,
    data: ResolveDisputeDto,
  ): Promise<DisputeDto> {
    try {
      return await this.prisma.dispute.update({
        where: { id },
        data: {
          status: data.status,
          resolved_at: data.resolved_at || new Date(),
        },
      });
    } catch (error) {
      handleError(error, 'Failed to resolve dispute');
    }
  }
}
