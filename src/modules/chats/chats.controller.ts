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
  HttpException,
  HttpStatus,
} from '@nestjs/common'; // 📦 Importing necessary decorators and exceptions
import { ChatsService } from './chats.service'; // 💬 Importing ChatsService for business logic
import { JwtAuthGuard } from 'src/guards/jwt.guard'; // 🔑 Importing JWT authentication guard
import { AllowedUserTypes, UserTypeGuard } from 'src/guards/userType.guard'; // 🛡️ Importing user type guards
import {
  CreateChatDto,
  GetChatByIdDto,
  GetMessagesInChatDto,
} from './dto/chats.dto'; // 📑 Importing DTOs

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
  async getAllChats() {
    try {
      const chats = await this.chatsService.getAllChats(); // 🔍 Fetching all chats
      return {
        status: 'success',
        message: 'All chats retrieved successfully', // ✅ Success message
        data: chats, // 🎉 Chats data
      };
    } catch (error) {
      throw new HttpException(
        error.message || 'Failed to retrieve chats', // 🚫 Error message
        HttpStatus.INTERNAL_SERVER_ERROR, // ⚠️ Internal Server Error status
      );
    }
  }

  /**
   * ➕ Create Chat
   * Creates a new chat, accessible to brokers and barterers.
   */
  @AllowedUserTypes('broker', 'barterer') // 🎯 Restricting access to brokers and barterers
  @Post() // ➕ Endpoint to create a chat
  async createChat(@Body() body: CreateChatDto) {
    // 📝 Using DTO for validation
    // Validate that at least one of barter_id or hire_id is provided
    if (!body.barter_id && !body.hire_id) {
      throw new HttpException(
        'Either barter_id or hire_id must be provided', // 🚫 Error message
        HttpStatus.BAD_REQUEST, // ⚠️ Bad Request status
      );
    }

    try {
      const chat = await this.chatsService.createChat(body); // Pass the entire DTO
      return {
        status: 'success',
        message: 'Chat created successfully', // ✅ Success message
        data: chat, // 🎉 Created chat data
      };
    } catch (error) {
      throw new HttpException(
        error.message || 'Failed to create chat', // 🚫 Error message
        HttpStatus.INTERNAL_SERVER_ERROR, // ⚠️ Internal Server Error status
      );
    }
  }

  /**
   * 📑 Get User Chats
   * Fetches all chats for the authenticated user.
   */
  @AllowedUserTypes('broker', 'barterer') // 🎯 Restricting access to brokers and barterers
  @Get('user') // 📥 Endpoint to get user-specific chats
  async getUserChats(@Request() req: any) {
    const userId = req.user.id; // Extract user ID from JWT
    try {
      const userChats = await this.chatsService.getUserChats(userId); // 🔍 Fetching user chats
      return {
        status: 'success',
        message: 'User chats retrieved successfully', // ✅ Success message
        data: userChats, // 🎉 User chats data
      };
    } catch (error) {
      throw new HttpException(
        error.message || 'Failed to retrieve user chats', // 🚫 Error message
        HttpStatus.INTERNAL_SERVER_ERROR, // ⚠️ Internal Server Error status
      );
    }
  }

  /**
   * 📜 Get Chat by ID
   * Fetches a specific chat by its ID.
   */
  @AllowedUserTypes('broker', 'barterer') // 🎯 Restricting access to brokers and barterers
  @Get(':id') // 📥 Endpoint to get a chat by ID
  async getChatById(@Param() params: GetChatByIdDto) {
    // 📝 Using DTO for validation
    try {
      const chat = await this.chatsService.getChatById(params); // Pass the entire DTO
      return {
        status: 'success',
        message: 'Chat retrieved successfully', // ✅ Success message
        data: chat, // 🎉 Chat data
      };
    } catch (error) {
      throw new HttpException(
        error.message || 'Chat not found', // 🚫 Error message
        HttpStatus.NOT_FOUND, // ⚠️ Not Found status
      );
    }
  }

  /**
   * 📩 Get Messages in Chat
   * Fetches messages for a specific chat, optionally filtered by status.
   */
  @AllowedUserTypes('broker', 'barterer') // 🎯 Restricting access to brokers and barterers
  @Get(':id/messages') // 📥 Endpoint to get messages in a chat
  async getMessagesInChat(
    @Param() params: GetChatByIdDto, // 📝 Using DTO for validation
    @Query() query: GetMessagesInChatDto, // 📝 Using DTO to validate query parameters
  ) {
    try {
      const messages = await this.chatsService.getMessagesInChat(query); // Pass DTO directly
      return {
        status: 'success',
        message: 'Messages retrieved successfully', // ✅ Success message
        data: messages, // 🎉 Messages data
      };
    } catch (error) {
      throw new HttpException(
        error.message || 'Failed to retrieve messages', // 🚫 Error message
        HttpStatus.INTERNAL_SERVER_ERROR, // ⚠️ Internal Server Error status
      );
    }
  }

  /**
   * ❌ Delete Chat
   * Deletes a specific chat by its ID.
   */
  @Delete(':id') // ❌ Endpoint to delete a chat
  async deleteChat(@Param() params: GetChatByIdDto) {
    // 📝 Using DTO for validation
    try {
      await this.chatsService.deleteChat(params); // Pass the entire DTO
      return {
        status: 'success',
        message: 'Chat deleted successfully', // ✅ Success message
      };
    } catch (error) {
      throw new HttpException(
        error.message || 'Failed to delete chat', // 🚫 Error message
        HttpStatus.INTERNAL_SERVER_ERROR, // ⚠️ Internal Server Error status
      );
    }
  }

  /**
   * 📊 Get Message Count for a Chat
   * Fetches the count of messages in a specific chat.
   */
  @Get(':chatId/messages/count') // 📥 Endpoint to get message count for a chat
  async getMessageCount(@Param('chatId') chatId: string) {
    try {
      const count = await this.chatsService.getMessageCount(chatId); // 🔍 Fetching message count
      return {
        status: 'success',
        message: 'Message count retrieved successfully', // ✅ Success message
        data: count, // 🎉 Message count data
      };
    } catch (error) {
      throw new HttpException(
        error.message || 'Failed to retrieve message count', // 🚫 Error message
        HttpStatus.INTERNAL_SERVER_ERROR, // ⚠️ Internal Server Error status
      );
    }
  }

  /**
   * 📬 Get All Chats with Unread Messages
   * Fetches all chats for the current user that have unread messages.
   */
  @AllowedUserTypes('broker', 'barterer') // 🎯 Restricting access to brokers and barterers
  @Get('unread') // 📥 Endpoint to get chats with unread messages
  async getChatsWithUnreadMessages(@Req() req: any) {
    const userId = req.user.id; // Extract user ID from JWT
    try {
      const unreadChats =
        await this.chatsService.getChatsWithUnreadMessages(userId); // 🔍 Fetching chats with unread messages
      return {
        status: 'success',
        message: 'Chats with unread messages retrieved successfully', // ✅ Success message
        data: unreadChats, // 🎉 Unread chats data
      };
    } catch (error) {
      throw new HttpException(
        error.message || 'Failed to retrieve chats with unread messages', // 🚫 Error message
        HttpStatus.INTERNAL_SERVER_ERROR, // ⚠️ Internal Server Error status
      );
    }
  }
}
