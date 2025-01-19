import { Module } from '@nestjs/common'; // 📦 Importing necessary decorators
import { BartersController } from './barters.controller'; // 🤝 Importing BartersController for handling requests
import { BartersService } from './barters.service'; // 🛠️ Importing BartersService for business logic
import { PrismaService } from 'src/database/prisma.service'; // 🗄️ Importing PrismaService for database access

/**
 * 📦 Barters Module
 * This module encapsulates the logic for managing barters, including creating, updating, and canceling barters.
 */
@Module({
  controllers: [BartersController], // 🎮 Registering the BartersController
  providers: [BartersService, PrismaService], // 🛠️ Registering the BartersService and PrismaService
  exports: [BartersService], // 🔓 Exporting BartersService for use in other modules
})
export class BartersModule {} // 📦 Barters Module