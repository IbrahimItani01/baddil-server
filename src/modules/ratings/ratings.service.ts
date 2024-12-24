/* eslint-disable @typescript-eslint/no-unused-vars */
import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { PrismaService } from 'src/database/prisma.service';

@Injectable()
export class RatingsService {
  constructor(private readonly prisma: PrismaService) {}

  async addBrokerRating(
    userId: string,
    brokerId: string,
    value: number,
    description: string,
  ) {
    try {
      return await this.prisma.rating.create({
        data: {
          value,
          description,
          wrote_by: userId,
          broker_id: brokerId,
        },
      });
    } catch (error) {
      throw new HttpException(
        'Failed to add broker rating',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
  
  async deleteRating(ratingId: string) {
    try {
      const existingRating = await this.prisma.rating.findUnique({
        where: { id: ratingId },
      });

      if (!existingRating) {
        throw new HttpException('Rating not found', HttpStatus.NOT_FOUND);
      }

      await this.prisma.rating.delete({
        where: { id: ratingId },
      });

      return { message: 'Rating deleted successfully' };
    } catch (error) {
      throw new HttpException(
        'Failed to delete rating',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async addBarterRating(
    userId: string,
    barterId: string,
    value: number,
    description: string,
  ) {
    try {
      return await this.prisma.rating.create({
        data: {
          value,
          description,
          wrote_by: userId,
          barter_id: barterId,
        },
      });
    } catch (error) {
      throw new HttpException(
        'Failed to add barter rating',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
