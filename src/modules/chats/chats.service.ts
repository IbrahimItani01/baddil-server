import { Injectable, NotFoundException } from '@nestjs/common'; // 📦 Importing necessary exceptions
import { MessageStatus } from '@prisma/client'; // 📜 Importing MessageStatus type from Prisma
import { PrismaService } from 'src/database/prisma.service'; // 🗄️ Importing PrismaService for database access

@Injectable()
export class ChatsService {
  constructor(private readonly prisma: PrismaService) {} // 🏗️ Injecting PrismaService

  /**
   * ➕ Create Chat
   * Creates a new chat with optional barter and hire IDs.
   * @param barter_id - Optional ID of the barter.
   * @param hire_id - Optional ID of the hire.
   * @returns The created chat record.
   */
  async createChat(barter_id?: string, hire_id?: string) {
    return await this.prisma.chat.create({
      data: {
        barter_id,
        hire_id,
      },
    });
  }

  /**
   * 📜 Get All Chats
   * Fetches all chats, including their messages.
   * @returns An array of all chats.
   */
  async getAllChats() {
    return await this.prisma.chat.findMany({
      include: { Message: true }, // 📩 Including messages in the result
    });
  }

  /**
   * 📜 Get Chat by ID
   * Fetches a specific chat by its ID, including messages.
   * @param id - The ID of the chat to retrieve.
   * @returns The chat record.
   * @throws NotFoundException if the chat is not found.
   */
  async getChatById(id: string) {
    const chat = await this.prisma.chat.findUnique({
      where: { id },
      include: { Message: true }, // 📩 Including messages in the result
    });

    if (!chat) {
      throw new NotFoundException('Chat not found'); // 🚫 Chat not found
    }

    return chat; // Return the chat record
  }

  /**
   * 📩 Get Messages in Chat
   * Fetches messages for a specific chat, optionally filtered by status.
   * @param chatId - The ID of the chat.
   * @param status - Optional status to filter messages.
   * @returns An array of messages in the chat.
   */
  async getMessagesInChat(chatId: string, status?: string) {
    return await this.prisma.message.findMany({
      where: {
        chat_id: chatId,
        ...(status && { status: status as MessageStatus }), // Cast status to MessageStatus
      },
    });
  }

  /**
   * ❌ Delete Chat
   * Deletes a specific chat by its ID.
   * @param id - The ID of the chat to delete.
   * @returns The deleted chat record.
   * @throws NotFoundException if the chat is not found.
   */
  async deleteChat(id: string) {
    const chat = await this.prisma.chat.findUnique({
      where: { id },
    });

    if (!chat) {
      throw new NotFoundException('Chat not found'); // 🚫 Chat not found
    }

    return await this.prisma.chat.delete({
      where: { id },
    });
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
      message: 'User  chats fetched successfully',
      data: chats,
    };
  }
}
