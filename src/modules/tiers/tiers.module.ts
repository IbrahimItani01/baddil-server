import { Module } from '@nestjs/common'; // 📦 Importing the Module decorator
import { TiersService } from './tiers.service'; // 📊 Importing the TiersService
import { TiersController } from './tiers.controller'; // 📋 Importing the TiersController
import { PrismaService } from 'src/database/prisma.service'; // 🗄️ Importing PrismaService for database access

@Module({
  controllers: [TiersController], // Registering the TiersController
  providers: [TiersService, PrismaService], // Registering the TiersService and PrismaService
})
export class TiersModule {}