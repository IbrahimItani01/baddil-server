import { Injectable, BadRequestException } from '@nestjs/common'; // 📦 Importing necessary exceptions
import { MessageStatus } from '@prisma/client'; // 📜 Importing MessageStatus enum from Prisma
import { PrismaService } from 'src/database/prisma.service'; // 🗄️ Importing PrismaService for database access
import { SendMessageDto, UpdateMessageStatusDto } from './dto/messages.dto'; // 📨 Importing DTOs for data validation
import { handleError } from 'src/utils/general/error.utils';
import { checkEntityExists } from 'src/utils/general/models.utils';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';
import { ChatGateway } from 'src/gateways/chat.gateway';

@Injectable()
export class MessagesService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly configService: ConfigService,
    private readonly chatGateway: ChatGateway, // 🏗️ Injecting ChatGateway
    // Inject ConfigService to access env variables
  ) {} // 🏗️ Injecting PrismaService

  /**
   * ➕ Send a new message
   * @param sendMessageDto - DTO containing content, owner ID, chat ID, and optional status.
   * @returns The created message record.
   * @throws BadRequestException if the status is invalid.
   * @throws InternalServerErrorException if there is an error creating the message.
   */
  async sendMessage(sendMessageDto: SendMessageDto) {
    const { content, owner_id, chat_id, status } = sendMessageDto;

    // Validate and cast the status to MessageStatus
    await this.checkStatus(status);

    try {
      // Step 1: Save the user message to the database
      const savedMessage = await this.prisma.message.create({
        data: {
          content,
          owner_id,
          chat_id,
          status: status ? (status as MessageStatus) : 'sent', // Default status to 'sent'
        },
      });

      // Step 2: Fetch the chat and get the corresponding barter_id
      const chat = await this.prisma.chat.findUnique({
        where: { id: chat_id },
        include: {
          barter: { include: { user1: true, user2: true } }, // Include the barter information
        },
      });

      if (!chat) {
        throw new Error('Chat not found');
      }

      const { user1_id, user2_id, handled_by_ai } = chat.barter;

      // Step 3: Identify the other user
      const otherUserId = owner_id === user1_id ? user2_id : user1_id;

      // Step 4: Check if the other user is handling the barter by AI
      const isAiHandled =
        (otherUserId === user1_id && handled_by_ai === 'user1') ||
        (otherUserId === user2_id && handled_by_ai === 'user2') ||
        handled_by_ai === 'both';
      let aiMessage;
      // Step 5: If AI handling is enabled for the other user, call the AI API for response
      if (isAiHandled) {
        // Call the AI response API
        const aiResponse = await this.callAiApi(otherUserId, chat.barter_id);

        // Step 6: Save the AI-generated message
        aiMessage = await this.prisma.message.create({
          data: {
            content: aiResponse,
            owner_id: otherUserId, // The other user (not the sender)
            chat_id,
            status: 'sent',
          },
        });

        // Step 7: Emit WebSocket event for the AI response
      }

      // Step 8: Emit WebSocket event for the user message
      await this.chatGateway.server
        .to(chat_id)
        .emit('newMessage', savedMessage);
      await this.chatGateway.server.to(chat_id).emit('newMessage', aiMessage);

      return savedMessage; // Return the saved message
    } catch (error) {
      handleError(error, 'Failed sending message');
    }
  }

  /**
   * ✏️ Update the status of a message
   * @param id - The ID of the message to update.
   * @param updateMessageStatusDto - DTO containing the new status of the message.
   * @returns The updated message record.
   * @throws BadRequestException if the status is invalid.
   * @throws NotFoundException if the message is not found.
   * @throws InternalServerErrorException if there is an error updating the message.
   */
  async updateMessageStatus(
    id: string,
    updateMessageStatusDto: UpdateMessageStatusDto,
  ) {
    const { status } = updateMessageStatusDto;

    // Validate and cast the status to MessageStatus
    await this.checkStatus(status);

    await checkEntityExists(this.prisma, 'message', id);

    try {
      return await this.prisma.message.update({
        where: { id },
        data: {
          status: status as MessageStatus, // Cast to MessageStatus
        },
      });
    } catch (error) {
      handleError(error, 'failed to update message status');
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
    await checkEntityExists(this.prisma, 'message', id);

    try {
      return await this.prisma.message.delete({
        where: { id },
      });
    } catch (error) {
      handleError(error, 'failed to delete message');
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
      handleError(error, 'failed to get messages');
    }
  }

  private async checkStatus(status: string) {
    if (
      status &&
      !Object.values(MessageStatus).includes(status as MessageStatus)
    ) {
      throw new BadRequestException(`Invalid status: ${status}`); // 🚫 Error handling for invalid status
    }
  }
}
