import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common'; // 📦 Importing necessary exceptions
import { MessageStatus } from '@prisma/client'; // 📜 Importing MessageStatus type from Prisma
import { PrismaService } from 'src/database/prisma.service'; // 🗄️ Importing PrismaService for database access
import { CreateChatDto, GetChatByIdDto } from './dto/chats.dto'; // 📑 Importing DTOs
import { handleError } from 'src/utils/general/error.utils';
import { checkChatExists } from 'src/utils/modules/chats/chats.utils';

@Injectable()
export class ChatsService {
  constructor(private readonly prisma: PrismaService) {} // 🏗️ Injecting PrismaService

  /**
   * ➕ Create Chat
   * Creates a new chat with optional barter and hire IDs.
   * @param createChatDto - DTO containing barter and hire IDs.
   * @returns The created chat record.
   */
  async createChat(createChatDto: CreateChatDto) {
    const { barter_id, hire_id } = createChatDto;

    try {
      // Validation: Ensure that one and only one of `barter_id` or `hire_id` is provided
      if (!barter_id && !hire_id) {
        throw new BadRequestException(
          'Either barter_id or hire_id must be provided to create a chat',
        );
      }

      if (barter_id && hire_id) {
        throw new BadRequestException(
          'A chat cannot be linked to both a barter and a hire simultaneously',
        );
      }

      // Create the chat entry
      return await this.prisma.chat.create({
        data: {
          barter_id,
          hire_id,
        },
      });
    } catch (error) {
      handleError(error, 'Failed to create chat'); // Use the handleError utility for consistent error handling
    }
  }

  /**
   * 📜 Get All Chats
   * Fetches all chats, including their messages.
   * @returns An array of all chats.
   */
  async getAllChats() {
    try {
      // Retrieve all chats from the database
      return await this.prisma.chat.findMany({
        include: { Message: true }, // 📩 Including messages in the result
      });
    } catch (error) {
      handleError(error, 'Failed to retrieve chats'); // Handle errors using the utility function
    }
  }

  /**
   * 📜 Get Chat by ID
   * Fetches a specific chat by its ID, including messages.
   * @param getChatByIdDto - DTO containing the chat ID.
   * @returns The chat record.
   * @throws NotFoundException if the chat is not found.
   */
  async getChatById(getChatByIdDto: GetChatByIdDto) {
    try {
      const { id } = getChatByIdDto;

      await checkChatExists(this.prisma, id);

      const chat = await this.prisma.chat.findUnique({
        where: { id },
        include: { Message: true }, // 📩 Including messages in the result
      });
      return chat; // Return the chat record
    } catch (error) {
      handleError(error, 'Failed to fetch chat by ID'); // Use handleError for consistent error handling
    }
  }

  /**
   * ❌ Delete Chat
   * Deletes a specific chat by its ID.
   * @param getChatByIdDto - DTO containing the chat ID.
   * @returns The deleted chat record.
   * @throws NotFoundException if the chat is not found.
   */
  async deleteChat(getChatByIdDto: GetChatByIdDto) {
    try {
      const { id } = getChatByIdDto;

      await checkChatExists(this.prisma, id);

      return await this.prisma.chat.delete({
        where: { id },
      });
    } catch (error) {
      handleError(error, 'Failed to delete chat');
    }
  }

  /**
   * 📊 Get Message Count for a Chat
   * Fetches the count of messages in a specific chat.
   * @param chatId - The ID of the chat.
   * @returns The count of messages in the chat.
   */
  async getMessageCount(chatId: string) {
    return await this.prisma.message.count({
      where: {
        chat_id: chatId,
      },
    });
  }

  /**
   * 📬 Get All Chats with Unread Messages for the Current User
   * Fetches all chats for the current user that have unread messages.
   * @param userId - The ID of the user.
   * @returns An array of chats with unread messages.
   */
  async getChatsWithUnreadMessages(userId: string) {
    return await this.prisma.chat.findMany({
      where: {
        Message: {
          some: {
            owner_id: {
              not: userId, // Messages not sent by the current user
            },
            status: MessageStatus.sent, // Unread messages
          },
        },
      },
      select: {
        id: true,
        barter: {
          select: {
            user1_id: true,
            user2_id: true,
          },
        },
        hire: true,
        Message: {
          where: {
            owner_id: {
              not: userId,
            },
            status: MessageStatus.sent,
          },
          select: {
            id: true,
            content: true,
          },
        },
      },
    });
  }

  /**
   * 📑 Get User Chats
   * Fetches chats where the user is either involved in a hire or barter.
   * @param userId - The ID of the user.
   * @returns An array of chats for the user.
   */
  async getUserChats(userId: string) {
    const chats = await this.prisma.chat.findMany({
      where: {
        OR: [
          // User is involved in a hire (as broker or client)
          {
            hire: {
              OR: [{ broker_id: userId }, { client_id: userId }],
            },
          },
          // User is involved in a barter (as user1 or user2)
          {
            barter: {
              OR: [{ user1_id: userId }, { user2_id: userId }],
            },
          },
        ],
      },
      include: {
        barter: {
          include: {
            user1: true,
            user2: true,
          },
        },
        hire: {
          include: {
            broker: true,
            client: true,
          },
        },
        Message: {
          include: {
            owner: true,
          },
        },
      },
    });

    return {
      status: 'success',
      message: 'User chats fetched successfully',
      data: chats,
    };
  }
}
