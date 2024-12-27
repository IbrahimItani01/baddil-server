import { Module } from '@nestjs/common'; // 📦 Importing necessary decorators
import { ManagementService } from './management.service'; // 🛠️ Importing ManagementService for business logic
import { ManagementController } from './management.controller'; // 🎮 Importing ManagementController for handling requests
import { PrismaService } from 'src/database/prisma.service'; // 🗄️ Importing PrismaService for database access

@Module({
  controllers: [ManagementController], // 🎮 Registering the ManagementController
  providers: [ManagementService, PrismaService], // 🛠️ Registering the ManagementService and PrismaService
})
export class ManagementModule {} // 📦 Management Module