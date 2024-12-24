import { AllowedUserTypes, UserTypeGuard } from 'src/guards/userType.guard';
import { PerformancesService } from './performances.service';
import {
  Controller,
  Get,
  UseGuards,
  HttpException,
  HttpStatus,
  Request,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/guards/jwt.guard';

@UseGuards(JwtAuthGuard, UserTypeGuard)
@AllowedUserTypes('broker')
@Controller('performance')
export class PerformancesController {
  constructor(private readonly performancesService: PerformancesService) {}

