import { IsString, IsBoolean, IsOptional } from 'class-validator'; // 📦 Importing validation decorators

/**
 * 🔄 Toggle Auto-Trade DTO
 * DTO used for toggling auto-trade functionality for a specific barter.
 */
export class ToggleAutoTradeDto {
  @IsString() // 🏷️ Ensuring barterId is a string
  barterId: string; // 📜 ID of the barter to toggle auto-trade for

  @IsBoolean() // ✅ Ensuring enabled is a boolean value
  enabled: boolean; // 🛠 Boolean to enable or disable auto-trade
}

/**
 * ✏️ Update Auto-Trade DTO
 * DTO used for updating the status and details of an AI-managed barter.
 */
export class UpdateAutoTradeDto {
  @IsString() // 🏷️ Ensuring barterId is a string
  barterId: string; // 📜 ID of the barter to update

  @IsOptional() // 🔄 Status is optional
  @IsString() // ✅ Ensuring status is a string if provided
  status?: string; // 📜 Status of the barter (e.g., "completed", "pending")

  @IsOptional() // 🔄 Details are optional
  details?: any; // 📝 Additional details related to the barter (e.g., notes, conditions)
}

/**
 * 💬 Get Auto-Trade Chat DTO
 * DTO used for fetching the chat details for a specific barter.
 */
export class GetAutoTradeChatDto {
  @IsString() // 🏷️ Ensuring barterId is a string
  barterId: string; // 📜 ID of the barter to fetch the chat for
}
