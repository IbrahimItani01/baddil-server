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

