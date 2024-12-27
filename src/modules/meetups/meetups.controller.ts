import {
  Controller,
  Post,
  Body,
  Param,
  UseGuards,
  Get,
  HttpException,
  HttpStatus,
} from '@nestjs/common'; // 📦 Importing necessary decorators and exceptions
import { MeetupsService } from './meetups.service'; // 📅 Importing MeetupsService for business logic
import { AllowedUserTypes, UserTypeGuard } from 'src/guards/userType.guard'; // 🛡️ Importing user type guards
import { JwtAuthGuard } from 'src/guards/jwt.guard'; // 🔑 Importing JWT authentication guard

@Controller('meetups')
export class MeetupsController {
  constructor(private readonly meetupsService: MeetupsService) {}
}
