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

