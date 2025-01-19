import { Module } from '@nestjs/common'; // 📦 Importing Module from NestJS to define the application module
import { AppController } from './app.controller'; // 🎛️ Importing the main controller of the app
import { AppService } from './app.service'; // 🛠️ Importing the main service of the app
import { ConfigModule } from '@nestjs/config'; // ⚙️ Importing ConfigModule to handle environment variables and configurations
import { AuthModule } from './auth/auth.module'; // 🔐 Importing authentication module
import { FirebaseAdminModule } from './auth/firebase/firebase.module'; // 📱 Importing Firebase admin module for Firebase authentication
import { UsersModule } from './modules/users/users.module'; // 👤 Importing the Users module
import { ServeStaticModule } from '@nestjs/serve-static'; // 📂 Importing ServeStaticModule to serve static files like images
import { join } from 'path'; // 🛤️ Importing 'path' to manage and resolve file paths
import { AiModule } from './modules/ai/ai.module'; // 🤖 Importing the AI module for any AI-related functionalities
import { BarterersModule } from './modules/barterers/barterers.module'; // 🤝 Importing the Barterers module
import { BartersModule } from './modules/barters/barters.module'; // 🔄 Importing the Barters module
import { BrokersModule } from './modules/brokers/brokers.module'; // 🧑‍💼 Importing the Brokers module
import { ChatsModule } from './modules/chats/chats.module'; // 💬 Importing the Chats module
import { DisputesModule } from './modules/disputes/disputes.module'; // ⚖️ Importing the Disputes module
import { LocationsModule } from './modules/locations/locations.module'; // 📍 Importing the Locations module
import { MeetupsModule } from './modules/meetups/meetups.module'; // 🤝 Importing the Meetups module
import { MessagesModule } from './modules/messages/messages.module'; // ✉️ Importing the Messages module
import { PerformancesModule } from './modules/performances/performances.module'; // 📊 Importing the Performances module
import { RatingsModule } from './modules/ratings/ratings.module'; // ⭐ Importing the Ratings module
import { TiersModule } from './modules/tiers/tiers.module'; // 🔝 Importing the Tiers module
import { WalletModule } from './modules/wallets/wallets.module'; // 💰 Importing the Wallet module
import { APP_FILTER } from '@nestjs/core'; // 🚨 Importing APP_FILTER to handle errors
import { ApiResponseExceptionFilter } from './utils/api/api.filter'; // 🚨 Importing the API response exception filter
import { ManagementModule } from './modules/company/management/management.module';
import { FinancesModule } from './modules/company/finances/finances.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, // 🌍 Ensuring configuration is globally available in the entire application
    }),
    // 📂 Serve static files like images, videos, or any other static resources
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'uploads'), // 📂 Path where static files are stored
      serveRoot: '/uploads', // 📸 Files will be accessible at /uploads/<filename>
    }),
    // 🔗 Importing all necessary modules for the application
    AuthModule,
    FirebaseAdminModule,
    UsersModule,
    AiModule,
    BarterersModule,
    BartersModule,
    BrokersModule,
    ChatsModule,
    DisputesModule,
    LocationsModule,
    MeetupsModule,
    MessagesModule,
    PerformancesModule,
    ManagementModule,
    RatingsModule,
    TiersModule,
    WalletModule,
    FinancesModule
  ],
  controllers: [AppController], // 🎛️ Registering the main controller of the app
  providers: [
    AppService,
    { provide: APP_FILTER, useClass: ApiResponseExceptionFilter }, // 🚨 Registering the API response exception filter
  ], // 🛠️ Registering the main service of the app
})
export class AppModule {} // 📦 Defining the main application module
