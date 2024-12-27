import {
  Injectable,
  NotFoundException,
  InternalServerErrorException,
} from '@nestjs/common'; // 📦 Importing necessary exceptions
import { PrismaService } from 'src/database/prisma.service'; // 🗄️ Importing PrismaService for database access

@Injectable()
export class PerformancesService {
  constructor(private readonly prisma: PrismaService) {} // 🏗️ Injecting PrismaService

  /**
   * 📜 Get total earnings for a broker
   * @param brokerId - The ID of the broker.
   * @returns An object containing total earnings and completed hires count.
   * @throws NotFoundException if the broker has no completed hires.
   * @throws InternalServerErrorException if there is an error retrieving earnings.
   */
  async getBrokerEarnings(brokerId: string) {
    try {
      const hires = await this.prisma.hire.findMany({
        where: { broker_id: brokerId, status: 'completed' },
        select: { budget: true },
      });

      if (hires.length === 0) {
        throw new NotFoundException('No completed hires found for this broker'); // 🚫 Error handling for not found
      }

      const totalEarnings = hires.reduce((sum, hire) => sum + hire.budget, 0);

      return {
        totalEarnings,
        completedHires: hires.length,
      };
    } catch (error) {
      throw new InternalServerErrorException(
        'Failed to retrieve broker earnings: ' + error.message,
      ); // 🚫 Error handling
    }
  }

  /**
   * 📜 Get broker barters grouped by status
   * @param brokerId - The ID of the broker.
   * @returns An object containing the count of barters grouped by status.
   * @throws InternalServerErrorException if there is an error retrieving barters.
   */
  async getBrokerBartersGroupedByStatus(brokerId: string) {
    try {
      const barters = await this.prisma.barter.findMany({
        where: { user1_id: brokerId },
        select: { status: true },
      });

      const groupedBarters = barters.reduce((acc, barter) => {
        acc[barter.status] = (acc[barter.status] || 0) + 1; // Grouping by status
        return acc;
      }, {});

      return groupedBarters; // Returning grouped barters
    } catch (error) {
      throw new InternalServerErrorException(
        'Failed to retrieve broker barters: ' + error.message,
      ); // 🚫 Error handling
    }
  }

  /**
   * 📜 Get broker ratings
   * @param brokerId - The ID of the broker.
   * @returns An object containing average rating and total ratings count.
   * @throws InternalServerErrorException if there is an error retrieving ratings.
   */
  async getBrokerRatings(brokerId: string) {
    try {
      const ratings = await this.prisma.rating.findMany({
        where: { broker_id: brokerId },
        select: { value: true },
      });

      const totalRatings = ratings.length;
      const averageRating =
        totalRatings > 0
          ? ratings.reduce((sum, rating) => sum + rating.value, 0) /
            totalRatings
          : 0; // Avoid division by zero

      return {
        averageRating,
        totalRatings,
      };
    } catch (error) {
      throw new InternalServerErrorException(
        'Failed to retrieve broker ratings: ' + error.message,
      ); // 🚫 Error handling
    }
  }
}
