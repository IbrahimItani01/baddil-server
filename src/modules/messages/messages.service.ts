import { Injectable } from '@nestjs/common';
import { MessageStatus } from '@prisma/client';
import { PrismaService } from 'src/database/prisma.service';

@Injectable()
export class MessagesService {
  constructor(private readonly prisma: PrismaService) {}

  async sendMessage(
    content: string,
    owner_id: string,
    chat_id: string,
    status: string,
  ) {
    // Validate and cast the status to MessageStatus
    if (!Object.values(MessageStatus).includes(status as MessageStatus)) {
      throw new Error(`Invalid status: ${status}`);
    }

    return await this.prisma.message.create({
      data: {
        content,
        owner_id,
        chat_id,
        status: status as MessageStatus, // Cast to MessageStatus
      },
    });
  }

  async updateMessageStatus(id: string, status: string) {
    // Validate and cast the status to MessageStatus
    if (!Object.values(MessageStatus).includes(status as MessageStatus)) {
      throw new Error(`Invalid status: ${status}`);
    }

    return await this.prisma.message.update({
      where: { id },
      data: {
        status: status as MessageStatus, // Cast to MessageStatus
      },
    });
  }

  async deleteMessage(id: string) {
    return await this.prisma.message.delete({
      where: { id },
    });
  }

