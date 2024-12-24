import {
  Controller,
  Get,
  Post,
  Delete,
  Param,
  Body,
  Query,
  UseGuards,
  Req,
  Request,
} from '@nestjs/common';
import { ChatsService } from './chats.service';
import { JwtAuthGuard } from 'src/guards/jwt.guard';
import { AllowedUserTypes, UserTypeGuard } from 'src/guards/userType.guard';

@UseGuards(JwtAuthGuard, UserTypeGuard)
@Controller('chats')
export class ChatsController {
  constructor(private readonly chatsService: ChatsService) {}

  @AllowedUserTypes('admin')
  @Get()
  async getAllChats() {
    return this.chatsService.getAllChats();
  }

  @AllowedUserTypes('broker', 'barterer')
  @Post()
  async createChat(@Body() body: { barter_id?: string; hire_id?: string }) {
    return this.chatsService.createChat(body.barter_id, body.hire_id);
  }

  @AllowedUserTypes('broker', 'barterer')
  @Get('user')
  async getUserChats(@Request() req: any) {
    const userId = req.user.id; // Extract user ID from JWT
    return await this.chatsService.getUserChats(userId);
  }

  @AllowedUserTypes('broker', 'barterer')
  @Get(':id')
  async getChatById(@Param('id') id: string) {
    return this.chatsService.getChatById(id);
  }

  @AllowedUserTypes('broker', 'barterer')
  @Get(':id/messages')
  async getMessagesInChat(
    @Param('id') chatId: string,
    @Query('status') status?: string,
  ) {
    return this.chatsService.getMessagesInChat(chatId, status);
  }

  @Delete(':id')
  async deleteChat(@Param('id') id: string) {
    return this.chatsService.deleteChat(id);
  }
  
