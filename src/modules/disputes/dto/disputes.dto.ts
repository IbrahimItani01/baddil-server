import { IsString, IsNotEmpty, IsOptional, IsEnum } from 'class-validator'; // 🛠️ Importing validation decorators
import { DisputeStatus } from '@prisma/client'; // 📜 Importing the DisputeStatus enum from Prisma

// DTO for creating a dispute
export class CreateDisputeDto {
  @IsString() // 🧾 Validate that 'adminId' is a string
  @IsNotEmpty() // 🚫 Ensure 'adminId' is not empty
  adminId: string;

  @IsString() // 🧾 Validate that 'user1Id' is a string
  @IsNotEmpty() // 🚫 Ensure 'user1Id' is not empty
  user1Id: string;

  @IsString() // 🧾 Validate that 'user2Id' is a string
  @IsNotEmpty() // 🚫 Ensure 'user2Id' is not empty
  user2Id: string;

  @IsString() // 🧾 Validate that 'details' is a string
  @IsNotEmpty() // 🚫 Ensure 'details' is not empty
  details: string;
}

// DTO for returning dispute data
export class DisputeDto {
  @IsString() // 🧾 Validate that 'id' is a string
  id: string;

  @IsString() // 🧾 Validate that 'adminId' is a string
  admin_id: string;

  @IsString() // 🧾 Validate that 'user1Id' is a string
  user1_id: string;

  @IsString() // 🧾 Validate that 'user2Id' is a string
  user2_id: string;

  @IsString() // 🧾 Validate that 'details' is a string
  details: string;

  @IsEnum(DisputeStatus) // ⚖️ Validate that 'status' is an enum of DisputeStatus
  status: DisputeStatus;

  @IsOptional() // ⏳ 'resolved_at' is optional
  resolved_at?: Date;
}

// DTO for updating the dispute (resolving it)
export class ResolveDisputeDto {
  @IsEnum(DisputeStatus) // ⚖️ Validate that 'status' is an enum of DisputeStatus
  status: DisputeStatus;

  @IsOptional() // ⏳ 'resolved_at' is optional
  resolved_at?: Date;
}
