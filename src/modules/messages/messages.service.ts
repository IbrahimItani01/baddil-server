import {
  Injectable,
  BadRequestException,
  NotFoundException,
  InternalServerErrorException,
} from '@nestjs/common'; // 📦 Importing necessary exceptions
import { MessageStatus } from '@prisma/client'; // 📜 Importing MessageStatus enum from Prisma
import { PrismaService } from 'src/database/prisma.service'; // 🗄️ Importing PrismaService for database access

@Injectable()
export class MessagesService {
  constructor(private readonly prisma: PrismaService) {} // 🏗️ Injecting PrismaService

  /**
   * ➕ Send a new message
   * @param content - The content of the message.
   * @param owner_id - The ID of the message owner.
   * @param chat_id - The ID of the chat.
   * @param status - The status of the message.
   * @returns The created message record.
   * @throws BadRequestException if the status is invalid.
   * @throws InternalServerErrorException if there is an error creating the message.
   */
  async sendMessage(
    content: string,
    owner_id: string,
    chat_id: string,
    status: string,
  ) {
    // Validate and cast the status to MessageStatus
    if (!Object.values(MessageStatus).includes(status as MessageStatus)) {
      throw new BadRequestException(`Invalid status: ${status}`); // 🚫 Error handling for invalid status
    }

    try {
      return await this.prisma.message.create({
        data: {
          content,
          owner_id,
          chat_id,
          status: status as MessageStatus, // Cast to MessageStatus
        },
      });
    } catch (error) {
      throw new InternalServerErrorException(
        'Failed to send message: ' + error.message,
      ); // 🚫 Error handling
    }
  }

  /**
   * ✏️ Update the status of a message
   * @param id - The ID of the message to update.
   * @param status - The new status of the message.
   * @returns The updated message record.
   * @throws BadRequestException if the status is invalid.
   * @throws NotFoundException if the message is not found.
   * @throws InternalServerErrorException if there is an error updating the message.
   */
  async updateMessageStatus(id: string, status: string) {
    // Validate and cast the status to MessageStatus
    if (!Object.values(MessageStatus).includes(status as MessageStatus)) {
      throw new BadRequestException(`Invalid status: ${status}`); // 🚫 Error handling for invalid status
    }

    const message = await this.prisma.message.findUnique({ where: { id } });
    if (!message) {
      throw new NotFoundException('Message not found'); // 🚫 Error handling for not found
    }

    try {
      return await this.prisma.message.update({
        where: { id },
        data: {
          status: status as MessageStatus, // Cast to MessageStatus
        },
      });
    } catch (error) {
      throw new InternalServerErrorException(
        'Failed to update message status: ' + error.message,
      ); // 🚫 Error handling
    }
  }

  /**
   * 🗑️ Delete a message
   * @param id - The ID of the message to delete.
   * @returns The deleted message record.
   * @throws NotFoundException if the message is not found.
   * @throws InternalServerErrorException if there is an error deleting the message.
   */
  async deleteMessage(id: string) {
    const message = await this.prisma.message.findUnique({ where: { id } });
    if (!message) {
      throw new NotFoundException('Message not found'); // 🚫 Error handling for not found
    }

    try {
      return await this.prisma.message.delete({
        where: { id },
      });
    } catch (error) {
      throw new InternalServerErrorException(
        'Failed to delete message: ' + error.message,
      ); // 🚫 Error handling
    }
  }

  /**
   * 📜 Get messages by user
   * @param userId - The ID of the user whose messages to retrieve.
   * @returns An array of messages for the user.
   * @throws InternalServerErrorException if there is an error retrieving messages.
   */
  async getMessagesByUser(userId: string) {
    try {
      return await this.prisma.message.findMany({
        where: { owner_id: userId },
        include: { chat: true }, // Include chat details
      });
    } catch (error) {
      throw new InternalServerErrorException(
        'Failed to retrieve messages: ' + error.message,
      ); // 🚫 Error handling
    }
  }
}
