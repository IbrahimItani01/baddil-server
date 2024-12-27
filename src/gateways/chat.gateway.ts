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

