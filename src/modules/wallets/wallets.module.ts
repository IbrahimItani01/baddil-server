import { Module } from '@nestjs/common'; // 🌐 Importing the Module decorator from NestJS
import { WalletsService } from './wallets.service'; // 💼 Importing the service that handles wallet logic
import { WalletsController } from './wallets.controller'; // 📜 Importing the controller that handles wallet-related HTTP requests
import { PrismaService } from 'src/database/prisma.service';

@Module({
  controllers: [WalletsController], // 👨‍💻 Registering the WalletsController to handle HTTP routes for wallets
  providers: [WalletsService, PrismaService], // 🛠️ Registering the WalletsService and PrismaService as providers
})
export class WalletModule {} // 🏦 The WalletModule is now ready to be used in your NestJS app
