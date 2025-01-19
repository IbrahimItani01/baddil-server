import { Module } from '@nestjs/common'; // 📦 Importing necessary decorators
import { FinancesService } from './finances.service'; // 💰 Importing FinancesService for business logic
import { FinancesController } from './finances.controller'; // 🎮 Importing FinancesController for handling requests
import { PrismaService } from 'src/database/prisma.service'; // 🗄️ Importing PrismaService for database access

@Module({
  controllers: [FinancesController], // 🎮 Registering the FinancesController
  providers: [FinancesService, PrismaService], // 🛠️ Registering the FinancesService and PrismaService
})
export class FinancesModule {} // 📦 Finances Module