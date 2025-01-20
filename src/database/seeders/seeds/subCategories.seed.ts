import { PrismaClient } from '@prisma/client';

export const seedSubcategories = async (prisma: PrismaClient) => {
  console.log('Seeding Subcategories...');

  const currentDate = new Date();

  const subcategoriesData = [
    {
      id: '09a4b4ee-52a7-437f-b030-ded6ec73b91e',
      name: 'cars',
      main_category_id: '63a95c23-7a7a-4de1-9780-5144cfb2ed47',
      createdAt: currentDate,
      updatedAt: currentDate,
    },
    {
      id: '2d202aca-05ed-4d9d-9139-fc09866e72e6',
      name: 'motorcycles',
      main_category_id: '63a95c23-7a7a-4de1-9780-5144cfb2ed47',
      createdAt: currentDate,
      updatedAt: currentDate,
    },
    {
      id: '4526ceb4-d085-4d2b-bf9d-ce578df726d6',
      name: 'trucks',
      main_category_id: '63a95c23-7a7a-4de1-9780-5144cfb2ed47',
      createdAt: currentDate,
      updatedAt: currentDate,
    },
    {
      id: '4d92896d-0496-4a41-b748-acb38d27ab90',
      name: 'bicycles',
      main_category_id: '63a95c23-7a7a-4de1-9780-5144cfb2ed47',
      createdAt: currentDate,
      updatedAt: currentDate,
    },
    {
      id: '4e87550f-2b53-4a6c-af61-3eb1f73e492a',
      name: 'phones',
      main_category_id: '8b506853-22f2-4218-9697-2bfac3c67aec',
      createdAt: currentDate,
      updatedAt: currentDate,
    },
    {
      id: '77407e65-fe3e-4c17-ace5-d74e50c7c1b6',
      name: 'laptops',
      main_category_id: '8b506853-22f2-4218-9697-2bfac3c67aec',
      createdAt: currentDate,
      updatedAt: currentDate,
    },
    {
      id: '8897fa5f-2a03-46fa-b760-c95513bf9695',
      name: 'televisions',
      main_category_id: '8b506853-22f2-4218-9697-2bfac3c67aec',
      createdAt: currentDate,
      updatedAt: currentDate,
    },
    {
      id: 'c122b0d6-7580-4ab8-953d-dac277437062',
      name: 'cameras',
      main_category_id: '8b506853-22f2-4218-9697-2bfac3c67aec',
      createdAt: currentDate,
      updatedAt: currentDate,
    },
  ];

  await Promise.all(
    subcategoriesData.map((subcategory) =>
      prisma.subcategory.upsert({
        where: { id: subcategory.id },
        update: {},
        create: {
          id: subcategory.id,
          name: subcategory.name,
          main_category_id: subcategory.main_category_id,
          created_at: currentDate,
          updated_at: currentDate,
        },
      }),
    ),
  );

  console.log('Subcategories seeded successfully.');
};
