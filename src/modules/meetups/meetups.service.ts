import {
  Injectable,
  NotFoundException,
  InternalServerErrorException,
  BadRequestException,
} from '@nestjs/common'; // 📦 Importing necessary exceptions
import { Meetup, MeetupStatus } from '@prisma/client'; // 📅 Importing Meetup and MeetupStatus types from Prisma
import { PrismaService } from 'src/database/prisma.service'; // 🗄️ Importing PrismaService for database access

@Injectable()
export class MeetupsService {}
