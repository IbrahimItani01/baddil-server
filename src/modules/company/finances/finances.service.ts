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

