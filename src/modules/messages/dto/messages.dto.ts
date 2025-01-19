import { IsString, IsEnum, IsOptional } from 'class-validator'; // 🧾 Importing class-validator for validation
import { MessageStatus } from '@prisma/client'; // 📜 Importing MessageStatus enum from Prisma

/**
 * DTO for sending a new message
 */
export class SendMessageDto {
  @IsString() // 🧾 Validate that content is a string
  content: string;

  @IsString() // 🧾 Validate that owner_id is a string
  owner_id: string;

  @IsString() // 🧾 Validate that chat_id is a string
  chat_id: string;

  @IsEnum(MessageStatus) // 🧾 Validate that status is one of the MessageStatus enum values
  @IsOptional() // 🧾 Allow the status to be optional, default can be set in the service
  status?: MessageStatus;
}

/**
 * DTO for updating message status
 */
export class UpdateMessageStatusDto {
  @IsEnum(MessageStatus) // 🧾 Validate that status is one of the MessageStatus enum values
  status: MessageStatus;
}

/**
 * DTO for fetching user messages
 */
export class GetUserMessagesDto {
  @IsString() // 🧾 Validate that userId is a string
  userId: string;
}
