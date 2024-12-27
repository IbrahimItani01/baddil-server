import { Module } from '@nestjs/common'; // 📦 Importing necessary decorators
import { DisputesService } from './disputes.service'; // ⚖️ Importing DisputesService for business logic
import { DisputesController } from './disputes.controller'; // 📜 Importing DisputesController for handling requests
import { PrismaService } from 'src/database/prisma.service'; // 🗄️ Importing PrismaService for database access

@Module({
  controllers: [DisputesController], // 🎮 Registering the DisputesController
  providers: [DisputesService, PrismaService], // 🛠️ Registering the DisputesService and PrismaService
})
export class DisputesModule {} // 📦 Disputes Module
