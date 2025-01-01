// src/barters/barters.service.ts

import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common'; // 📦 Importing necessary exceptions
import { BarterStatus } from '@prisma/client'; // 📜 Importing BarterStatus enum from Prisma
import { PrismaService } from 'src/database/prisma.service'; // 🗄️ Importing PrismaService for database access
import {
  CreateBarterDto,
  UpdateBarterStatusDto,
  BarterResponseDto,
} from './dto/barters.dto'; // Importing DTOs

@Injectable()
export class BartersService {
  constructor(private readonly prisma: PrismaService) {} // 🏗️ Injecting PrismaService

  /**
   * 📄 Get Barters by User
   * Fetches all barters associated with a specific user.
   * @param userId - The ID of the user whose barters are to be fetched.
   * @returns An array of barters associated with the user.
   * @throws NotFoundException if no barters are found for the user.
   */
  async getBartersByUser(userId: string): Promise<BarterResponseDto[]> {
    const barters = await this.prisma.barter.findMany({
      where: { user1_id: userId },
    });

    if (!barters.length) {
      throw new NotFoundException('No barters found for this user'); // Handle case where no barters are found
    }

    return barters.map((barter) => this.mapBarterResponse(barter)); // Map and return the barters
  }

  /**
   * ➕ Create Barter
   * Creates a new barter between two users.
   * @param userId - The ID of the user creating the barter.
   * @param barterDetails - Details of the barter including user2Id and item IDs.
   * @returns The created barter object.
   * @throws BadRequestException if the barter creation fails.
   */
  async createBarter(
    userId: string,
    barterDetails: CreateBarterDto,
  ): Promise<BarterResponseDto> {
    try {
      // Lookup user2_id using the provided email
      const user2 = await this.prisma.user.findUnique({
        where: { email: barterDetails.user2Email },
      });

      if (!user2) {
        throw new NotFoundException(
          `User with email ${barterDetails.user2Email} not found`,
        );
      }
      const createdBarter = await this.prisma.barter.create({
        data: {
          user1_id: userId,
          user2_id: barterDetails.user2Id,
          user1_item_id: barterDetails.user1ItemId,
          user2_item_id: barterDetails.user2ItemId,
          status: BarterStatus.ongoing, // Default status
        },
      });
      return this.mapBarterResponse(createdBarter); // Return the created barter formatted as BarterResponseDto
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      throw new BadRequestException('Failed to create barter'); // Handle case where barter creation fails
    }
  }

  /**
   * ✏️ Update Barter Status
   * Updates the status of an existing barter.
   * @param updateDetails - Object containing barterId and new status.
   * @returns The updated barter object.
   * @throws NotFoundException if the barter is not found.
   */
  async updateBarterStatus(
    updateDetails: UpdateBarterStatusDto,
  ): Promise<BarterResponseDto> {
    const barter = await this.prisma.barter.findUnique({
      where: { id: updateDetails.barterId },
    });

    if (!barter) {
      throw new NotFoundException('Barter not found'); // Handle case where barter does not exist
    }

    const updatedBarter = await this.prisma.barter.update({
      where: { id: updateDetails.barterId },
      data: {
        status: updateDetails.status,
      },
    });
    return this.mapBarterResponse(updatedBarter); // Return updated barter formatted as BarterResponseDto
  }

  /**
   * ❌ Cancel Barter
   * Cancels or removes a barter from the Barterer's list.
   * @param barterId - The ID of the barter to cancel.
   * @throws NotFoundException if the barter is not found.
   */
  async cancelBarter(barterId: string): Promise<void> {
    const barter = await this.prisma.barter.findUnique({
      where: { id: barterId },
    });

    if (!barter) {
      throw new NotFoundException('Barter not found'); // Handle case where barter does not exist
    }

    await this.prisma.barter.delete({
      where: { id: barterId },
    });
  }

  /**
   * Helper function to map the Barter object to the BarterResponseDto format
   */
  private mapBarterResponse(barter): BarterResponseDto {
    return {
      id: barter.id,
      user1_id: barter.user1_id,
      user2_id: barter.user2_id,
      user1_item_id: barter.user1_item_id,
      user2_item_id: barter.user2_item_id,
      status: barter.status,
    };
  }
}
