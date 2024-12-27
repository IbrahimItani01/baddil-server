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

