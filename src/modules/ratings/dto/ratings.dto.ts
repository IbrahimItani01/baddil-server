// 📁 ratings.dto.ts

import { IsString, IsNumber, IsNotEmpty } from 'class-validator'; // 🛠️ Importing validation decorators from class-validator

// DTO for adding a rating for a broker 🏢
export class AddBrokerRatingDto {
  @IsNumber() // ✅ Ensures value is a number
  @IsNotEmpty() // ✅ Ensures value is not empty
  value: number; // 🌟 Rating value (e.g., 1-5)

  @IsString() // ✅ Ensures description is a string
  @IsNotEmpty() // ✅ Ensures description is not empty
  description: string; // ✍️ Description of the broker rating

  @IsString() // ✅ Ensures brokerId is a string (UUID)
  @IsNotEmpty() // ✅ Ensures brokerId is not empty
  brokerId: string; // 🧑‍💼 ID of the broker being rated
}

// DTO for adding a rating for a barter 🔄
export class AddBarterRatingDto {
  @IsNumber() // ✅ Ensures value is a number
  @IsNotEmpty() // ✅ Ensures value is not empty
  value: number; // 🌟 Rating value (e.g., 1-5)

  @IsString() // ✅ Ensures description is a string
  @IsNotEmpty() // ✅ Ensures description is not empty
  description: string; // ✍️ Description of the barter rating

  @IsString() // ✅ Ensures barterId is a string (UUID)
  @IsNotEmpty() // ✅ Ensures barterId is not empty
  barterId: string; // 🔄 ID of the barter being rated
}
