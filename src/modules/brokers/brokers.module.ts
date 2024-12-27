import { Module } from '@nestjs/common'; // 📦 Importing necessary decorators
import { BrokersController } from './brokers.controller'; // 🤝 Importing BrokersController for handling requests
import { BrokerService } from './brokers.service'; // 🛠️ Importing BrokerService for business logic
import { PrismaService } from 'src/database/prisma.service'; // 🗄️ Importing PrismaService for database access

@Module({
  imports: [], // 📥 No additional modules imported
  controllers: [BrokersController], // 🎮 Registering the BrokersController
  providers: [BrokerService, PrismaService], // 🛠️ Registering the BrokerService and PrismaService
  exports: [BrokerService], // 🔓 Exporting BrokerService for use in other modules
})
export class BrokersModule {} // 📦 Brokers Module