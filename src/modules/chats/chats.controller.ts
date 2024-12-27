import {
  Controller,
  Get,
  Post,
  Delete,
  Param,
  Body,
  Query,
  UseGuards,
  Req,
  Request,
} from '@nestjs/common'; // 📦 Importing necessary decorators and exceptions
import { ChatsService } from './chats.service'; // 💬 Importing ChatsService for business logic
import { JwtAuthGuard } from 'src/guards/jwt.guard'; // 🔑 Importing JWT authentication guard
import { AllowedUserTypes, UserTypeGuard } from 'src/guards/userType.guard'; // 🛡️ Importing user type guards
import {
  CreateChatDto,
  GetChatByIdDto,
  GetMessagesInChatDto,
} from './dto/chats.dto'; // 📑 Importing DTOs
import { ApiResponse } from 'src/utils/api/apiResponse.interface';

@UseGuards(JwtAuthGuard, UserTypeGuard) // 🛡️ Applying guards for authentication and user type validation
@Controller('chats') // 📍 Base route for chat-related operations
export class ChatsController {
  constructor(private readonly chatsService: ChatsService) {} // 🏗️ Injecting ChatsService

  /**
   * 📜 Get All Chats
   * Fetches all chats, restricted to admin users.
   */
  @AllowedUserTypes('admin') // 🎯 Restricting access to admin users
  @Get() // 📥 Endpoint to get all chats
  async getAllChats(): Promise<ApiResponse> {
    const chats = await this.chatsService.getAllChats(); // 🔍 Fetching all chats
    return {
      success: true,
      message: 'All chats retrieved successfully', // ✅ Success message
      data: chats, // 🎉 Chats data
    };
  }

  /**
   * ➕ Create Chat
   * Creates a new chat, accessible to brokers and barterers.
   */
  @AllowedUserTypes('broker', 'barterer') // 🎯 Restricting access to brokers and barterers
  @Post() // ➕ Endpoint to create a chat
  async createChat(@Body() body: CreateChatDto): Promise<ApiResponse> {
    // 📝 Using DTO for validation
    // Validate that at least one of barter_id or hire_id is provided

    const chat = await this.chatsService.createChat(body); // Pass the entire DTO
    return {
      success: true,
      message: 'Chat created successfully', // ✅ Success message
      data: chat, // 🎉 Created chat data
    };
  }

  /**
   * 📑 Get User Chats
   * Fetches all chats for the authenticated user.
   */
  @AllowedUserTypes('broker', 'barterer') // 🎯 Restricting access to brokers and barterers
  @Get('user') // 📥 Endpoint to get user-specific chats
  async getUserChats(@Request() req: any): Promise<ApiResponse> {
    const userId = req.user.id; // Extract user ID from JWT
    const userChats = await this.chatsService.getUserChats(userId); // 🔍 Fetching user chats
    return {
      success: true,
      message: 'User chats retrieved successfully', // ✅ Success message
      data: userChats, // 🎉 User chats data
    };
  }

  /**
   * 📜 Get Chat by ID
   * Fetches a specific chat by its ID.
   */
  @AllowedUserTypes('broker', 'barterer') // 🎯 Restricting access to brokers and barterers
  @Get(':id') // 📥 Endpoint to get a chat by ID
  async getChatById(@Param() params: GetChatByIdDto): Promise<ApiResponse> {
    // 📝 Using DTO for validation
    const chat = await this.chatsService.getChatById(params); // Pass the entire DTO
    return {
      success: true,
      message: 'Chat retrieved successfully', // ✅ Success message
      data: chat, // 🎉 Chat data
    };
  }

  /**
   * 📩 Get Messages in Chat
   * Fetches messages for a specific chat, optionally filtered by status.
   */
  @AllowedUserTypes('broker', 'barterer') // 🎯 Restricting access to brokers and barterers
  @Get(':id/messages') // 📥 Endpoint to get messages in a chat
  async getMessagesInChat(
    @Param() params: GetChatByIdDto, // 📝 Using DTO for validation
    @Query() query: Pick<GetMessagesInChatDto, 'status'>, // 📝 Only validate `status` in query
  ): Promise<ApiResponse> {
    const messages = await this.chatsService.getMessagesInChat({
      chatId: params.id, // Use the `id` from `params`
      ...query, // Spread the query parameters like `status`
    });
    return {
      success: true,
      message: 'Messages retrieved successfully', // ✅ Success message
      data: messages, // 🎉 Messages data
    };
  }

  /**
   * ❌ Delete Chat
   * Deletes a specific chat by its ID.
   */
  @Delete(':id') // ❌ Endpoint to delete a chat
  async deleteChat(@Param() params: GetChatByIdDto): Promise<ApiResponse> {
    // 📝 Using DTO for validation
    await this.chatsService.deleteChat(params); // Pass the entire DTO
    return {
      success: true,
      message: 'Chat deleted successfully', // ✅ Success message
    };
  }

  /**
   * 📊 Get Message Count for a Chat
   * Fetches the count of messages in a specific chat.
   */
  @Get(':chatId/messages/count') // 📥 Endpoint to get message count for a chat
  async getMessageCount(@Param('chatId') chatId: string): Promise<ApiResponse> {
    const count = await this.chatsService.getMessageCount(chatId); // 🔍 Fetching message count
    return {
      success: true,
      message: 'Message count retrieved successfully', // ✅ Success message
      data: count, // 🎉 Message count data
    };
  }

  /**
   * 📬 Get All Chats with Unread Messages
   * Fetches all chats for the current user that have unread messages.
   */
  @AllowedUserTypes('broker', 'barterer') // 🎯 Restricting access to brokers and barterers
  @Get('unread') // 📥 Endpoint to get chats with unread messages
  async getChatsWithUnreadMessages(@Req() req: any): Promise<ApiResponse> {
    const userId = req.user.id; // Extract user ID from JWT
    const unreadChats =
      await this.chatsService.getChatsWithUnreadMessages(userId); // 🔍 Fetching chats with unread messages
    return {
      success: true,
      message: 'Chats with unread messages retrieved successfully', // ✅ Success message
      data: unreadChats, // 🎉 Unread chats data
    };
  }
}
