import { Module } from '@nestjs/common'; // 📦 Importing necessary decorators
import { AIController } from './ai.controller'; // 🤖 Importing AIController for handling requests
import { AIService } from './ai.service'; // 🛠️ Importing AIService for business logic
import { PrismaService } from 'src/database/prisma.service'; // 🗄️ Importing PrismaService for database access

/**
 * 🧠 AI Module
 * The AI Module is responsible for managing the AI-related business logic,
 * including the handling of auto-trades, barters, and other AI-managed tasks.
 */
@Module({
  controllers: [AIController], // 🎮 Registering the AIController
  providers: [AIService, PrismaService], // 🛠️ Registering the AIService and PrismaService
  exports: [AIService], // 🔓 Exporting AIService for use in other modules
})
export class AiModule {} // 📦 AI Module
