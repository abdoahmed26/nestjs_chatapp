/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { ConnectedSocket, MessageBody, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Conversation } from 'src/conversations/entities/conversation.entity';
import { Repository } from 'typeorm';

@WebSocketGateway({
  cors:{
    origin: '*',
  }
})
export class ChatGateway {
  @WebSocketServer()
  server:Server;

  onlineUsers = new Set();

  constructor(
    private readonly jwtService: JwtService,
    @InjectRepository(Conversation) private readonly conversationRepository: Repository<Conversation>,
  ) {}

  async handleConnection(client: Socket) {
    const auth = client.handshake.headers.authorization;
    if (!auth) {
      throw new UnauthorizedException("No token provided");
    }
    const token = auth.split(' ')[1];

    try {
      const payload = this.jwtService.verify(token, { secret: process.env.JWT_SECRET });
      client.data.user = payload;
      await client.join(payload.id);
      this.onlineUsers.add(payload.id);
      this.server.emit('onlineUsers', Array.from(this.onlineUsers));
      console.log('Client connected:', payload.id);
      const conversations = await this.conversationRepository.find({
        where:{
          members:{
            userId:payload.id
          }
        },
        relations:['members']
      });
      for (const conversation of conversations) {
        await client.join(conversation.id);
      }
    } catch(e) {
      throw new UnauthorizedException(e.message);
    }
  }

  handleDisconnect(client: Socket) {
    this.onlineUsers.delete(client.data.user.id);
    this.server.emit('onlineUsers', Array.from(this.onlineUsers));
    console.log('Client disconnected:', client.data.user.id);
  }

  @SubscribeMessage('message')
  handleMessage(
    @MessageBody() data: { message: string; userId: string },
    @ConnectedSocket() client: Socket
  ) {
    this.emitTo(data.userId, 'message', { from: client.data.user.id, message: data.message });
  }

  emitTo(id:string, event:string, data:any) {
    this.server.to(id).emit(event, data);
  }
}
