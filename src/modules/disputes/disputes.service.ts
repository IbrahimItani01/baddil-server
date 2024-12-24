import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/database/prisma.service';
import { DisputeStatus } from '@prisma/client';

@Injectable()
export class DisputesService {
  constructor(private readonly prisma: PrismaService) {}

