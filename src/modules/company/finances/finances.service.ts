import { Injectable, BadRequestException } from '@nestjs/common'; // 📦 Importing necessary exceptions
import { PrismaService } from 'src/database/prisma.service'; // 🗄️ Importing PrismaService for database access
import { ProfitSource, ExpenseType } from '@prisma/client'; // 📜 Importing enum types

@Injectable()
export class FinancesService {
  constructor(private readonly prisma: PrismaService) {} // 🏗️ Injecting PrismaService

  /**
   * ➕ Create a new profit
   * @param data - The profit details including amount and source.
   * @returns The created profit record.
   * @throws BadRequestException if the profit creation fails.
   */
  async createProfit(data: { amount: number; source: ProfitSource }) {
    if (data.amount <= 0) {
      throw new BadRequestException('Amount must be greater than zero'); // 🚫 Invalid amount
    }
    return this.prisma.profit.create({ data }); // 🔄 Creating a new profit
  }

  /**
   * 📜 Get profits with filters
   * @param query - Filters for startDate, endDate, and source.
   * @returns An array of profits matching the filters.
   */
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
          gte: startDate ? new Date(startDate) : undefined, // 📅 Start date filter
          lte: endDate ? new Date(endDate) : undefined, // 📅 End date filter
        },
      },
    });
  }

  /**
   * 📊 Get profits grouped by user type
   * @returns An array of profits grouped by user type.
   */
  async getProfitsByUserType() {
    const users = await this.prisma.user.findMany({
      select: {
        user_type_id: true, // Fetching user type ID
        subscription: {
          select: {
            price: true, // Fetching the subscription price
          },
        },
      },
    });

    const profitsByUserType = users.reduce((acc, user) => {
      const userTypeId = user.user_type_id; // User type ID
      const price = user.subscription?.price || 0; // Subscription price

      if (!acc[userTypeId]) {
        acc[userTypeId] = { totalProfit: 0, userType: userTypeId }; // Initialize if not present
      }

      acc[userTypeId].totalProfit += price; // Accumulate profit
      return acc;
    }, {});

    // Return the results as an array
    return Object.values(profitsByUserType);
  }

  /**
   * 📈 Get profits from hires (budget)
   * @returns The total budget from hires.
   */
  async getHireProfits() {
    const result = await this.prisma.hire.aggregate({
      _sum: {
        budget: true, // Summing the budget field
      },
    });

    return result._sum.budget || 0; // Return total budget or 0 if none
  }

  /**
   * ➕ Create a new expense
   * @param data - The expense details including amount, description, and type.
   * @returns The created expense record.
   * @throws BadRequestException if the expense creation fails.
   */
  async createExpense(data: {
    amount: number;
    description: string;
    expenseType: ExpenseType;
  }) {
    if (data.amount <= 0) {
      throw new BadRequestException('Amount must be greater than zero'); // 🚫 Invalid amount
    }

    return this.prisma.expense.create({
      data: {
        amount: data.amount,
        description: data.description,
        expense_type: data.expenseType, // Match the field name
      },
    });
  }

  /**
   * 📜 Get expenses with filters
   * @param query - Filters for startDate, endDate, and expenseType.
   * @returns An array of expenses matching the filters.
   */
  async getExpenses(query: {
    startDate?: string;
    endDate?: string;
    expenseType?: ExpenseType;
  }) {
    const { startDate, endDate, expenseType } = query;
    return this.prisma.expense.findMany({
      where: {
        expense_type: expenseType,
        date: {
          gte: startDate ? new Date(startDate) : undefined, // 📅 Start date filter
          lte: endDate ? new Date(endDate) : undefined, // 📅 End date filter
        },
      },
    });
  }
}
