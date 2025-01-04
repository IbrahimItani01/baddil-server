import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common'; // 📦 Importing necessary exceptions
import axios from 'axios';
import { PrismaService } from 'src/database/prisma.service'; // 🗄️ Importing PrismaService for database access
import { ToggleAutoTradeDto, UpdateAutoTradeDto } from './dto/ai.dto'; // 📦 Importing DTOs
import { processBarterUpdate } from 'src/utils/modules/barters/barters.utils';
import { handleError } from 'src/utils/general/error.utils';
import { checkEntityExists } from 'src/utils/general/models.utils';
import { HandledByAi } from '@prisma/client';

/**
 * ⚙️ AI Service
 * Handles the business logic for AI-managed operations, including managing
 * AI-driven barters, updating statuses, and fetching related data like chats.
 */
@Injectable()
export class AIService {
  private readonly openAiApiKey: string;
  private readonly openAiApiUrl = 'https://api.openai.com/v1/chat/completions'; // 🌐 OpenAI endpoint
  // 📜 Constant system prompt for OpenAI
  private readonly SYSTEM_PROMPT =
    'You are an assistant that provides responses in JSON format only. Ensure the JSON is always well-structured and valid for easy parsing.';

  // 🏗️ Injecting PrismaService
  constructor(private readonly prisma: PrismaService) {
    this.openAiApiKey = process.env.OPENAI_API_KEY; // 🔑 Load API key from environment
  }

  /**
   * 🌐 Utility function to call OpenAI API
   * Sends a system prompt and user message to OpenAI and returns a response in JSON format.
   * @param userMessage - User's query or input.
   * @returns Parsed JSON response from OpenAI.
   */
  private async callOpenAiApi(userMessage: string): Promise<any> {
    try {
      const response = await axios.post(
        this.openAiApiUrl,
        {
          model: 'gpt-4',
          messages: [
            { role: 'system', content: this.SYSTEM_PROMPT },
            { role: 'user', content: userMessage },
          ],
        },
        {
          headers: {
            Authorization: `Bearer ${this.openAiApiKey}`, // 🔐 Include API key
            'Content-Type': 'application/json',
          },
        },
      );

      return response.data; // 🎉 Return OpenAI response
    } catch (error) {
      throw new Error(
        `OpenAI API error: ${error.response?.data?.error?.message || error.message}`,
      ); // ⚠️ Handle API errors
    }
  }

  /**
   * 🗂️ Get all auto-trades
   * Retrieves all barters managed by AI. Optionally filters by a user's ID.
   * @param userId - Optional user ID for filtering by user.
   * @returns A list of barters managed by AI.
   */
  async getAutoTrades(userId?: string) {
    try {
      // Define initial filter for barters managed by AI
      const where: Record<string, any> = {
        handled_by_ai: { not: 'none' }, // Filter for any AI-managed barter (not 'none')
      };

      // Optionally filter by userId
      if (userId) {
        where.OR = [{ user1_id: userId }, { user2_id: userId }];
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
  async toggleAutoTrade(
    toggleAutoTradeDto: ToggleAutoTradeDto,
    userId: string,
  ) {
    try {
      const { barterId, enabled } = toggleAutoTradeDto; // 🏷️ Destructuring DTO

      // 🔍 Find the barter using a reusable function
      const barter = await this.prisma.barter.findFirst({
        where: {
          id: barterId,
          OR: [{ user1_id: userId }, { user2_id: userId }],
        },
      });

      if (!barter) {
        throw new NotFoundException(
          'Barter not found or you do not have access.',
        );
      }

      // ✅ Determine the new `handled_by_ai` value
      let newHandledByAi: HandledByAi;

      if (barter.user1_id === userId) {
        // User1 toggling
        if (enabled) {
          newHandledByAi = barter.handled_by_ai === 'user2' ? 'both' : 'user1'; // Add or set user1
        } else {
          newHandledByAi = barter.handled_by_ai === 'both' ? 'user2' : 'none'; // Remove user1
        }
      } else if (barter.user2_id === userId) {
        // User2 toggling
        if (enabled) {
          newHandledByAi = barter.handled_by_ai === 'user1' ? 'both' : 'user2'; // Add or set user2
        } else {
          newHandledByAi = barter.handled_by_ai === 'both' ? 'user1' : 'none'; // Remove user2
        }
      } else {
        throw new ForbiddenException(
          'You are not authorized to toggle auto-trade for this barter.',
        );
      }

      // ✅ Update the barter with the new `handled_by_ai` value
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
      const barter = await checkEntityExists(this.prisma, 'barter', barterId);

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
      await checkEntityExists(this.prisma, 'barter', barterId);

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

  /**
   * 🔝 Recommend categories
   * Suggests the top 3 categories and their subcategories based on the user's wallet items.
   * @param userId - ID of the user whose wallet items are analyzed.
   * @returns The top 3 categories with their associated subcategories.
   */
  async recommendCategories(userId: string) {
    // 📥 Fetch user's wallet items and associated categories and subcategories
    const userItems = await this.prisma.item.findMany({
      where: {
        wallet: { owner_id: userId }, // 🔍 Filter items by wallet owner ID
      },
      include: {
        category: true, // 🗂 Include category details
        subcategory: true, // 🗂 Include subcategory details
      },
    });

    if (userItems.length === 0) {
      throw new NotFoundException("No items found in the user's wallet."); // 🚫 Handle empty wallet
    }

    // 🔢 Count category occurrences
    const categoryCounts = userItems.reduce(
      (acc, item) => {
        const category = item.category?.name || 'Unknown'; // 📛 Handle missing categories
        const subcategory = item.subcategory?.name || null; // 📛 Handle missing subcategories

        if (!acc[category]) {
          acc[category] = { count: 0, subcategories: new Set<string>() }; // 🌟 Initialize accumulator entry
        }

        acc[category].count += 1; // ➕ Increment category count
        if (subcategory) acc[category].subcategories.add(subcategory); // ➕ Add subcategory if exists

        return acc; // 🔄 Return updated accumulator
      },
      {} as Record<string, { count: number; subcategories: Set<string> }>, // 🗂 Define accumulator structure
    );

    // 🏆 Sort categories by count and select the top 3
    const sortedCategories = Object.entries(categoryCounts)
      .sort(([, a], [, b]) => b.count - a.count) // 🔀 Sort by count descending
      .slice(0, 3) // ✂ Select top 3
      .map(([name, data]) => ({
        name, // 📝 Category name
        count: data.count, // 🔢 Number of items in the category
        subcategories: Array.from(data.subcategories), // 📋 Convert subcategories to array
      }));

    return sortedCategories; // 🎉 Return top categories
  }
}
