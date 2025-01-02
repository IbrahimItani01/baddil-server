import { NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/database/prisma.service';
import { BadRequestException } from '@nestjs/common';
import { BarterStatus } from '@prisma/client';

export async function findBarterById(
  prisma: PrismaService,
  barterId: string,
) {
  const barter = await prisma.barter.findUnique({
    where: { id: barterId },
  });

  if (!barter) {
    throw new NotFoundException(`Barter with ID ${barterId} not found`);
  }

  return barter;
}
