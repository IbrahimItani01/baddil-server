import { IsString, IsOptional, IsEnum, IsNumber, IsDateString } from 'class-validator'; // 📦 Importing class-validator decorators
import { ProfitSource, ExpenseType } from '@prisma/client'; // 📜 Importing enums from Prisma

export class CreateProfitDto {
  @IsNumber() // 💡 Validates that the amount is a number
  amount: number;

  @IsEnum(ProfitSource) // 💡 Ensures the source is one of the ProfitSource enum values
  source: ProfitSource;
}

export class GetProfitsDto {
  @IsOptional() // 💡 Optional filter for start date
  @IsDateString() // 💡 Validates that the date is in ISO format
  startDate?: string;

  @IsOptional() // 💡 Optional filter for end date
  @IsDateString() // 💡 Validates that the date is in ISO format
  endDate?: string;

  @IsOptional() // 💡 Optional filter for source
  @IsEnum(ProfitSource) // 💡 Ensures the source is one of the ProfitSource enum values
  source?: ProfitSource;
}

export class CreateExpenseDto {
  @IsNumber() // 💡 Validates that the amount is a number
  amount: number;

  @IsString() // 💡 Validates that description is a string
  description: string;

  @IsEnum(ExpenseType) // 💡 Ensures the expense type is one of the ExpenseType enum values
  expenseType: ExpenseType;
}

export class GetExpensesDto {
  @IsOptional() // 💡 Optional filter for start date
  @IsDateString() // 💡 Validates that the date is in ISO format
  startDate?: string;

  @IsOptional() // 💡 Optional filter for end date
  @IsDateString() // 💡 Validates that the date is in ISO format
  endDate?: string;

  @IsOptional() // 💡 Optional filter for expense type
  @IsEnum(ExpenseType) // 💡 Ensures the expense type is one of the ExpenseType enum values
  expenseType?: ExpenseType;
}
