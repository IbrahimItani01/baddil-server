import { BadRequestException } from '@nestjs/common'; // ❌ Importing BadRequestException for error handling
import { Language, Theme } from '@prisma/client'; // 🌐 Importing Language and Theme enums from Prisma client
import { PrismaService } from 'src/database/prisma.service'; // 🔌 Importing PrismaService to interact with the database

// 🛠️ Interface to type the settings data (optional fields for language, theme, and notifications)
interface SettingsData {
  language?: string; // 🗣️ Language setting (optional)
  theme?: string; // 🎨 Theme setting (optional)
  notifications?: boolean; // 🔔 Notification setting (optional)
}

// 🛠️ Function to create a user's settings with default values if none are provided
export async function createUserSettings(
  prisma: PrismaService, // 🔌 PrismaService instance to interact with the database
  language: string = 'english', // 🌐 Default language is 'english'
  theme: string = 'light', // 🎨 Default theme is 'light'
) {
  // 🌍 Define valid language options
  const validLanguages: Language[] = ['english', 'french'];

  // 🎨 Define valid theme options
  const validThemes: Theme[] = ['dark', 'light'];

  // 🎯 Check if the provided language is valid, else default to 'english'
  const finalLanguage = validLanguages.includes(language as Language)
    ? (language as Language)
    : 'english';

  // 🎯 Check if the provided theme is valid, else default to 'light'
  const finalTheme = validThemes.includes(theme as Theme)
    ? (theme as Theme)
    : 'light';

  // 📝 Create the new settings record in the database
  const newSetting = await prisma.setting.create({
    data: {
      language: finalLanguage, // 🗣️ Set the language
      theme: finalTheme, // 🎨 Set the theme
      notifications: true, // 🔔 Default notifications to true
    },
  });

  // 🔄 Return the newly created settings
  return newSetting;
}

// 🧐 Function to retrieve settings by ID
export const getSettingsById = async (
  prisma: PrismaService, // 🔌 PrismaService instance
  settingsId: string, // 🆔 Settings ID
) => {
  // 🔍 Fetch the settings from the database by its ID
  const settingsRecord = await prisma.setting.findUnique({
    where: { id: settingsId },
  });

  // ❌ If no settings found, throw an error
  if (!settingsRecord) {
    throw new BadRequestException(`Settings with ID "${settingsId}" not found`);
  }

  // 🔄 Return the settings record
  return settingsRecord;
};

// 🧐 Function to retrieve settings ID for a given user
export const getSettingsId = async (
  prisma: PrismaService, // 🔌 PrismaService instance
  userId: string, // 🆔 User ID
): Promise<string> => {
  // 🔍 Fetch the user and its associated settings ID
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { settings_id: true }, // 🏷️ Select only the settings_id
  });

  // ❌ If no user found, throw an error
  if (!user) {
    throw new BadRequestException(`User with ID "${userId}" not found`);
  }

  // 🔄 Return the settings ID for the user
  return user.settings_id;
};

// 🛠️ Function to validate the settings data
export function validateSettingsData(settingsData: SettingsData) {
  // 🗂️ Initialize an empty object to store the validated update data
  const updateData: any = {};

  // 🗣️ Validate the language setting
  if (settingsData.language) {
    if (!Object.values(Language).includes(settingsData.language as Language)) {
      // ❌ If the language is invalid, throw an error
      throw new BadRequestException(`Invalid language provided`);
    }
    updateData.language = { set: settingsData.language as Language }; // 🗣️ Add the valid language to the update data
  }

  // 🎨 Validate the theme setting
  if (settingsData.theme) {
    if (!Object.values(Theme).includes(settingsData.theme as Theme)) {
      // ❌ If the theme is invalid, throw an error
      throw new BadRequestException(`Invalid theme provided`);
    }
    updateData.theme = { set: settingsData.theme as Theme }; // 🎨 Add the valid theme to the update data
  }

  // 🔔 Validate the notifications setting
  if (settingsData.notifications !== undefined) {
    updateData.notifications = settingsData.notifications; // 🔔 Add the notifications value to the update data
  }

  // 🔄 Return the validated update data
  return updateData;
}
