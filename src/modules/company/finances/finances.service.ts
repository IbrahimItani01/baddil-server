import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/database/prisma.service';
import { ProfitSource, ExpenseType } from '@prisma/client'; // Import enum types

@Injectable()
export class FinancesService {
  constructor(private readonly prisma: PrismaService) {}

  // Create a new profit
  async createProfit(data: { amount: number; source: ProfitSource }) {
    return this.prisma.profit.create({ data });
  }

  // Get profits with filters: startDate, endDate, source
  async getProfits(query: {
    startDate?: string;
    endDate?: string;
    source?: ProfitSource;
  }) {
    const { startDate, endDate, source } = query;
    return this.prisma.profit.findMany({
      where: {
        source,
        date: {
          gte: startDate ? new Date(startDate) : undefined,
          lte: endDate ? new Date(endDate) : undefined,
        },
      },
    });
  }

