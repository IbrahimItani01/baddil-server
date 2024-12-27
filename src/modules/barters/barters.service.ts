import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common'; // 📦 Importing necessary exceptions
import { BarterStatus } from '@prisma/client'; // 📜 Importing BarterStatus enum from Prisma
import { PrismaService } from 'src/database/prisma.service'; // 🗄️ Importing PrismaService for database access

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
  async getBartersByUser(userId: string) {
    const barters = await this.prisma.barter.findMany({
      where: { user1_id: userId },
    });

    if (!barters.length) {
      throw new NotFoundException('No barters found for this user'); // Handle case where no barters are found
    }

    return barters; // Return the list of barters
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
    barterDetails: {
      user2Id: string;
      user1ItemId: string;
      user2ItemId: string;
    },
  ) {
    try {
      return await this.prisma.barter.create({
        data: {
          user1_id: userId,
          user2_id: barterDetails.user2Id,
          user1_item_id: barterDetails.user1ItemId,
          user2_item_id: barterDetails.user2ItemId,
          status: BarterStatus.ongoing, // Default status
        },
      });
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
  async updateBarterStatus(updateDetails: {
    barterId: string;
    status: BarterStatus;
  }) {
    const barter = await this.prisma.barter.findUnique({
      where: { id: updateDetails.barterId },
    });

    if (!barter) {
      throw new NotFoundException('Barter not found'); // Handle case where barter does not exist
    }

    return await this.prisma.barter.update({
      where: { id: updateDetails.barterId },
      data: {
        status: updateDetails.status,
      },
    });
  }

  /**
   * ❌ Cancel Barter
   * Cancels or removes a barter from the Barterer's list.
   * @param barterId - The ID of the barter to cancel.
   * @throws NotFoundException if the barter is not found.
   */
  async cancelBarter(barterId: string) {
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
}
