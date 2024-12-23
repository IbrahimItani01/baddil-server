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
export class BrokersController {}
