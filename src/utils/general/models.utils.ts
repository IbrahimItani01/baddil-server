import { NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/database/prisma.service';

/**
 * Checks if a record exists in any table based on the provided model name and ID.
 * @param prisma - PrismaService instance for interacting with the database.
 * @param model - The model name (e.g., 'location', 'chat', etc.).
 * @param id - The ID of the record to be checked.
 * @returns The record if found, otherwise throws a NotFoundException.
 */
export async function checkEntityExists(
  prisma: PrismaService,
  model: string,
  id: string,
) {
  // Dynamically get the model from PrismaService
  const entity = await prisma[model].findUnique({
    where: { id }, // Assuming 'id' is the identifier for all models
  });

  if (!entity) {
    throw new NotFoundException(
      `${model.charAt(0).toUpperCase() + model.slice(1)} with ID ${id} not found`,
    ); // 🚫 Error handling for not found
  }

  return entity;
}
