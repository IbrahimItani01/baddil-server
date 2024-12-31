import { Module } from '@nestjs/common'; // 📦 Importing necessary decorators
import { MessagesService } from './messages.service'; // 💬 Importing MessagesService for business logic
import { MessagesController } from './messages.controller'; // 📜 Importing MessagesController for handling requests
import { ChatsModule } from '../chats/chats.module'; // 💬 Importing ChatsModule for chat-related functionality
import { PrismaService } from 'src/database/prisma.service'; // 🗄️ Importing PrismaService for database access
import { ChatGateway } from 'src/gateways/chat.gateway';
import { JwtService } from '@nestjs/jwt';

@Module({
  imports: [ChatsModule], // 📦 Importing ChatsModule
  controllers: [MessagesController], // 🎮 Registering the MessagesController
  providers: [MessagesService, PrismaService,ChatGateway,JwtService], // 🛠️ Registering the MessagesService and PrismaService
})
export class MessagesModule {} // 📦 Messages Module
