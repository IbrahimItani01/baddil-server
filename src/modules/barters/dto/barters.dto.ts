// src/barters/dto/barters.dto.ts

import { IsString, IsNotEmpty, IsEnum, IsEmail } from 'class-validator';
import { BarterStatus } from '@prisma/client'; // 📜 Importing the enum from Prisma to use for status validation

export class CreateBarterDto {
  @IsString() // 🧑‍💻 Ensuring user2Email is a string
  @IsNotEmpty() // ❗ Ensuring user2Email is not empty
  @IsEmail() // 📧 Ensuring user2Email is a valid email format
  user2Email: string; // Email of the second user involved in the barter

  @IsString() // 📦 Ensuring user1ItemId is a string
  @IsNotEmpty() // ❗ Ensuring user1ItemId is not empty
  user1ItemId: string; // ID of the first user's item in the barter

  @IsString() // 📦 Ensuring user2ItemId is a string
  @IsNotEmpty() // ❗ Ensuring user2ItemId is not empty
  user2ItemId: string; // ID of the second user's item in the barter
}

export class UpdateBarterStatusDto {
  @IsString() // 🧑‍💻 Ensuring barterId is a string
  @IsNotEmpty() // ❗ Ensuring barterId is not empty
  barterId: string; // ID of the barter to be updated

  @IsEnum(BarterStatus) // ⚙️ Ensuring status is a valid BarterStatus
  @IsNotEmpty() // ❗ Ensuring status is not empty
  status: BarterStatus; // New status for the barter
}

export class BarterResponseDto {
  id: string; // 🆔 ID of the barter
  user1_id: string; // 🧑‍💼 ID of the first user
  user2_id: string; // 🧑‍💼 ID of the second user
  user1_item_id: string; // 📦 ID of the first user's item
  user2_item_id: string; // 📦 ID of the second user's item
  status: BarterStatus; // 🟢 Current status of the barter
}
