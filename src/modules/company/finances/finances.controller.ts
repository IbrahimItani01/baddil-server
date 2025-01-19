import { Controller, Get, Post, Body, Query, UseGuards } from '@nestjs/common'; // 📦 Importing necessary decorators and exceptions
import { FinancesService } from './finances.service'; // 💰 Importing FinancesService for business logic
import { JwtAuthGuard } from 'src/guards/jwt.guard'; // 🔑 Importing JWT authentication guard
import { AllowedUserTypes, UserTypeGuard } from 'src/guards/userType.guard'; // 🛡️ Importing user type guards

// Importing DTOs
import {
  CreateProfitDto,
  GetProfitsDto,
  CreateExpenseDto,
  GetExpensesDto,
} from './dto/finances.dto';
import { ApiResponse } from 'src/utils/api/apiResponse.interface';

@UseGuards(JwtAuthGuard, UserTypeGuard) // 🛡️ Applying guards for authentication and user type validation
@Controller('finances') // 📍 Base route for finance-related operations
export class FinancesController {
  constructor(private readonly financesService: FinancesService) {} // 🏗️ Injecting FinancesService

  /**
   * ➕ Create a new profit
   * @param body - The profit details including amount and source.
   */
  @AllowedUserTypes('admin') // 🎯 Restricting access to admin users
  @Post('profit') // ➕ Endpoint to create a profit
  async createProfit(@Body() body: CreateProfitDto): Promise<ApiResponse> {
    // Use CreateProfitDto for validation
    const profit = await this.financesService.createProfit(body); // 🔄 Creating a new profit
    return {
      success: true,
      message: 'Profit created successfully', // ✅ Success message
      data: profit, // 🎉 Profit data
    };
  }

  /**
   * 📜 Get profits with filters
   * @param query - Filters for startDate, endDate, and source.
   */
  @AllowedUserTypes('admin') // 🎯 Restricting access to admin users
  @Get('profits') // 📥 Endpoint to get profits
  async getProfits(@Query() query: GetProfitsDto): Promise<ApiResponse> {
    // Use GetProfitsDto for validation
    const profits = await this.financesService.getProfits(query); // 🔍 Fetching profits
    return {
      success: true,
      message: 'Profits retrieved successfully', // ✅ Success message
      data: profits, // 🎉 Profits data
    };
  }

  /**
   * 📊 Get profits grouped by user type
   */
  @AllowedUserTypes('admin') // 🎯 Restricting access to admin users
  @Get('profits/by-user-type') // 📥 Endpoint to get profits by user type
  async getProfitsByUserType(): Promise<ApiResponse> {
    const profitsByUserType = await this.financesService.getProfitsByUserType(); // 🔍 Fetching profits by user type
    return {
      success: true,
      message: 'Profits by user type retrieved successfully', // ✅ Success message
      data: profitsByUserType, // 🎉 Profits by user type data
    };
  }

  /**
   * 📈 Get hire-related profits (budget)
   */
  @AllowedUserTypes('admin') // 🎯 Restricting access to admin users
  @Get('profits/hire') // 📥 Endpoint to get hire-related profits
  async getHireProfits(): Promise<ApiResponse> {
    const hireProfits = await this.financesService.getHireProfits(); // 🔍 Fetching hire-related profits
    return {
      success: true,
      message: 'Hire profits retrieved successfully', // ✅ Success message
      data: hireProfits, // 🎉 Hire profits data
    };
  }

  /**
   * ➕ Create a new expense
   * @param body - The expense details including amount, description, and type.
   */
  @AllowedUserTypes('admin') // 🎯 Restricting access to admin users
  @Post('expense') // ➕ Endpoint to create an expense
  async createExpense(@Body() body: CreateExpenseDto): Promise<ApiResponse> {
    // Use CreateExpenseDto for validation
    const expense = await this.financesService.createExpense(body); // 🔄 Creating a new expense
    return {
      success: true,
      message: 'Expense created successfully', // ✅ Success message
      data: expense, // 🎉 Expense data
    };
  }

  /**
   * 📜 Get expenses with filters
   * @param query - Filters for startDate, endDate, and expenseType.
   */
  @AllowedUserTypes('admin') // 🎯 Restricting access to admin users
  @Get('expenses') // 📥 Endpoint to get expenses
  async getExpenses(@Query() query: GetExpensesDto): Promise<ApiResponse> {
    // Use GetExpensesDto for validation
    const expenses = await this.financesService.getExpenses(query); // 🔍 Fetching expenses
    return {
      success: true,
      message: 'Expenses retrieved successfully', // ✅ Success message
      data: expenses, // 🎉 Expenses data
    };
  }
}
