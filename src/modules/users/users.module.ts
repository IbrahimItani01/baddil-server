import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { PrismaService } from 'src/database/prisma.service';

@Module({
  imports: [], // 🌟 No additional modules are imported for now
  controllers: [UsersController], // 🚀 Declaring the UsersController for handling routes
  providers: [UsersService, PrismaService], // 🛠️ Providing UsersService and PrismaService for dependency injection
  exports: [UsersService], // 📤 Exporting UsersService for use in other modules
})
export class UsersModule {} // 🏗️ Defining the UsersModule to encapsulate user-related logic
