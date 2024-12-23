import { Injectable } from '@nestjs/common';
import { BarterStatus } from '@prisma/client';
import { PrismaService } from 'src/database/prisma.service';

@Injectable()
export class AIService {
  constructor(private readonly prisma: PrismaService) {}

  async getAutoTrades(userId?: string) {
    const where = { handled_by_ai: true };
    if (userId) {
      where['user1_id'] = userId;
    }
    return await this.prisma.barter.findMany({
      where,
      include: {
        user1: true,
        user2: true,
        user1_item: true,
        user2_item: true,
      },
    });
  }

