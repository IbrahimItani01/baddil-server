import { Injectable } from '@nestjs/common';
import { BarterStatus } from '@prisma/client';
import { PrismaService } from 'src/database/prisma.service';

@Injectable()
export class AIService {
  constructor(private readonly prisma: PrismaService) {}

  async getAutoTrades(userId?: string) {
    const where = { handled_by_ai: true };
    if (userId) {
      where['user1_id'] = userId;
    }
    return await this.prisma.barter.findMany({
      where,
      include: {
        user1: true,
        user2: true,
        user1_item: true,
        user2_item: true,
      },
    });
  }

  async toggleAutoTrade(barterId: string, enabled: boolean) {
    return await this.prisma.barter.update({
      where: { id: barterId },
      data: { handled_by_ai: enabled },
    });
  }

  async updateAutoTrade(
    barterId: string,
    updateDetails: { status?: string; details?: any },
  ) {
    const data: any = {};
    if (updateDetails.status) {
      data.status = updateDetails.status as BarterStatus;
    }
    if (updateDetails.details) {
      data.details = updateDetails.details; // Example: include other details
    }
    return await this.prisma.barter.update({
      where: { id: barterId },
      data,
    });
  }

  async getAutoTradeChat(barterId: string) {
    const chat = await this.prisma.chat.findFirst({
      where: { barter_id: barterId },
      include: {
        Message: {
          include: { owner: true },
        },
      },
    });

    if (!chat) {
      throw new Error('Chat not found for this barter');
    }

    return chat;
  }
}
