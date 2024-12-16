import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CompanySeeder } from './company/company.seeder';
import { UsersSeeder } from './users/users.seeder';
import { BarterersSeeder } from './barterers/barterers.seeder';
import { BrokersSeeder } from './brokers/brokers.seeder';
import { BartersSeeder } from './barters/barters.seeder';
import { ChatsSeeder } from './chats/chats.seeder';
import { DisputesSeeder } from './disputes/disputes.seeder';
import { FlagsSeeder } from './flags/flags.seeder';
import { NotificationsSeeder } from './notifications/notifications.seeder';
import { Company, CompanySchema } from '../schemas/company.schema';
import { User, UserSchema } from '../schemas/users.schema';
import { Barterer, BartererSchema } from '../schemas/barterers.schema';
import { Broker, BrokerSchema } from '../schemas/brokers.schema';
import { Barter, BarterSchema } from '../schemas/barters.schema';
import { Chat, ChatSchema } from '../schemas/chats.schema';
import { Dispute, DisputeSchema } from '../schemas/disputes.schema';
import { Flag, FlagSchema } from '../schemas/flags.schema';
import {
  Notification,
  NotificationSchema,
} from '../schemas/notifications.schema';
import { DatabaseModule } from '../database.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    DatabaseModule,
    MongooseModule.forFeature([
      { name: Company.name, schema: CompanySchema },
      { name: User.name, schema: UserSchema },
      { name: Barterer.name, schema: BartererSchema },
      { name: Broker.name, schema: BrokerSchema },
      { name: Barter.name, schema: BarterSchema },
      { name: Chat.name, schema: ChatSchema },
      { name: Dispute.name, schema: DisputeSchema },
      { name: Flag.name, schema: FlagSchema },
      { name: Notification.name, schema: NotificationSchema },
    ]),
  ],
  providers: [
    CompanySeeder,
    UsersSeeder,
    BarterersSeeder,
    BrokersSeeder,
    BartersSeeder,
    ChatsSeeder,
    DisputesSeeder,
    FlagsSeeder,
    NotificationsSeeder,
  ],
  exports: [
    CompanySeeder,
    UsersSeeder,
    BarterersSeeder,
    BrokersSeeder,
    BartersSeeder,
    ChatsSeeder,
    DisputesSeeder,
    FlagsSeeder,
    NotificationsSeeder,
  ],
})
export class SeedersModule {}
