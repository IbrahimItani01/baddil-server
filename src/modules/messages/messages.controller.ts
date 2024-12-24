import {
  Controller,
  Post,
  Patch,
  Delete,
  Param,
  Body,
  Get,
  UseGuards,
  Request,
} from '@nestjs/common';
import { MessagesService } from './messages.service';
import { JwtAuthGuard } from 'src/guards/jwt.guard';
import { AllowedUserTypes, UserTypeGuard } from 'src/guards/userType.guard';

@UseGuards(JwtAuthGuard, UserTypeGuard)
@AllowedUserTypes('barterer', 'broker')
@Controller('messages')
export class MessagesController {
  constructor(private readonly messagesService: MessagesService) {}

