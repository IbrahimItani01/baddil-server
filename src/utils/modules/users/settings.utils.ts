import { BadRequestException } from '@nestjs/common';
import { Language, Theme } from '@prisma/client';
import { PrismaService } from 'src/database/prisma.service';

interface SettingsData {
  language?: string;
  theme?: string;
  notifications?: boolean;
}

export async function createUserSettings(
  prisma: PrismaService,
  language: string = 'english',
  theme: string = 'light',
) {
  const validLanguages: Language[] = ['english', 'french'];
  const validThemes: Theme[] = ['dark', 'light'];

  const finalLanguage = validLanguages.includes(language as Language)
    ? (language as Language)
    : 'english';
  const finalTheme = validThemes.includes(theme as Theme)
    ? (theme as Theme)
    : 'light';

  const newSetting = await prisma.setting.create({
    data: {
      language: finalLanguage,
      theme: finalTheme,
      notifications: true,
    },
  });

  return newSetting;
}
export const getSettingsById = async (
  prisma: PrismaService,
  settingsId: number,
) => {
  const settingsRecord = await prisma.setting.findUnique({
    where: { id: settingsId },
  });

  if (!settingsRecord) {
    throw new BadRequestException(`Settings with ID "${settingsId}" not found`);
  }

  return settingsRecord;
};
export const getSettingsId = async (
  prisma: PrismaService,
  userId: number,
): Promise<number> => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { settings_id: true },
  });

  if (!user) {
    throw new BadRequestException(`User with ID "${userId}" not found`);
  }

  return user.settings_id;
};
