import {
  Controller,
  Get,
  Post,
  Body,
  Query,
  UseGuards,
  HttpException,
  HttpStatus,
} from '@nestjs/common'; // 📦 Importing necessary decorators and exceptions
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

@UseGuards(JwtAuthGuard, UserTypeGuard) // 🛡️ Applying guards for authentication and user type validation
@AllowedUserTypes('admin') // 🎯 Restricting access to admin users
@Controller('finances') // 📍 Base route for finance-related operations
export class FinancesController {
  constructor(private readonly financesService: FinancesService) {} // 🏗️ Injecting FinancesService

  /**
   * ➕ Create a new profit
   * @param body - The profit details including amount and source.
   */
  @Post('profit') // ➕ Endpoint to create a profit
  async createProfit(@Body() body: CreateProfitDto) {
    // Use CreateProfitDto for validation
    try {
      const profit = await this.financesService.createProfit(body); // 🔄 Creating a new profit
      return {
        status: 'success',
        message: 'Profit created successfully', // ✅ Success message
        data: profit, // 🎉 Profit data
      };
    } catch (error) {
      throw new HttpException(
        error.message || 'Failed to create profit', // 🚫 Error message
        HttpStatus.INTERNAL_SERVER_ERROR, // ⚠️ Internal Server Error status
      );
    }
  }

  /**
   * 📜 Get profits with filters
   * @param query - Filters for startDate, endDate, and source.
   */
  @Get('profits') // 📥 Endpoint to get profits
  async getProfits(@Query() query: GetProfitsDto) {
    // Use GetProfitsDto for validation
    try {
      const profits = await this.financesService.getProfits(query); // 🔍 Fetching profits
      return {
        status: 'success',
        message: 'Profits retrieved successfully', // ✅ Success message
        data: profits, // 🎉 Profits data
      };
    } catch (error) {
      throw new HttpException(
        error.message || 'Failed to retrieve profits', // 🚫 Error message
        HttpStatus.INTERNAL_SERVER_ERROR, // ⚠️ Internal Server Error status
      );
    }
  }

  /**
   * 📊 Get profits grouped by user type
   */
  @Get('profits/by-user-type') // 📥 Endpoint to get profits by user type
  async getProfitsByUserType() {
    try {
      const profitsByUserType =
        await this.financesService.getProfitsByUserType(); // 🔍 Fetching profits by user type
      return {
        status: 'success',
        message: 'Profits by user type retrieved successfully', // ✅ Success message
        data: profitsByUserType, // 🎉 Profits by user type data
      };
    } catch (error) {
      throw new HttpException(
        error.message || 'Failed to retrieve profits by user type', // 🚫 Error message
        HttpStatus.INTERNAL_SERVER_ERROR, // ⚠️ Internal Server Error status
      );
    }
  }

  /**
   * 📈 Get hire-related profits (budget)
   */
  @Get('profits/hire') // 📥 Endpoint to get hire-related profits
  async getHireProfits() {
    try {
      const hireProfits = await this.financesService.getHireProfits(); // 🔍 Fetching hire-related profits
      return {
        status: 'success',
        message: 'Hire profits retrieved successfully', // ✅ Success message
        data: hireProfits, // 🎉 Hire profits data
      };
    } catch (error) {
      throw new HttpException(
        error.message || 'Failed to retrieve hire profits', // 🚫 Error message
        HttpStatus.INTERNAL_SERVER_ERROR, // ⚠️ Internal Server Error status
      );
    }
  }

  /**
   * ➕ Create a new expense
   * @param body - The expense details including amount, description, and type.
   */
  @Post('expense') // ➕ Endpoint to create an expense
  async createExpense(@Body() body: CreateExpenseDto) {
    // Use CreateExpenseDto for validation
    try {
      const expense = await this.financesService.createExpense(body); // 🔄 Creating a new expense
      return {
        status: 'success',
        message: 'Expense created successfully', // ✅ Success message
        data: expense, // 🎉 Expense data
      };
    } catch (error) {
      throw new HttpException(
        error.message || 'Failed to create expense', // 🚫 Error message
        HttpStatus.INTERNAL_SERVER_ERROR, // ⚠️ Internal Server Error status
      );
    }
  }

  /**
   * 📜 Get expenses with filters
   * @param query - Filters for startDate, endDate, and expenseType.
   */
  @Get('expenses') // 📥 Endpoint to get expenses
  async getExpenses(@Query() query: GetExpensesDto) {
    // Use GetExpensesDto for validation
    try {
      const expenses = await this.financesService.getExpenses(query); // 🔍 Fetching expenses
      return {
        status: 'success',
        message: 'Expenses retrieved successfully', // ✅ Success message
        data: expenses, // 🎉 Expenses data
      };
    } catch (error) {
      throw new HttpException(
        error.message || 'Failed to retrieve expenses', // 🚫 Error message
        HttpStatus.INTERNAL_SERVER_ERROR, // ⚠️ Internal Server Error status
      );
    }
  }
}
