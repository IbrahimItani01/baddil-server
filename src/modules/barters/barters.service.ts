import { Injectable } from '@nestjs/common';
import { BarterStatus } from '@prisma/client';
import { PrismaService } from 'src/database/prisma.service';

@Injectable()
export class BartersService {
  constructor(private readonly prisma: PrismaService) {}

  async getBartersByUser(userId: string) {
    try {
      return await this.prisma.barter.findMany({
        where: { user1_id: userId },
      });
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      throw new Error('Failed to fetch barters');
    }
  }

