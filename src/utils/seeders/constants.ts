import { BarterersSeeder } from '../../database/seeders/barterers/barterers.seeder';
import { BartersSeeder } from '../../database/seeders/barters/barters.seeder';
import { BrokersSeeder } from '../../database/seeders/brokers/brokers.seeder';
import { ChatsSeeder } from '../../database/seeders/chats/chats.seeder';
import { CompanySeeder } from '../../database/seeders/company/company.seeder';
import { DisputesSeeder } from '../../database/seeders/disputes/disputes.seeder';
import { FlagsSeeder } from '../../database/seeders/flags/flags.seeder';
import { NotificationsSeeder } from '../../database/seeders/notifications/notifications.seeder';
import { UsersSeeder } from '../../database/seeders/users/users.seeder';

export const SEEDERS = [
  CompanySeeder,
  UsersSeeder,
  BarterersSeeder,
  BrokersSeeder,
  BartersSeeder,
  ChatsSeeder,
  DisputesSeeder,
  FlagsSeeder,
  NotificationsSeeder,
];
