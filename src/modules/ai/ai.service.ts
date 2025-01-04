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
        data: { handled_by_ai: newHandledByAi },
      });

      return updatedBarter; // 🎉 Return the updated barter
    } catch (error) {
      handleError(error, 'An error occurred while toggling auto trades'); // Use the reusable error handler
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

  /**
   * 💬 Chat on behalf of the user
   * Automatically generates a reply in an AI-managed barter chat.
   * @param barterId - ID of the barter whose chat will be managed by AI.
   * @returns AI-generated chat message.
   */
  async chatOnBehalf(barterId: string, userId: string) {
    // 1️⃣ Verify if the barter exists and includes the userId
    const barter = await this.prisma.barter.findFirst({
      where: {
        id: barterId,
        OR: [{ user1_id: userId }, { user2_id: userId }],
      },
      include: {
        user1_item: true,
        user2_item: true,
        user1: true,
        user2: true,
      },
    });

    if (!barter) {
      throw new NotFoundException(
        'This barter does not exist or you do not have access.',
      );
    }

    // 2️⃣ Check AI handling status
    const isAiHandled =
      (barter.handled_by_ai === 'user1' && barter.user1_id === userId) ||
      (barter.handled_by_ai === 'user2' && barter.user2_id === userId) ||
      barter.handled_by_ai === 'both';

    if (!isAiHandled) {
      throw new NotFoundException(
        'AI is not handling this chat for your role in this barter.',
      );
    }

    // 3️⃣ Fetch the last 7 messages for context
    const chat = await this.prisma.chat.findFirst({
      where: { barter_id: barterId },
      include: {
        Message: {
          take: 7, // Fetch last 7 messages in order
          orderBy: { timestamp: 'asc' },
          include: { owner: true },
        },
      },
    });

    if (!chat) {
      throw new NotFoundException('Chat not found for this barter.');
    }

    const messages = chat.Message.map((msg) => ({
      role: msg.owner.id === barter.user1_id ? 'user1' : 'user2',
      content: msg.content,
    }));

    // 4️⃣ Prepare barter context with item details
    const barterContext = {
      user1: barter.user1.name,
      user2: barter.user2.name,
      item1: {
        name: barter.user1_item.name,
        condition: barter.user1_item.condition.toString(), // Convert enum to string
        value: barter.user1_item.value,
      },
      item2: {
        name: barter.user2_item.name,
        condition: barter.user2_item.condition.toString(), // Convert enum to string
        value: barter.user2_item.value,
      },
      status: barter.status.toString(), // Convert enum to string
    };

    const aiMessage = await this.generateAiResponse(messages, barterContext);

    // 6️⃣ AI response already includes "handled by AI", no need to append manually
    return aiMessage; // Use aiMessage directly
  }

  /**
   * 🤖 Generate AI response for chat
   * Uses OpenAI API to produce a reply based on chat history and barter context.
   */
  private async generateAiResponse(
    messages: { role: string; content: string }[],
    barterContext: {
      user1: string;
      user2: string;
      item1: { name: string; condition: string; value: number };
      item2: { name: string; condition: string; value: number };
      status: string;
    },
  ): Promise<string> {
    const openAiPayload = {
      model: 'gpt-4',
      messages: [
        {
          role: 'system',
          content: `You are a barter assistant AI. Always respond in JSON format for easy data extraction.
        Include barter details in your response."`,
        },
        {
          role: 'system',
          content: `Barter context: User1 (${barterContext.user1}) is bartering "${barterContext.item1.name}" (Condition: ${barterContext.item1.condition}, Value: ${barterContext.item1.value}) 
        with User2 (${barterContext.user2})'s "${barterContext.item2.name}" (Condition: ${barterContext.item2.condition}, Value: ${barterContext.item2.value}). Barter status is ${barterContext.status}.`,
        },
        ...messages.map((msg) => ({
          role: msg.role === 'user1' ? 'user' : 'assistant',
          content: msg.content,
        })),
      ],
    };

    const response = await fetch(this.openAiApiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${this.openAiApiKey}`,
      },
      body: JSON.stringify(openAiPayload),
    });

    const data = await response.json();
    if (!response.ok || !data.choices || !data.choices[0].message) {
      throw new Error('Failed to fetch AI response from OpenAI');
    }

    const aiReply = data.choices[0].message.content;
    return `${aiReply} handled by AI`; // Append "handled by AI" to the reply
  }
}
