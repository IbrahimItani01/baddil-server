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

  async sendMessage(
    @Body()
    body: {
      content: string;
      owner_id: string;
      chat_id: string;
      status?: string;
    },
  ) {
    return this.messagesService.sendMessage(
      body.content,
      body.owner_id,
      body.chat_id,
      body.status || 'sent',
    );
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
