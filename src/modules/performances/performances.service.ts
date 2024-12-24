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
