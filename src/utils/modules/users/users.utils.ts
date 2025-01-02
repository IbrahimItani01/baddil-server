import { BadRequestException, NotFoundException } from '@nestjs/common'; // ❌ Importing BadRequestException to handle invalid requests
import { PrismaService } from 'src/database/prisma.service'; // 🔌 Importing PrismaService to interact with the database

// 🧐 Function to get UserType ID by type (string)
export const getUserTypeId = async (
  prisma: PrismaService, // 🔌 PrismaService instance to interact with the database
  userType: string, // 🏷️ User type (e.g., 'admin', 'user', etc.)
) => {
  // 🔍 Fetch the user type record based on the type
  const userTypeRecord = await prisma.userType.findFirst({
    where: { type: userType }, // 📋 Search for the user type
  });

  // ❌ If the user type is not found, throw an error
  if (!userTypeRecord) {
    throw new BadRequestException(`User type "${userType}" not found`);
  }

  // 🔄 Return the ID of the user type
  return userTypeRecord.id;
};

// 🧐 Function to get UserType by ID (string)
export const getUserTypeById = async (
  prisma: PrismaService, // 🔌 PrismaService instance
  userTypeId: string, // 🆔 User type ID
) => {
  // 🔍 Fetch the user type record based on the ID
  const userTypeRecord = await prisma.userType.findUnique({
    where: { id: userTypeId }, // 🏷️ Search for the user type by its ID
  });

  // ❌ If no user type record is found, throw an error
  if (!userTypeRecord) {
    throw new BadRequestException(
      `User type with ID "${userTypeId}" not found`, // 🚫 Error message
    );
  }

  // 🔄 Return the type name (e.g., 'admin', 'user')
  return userTypeRecord.type;
};

// 🧐 Function to get UserStatus ID by status (string)
export const getUserStatusId = async (
  prisma: PrismaService, // 🔌 PrismaService instance
  status: string, // 🏷️ User status (e.g., 'active', 'inactive')
) => {
  // 🔍 Fetch the user status record based on the status string
  const userStatusRecord = await prisma.userStatus.findFirst({
    where: { status }, // 📋 Search for the user status
  });

  // ❌ If the user status is not found, throw an error
  if (!userStatusRecord) {
    throw new BadRequestException(`User status "${status}" not found`);
  }

  // 🔄 Return the ID of the user status
  return userStatusRecord.id;
};

// 🧐 Function to get UserStatus by ID (string)
export const getUserStatusById = async (
  prisma: PrismaService, // 🔌 PrismaService instance
  userStatusId: string, // 🆔 User status ID
) => {
  // 🔍 Fetch the user status record based on the ID
  const userStatusRecord = await prisma.userStatus.findUnique({
    where: { id: userStatusId }, // 🏷️ Search for the user status by its ID
  });

  // ❌ If no user status record is found, throw an error
  if (!userStatusRecord) {
    throw new BadRequestException(
      `User status with ID "${userStatusId}" not found`, // 🚫 Error message
    );
  }

  // 🔄 Return the status string (e.g., 'active', 'inactive')
  return userStatusRecord.status;
};

// 🧐 Function to get use by email
export async function findUserByEmail(
  prisma: PrismaService,
  email: string,
): Promise<any> {
  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user) {
    throw new NotFoundException(`User with email ${email} not found`); // 🚫 User not found
  }

  return user; // 🎉 Return the user object
}
