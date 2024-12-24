/* eslint-disable @typescript-eslint/no-unused-vars */
import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { PrismaService } from 'src/database/prisma.service';

@Injectable()
export class RatingsService {
  constructor(private readonly prisma: PrismaService) {}

