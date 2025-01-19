import { Module } from '@nestjs/common'; // 📦 Importing necessary decorators
import { LocationsService } from './locations.service'; // 📍 Importing LocationsService for business logic
import { LocationsController } from './locations.controller'; // 📜 Importing LocationsController for handling requests
import { PrismaService } from 'src/database/prisma.service'; // 🗄️ Importing PrismaService for database access

@Module({
  controllers: [LocationsController], // 🎮 Registering the LocationsController
  providers: [LocationsService, PrismaService], // 🛠️ Registering the LocationsService and PrismaService
})
export class LocationsModule {} // 📦 Locations Module