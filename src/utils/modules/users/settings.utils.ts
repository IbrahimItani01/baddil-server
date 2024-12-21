import { BadRequestException } from '@nestjs/common';
import { Language, Theme } from '@prisma/client';
import { PrismaService } from 'src/database/prisma.service';

interface SettingsData {
  language?: string;
  theme?: string;
  notifications?: boolean;
}

