import { Module } from '@nestjs/common'; // 📦 Importing necessary decorators
import { ChatsService } from './chats.service'; // 💬 Importing ChatsService for business logic
import { ChatsController } from './chats.controller'; // 🎮 Importing ChatsController for handling requests
import { ChatGateway } from 'src/gateways/chat.gateway'; // 🌐 Importing ChatGateway for WebSocket communication
import { PrismaService } from 'src/database/prisma.service'; // 🗄️ Importing PrismaService for database access

@Module({
  controllers: [ChatsController], // 🎮 Registering the ChatsController
  providers: [ChatsService, ChatGateway, PrismaService], // 🛠️ Registering the ChatsService, ChatGateway, and PrismaService
})
export class ChatsModule {} // 📦 Chats Module