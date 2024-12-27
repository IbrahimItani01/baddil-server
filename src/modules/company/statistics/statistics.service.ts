import { Injectable, InternalServerErrorException } from '@nestjs/common'; // 📦 Importing necessary exceptions
import { PrismaService } from 'src/database/prisma.service'; // 🗄️ Importing PrismaService for database access
import { getUserTypeId } from 'src/utils/modules/users/users.utils'; // 🔍 Importing utility function to get user type ID
import { UserCountsDto } from './dto/statistics.dto'; // 📥 Importing the UserCountsDto

@Injectable()
export class StatisticsService {
  constructor(private readonly prisma: PrismaService) {} // 🏗️ Injecting PrismaService

  /**
   * 📊 Get user counts by user type
   * @returns An object containing counts of admins, brokers, and barterers.
   * @throws InternalServerErrorException if there is an error retrieving user counts.
   */
  async getUserCounts(): Promise<UserCountsDto> {
    // 🎯 Return type is now the DTO
    try {
      // Fetching user type IDs
      const adminTypeId = await getUserTypeId(this.prisma, 'admin');
      const brokerTypeId = await getUserTypeId(this.prisma, 'broker');
      const bartererTypeId = await getUserTypeId(this.prisma, 'barterer');

      // Counting users by type concurrently
      const [adminsCount, brokersCount, barterersCount] = await Promise.all([
        this.prisma.user.count({ where: { user_type_id: adminTypeId } }), // Counting admins
        this.prisma.user.count({ where: { user_type_id: brokerTypeId } }), // Counting brokers
        this.prisma.user.count({ where: { user_type_id: bartererTypeId } }), // Counting barterers
      ]);

      return {
        admins_count: adminsCount, // Returning admin count
        brokers_count: brokersCount, // Returning broker count
        barterers_count: barterersCount, // Returning barterer count
      };
    } catch (error) {
      // Handle errors gracefully
      throw new InternalServerErrorException(
        'Failed to retrieve user counts: ' + error.message,
      ); // 🚫 Error handling
    }
  }
}
