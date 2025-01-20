import { ItemCondition } from '@prisma/client'; // 🔄 Importing ItemCondition enum from Prisma for item condition validation
import {
  IsString,
  IsNumber,
  IsOptional,
  IsArray,
  ArrayNotEmpty,
  IsEnum,
  IsUUID,
} from 'class-validator'; // 📦 Importing class-validator decorators for validation

// DTO for creating an item
export class CreateItemDto {
  @IsString() // 🔤 Ensures the name is a string
  name: string;

  @IsString() // 🔤 Ensures the description is a string
  description: string;

  @IsUUID() // 🆔 Ensures the categoryId is a valid UUID
  categoryId: string;

  @IsUUID() // 🆔 Ensures the subcategoryId is a valid UUID
  subcategoryId: string;

  @IsEnum(ItemCondition) // 🏷️ Ensures the condition is a valid ItemCondition enum value
  condition: ItemCondition;

  @IsUUID() // 🆔 Ensures the locationId is a valid UUID
  locationId: string;

  @IsNumber() // 🔢 Ensures the value is a valid number
  value?: number|string;
}

// DTO for updating an item
export class UpdateItemDto {
  @IsOptional() // 📝 Makes the name optional during update
  @IsString() // 🔤 Ensures the name is a string if provided
  name?: string;

  @IsOptional() // 📝 Makes the description optional during update
  @IsString() // 🔤 Ensures the description is a string if provided
  description?: string;

  @IsOptional() // 📝 Makes the condition optional during update
  @IsEnum(ItemCondition) // 🏷️ Ensures the condition is a valid ItemCondition enum value if provided
  condition?: ItemCondition;

  @IsOptional() // 📝 Makes the value optional during update
  @IsNumber() // 🔢 Ensures the value is a valid number if provided
  value?: number;

  @IsOptional() // 📝 Makes the images optional during update
  @IsArray() // 📑 Ensures the images are an array
  @ArrayNotEmpty() // 🚫 Ensures the images array is not empty
  images?: string[]; // 🖼️ Holds the image paths (strings) if provided
}
