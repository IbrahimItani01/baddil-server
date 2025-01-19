import * as path from 'path';
import * as fs from 'fs/promises';
import { BadRequestException } from '@nestjs/common';

/**
 * Generates a full path for storing files based on parameters.
 * @param basePath The base path for the directory.
 * @param subPaths Additional subdirectories or identifiers (e.g., user ID).
 * @returns The constructed full path.
 */
export function generatePath(basePath: string, ...subPaths: string[]): string {
  return path.join(basePath, ...subPaths);
}

/**
 * Ensures a dynamically generated directory exists.
 * @param basePath The base path for the directory.
 * @param subPaths Additional subdirectories or identifiers (e.g., user ID).
 * @returns The full resolved directory path.
 * @throws BadRequestException if directory creation fails.
 */
export async function ensureDynamicDirectoryExists(
  basePath: string,
  ...subPaths: string[]
): Promise<string> {
  const fullPath = generatePath(basePath, ...subPaths);
  try {
    await fs.mkdir(fullPath, { recursive: true });
    return fullPath;
  } catch (err) {
    throw new BadRequestException(`Failed to create directory: ${err.message}`);
  }
}
