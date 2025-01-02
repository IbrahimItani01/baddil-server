import { Injectable, NotFoundException } from '@nestjs/common'; // 📦 Importing necessary exceptions
import { PrismaService } from 'src/database/prisma.service'; // 🗄️ Importing PrismaService for database access
import { ToggleAutoTradeDto, UpdateAutoTradeDto } from './dto/ai.dto'; // 📦 Importing DTOs
import {
  findBarterById,
  processBarterUpdate,
} from 'src/utils/modules/barters/barters.utils';
import { handleError } from 'src/utils/general/error.utils';

/**
 * ⚙️ AI Service
 * Handles the business logic for AI-managed operations, including managing
 * AI-driven barters, updating statuses, and fetching related data like chats.
 */
@Injectable()
export class AIService {
  constructor(private readonly prisma: PrismaService) {} // 🏗️ Injecting PrismaService

  /**
   * 🗂️ Get all auto-trades
   * Retrieves all barters managed by AI. Optionally filters by a user's ID.
   * @param userId - Optional user ID for filtering by user.
   * @returns A list of barters managed by AI.
   */
  async getAutoTrades(userId?: string) {
    try {
      const where = { handled_by_ai: true }; // 🔍 Filtering for AI-managed barters
      if (userId) {
        where['user1_id'] = userId; // Filter by user1_id if provided
      }

      const barters = await this.prisma.barter.findMany({
        where,
        include: {
          user1: true,
          user2: true,
          user1_item: true,
          user2_item: true,
        },
      });

      if (!barters || barters.length === 0) {
        throw new NotFoundException('No auto trades found'); // 🚫 No records found
      }

      return barters; // 🎉 Return the list of barters
    } catch (error) {
      handleError(error, 'An error occurred while retrieving auto trades');
    }
  }

  /**
   * 🔄 Toggle auto-trade
   * Enables or disables AI management for a specified barter.
   * @param toggleAutoTradeDto - DTO containing the barterId and the enabled status.
   * @returns The updated barter object with the toggled AI management.
   */
  async toggleAutoTrade(toggleAutoTradeDto: ToggleAutoTradeDto) {
    try {
      const { barterId, enabled } = toggleAutoTradeDto; // 🏷️ Destructuring DTO

      // 🔍 Find the barter using the reusable function
      await findBarterById(this.prisma, barterId);

      // ✅ Update the AI management status
      const updatedBarter = await this.prisma.barter.update({
        where: { id: barterId },
        data: { handled_by_ai: enabled },
      });

      return updatedBarter; // 🎉 Return the updated barter
    } catch (error) {
      handleError(error, 'An error occurred while retrieving auto trades'); // Use the reusable error handler
    }
  }

  /**
   * ✏️ Update auto-trade
   * Updates details or status of a specified barter managed by AI.
   * @param updateAutoTradeDto - DTO containing update details like status and additional information.
   * @returns The updated barter object.
   */
  async updateAutoTrade(updateAutoTradeDto: UpdateAutoTradeDto) {
    const { barterId, status, details } = updateAutoTradeDto;

    try {
      // Find the current barter using the reusable function
      const barter = await findBarterById(this.prisma, barterId);

      // Use the utility function to process updates
      const updateData = processBarterUpdate(barter.status, {
        status,
        details,
      });

      // Update the barter
      return await this.prisma.barter.update({
        where: { id: barterId },
        data: updateData,
      });
    } catch (error) {
      handleError(error, 'An error occurred while updating the auto trade'); // Use the reusable error handler
    }
  }

  /**
   * 💬 Get barter chat
   * Retrieves the chat related to a specific barter.
   * @param getAutoTradeChatDto - DTO containing the barterId to fetch the chat.
   * @returns The chat object related to the barter, including messages and their owners.
   */
  async getAutoTradeChat(barterId: string) {
    try {
      // 🔔 Check if barter exists using the reusable findBarterById function
      await findBarterById(this.prisma, barterId);

      // Find the chat associated with the barter
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
    } catch (error) {
      handleError(
        error,
        'An error occurred while retrieving the chat for the barter',
      );
    }
  }
}
