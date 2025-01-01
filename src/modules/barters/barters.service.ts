// src/barters/barters.service.ts

import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ForbiddenException,
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
      where: {
        OR: [{ user1_id: userId }, { user2_id: userId }],
      },
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

      // Get user1's wallet
      const user1Wallet = await this.prisma.wallet.findFirst({
        where: { owner_id: userId },
      });

      if (!user1Wallet) {
        throw new NotFoundException(
          `Wallet not found for user1 (ID: ${userId})`,
        );
      }

      // Get user2's wallet
      const user2Wallet = await this.prisma.wallet.findFirst({
        where: { owner_id: user2.id },
      });

      if (!user2Wallet) {
        throw new NotFoundException(
          `Wallet not found for user2 (Email: ${barterDetails.user2Email})`,
        );
      }

      // Validate user1's item
      const user1Item = await this.prisma.item.findFirst({
        where: {
          id: barterDetails.user1ItemId,
          wallet_id: user1Wallet.id, // Ensure the item is in user1's wallet
        },
      });

      if (!user1Item) {
        throw new BadRequestException(
          `Item with ID ${barterDetails.user1ItemId} does not belong to user1's wallet`,
        );
      }

      // Validate user2's item
      const user2Item = await this.prisma.item.findFirst({
        where: {
          id: barterDetails.user2ItemId,
          wallet_id: user2Wallet.id, // Ensure the item is in user2's wallet
        },
      });

      if (!user2Item) {
        throw new BadRequestException(
          `Item with ID ${barterDetails.user2ItemId} does not belong to user2's wallet`,
        );
      }

      // Create the barter with the resolved user2_id and validated items
      const createdBarter = await this.prisma.barter.create({
        data: {
          user1_id: userId,
          user2_id: user2.id, // Use the found user ID
          user1_item_id: barterDetails.user1ItemId,
          user2_item_id: barterDetails.user2ItemId,
          status: BarterStatus.ongoing, // Default status
        },
      });

      return this.mapBarterResponse(createdBarter); // Return the created barter formatted as BarterResponseDto
    } catch (error) {
      throw new BadRequestException(
        error instanceof NotFoundException
          ? error.message
          : 'Failed to create barter',
      ); // Handle errors gracefully
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
    userId: string,
    updateDetails: UpdateBarterStatusDto,
  ): Promise<BarterResponseDto> {
    const barter = await this.prisma.barter.findUnique({
      where: { id: updateDetails.barterId },
    });

    if (!barter) {
      throw new NotFoundException('Barter not found'); // Handle case where barter does not exist
    }

    // Check if the user is involved in the barter
    if (barter.user1_id !== userId && barter.user2_id !== userId) {
      throw new ForbiddenException(
        'You are not authorized to update the status of this barter',
      );
    }

    // Prevent updates to completed or aborted barters
    if (
      barter.status === BarterStatus.completed ||
      barter.status === BarterStatus.aborted
    ) {
      throw new BadRequestException(
        `Cannot update status of a barter that is already ${barter.status}`,
      );
    }

    // Update the barter status
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
