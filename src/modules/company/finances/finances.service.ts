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

  // Get profits grouped by user type
  async getProfitsByUserType() {
    return this.prisma.user
      .findMany({
        select: {
          user_type_id: true, // Corrected field name to match the model
          subscription: {
            select: {
              price: true, // Fetch the subscription price
            },
          },
        },
      })
      .then((users) => {
        const profitsByUserType = users.reduce((acc, user) => {
          const userTypeId = user.user_type_id; // Corrected to match the model
          const price = user.subscription?.price || 0; // Corrected to match the relation name

          if (!acc[userTypeId]) {
            acc[userTypeId] = { totalProfit: 0, userType: userTypeId };
          }

          acc[userTypeId].totalProfit += price;
          return acc;
        }, {});

        // Return the results as an array
        return Object.values(profitsByUserType);
      });
  }

