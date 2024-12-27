import {
  Controller,
  Post,
  Patch,
  Delete,
  Param,
  Body,
  Get,
  UseGuards,
  Request,
  HttpException,
  HttpStatus,
} from '@nestjs/common'; // 📦 Importing necessary decorators and exceptions
import { MessagesService } from './messages.service'; // 💬 Importing MessagesService for business logic
import { JwtAuthGuard } from 'src/guards/jwt.guard'; // 🔑 Importing JWT authentication guard
import { AllowedUserTypes, UserTypeGuard } from 'src/guards/userType.guard'; // 🛡️ Importing user type guards
import { ChatGateway } from 'src/gateways/chat.gateway'; // 📡 Importing ChatGateway for WebSocket communication
import { SendMessageDto, UpdateMessageStatusDto } from './dto/messages.dto'; // 📨 Importing DTOs for data validation

@UseGuards(JwtAuthGuard, UserTypeGuard) // 🛡️ Applying guards for authentication and user type validation
@AllowedUserTypes('barterer', 'broker') // 🎯 Restricting access to barterers and brokers
@Controller('messages') // 📍 Base route for message-related operations
export class MessagesController {
  constructor(
    private readonly messagesService: MessagesService, // 🏗️ Injecting MessagesService
    private readonly chatGateway: ChatGateway, // 🏗️ Injecting ChatGateway
  ) {}

  /**
   * ➕ Send a new message
   * @param sendMessageDto - The message content, owner ID, chat ID, and optional status.
   * @returns The saved message record.
   */
  @Post() // ➕ Endpoint to send a message
  async sendMessage(@Body() sendMessageDto: SendMessageDto) {
    try {
      const savedMessage =
        await this.messagesService.sendMessage(sendMessageDto);

      // Emit WebSocket event
      this.chatGateway.server
        .to(sendMessageDto.chat_id)
        .emit('newMessage', savedMessage);

      return {
        status: 'success',
        message: 'Message sent successfully',
        data: savedMessage,
      };
    } catch (error) {
      throw new HttpException(
        'Failed to send message: ' + error.message,
        HttpStatus.BAD_REQUEST, // 400 Bad Request
      );
    }
  }

  /**
   * ✏️ Update the status of a message
   * @param id - The ID of the message to update.
   * @param updateMessageStatusDto - The new status of the message.
   * @returns The updated message record.
   */
  @Patch(':id/status') // ✏️ Endpoint to update message status
  async updateMessageStatus(
    @Param('id') id: string,
    @Body() updateMessageStatusDto: UpdateMessageStatusDto,
  ) {
    try {
      const updatedMessage = await this.messagesService.updateMessageStatus(
        id,
        updateMessageStatusDto,
      );
      return {
        status: 'success',
        message: 'Message status updated successfully',
        data: updatedMessage,
      };
    } catch (error) {
      throw new HttpException(
        'Failed to update message status: ' + error.message,
        HttpStatus.BAD_REQUEST, // 400 Bad Request
      );
    }
  }

  /**
   * 🗑️ Delete a message
   * @param id - The ID of the message to delete.
   * @returns A success message.
   */
  @Delete(':id') // 🗑️ Endpoint to delete a message
  async deleteMessage(@Param('id') id: string) {
    try {
      await this.messagesService.deleteMessage(id);
      return {
        status: 'success',
        message: 'Message deleted successfully',
      };
    } catch (error) {
      throw new HttpException(
        'Failed to delete message: ' + error.message,
        HttpStatus.BAD_REQUEST, // 400 Bad Request
      );
    }
  }

  /**
   * 📜 Get messages by user
   * @param req - The request object containing user information.
   * @returns An array of messages for the user.
   */
  @Get('user') // 📥 Endpoint to get messages by user
  async getMessagesByUser(@Request() req: any) {
    const userId = req.user.id; // 🔍 Extracting user ID from the request
    try {
      const messages = await this.messagesService.getMessagesByUser(userId);
      return {
        status: 'success',
        message: 'Messages retrieved successfully',
        data: messages,
      };
    } catch (error) {
      throw new HttpException(
        'Failed to retrieve messages: ' + error.message,
        HttpStatus.INTERNAL_SERVER_ERROR, // 500 Internal Server Error
      );
    }
  }
}
