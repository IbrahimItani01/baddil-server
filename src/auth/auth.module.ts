import { Module } from '@nestjs/common'; // 📦 Importing necessary decorators
import { JwtModule } from '@nestjs/jwt'; // 🔑 Importing JWT module for token management
import { PassportModule } from '@nestjs/passport'; // 🛂 Importing Passport module for authentication strategies
import { ConfigModule, ConfigService } from '@nestjs/config'; // ⚙️ Importing ConfigModule for environment variables

import { AuthController } from './auth.controller'; // 🔑 Importing AuthController for authentication routes
import { AuthService } from './auth.service'; // 🔑 Importing AuthService for authentication logic
import { UsersModule } from '../modules/users/users.module'; // 👤 Importing UsersModule for user management
import { BarterersModule } from '../modules/barterers/barterers.module'; // 📦 Importing BarterersModule for barterer logic
import { BrokersModule } from '../modules/brokers/brokers.module'; // 📦 Importing BrokersModule for broker logic
import { JwtStrategy } from '../utils/strategies/jwt.strategy'; // 🛡 Importing JWT strategy for token validation
import { PrismaService } from 'src/database/prisma.service'; // 🗄 Importing PrismaService for database access

@Module({
  imports: [
    PassportModule, // 🛂 Handles authentication strategies
    JwtModule.registerAsync({
      imports: [ConfigModule], // 🛠 Imports ConfigModule for dynamic configuration
      inject: [ConfigService], // 💉 Injects ConfigService to access environment variables
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'), // 🔑 Secret key for signing JWT
        signOptions: {
          expiresIn: '3650d', // ⏳ JWT expiration time (10 years)
        },
      }),
    }),
    BarterersModule, // 📦 Module for handling barterer-specific logic
    BrokersModule, // 📦 Module for handling broker-specific logic
    UsersModule, // 👤 Module for user management
  ],
  controllers: [AuthController], // 🎮 Controller handling authentication-related endpoints
  providers: [
    AuthService, // 🛠 Service for authentication logic
    JwtStrategy, // 🛡 Strategy for validating JWT
    PrismaService, // 🗄 Service for database access
  ],
  exports: [
    PassportModule, // 🚪 Exporting for use in other modules
    JwtModule, // 🚪 Exporting JWT-related functionality
  ],
})
export class AuthModule {} // 📦 Auth Module
