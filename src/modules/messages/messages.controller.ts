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
   * @param body - The message content, owner ID, and chat ID.
   * @returns The saved message record.
   */
  @Post() // ➕ Endpoint to send a message
  async sendMessage(
    @Body() body: { content: string; owner_id: string; chat_id: string },
  ) {
    try {
      const savedMessage = await this.messagesService.sendMessage(
        body.content,
        body.owner_id,
        body.chat_id,
        'sent',
      );

      // Emit WebSocket event
      this.chatGateway.server.to(body.chat_id).emit('newMessage', savedMessage);
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

  @Patch(':id/status')
  async updateMessageStatus(
    @Param('id') id: string,
    @Body() body: { status: string },
  ) {
    return this.messagesService.updateMessageStatus(id, body.status);
  }

  @Delete(':id')
  async deleteMessage(@Param('id') id: string) {
    return this.messagesService.deleteMessage(id);
  }

  @Get('user')
  async getMessagesByUser(@Request() req: any) {
    const userId = req.user.id; 
    return this.messagesService.getMessagesByUser(userId);
  }
}
