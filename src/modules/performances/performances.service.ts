/* eslint-disable @typescript-eslint/no-unused-vars */
import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { PrismaService } from 'src/database/prisma.service';

@Injectable()
export class PerformancesService {
  constructor(private readonly prisma: PrismaService) {}

  async getBrokerEarnings(brokerId: string) {
    try {
      const hires = await this.prisma.hire.findMany({
        where: { broker_id: brokerId, status: 'completed' },
        select: { budget: true },
      });

      const totalEarnings = hires.reduce((sum, hire) => sum + hire.budget, 0);

      return {
        totalEarnings,
        completedHires: hires.length,
      };
    } catch (error) {
      throw new HttpException(
        'Failed to calculate broker earnings',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async getBrokerBartersGroupedByStatus(brokerId: string) {
    try {
      const barters = await this.prisma.barter.findMany({
        where: { user1_id: brokerId },
        select: { status: true },
      });

      const groupedBarters = barters.reduce((acc, barter) => {
        acc[barter.status] = (acc[barter.status] || 0) + 1;
        return acc;
      }, {});

      return groupedBarters;
    } catch (error) {
      throw new HttpException(
        'Failed to retrieve broker barters',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async getBrokerRatings(brokerId: string) {
    try {
      const ratings = await this.prisma.rating.findMany({
        where: { broker_id: brokerId },
        select: { value: true },
      });

      const totalRatings = ratings.length;
      const averageRating =
        ratings.reduce((sum, rating) => sum + rating.value, 0) / totalRatings ||
        0;

      return {
        averageRating,
        totalRatings,
      };
    } catch (error) {
      throw new HttpException(
        'Failed to retrieve broker ratings',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
