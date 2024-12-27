// src/meetups/dto/meetups.dto.ts

import { IsString } from 'class-validator'; // 🧾 Importing class-validator for validation

// DTO for creating a new meetup
export class CreateMeetupDto {
  @IsString() // 🧾 Validate that user1Key is a string
  user1Key: string;

  @IsString() // 🧾 Validate that user2Key is a string
  user2Key: string;

  @IsString() // 🧾 Validate that locationId is a string
  locationId: string;
}

// DTO for verifying a meetup
export class VerifyMeetupDto {
  @IsString() // 🧾 Validate that userKey is a string
  userKey: string;
}
