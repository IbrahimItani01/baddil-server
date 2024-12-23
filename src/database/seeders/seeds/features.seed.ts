import { PrismaClient } from '@prisma/client';
import { faker } from '@faker-js/faker';

const prisma = new PrismaClient();

export const seedFeatures = async () => {
  console.log('Seeding Features...');

  // Fetch existing subscription plans to associate features with them
  const subscriptionPlans = await prisma.subscriptionPlan.findMany();

  if (subscriptionPlans.length === 0) {
    throw new Error(
      'No subscription plans found. Seed subscription plans first.',
    );
  }

  const features = [
    'Unlimited Storage',
    'Priority Support',
    'Custom Branding',
    'Advanced Analytics',
    'API Access',
    'Mobile App Access',
    'Team Collaboration',
    '24/7 Customer Service',
    'Exclusive Discounts',
    'Dedicated Account Manager',
  ];

  // Generate a random number of features for each subscription plan
  await Promise.all(
    subscriptionPlans.map((plan) => {
      const planFeatures = Array.from({
        length: faker.number.int({ min: 1, max: 5 }),
      }).map(() => ({
        subscription_plan_id: plan.id.toString(), // Ensure the ID is treated as a string
        feature: faker.helpers.arrayElement(features),
      }));

      // Insert the generated features into the database
      return prisma.feature.createMany({
        data: planFeatures,
      });
    }),
  );

  console.log('Features seeded successfully.');
};
