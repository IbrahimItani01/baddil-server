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

