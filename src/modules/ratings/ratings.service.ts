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
  
