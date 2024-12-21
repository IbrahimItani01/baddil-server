import { PrismaClient, Theme, Language } from '@prisma/client'; // Import enums

const prisma = new PrismaClient();

export const seedSettings = async () => {
  console.log('Seeding Settings...');
  
  const themes = [Theme.light, Theme.dark]; // Use Prisma enums
  const languages = [Language.english, Language.french]; // Use Prisma enums

  await Promise.all(
    Array.from({ length: 10 }).map(() =>
      prisma.setting.create({
        data: {
          theme: themes[Math.floor(Math.random() * themes.length)],
          language: languages[Math.floor(Math.random() * languages.length)],
          notifications: Math.random() > 0.5,
        },
      }),
    ),
  );
};
