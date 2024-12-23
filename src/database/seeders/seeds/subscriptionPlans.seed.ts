import { PrismaClient } from '@prisma/client';

export const seedSubscriptionPlans = async (prisma: PrismaClient) => {
  console.log('Seeding Subscription Plans...');

  // Fetch user types for Barterers and Brokers only
  const validUserTypes = await prisma.userType.findMany({
    where: {
      type: {
        in: ['barterer', 'broker'], // Adjust these names to match your database records
      },
    },
  });

  if (validUserTypes.length === 0) {
    throw new Error(
      'No valid user types (Barterer or Broker) found. Check your userType records.',
    );
  }

  const plans = [
    { name: 'Pro', price: 10.0, user_type: validUserTypes[0] },
    {
      name: 'Premium',
      price: 50.0,
      user_type: validUserTypes[1] || validUserTypes[0],
    }, // Fallback to Barterer if only one type exists
  ];

  await Promise.all(
    plans.map((plan) =>
      prisma.subscriptionPlan.create({
        data: {
          name: plan.name,
          price: plan.price,
          target_user_type: plan.user_type.id, // This should be a UUID string, no changes needed
        },
      }),
    ),
  );

  console.log('Subscription plans seeded successfully.');
};
