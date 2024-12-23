import {
  Controller,
  Get,
  UseGuards,
  Request,
  HttpException,
  HttpStatus,
  Delete,
  Body,
  Post,
  Param,
} from '@nestjs/common';
import { BrokerService } from './brokers.service';
import { JwtAuthGuard } from 'src/guards/jwt.guard';
import { UserTypeGuard, AllowedUserTypes } from 'src/guards/userType.guard';

@Controller('brokers')
@UseGuards(JwtAuthGuard, UserTypeGuard)
export class BrokersController {
  constructor(private readonly brokerService: BrokerService) {}

  @Get('hired-brokers')
  @AllowedUserTypes('barterer')
  async getHiredBrokers(@Request() req) {
    const userId = req.user.id; // Extract user ID from JWT payload
    try {
      const hiredBrokers = await this.brokerService.getHiredBrokers(userId);
      return {
        status: 'success',
        message: 'Hired brokers retrieved successfully',
        data: hiredBrokers,
      };
    } catch (error) {
      throw new HttpException(
        error.message || 'Failed to retrieve hired brokers',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
  
  @Post('hired-brokers')
  @AllowedUserTypes('barterer')
  async hireBroker(
    @Body() body: { brokerEmail: string; targetItemId: string; budget: number },
    @Request() req,
  ) {
    const userId = req.user.id; // Extract the authenticated user ID from the JWT payload
    try {
      const hireResult = await this.brokerService.hireBroker(
        userId,
        body.brokerEmail,
        body.targetItemId,
        body.budget,
      );
      return {
        status: 'success',
        message: 'Broker hired successfully',
        data: hireResult,
      };
    } catch (error) {
      throw new HttpException(
        error.message || 'Failed to hire broker',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
