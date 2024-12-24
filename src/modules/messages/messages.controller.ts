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
} from '@nestjs/common';
import { MessagesService } from './messages.service';
import { JwtAuthGuard } from 'src/guards/jwt.guard';
import { AllowedUserTypes, UserTypeGuard } from 'src/guards/userType.guard';

@UseGuards(JwtAuthGuard, UserTypeGuard)
@AllowedUserTypes('barterer', 'broker')
@Controller('messages')
export class MessagesController {
  constructor(private readonly messagesService: MessagesService) {}

  @Post()
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

