import { Module } from '@nestjs/common'; // 📦 Importing necessary decorators
import { BarterersController } from './barterers.controller'; // 🤝 Importing BarterersController for handling requests
import { BarterersService } from './barterers.service'; // 🛠️ Importing BarterersService for business logic
import { PrismaService } from '../../database/prisma.service'; // 🗄️ Importing PrismaService for database access

/**
 * 📦 Barterers Module
 * This module encapsulates the logic related to barterers, including fetching
 * their information, and includes the relevant controller, service, and database access.
 */
@Module({
  controllers: [BarterersController], // 🎮 Registering the BarterersController
  providers: [BarterersService, PrismaService], // 🛠️ Registering the BarterersService and PrismaService
  exports: [BarterersService], // 🔓 Exporting BarterersService for use in other modules
})
export class BarterersModule {} // 📦 Barterers Module
