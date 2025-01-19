import { IsNumber } from 'class-validator'; // 🛠️ Importing class-validator to validate the properties

// DTO for user counts response
export class UserCountsDto {
  @IsNumber() // 🔢 Validate that 'admins_count' is a number
  admins_count: number;

  @IsNumber() // 🔢 Validate that 'brokers_count' is a number
  brokers_count: number;

  @IsNumber() // 🔢 Validate that 'barterers_count' is a number
  barterers_count: number;
}
