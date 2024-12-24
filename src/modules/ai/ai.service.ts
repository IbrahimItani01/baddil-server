import { Injectable, NotFoundException } from '@nestjs/common';
import { BarterStatus } from '@prisma/client';
import { PrismaService } from 'src/database/prisma.service';

/**
 * ⚙️ AI Service
 * Provides business logic for AI-related operations, including managing
 * AI-handled barters and related data such as chats.
 */
@Injectable()
export class AIService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * 🗂️ Get all auto-trades
   * Fetches all barters handled by AI, with optional filtering by user.
   */
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

  /**
   * 🔄 Toggle auto-trade
   * Enables or disables AI management for a barter.
   */
  async toggleAutoTrade(barterId: string, enabled: boolean) {
    const barter = await this.prisma.barter.findUnique({
      where: { id: barterId },
    });
    if (!barter) throw new NotFoundException('Barter not found');
    return await this.prisma.barter.update({
      where: { id: barterId },
      data: { handled_by_ai: enabled },
    });
  }

  /**
   * ✏️ Update auto-trade
   * Updates details or status of a barter.
   */
  async updateAutoTrade(
    barterId: string,
    updateDetails: { status?: string; details?: any },
  ) {
    const data: any = {};
    if (updateDetails.status) {
      data.status = updateDetails.status as BarterStatus;
    }
    if (updateDetails.details) {
      data.details = updateDetails.details;
    }

    const barter = await this.prisma.barter.findUnique({
      where: { id: barterId },
    });
    if (!barter) throw new NotFoundException('Barter not found');

    return await this.prisma.barter.update({
      where: { id: barterId },
      data,
    });
  }

  /**
   * 💬 Get barter chat
   * Fetches chat details for a specific barter.
   */
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
      throw new NotFoundException('Chat not found for this barter');
    }

    return chat;
  }
}
