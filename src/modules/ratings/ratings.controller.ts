import {
  Controller,
  Post,
  Delete,
  Body,
  Param,
  UseGuards,
  Request,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { RatingsService } from './ratings.service';
import { JwtAuthGuard } from 'src/guards/jwt.guard';
import { UserTypeGuard, AllowedUserTypes } from 'src/guards/userType.guard';

@UseGuards(JwtAuthGuard, UserTypeGuard)
@Controller('ratings')
export class RatingsController {
  constructor(private readonly ratingsService: RatingsService) {}

