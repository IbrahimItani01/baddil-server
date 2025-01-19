import { IsString, IsArray, IsOptional } from 'class-validator'; // 📦 Importing validation decorators

// DTO for Barterer Information
export class BartererInfoDto {
  @IsString() // 🧑‍💻 Ensuring id is a string
  id: string;

  @IsString() // 🧑‍💼 Ensuring name is a string
  name: string;

  @IsString() // 📧 Ensuring email is a string
  email: string;

  @IsArray() // 💰 Ensuring wallet is an array
  wallet: { id: string; items: any[] }[];

  @IsArray() // 🛠️ Ensuring barteringHistory is an array
  @IsOptional() // ❓ It's optional as there may be no bartering history initially
  barteringHistory?: { id: string; status: string; itemTraded: any }[];
}
