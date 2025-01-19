import {
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common'; // 📦 Importing necessary exceptions
import axios from 'axios';
import { PrismaService } from 'src/database/prisma.service'; // 🗄️ Importing PrismaService for database access
import { ToggleAutoTradeDto, UpdateAutoTradeDto } from './dto/ai.dto'; // 📦 Importing DTOs
import { processBarterUpdate } from 'src/utils/modules/barters/barters.utils';
import { handleError } from 'src/utils/general/error.utils';
import { checkEntityExists } from 'src/utils/general/models.utils';
import { BarterStatus, HandledByAi } from '@prisma/client';
import { ConfigService } from '@nestjs/config';
import { BarterResponseDto } from '../barters/dto/barters.dto';
import { findUserByEmail } from 'src/utils/modules/users/users.utils';

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
  private readonly base_url: string;

  // 🏗️ Injecting PrismaService
  constructor(
    private readonly prisma: PrismaService,
    private readonly configService: ConfigService,
  ) {
    this.openAiApiKey = this.configService.get('OPENAI_API_KEY'); // 🔑 Load API key from environment
    this.base_url = this.configService.get('BASE_URL');
  }

  /**
   * 🌐 Utility function to call OpenAI API
   * Sends a system prompt and user message to OpenAI and returns a response in JSON format.
   * @param userMessage - User's query or input.
   * @returns Parsed JSON response from OpenAI.
   */
  private async callOpenAiApi(userMessage: any): Promise<any> {
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
   * 💬 Generate value for an item
   * Automatically generates a reply in an AI-managed barter chat.
   * @param itemId - ID of the item
   * @returns saves the value in database.
   */
  async generatePrice(itemId: string) {
    // 🖼️ Step 1: Fetch item images from the wallet API
    await axios
      .get(`${this.base_url}/api/wallet/items/${itemId}/images`)
      .then((res) => {
        return res.data.data; // ✅ Extract 'data' from the response
      })
      .then(async (images) => {
        // 📦 Step 2: Fetch item details from the wallet API
        await axios
          .get(`${this.base_url}/api/wallet/items/${itemId}`)
          .then((res) => {
            return res.data.data; // ✅ Extract 'data' from the response
          })
          .then(async (itemData) => {
            // 💰 Step 3: Define AI instructions for generating the item's price
            const aiMessage = `
              visit each image URL below and study the content:
              ${images}
              Based on the information from the images and the following item details:
              Name: ${itemData.name}
              Description: ${itemData.description}
              Condition: ${itemData.condition} (new, used, refurbished, etc.)
              Category: ${itemData.category} (electronics, clothing, furniture, etc.)
    
              Please consider the following rules to generate the price for this item in BaddilCoins:
            
              1. **Item Condition Multipliers**:
                 - New: 1.2x
                 - Used: 0.8x
                 - Refurbished: 1.0x
             
              2. Return only the estimated value in BaddilCoins as a number in the response like:
              {
                value: <the value generated in BaddilCoins>  
              }
            `;

            // 📡 Step 4: Call OpenAI API with the pricing message
            try {
              const value = JSON.parse(
                await this.callOpenAiApi(aiMessage),
              ).value; // 🧠 Parse AI response to get the generated price

              // ✅ Step 5: Update the item's value in the database if a valid number is returned
              if (value && typeof value === 'number') {
                await this.prisma.item.update({
                  where: { id: itemId },
                  data: { value: value },
                });
              } else {
                // 🚨 Handle errors if the value is invalid
                throw new InternalServerErrorException(
                  'Error generating value',
                );
              }
            } catch (error) {
              // 🛑 Handle API call errors
              handleError(error, 'Error generating value');
            }
          });
      });
  }

  /**
   * 💬 Filter items in user wallet
   * Automatically generates a reply in an AI-managed barter chat.
   * @param itemId - ID of the item the user want to barter for
   * @param userId - ID of the active user
   * @returns items from user wallet that can be used for bartering
   */
  async getBarterRecommendations(userId: string, itemId: string) {
    try {
      // 🖼️ Step 1: Fetch images of the item from the wallet API
      const itemImages = await axios
        .get(`${this.base_url}/api/wallet/items/${itemId}/images`)
        .then((response) => response.data.data); // ✅ Extract 'data' from the response

      // 📦 Step 2: Fetch detailed data of the item from the wallet API
      const itemData = await axios
        .get(`${this.base_url}/api/wallet/items/${itemId}`)
        .then((response) => response.data.data); // ✅ Extract 'data' from the response

      // 🎒 Step 3: Fetch all items in the user's wallet from the wallet API
      const userItems = await axios
        .get(`${this.base_url}/api/wallet/items/user/${userId}`)
        .then((response) => response.data.data); // ✅ Extract 'data' from the response

      // 🤖 Step 4: Create a message for AI with item and user data
      const aiMessage = `
        Study the user items he has in his wallet: ${JSON.stringify(userItems)}
        Based on the data you studied, recommend the top 4 items from user items that have a good chance to be bartered with the item having the following data:
        Study the item images: ${JSON.stringify(itemImages)}
        Study the item data: ${JSON.stringify(itemData)}
    
        Your reply must be in JSON format in this form:
        {
          "data": [
            ...the recommended items
          ]
        }
      `;

      // 📡 Step 5: Call the AI service with the message and parse the response
      try {
        const aiResponse = await this.callOpenAiApi(aiMessage);
        const recommendedData = JSON.parse(aiResponse).data;

        // ✅ Step 6: Return the recommended items if available
        if (recommendedData) return recommendedData;
      } catch (error) {
        // 🚨 Handle errors if the AI service fails
        throw new InternalServerErrorException(
          'Error getting recommendations',
          error,
        );
      }
    } catch (error) {
      // 🛑 Handle errors when fetching API data
      handleError(error, 'Failed to get barter recommendations');
    }
  }

  /**
   * 💬 Filter items in user wallet
   * Automatically generates a reply in an AI-managed barter chat.
   * @param email - email of the owner of the item the user want to barter for
   * @returns success probability to barter with this user based of previous barters
   */
  async getSuccessProbability(email: string) {
    try {
      // 🌟 Step 1: Find the user by email using Prisma
      const { id } = await findUserByEmail(this.prisma, email);

      // 🔄 Step 2: Fetch the barters associated with the user from the barters API
      const userBarters: object[] = await axios
        .get(`${this.base_url}/api/barters/by-user/${id}`)
        .then((response) => response.data?.data || []); // ✅ Extracting 'data' key from API response

      // 📊 Step 3: Extract only the 'status' field from each barter
      const statuses = userBarters.map(
        (barter: BarterResponseDto) => barter.status, // 🏷️ Mapping to get the 'status' field
      );

      // 🤖 Step 4: Create a message for AI with status data and calculation instructions
      const aiMessage = `
        Analyze the following barter statuses from previous trades by a user: ${JSON.stringify(statuses)}.
        Possible status values are: ${JSON.stringify(BarterStatus)}.
        
        Based on the frequency of "completed" statuses relative to the total number of statuses provided, calculate the probability (in percentage) that a future barter with this user will be successful.
        
        Use this formula: (number of "completed" statuses / total number of statuses) * 100 to compute the success probability.
        
        Your response must be in JSON format as follows:
        {
          "data": <calculated percentage of success as a number>
        }
      `;

      try {
        // 🧠 Step 5: Call the AI service with the message and parse the JSON response
        const aiResponse = await this.callOpenAiApi(aiMessage);
        const recommendedData = JSON.parse(aiResponse).data;

        // ✅ Step 6: Return the success probability if it's available
        if (recommendedData) return recommendedData;
      } catch (error) {
        // 🚨 Handle errors if the AI service fails
        throw new InternalServerErrorException(
          'Error generating success probability',
          error,
        );
      }
    } catch (error) {
      // 🛑 Handle errors when fetching user data or barters
      handleError(error, 'Failed to get success probability');
    }
  }

  /**
   * 💬 Filter items in user wallet
   * Automatically generates a reply in an AI-managed barter chat.
   * @param email - email of the owner of the item the user want to barter for
   * @returns credibility of the user
   */
  async getCredibility(email: string) {
    try {
      // 🌟 Step 1: Find the user by email using Prisma
      const { id } = await findUserByEmail(this.prisma, email);

      // 🔄 Step 2: Fetch the barters associated with the user from the barters API
      const userBarters: object[] = await axios
        .get(`${this.base_url}/api/barters/by-user/${id}`)
        .then((response) => response.data?.data || []); // ✅ Extracting 'data' key from API response

      // 🆔 Step 3: Extract barter IDs for the user
      const bartersIds = userBarters.map(
        (barter: BarterResponseDto) => barter.id, // 📋 Mapping to get barter IDs
      );

      // ⭐ Step 4: Fetch ratings from the database for the user's barters
      const ratings = await this.prisma.rating.findMany({
        where: {
          barter_id: {
            in: bartersIds, // 🔍 Filter ratings for relevant barter IDs
          },
        },
        select: {
          value: true, // 🎯 Select only the rating values
          barter_id: true, // 🔗 Include barter ID for grouping
        },
      });

      // 📊 Step 5: Group ratings by barterId and calculate average ratings
      const ratingsGroupedByBarterId = bartersIds.map((barterId) => {
        const ratingsForBarter = ratings.filter(
          (rating) => rating.barter_id === barterId, // 🏷️ Filter ratings for each barter ID
        );

        const averageRating =
          ratingsForBarter.reduce((acc, rating) => acc + rating.value, 0) /
          ratingsForBarter.length; // ➗ Calculate average rating

        return {
          barterId,
          averageRating: isNaN(averageRating) ? 0 : averageRating, // 🔢 Default to 0 if no ratings
        };
      });

      // 🧠 Step 6: Construct the AI message with ratings data
      const aiMessage = `
        Given the following ratings for each barter a user was part of, determine if this user is credible.
        
        Ratings by Barter ID for barters this user was part of:
        ${JSON.stringify(ratingsGroupedByBarterId)} 
        
        Return the result in the following format:
        {
          "data": <boolean value (true for credible, false for not)>
        }
      `;

      // 🤖 Step 7: Call the AI service with the message and parse the response
      try {
        const aiResponse = await this.callOpenAiApi(aiMessage);
        const isCredible = JSON.parse(aiResponse).data;

        // ✅ Step 8: Return credibility result if available
        if (isCredible) return isCredible;
      } catch (error) {
        // 🚨 Handle errors if the AI service fails
        throw new InternalServerErrorException(
          'Error getting recommendations',
          error,
        );
      }
    } catch (error) {
      // 🛑 Handle errors when fetching user data or ratings
      handleError(error, 'failed to get users credibility');
    }
  }
}
