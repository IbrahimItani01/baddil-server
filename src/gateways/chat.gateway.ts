import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  ConnectedSocket,
  MessageBody,
} from '@nestjs/websockets'; // 📡 Importing WebSocket decorators
import { Server, Socket } from 'socket.io'; // 🔌 Importing Socket.IO types
import { MessagesService } from 'src/modules/messages/messages.service'; // 💬 Importing MessagesService for message handling
import { JwtService } from '@nestjs/jwt'; // 🔑 Importing JwtService for token management
import { UnauthorizedException, Logger } from '@nestjs/common'; // ⚠️ Importing common exceptions and Logger
import { SendMessageDto } from 'src/modules/messages/dto/messages.dto';

/**
 * 🎤 ChatGateway handles real-time communication via WebSockets.
 * 💬 It provides mechanisms for user authentication, joining chat rooms,
 * 📩 sending and receiving messages.
 */
@WebSocketGateway({ cors: true }) // 🌐 Enabling CORS for WebSocket connections
export class ChatGateway {
  private readonly logger = new Logger(ChatGateway.name); // 📝 Logger for better debugging

  constructor(
    private readonly messagesService: MessagesService, // 💬 Injecting MessagesService
    private readonly jwtService: JwtService, // 🔑 Inject JwtService for decoding tokens
  ) {}

  @WebSocketServer() server: Server; // 🌐 WebSocket server instance

  /**
   * 🔐 Middleware for validating JWT tokens during connection.
   * 🚫 If the token is invalid, the connection is rejected.
   * 🧑‍💻 If valid, user data is attached to the socket.
   */
  handleConnection(client: Socket) {
    try {
      const token = client.handshake.headers['authorization']?.split(' ')[1]; // 🧩 Extract JWT from Authorization header
      if (!token) {
        throw new UnauthorizedException('No token provided'); // ⚠️ No token, reject connection
      }

      const decoded = this.jwtService.verify(token); // 🧳 Decode and validate the JWT
      client.data.user = decoded; // 🏷️ Attach user data to the socket instance

      this.logger.log(`User  ${decoded.sub} connected`); // ✅ Log successful connection
    } catch (error) {
      this.logger.error(`Connection rejected: ${error.message}`); // ❌ Log error if connection fails
      client.disconnect(true); // 🔌 Forcefully disconnect the client
    }
  }

  /**
   * ⚡ Middleware for handling disconnections.
   * 🚪 Logs when users disconnect.
   */
  handleDisconnect(client: Socket) {
    const user = client.data.user;
    if (user) {
      this.logger.log(`User  ${user.sub} disconnected`); // 👋 Log user disconnection
    } else {
      this.logger.warn('A client disconnected without being authenticated'); // 🚨 Warn if user wasn't authenticated
    }
  }

  /**
   * 🚪 Handle a user joining a chat room.
   * 🏠 Adds the user to the specified chat room.
   * @param chatId - The ID of the chat room.
   * @param client - The connected socket instance.
   */
  @SubscribeMessage('joinChat')
  handleJoinChat(
    @MessageBody() chatId: string, // 📜 Chat room ID from the message body
    @ConnectedSocket() client: Socket, // 🔗 Connected socket instance
  ) {
    const user = client.data.user; // 🧑‍💻 Retrieve user data from the socket
    if (!user) {
      throw new UnauthorizedException('User  not authenticated'); // ❌ User must be authenticated to join
    }

    this.logger.log(`User  ${user.sub} joined chat room ${chatId}`); // 📤 Log when user joins a room
    client.join(chatId); // 🏠 Add the user to the chat room
  }

  /**
   * 📩 Handle sending a message to a chat room.
   * ✉️ Saves the message and broadcasts it to all clients in the room.
   * @param message - The message payload containing chatId, content, and ownerId.
   * @param client - The connected socket instance.
   */
  @SubscribeMessage('sendMessage')
  async handleSendMessage(
    @MessageBody()
    message: SendMessageDto, // 📜 Message payload
    @ConnectedSocket() client: Socket, // 🔗 Connected socket instance
  ) {
    const user = client.data.user; // 🧑‍💻 Retrieve user data from the socket

    if (!user || user.sub !== message.owner_id) {
      throw new UnauthorizedException(
        'User  is not authorized to send this message',
      ); // ❌ Check for valid user
    }

    try {
      // 💾 Save the message to the database
      const savedMessage = await this.messagesService.sendMessage(message);

      // 🌍 Broadcast the new message to all clients in the chat room
      this.server.to(message.chat_id).emit('newMessage', savedMessage);
      this.logger.log(
        `Message sent by user ${user.sub} to chat ${message.chat_id}`,
      ); // ✅ Log successful message send
    } catch (error) {
      this.logger.error(`Failed to send message: ${error.message}`); // ❌ Log error if message fails to send
      throw error; // 💥 Throw error to propagate failure
    }
  }
}
