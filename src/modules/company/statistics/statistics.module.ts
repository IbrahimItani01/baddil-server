import { Module } from '@nestjs/common'; // 📦 Importing necessary decorators
import { StatisticsService } from './statistics.service'; // 📊 Importing StatisticsService for business logic
import { StatisticsController } from './statistics.controller'; // 📈 Importing StatisticsController for handling requests
import { PrismaService } from 'src/database/prisma.service'; // 🗄️ Importing PrismaService for database access

@Module({
  controllers: [StatisticsController], // 🎮 Registering the StatisticsController
  providers: [StatisticsService, PrismaService], // 🛠️ Registering the StatisticsService and PrismaService
})
export class StatisticsModule {} // 📦 Statistics Module