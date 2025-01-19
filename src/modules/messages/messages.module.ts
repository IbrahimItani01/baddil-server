import { forwardRef, Module } from '@nestjs/common'; // 📦 Importing necessary decorators
import { MessagesService } from './messages.service'; // 💬 Importing MessagesService for business logic
import { MessagesController } from './messages.controller'; // 📜 Importing MessagesController for handling requests
import { PrismaService } from 'src/database/prisma.service'; // 🗄️ Importing PrismaService for database access
import { ChatGateway } from 'src/gateways/chat.gateway';
import { JwtService } from '@nestjs/jwt';
import { ChatsService } from '../chats/chats.service';
import { ChatsModule } from '../chats/chats.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [ConfigModule, forwardRef(() => ChatsModule)], // Forward reference to prevent circular import
  controllers: [MessagesController], // 🎮 Registering the MessagesController
  providers: [
    MessagesService,
    PrismaService,
    ChatGateway,
    ChatsService,
    JwtService,
  ], // 🛠️ Registering the MessagesService and PrismaService
  exports: [MessagesService],
})
export class MessagesModule {} // 📦 Messages Module
