import {
  Controller,
  Get,
  UseGuards,
  Request,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { BarterersService } from './barterers.service';
import { JwtAuthGuard } from 'src/guards/jwt.guard';
import { UserTypeGuard, AllowedUserTypes } from 'src/guards/userType.guard';

@Controller('barterers')
export class BarterersController {}
