import { Module } from '@nestjs/common'; // 📦 Importing necessary decorators
import { MeetupsService } from './meetups.service'; // 📅 Importing MeetupsService for business logic
import { MeetupsController } from './meetups.controller'; // 📜 Importing MeetupsController for handling requests
import { PrismaService } from 'src/database/prisma.service'; // 🗄️ Importing PrismaService for database access

@Module({
  controllers: [MeetupsController], // 🎮 Registering the MeetupsController
  providers: [MeetupsService, PrismaService], // 🛠️ Registering the MeetupsService and PrismaService
})
export class MeetupsModule {} // 📦 Meetups Module
