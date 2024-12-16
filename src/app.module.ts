import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from './database/database.module';
import { AuthModule } from './auth/auth.module';
import { FirebaseAdminModule } from './auth/firebase/firebase.module';
import { UsersModule } from './modules/users/users.module';
import { SeedersModule } from './database/seeders/seeders.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    AuthModule,
    DatabaseModule,
    FirebaseAdminModule,
    UsersModule,
    SeedersModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
