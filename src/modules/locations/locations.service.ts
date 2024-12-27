import {
  Injectable,
  NotFoundException,
  InternalServerErrorException,
} from '@nestjs/common'; // 📦 Importing necessary exceptions
import { Location } from '@prisma/client'; // 📍 Importing Location type from Prisma
import { PrismaService } from 'src/database/prisma.service'; // 🗄️ Importing PrismaService for database access

