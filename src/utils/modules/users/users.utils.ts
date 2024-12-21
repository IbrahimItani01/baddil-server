import { BadRequestException } from '@nestjs/common';
import { PrismaService } from 'src/database/prisma.service';

export const getUserTypeId = async (
  prisma: PrismaService,
  userType: string,
) => {
  const userTypeRecord = await prisma.userType.findFirst({
    where: { type: userType },
  });

  if (!userTypeRecord) {
    throw new BadRequestException(`User type "${userType}" not found`);
  }

  return userTypeRecord.id;
};
