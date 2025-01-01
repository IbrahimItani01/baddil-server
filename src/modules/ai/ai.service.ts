import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common'; // 📦 Importing necessary exceptions
import { BarterStatus } from '@prisma/client'; // 📜 Importing BarterStatus enum from Prisma
import { PrismaService } from 'src/database/prisma.service'; // 🗄️ Importing PrismaService for database access
import { ToggleAutoTradeDto, UpdateAutoTradeDto } from './dto/ai.dto'; // 📦 Importing DTOs

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
    const where = { handled_by_ai: true }; // 🔍 Filtering for AI-managed barters
    if (userId) {
      where['user1_id'] = userId; // Filter by user1_id if provided
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
   * Enables or disables AI management for a specified barter.
   * @param toggleAutoTradeDto - DTO containing the barterId and the enabled status.
   * @returns The updated barter object with the toggled AI management.
   */
  async toggleAutoTrade(toggleAutoTradeDto: ToggleAutoTradeDto) {
    const { barterId, enabled } = toggleAutoTradeDto; // 🏷️ Destructuring DTO
    const barter = await this.prisma.barter.findUnique({
      where: { id: barterId },
    });

    if (!barter) {
      throw new NotFoundException('Barter not found'); // Handle case where barter does not exist
    }

    return await this.prisma.barter.update({
      where: { id: barterId },
      data: { handled_by_ai: enabled }, // Update AI management status
    });
  }

  /**
   * ✏️ Update auto-trade
   * Updates details or status of a specified barter managed by AI.
   * @param updateAutoTradeDto - DTO containing update details like status and additional information.
   * @returns The updated barter object.
   */
  async updateAutoTrade(updateAutoTradeDto: UpdateAutoTradeDto) {
    const { barterId, status, details } = updateAutoTradeDto; // 🏷️ Destructuring DTO
    const data: any = {}; // Initialize data object for updates

    const barter = await this.prisma.barter.findUnique({
      where: { id: barterId },
    });

    if (!barter) {
      throw new NotFoundException('Barter not found'); // Handle case where barter does not exist
    }

    // Prevent updating if the current status is "completed" or "aborted"
    if (
      barter.status === BarterStatus.completed ||
      barter.status === BarterStatus.aborted
    ) {
      throw new BadRequestException(
        `Cannot update a barter with status '${barter.status}'`,
      );
    }

    if (status) {
      if (!Object.values(BarterStatus).includes(status as BarterStatus)) {
        throw new BadRequestException('Invalid barter status'); // Handle invalid status
      }
      data.status = status as BarterStatus; // Set the status if provided

      // Check if the status is being set to "completed"
      if (status === BarterStatus.completed) {
        data.completed_at = new Date(); // Set completed_at to the current date and time
      }
    }

    if (details) {
      data.details = details; // Set additional details if provided
    }

    return await this.prisma.barter.update({
      where: { id: barterId },
      data, // Update barter with new data
    });
  }

  /**
   * 💬 Get barter chat
   * Retrieves the chat related to a specific barter.
   * @param getAutoTradeChatDto - DTO containing the barterId to fetch the chat.
   * @returns The chat object related to the barter, including messages and their owners.
   */
  async getAutoTradeChat(barterId: string) {
    const chat = await this.prisma.chat.findFirst({
      where: { barter_id: barterId },
      include: {
        Message: {
          include: { owner: true }, // Include message owners in the chat
        },
      },
    });

    if (!chat) {
      throw new NotFoundException('Chat not found for this barter'); // Handle case where chat does not exist
    }

    return chat; // Return the chat object
  }
}
