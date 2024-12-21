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
export const getUserTypeById = async (
  prisma: PrismaService,
  userTypeId: number,
) => {
  const userTypeRecord = await prisma.userType.findUnique({
    where: { id: userTypeId },
  });

  if (!userTypeRecord) {
    throw new BadRequestException(
      `User type with ID "${userTypeId}" not found`,
    );
  }

  return userTypeRecord.type;
};

export const getUserStatusId = async (
  prisma: PrismaService,
  status: string,
) => {
  const userStatusRecord = await prisma.userStatus.findFirst({
    where: { status },
  });

  if (!userStatusRecord) {
    throw new BadRequestException(`User status "${status}" not found`);
  }

  return userStatusRecord.id;
};
export const getUserStatusById = async (
  prisma: PrismaService,
  userStatusId: number,
) => {
  const userStatusRecord = await prisma.userStatus.findUnique({
    where: { id: userStatusId },
  });

  if (!userStatusRecord) {
    throw new BadRequestException(
      `User status with ID "${userStatusId}" not found`,
    );
  }

  return userStatusRecord.status;
};
