import { NotFoundException } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

export async function checkCategoryExists(prisma: PrismaClient, id: string) {
  const existingCategory = await prisma.category.findUnique({
    where: { id },
  });

  if (!existingCategory) {
    throw new NotFoundException(`Category with ID ${id} not found`);
  }
}
