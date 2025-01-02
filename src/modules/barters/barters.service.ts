// src/barters/barters.service.ts

import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common'; // 📦 Importing necessary exceptions
import { BarterStatus } from '@prisma/client'; // 📜 Importing BarterStatus enum from Prisma
import { PrismaService } from 'src/database/prisma.service'; // 🗄️ Importing PrismaService for database access
import {
  CreateBarterDto,
  UpdateBarterStatusDto,
  BarterResponseDto,
} from './dto/barters.dto'; // Importing DTOs
import { handleError } from 'src/utils/general/error.utils';
import { findUserByEmail } from 'src/utils/modules/users/users.utils';
import { checkItemInUserWallet } from 'src/utils/modules/wallet/wallet.utils';
import {
  findBarterById,
  processBarterUpdate,
} from 'src/utils/modules/barters/barters.utils';

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
    try {
      const barters = await this.prisma.barter.findMany({
        where: {
          OR: [{ user1_id: userId }, { user2_id: userId }],
        },
      });

      if (!barters.length) {
        throw new NotFoundException('No barters found for this user'); // Handle case where no barters are found
      }

      return barters.map((barter) => this.mapBarterResponse(barter)); // Map and return the barters
    } catch (error) {
      handleError(
        error,
        'An error occurred while retrieving barters for the user',
      );
    }
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
      const user2 = await findUserByEmail(
        this.prisma,
        barterDetails.user2Email,
      );

      // Validate user1's item in their wallet
      await checkItemInUserWallet(
        this.prisma,
        userId,
        barterDetails.user1ItemId,
      );

      // Validate user2's item in their wallet
      await checkItemInUserWallet(
        this.prisma,
        user2.id,
        barterDetails.user2ItemId,
      );

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
      handleError(error, 'Failed to create barter');
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
    try {
      // Find the barter by ID using the utility function
      const barter = await findBarterById(this.prisma, updateDetails.barterId);

      // Check if the user is involved in the barter
      if (barter.user1_id !== userId && barter.user2_id !== userId) {
        throw new ForbiddenException(
          'You are not authorized to update the status of this barter',
        );
      }

      // Process the barter update using the utility function
      const updateData = processBarterUpdate(barter.status, {
        status: updateDetails.status,
      });

      // Update the barter in the database
      const updatedBarter = await this.prisma.barter.update({
        where: { id: updateDetails.barterId },
        data: updateData,
      });

      // Return the updated barter formatted as a BarterResponseDto
      return this.mapBarterResponse(updatedBarter);
    } catch (error) {
      // Use the handleError utility for consistent error handling
      handleError(error, 'Failed to update barter status');
    }
  }

  /**
   * ❌ Cancel Barter
   * Cancels or removes a barter from the Barterer's list.
   * @param barterId - The ID of the barter to cancel.
   * @throws NotFoundException if the barter is not found.
   */
  async cancelBarter(barterId: string): Promise<void> {
    try {
      // Use utility function to find the barter
      findBarterById(this.prisma, barterId);

      // Delete the barter
      await this.prisma.barter.delete({
        where: { id: barterId },
      });
    } catch (error) {
      // Handle errors using the utility function
      handleError(error, 'Failed to cancel the barter');
    }
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
