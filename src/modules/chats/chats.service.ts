import { Injectable } from '@nestjs/common';
import { MessageStatus } from '@prisma/client';
import { PrismaService } from 'src/database/prisma.service';

@Injectable()
export class ChatsService {
  constructor(private readonly prisma: PrismaService) {}

  async createChat(barter_id?: string, hire_id?: string) {
    return await this.prisma.chat.create({
      data: {
        barter_id,
        hire_id,
      },
    });
  }

  async getAllChats() {
    return await this.prisma.chat.findMany({
      include: { Message: true },
    });
  }

  async getChatById(id: string) {
    return await this.prisma.chat.findUnique({
      where: { id },
      include: { Message: true },
    });
  }

  async getMessagesInChat(chatId: string, status?: string) {
    return await this.prisma.message.findMany({
      where: {
        chat_id: chatId,
        ...(status && { status: status as MessageStatus }), // Cast status to MessageStatus
      },
    });
  }

  async deleteChat(id: string) {
    return await this.prisma.chat.delete({
      where: { id },
    });
  }

  // Get Message Count for a Chat
  async getMessageCount(chatId: string) {
    return await this.prisma.message.count({
      where: {
        chat_id: chatId,
      },
    });
  }

  // Get All Chats with Unread Messages for the Current User
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

  async getUserChats(userId: string) {
    // Fetch chats where the user is either in a hire or barter
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
