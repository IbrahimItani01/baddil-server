import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  UseGuards,
  HttpException,
  HttpStatus,
} from '@nestjs/common'; // 📦 Importing necessary decorators and exceptions
import { LocationsService } from './locations.service'; // 📍 Importing LocationsService for business logic
import { AllowedUserTypes, UserTypeGuard } from 'src/guards/userType.guard'; // 🛡️ Importing user type guards
import { JwtAuthGuard } from 'src/guards/jwt.guard'; // 🔑 Importing JWT authentication guard

