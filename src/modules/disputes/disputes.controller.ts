import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Query,
  Patch,
  UseGuards,
} from '@nestjs/common';
import { DisputesService } from './disputes.service';
import { DisputeStatus } from '@prisma/client';
import { JwtAuthGuard } from 'src/guards/jwt.guard';
import { AllowedUserTypes, UserTypeGuard } from 'src/guards/userType.guard';

@UseGuards(JwtAuthGuard, UserTypeGuard)
@Controller('disputes')
export class DisputesController {
  constructor(private readonly disputesService: DisputesService) {}

  @AllowedUserTypes('broker', 'barterer')
  @Post()
  createDispute(
    @Body()
    body: {
      adminId: string;
      user1Id: string;
      user2Id: string;
      details: string;
    },
  ) {
    return this.disputesService.createDispute(body);
  }

  @AllowedUserTypes('admin')
  @Get()
  getDisputes(
    @Query()
    query: {
      status?: DisputeStatus;
      userId?: string;
    },
  ) {
    return this.disputesService.getDisputes(query);
  }

  // Get a specific dispute by ID
  @AllowedUserTypes('admin')
  @Get(':id')
  getDispute(@Param('id') id: string) {
    return this.disputesService.getDispute(id);
  }

