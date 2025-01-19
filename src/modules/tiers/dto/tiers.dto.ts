import { IsString, IsInt, IsOptional } from 'class-validator'; // 📦 Importing validation decorators

export class CreateTierDto {
  @IsString() // ✔️ Validate name as a string
  name: string;

  @IsInt() // ✔️ Validate requirement as an integer
  requirement: number;
}

export class UpdateTierDto {
  @IsString() // ✔️ Validate name as a string (optional)
  @IsOptional() // ✅ Make name optional
  name?: string;

  @IsInt() // ✔️ Validate requirement as an integer (optional)
  @IsOptional() // ✅ Make requirement optional
  requirement?: number;
}
