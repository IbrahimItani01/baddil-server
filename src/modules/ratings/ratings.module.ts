import { Module } from '@nestjs/common'; // 📦 Importing the Module decorator
import { RatingsService } from './ratings.service'; // 📊 Importing the RatingsService
import { RatingsController } from './ratings.controller'; // 📋 Importing the RatingsController
import { PrismaService } from 'src/database/prisma.service'; // 🗄️ Importing PrismaService for database access

@Module({
  controllers: [RatingsController], // Registering the RatingsController
  providers: [RatingsService, PrismaService], // Registering the RatingsService and PrismaService
})
export class RatingsModule {}