import { Injectable } from '@nestjs/common';
import { BarterStatus } from '@prisma/client';
import { PrismaService } from 'src/database/prisma.service';

@Injectable()
export class BartersService {
  constructor(private readonly prisma: PrismaService) {}

  async getBartersByUser(userId: string) {
    try {
      return await this.prisma.barter.findMany({
        where: { user1_id: userId },
      });
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      throw new Error('Failed to fetch barters');
    }
  }

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
      throw new Error('Failed to create barter');
    }
  }

  async updateBarterStatus(updateDetails: {
    barterId: string;
    status: BarterStatus;
  }) {
    try {
      return await this.prisma.barter.update({
        where: { id: updateDetails.barterId },
        data: {
          status: updateDetails.status,
        },
      });
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      throw new Error('Failed to update barter status');
    }
  }

