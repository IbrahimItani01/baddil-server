import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsNumber,
  Min,
} from 'class-validator'; // 🛠️ Importing validation decorators

// DTO for creating a subscription plan
export class CreateSubscriptionPlanDto {
  @IsString() // 📝 Validate that 'name' is a string
  @IsNotEmpty() // ❗ Ensure 'name' is not empty
  name: string;

  @IsNumber() // 🔢 Validate that 'price' is a number
  @Min(0) // 💸 Ensure 'price' is a positive number
  price: number;

  @IsString() // 📝 Validate that 'targetUserType' is a string
  @IsNotEmpty() // ❗ Ensure 'targetUserType' is not empty
  targetUserType: string;

  @IsOptional() // ➖ 'criteria' is optional
  @IsString() // 📝 Validate that 'criteria' is a string
  criteria?: string;
}

// DTO for updating a subscription plan
export class UpdateSubscriptionPlanDto {
  @IsOptional() // ➖ 'name' is optional for update
  @IsString() // 📝 Validate that 'name' is a string
  name?: string;

  @IsOptional() // ➖ 'price' is optional for update
  @IsNumber() // 🔢 Validate that 'price' is a number
  @Min(0) // 💸 Ensure 'price' is a positive number
  price?: number;

  @IsOptional() // ➖ 'criteria' is optional for update
  @IsString() // 📝 Validate that 'criteria' is a string
  criteria?: string;
}

// DTO for creating a category
export class CreateCategoryDto {
  @IsString() // 📝 Validate that 'name' is a string
  @IsNotEmpty() // ❗ Ensure 'name' is not empty
  name: string;

  @IsString() // 📝 Validate that 'categoryIcon' is a string
  @IsNotEmpty() // ❗ Ensure 'categoryIcon' is not empty
  categoryIcon: string;
}

// DTO for updating a category
export class UpdateCategoryDto {
  @IsOptional() // ➖ 'name' is optional for update
  @IsString() // 📝 Validate that 'name' is a string
  name?: string;

  @IsOptional() // ➖ 'categoryIcon' is optional for update
  @IsString() // 📝 Validate that 'categoryIcon' is a string
  categoryIcon?: string;
}

// DTO for creating a subcategory
export class CreateSubcategoryDto {
  @IsString() // 📝 Validate that 'name' is a string
  @IsNotEmpty() // ❗ Ensure 'name' is not empty
  name: string;

  @IsString() // 📝 Validate that 'mainCategoryId' is a string
  @IsNotEmpty() // ❗ Ensure 'mainCategoryId' is not empty
  mainCategoryId: string;
}
