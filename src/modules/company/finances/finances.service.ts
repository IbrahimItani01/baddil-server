import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/database/prisma.service';
import { ProfitSource, ExpenseType } from '@prisma/client'; // Import enum types

@Injectable()
export class FinancesService {
  constructor(private readonly prisma: PrismaService) {}

