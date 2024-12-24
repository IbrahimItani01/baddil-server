import { Controller, Get, Post, Body, Query, UseGuards } from '@nestjs/common';
import { FinancesService } from './finances.service';
import { ExpenseType, ProfitSource } from '@prisma/client';
import { JwtAuthGuard } from 'src/guards/jwt.guard';
import { AllowedUserTypes, UserTypeGuard } from 'src/guards/userType.guard';

@UseGuards(JwtAuthGuard, UserTypeGuard)
@AllowedUserTypes('admin')
@Controller('finances')
export class FinancesController {
  constructor(private readonly financesService: FinancesService) {}

  // Create a new profit
  @Post('profit')
  createProfit(@Body() body: { amount: number; source: ProfitSource }) {
    return this.financesService.createProfit(body);
  }

  // Get profits with filters: startDate, endDate, source
  @Get('profits')
  getProfits(
    @Query()
    query: {
      startDate?: string;
      endDate?: string;
      source?: ProfitSource;
    },
  ) {
    return this.financesService.getProfits(query);
  }

  // Get profits grouped by user type
  @Get('profits/by-user-type')
  getProfitsByUserType() {
    return this.financesService.getProfitsByUserType();
  }

  // Get hire-related profits (budget)
  @Get('profits/hire')
  getHireProfits() {
    return this.financesService.getHireProfits();
  }

  // Create a new expense
  @Post('expense')
  createExpense(
    @Body()
    body: {
      amount: number;
      description: string;
      expenseType: ExpenseType;
    },
  ) {
    return this.financesService.createExpense(body);
  }

  // Get expenses with filters: startDate, endDate, expenseType
  @Get('expenses')
  getExpenses(
    @Query()
    query: {
      startDate?: string;
      endDate?: string;
      expenseType?: ExpenseType;
    },
  ) {
    return this.financesService.getExpenses(query);
  }
}
