import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Put,
  Request,
  UseGuards,
} from '@nestjs/common';
import { TiersService } from './tiers.service';
import { JwtAuthGuard } from 'src/guards/jwt.guard';
import { AllowedUserTypes, UserTypeGuard } from 'src/guards/userType.guard';
