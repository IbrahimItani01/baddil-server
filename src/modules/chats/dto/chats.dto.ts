// src/chats/dto/chats.dto.ts

import { IsOptional, IsString } from 'class-validator'; // 📦 Importing validation decorators

/**
 * 📑 DTO for creating a chat
 */
export class CreateChatDto {
  @IsOptional() // 🔄 Optional field
  @IsString() // 📜 Validating as string
  barter_id?: string; // 🔄 Barter ID for optional barter-based chat

  @IsOptional() // 🔄 Optional field
  @IsString() // 📜 Validating as string
  hire_id?: string; // 🔄 Hire ID for optional hire-based chat
}

/**
 * 📑 DTO for getting a chat by ID
 */
export class GetChatByIdDto {
  @IsString() // 📜 Validating as string
  id: string; // 📜 ID of the chat to fetch
}

/**
 * 📑 DTO for fetching messages in a chat
 */
export class GetMessagesInChatDto {
  @IsString() // 📜 Validating as string
  chatId: string; // 📜 Chat ID to fetch messages for

  @IsOptional() // 🔄 Optional field
  @IsString() // 📜 Validating as string
  status?: string; // 📜 Optional status to filter messages
}
