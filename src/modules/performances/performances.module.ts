import { Module } from '@nestjs/common'; // 📦 Importing necessary decorators
import { PerformancesService } from './performances.service'; // 📈 Importing PerformancesService for business logic
import { PerformancesController } from './performances.controller'; // 📜 Importing PerformancesController for handling requests
import { PrismaService } from 'src/database/prisma.service'; // 🗄️ Importing PrismaService for database access

@Module({
  controllers: [PerformancesController], // 🎮 Registering the PerformancesController
  providers: [PerformancesService, PrismaService], // 🛠️ Registering the PerformancesService and PrismaService
})
export class PerformancesModule {} // 📦 Performances Module