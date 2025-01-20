import { PrismaClient } from '@prisma/client';

export const seedCategories = async (prisma: PrismaClient) => {
  console.log('Seeding Categories...');

  const currentDate = new Date();

  const categoriesData = [
    {
      id: '41789d75-b996-400f-8fdc-c87bbf6a6e98',
      name: 'sports',
      category_icon: 'futbol',
      createdAt: currentDate,
      updatedAt: currentDate,
    },
    {
      id: '4622df59-2533-4d0b-9ec7-068085ddea1d',
      name: 'appliances',
      category_icon: 'blender-phone',
      createdAt: currentDate,
      updatedAt: currentDate,
    },
    {
      id: '63a95c23-7a7a-4de1-9780-5144cfb2ed47',
      name: 'vehicles',
      category_icon: 'car',
      createdAt: currentDate,
      updatedAt: currentDate,
    },
    {
      id: '8b506853-22f2-4218-9697-2bfac3c67aec',
      name: 'electronics',
      category_icon: 'tablet-alt',
      createdAt: currentDate,
      updatedAt: currentDate,
    },
    {
      id: 'a9a75a53-750e-48f3-9db7-5bd66f87206b',
      name: 'furniture',
      category_icon: 'couch',
      createdAt: currentDate,
      updatedAt: currentDate,
    },
    {
      id: 'cfa781cd-809f-4c64-a604-e33d618c481f',
      name: 'fashion',
      category_icon: 'tshirt',
      createdAt: currentDate,
      updatedAt: currentDate,
    },
    {
      id: 'd49176c1-b363-409c-86da-f00b5cb33391',
      name: 'instruments',
      category_icon: 'music',
      createdAt: currentDate,
      updatedAt: currentDate,
    },
    {
      id: 'f2457de9-ef60-43b1-9509-929722a9d704',
      name: 'books',
      category_icon: 'book',
      createdAt: currentDate,
      updatedAt: currentDate,
    },
  ];

  await Promise.all(
    categoriesData.map((category) =>
      prisma.category.upsert({
        where: { id: category.id },
        update: {},
        create: {
          id: category.id,
          name: category.name,
          category_icon: category.category_icon,
          created_at: currentDate,
          updated_at: currentDate,
        },
      }),
    ),
  );

  console.log('Categories seeded successfully.');
};
