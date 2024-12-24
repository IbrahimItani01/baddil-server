import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/database/prisma.service';
import { getUserTypeId } from 'src/utils/modules/users/users.utils';

@Injectable()
export class StatisticsService {
  constructor(private readonly prisma: PrismaService) {}

