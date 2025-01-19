import { IsString, IsNotEmpty, IsNumber } from 'class-validator'; // 🛠️ Importing validation decorators

// DTO for creating a new location
export class CreateLocationDto {
  @IsString() // 🧾 Validate that 'name' is a string
  @IsNotEmpty() // 🚫 Ensure 'name' is not empty
  name: string;

  @IsNumber() // 🔢 Validate that 'longitude' is a number
  @IsNotEmpty() // 🚫 Ensure 'longitude' is not empty
  longitude: number;

  @IsNumber() // 🔢 Validate that 'latitude' is a number
  @IsNotEmpty() // 🚫 Ensure 'latitude' is not empty
  latitude: number;
}
