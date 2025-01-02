import { NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/database/prisma.service';

// fetch chat by Id
export async function checkChatExists(prisma: PrismaService, chatId: string) {
    const chat = await prisma.chat.findUnique({
      where: { id: chatId },
    });
  
    if (!chat) {
      throw new NotFoundException(`Chat with ID ${chatId} not found`);
    }
  
    return chat;
  }