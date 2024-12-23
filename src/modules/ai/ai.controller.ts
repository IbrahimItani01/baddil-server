import {
  Controller,
  Get,
  Param,
  Patch,
  Body,
  Put,
  UseGuards,
} from '@nestjs/common';
import { AIService } from './ai.service';
import { JwtAuthGuard } from 'src/guards/jwt.guard';
import { AllowedUserTypes, UserTypeGuard } from 'src/guards/userType.guard';

@UseGuards(JwtAuthGuard, UserTypeGuard)
@AllowedUserTypes('barterer', 'broker')
@Controller('ai')
export class AIController {
  constructor(private readonly aiService: AIService) {}

