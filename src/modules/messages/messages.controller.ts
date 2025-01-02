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
} from '@nestjs/common'; // 📦 Importing necessary decorators and exceptions
import { MessagesService } from './messages.service'; // 💬 Importing MessagesService for business logic
import { JwtAuthGuard } from 'src/guards/jwt.guard'; // 🔑 Importing JWT authentication guard
import { AllowedUserTypes, UserTypeGuard } from 'src/guards/userType.guard'; // 🛡️ Importing user type guards
import { ChatGateway } from 'src/gateways/chat.gateway'; // 📡 Importing ChatGateway for WebSocket communication
import { SendMessageDto, UpdateMessageStatusDto } from './dto/messages.dto'; // 📨 Importing DTOs for data validation
import { ApiResponse } from 'src/utils/api/apiResponse.interface';

@UseGuards(JwtAuthGuard, UserTypeGuard) // 🛡️ Applying guards for authentication and user type validation
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
  @AllowedUserTypes('barterer', 'broker') // 🎯 Restricting access to barterers and brokers
  @Post() // ➕ Endpoint to send a message
  async sendMessage(
    @Body() sendMessageDto: SendMessageDto,
  ): Promise<ApiResponse> {
    const savedMessage = await this.messagesService.sendMessage(sendMessageDto);

    // Emit WebSocket event
    this.chatGateway.server
      .to(sendMessageDto.chat_id)
      .emit('newMessage', savedMessage);

    return {
      success: true,
      message: 'Message sent successfully',
      data: savedMessage,
    };
  }

  /**
   * ✏️ Update the status of a message
   * @param id - The ID of the message to update.
   * @param updateMessageStatusDto - The new status of the message.
   * @returns The updated message record.
   */
  @AllowedUserTypes('barterer', 'broker') // 🎯 Restricting access to barterers and brokers
  @Patch(':id/status') // ✏️ Endpoint to update message status
  async updateMessageStatus(
    @Param('id') id: string,
    @Body() updateMessageStatusDto: UpdateMessageStatusDto,
  ): Promise<ApiResponse> {
    const updatedMessage = await this.messagesService.updateMessageStatus(
      id,
      updateMessageStatusDto,
    );
    return {
      success: true,
      message: 'Message status updated successfully',
      data: updatedMessage,
    };
  }

  /**
   * 🗑️ Delete a message
   * @param id - The ID of the message to delete.
   * @returns A success message.
   */
  @AllowedUserTypes('barterer', 'broker') // 🎯 Restricting
  @Delete(':id') // 🗑️ Endpoint to delete a message
  async deleteMessage(@Param('id') id: string): Promise<ApiResponse> {
    await this.messagesService.deleteMessage(id);
    return { success: true, message: 'Message deleted successfully' };
  }

  /**
   * 📜 Get messages by user
   * @param req - The request object containing user information.
   * @returns An array of messages for the user.
   */
  @AllowedUserTypes('barterer', 'broker') // 🎯 Restricting access to barterers and brokers
  @Get('user') // 📥 Endpoint to get messages by user
  async getMessagesByUser(@Request() req: any): Promise<ApiResponse> {
    const userId = req.user.id; // 🔍 Extracting user ID from the request

    const messages = await this.messagesService.getMessagesByUser(userId);
    return {
      success: true,
      message: 'Messages retrieved successfully',
      data: messages,
    };
  }
}
