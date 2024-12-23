import { Injectable } from '@nestjs/common';
import { BarterStatus } from '@prisma/client';
import { PrismaService } from 'src/database/prisma.service';

@Injectable()
export class BartersService {
  constructor(private readonly prisma: PrismaService) {}

