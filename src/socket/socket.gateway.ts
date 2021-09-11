import {
  SubscribeMessage,
  WebSocketGateway,
  OnGatewayInit,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Logger, UnauthorizedException } from '@nestjs/common';
import { Socket, Server } from 'socket.io';
import { AuthService } from 'src/auth/auth.service';
import { UsersService } from 'src/users/users.service';
import { ChatService } from 'src/chat/chat.service';
import { ConnectedUserService } from 'src/chat/connected-service.service';
import { emit } from 'process';
const options = {
  cors: {
    origin: [
      'https://dev-sr-chat-backend.herokuapp.com',
      'http://localhost:3000',
    ],
    methods: ['GET', 'POST'],
    credentials: true,
  },
};
@WebSocketGateway(options)
export class SocketGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer() server: Server;
  constructor(
    private authService: AuthService,
    private userService: UsersService,
    private chatService: ChatService,
    private connectedUserService: ConnectedUserService,
  ) {}
  private logger: Logger = new Logger('AppGateway');
  afterInit() {
    this.logger.log('Init');
  }
  async handleConnection(socket: Socket, ...args: any[]) {
    try {
      /*

      *Cookie: "accessToken=val; heroku-session-affinity=val; another=val...."

      All the cookies will come as in a string format Unlike in REST API where the
      cookies are parsed by CookieParser Middleware as an object
      */

      //
      const tokens: string[] = socket.handshake.headers.cookie.split('; ');
      let accessTokenFound = false;
      tokens.forEach(async (t) => {
        const [key, token] = t.split('=');
        if (key == 'accessToken') {
          accessTokenFound = true;
          const decodedToken = await this.authService.verifyToken(token);

          this.logger.log(
            `socket connected: ${socket.id} token: ${token.slice(0, 20)}...`,
          );

          if (!decodedToken) {
            return this.disconnect(socket);
          } else {
            await this.connectedUserService.setOnline({
              socketId: socket.id,
              userId: decodedToken.id,
            });
          }
        }
      });

      if (!accessTokenFound) {
        this.disconnect(socket);
      }
    } catch {
      return this.disconnect(socket);
    }
  }
  private disconnect(socket: Socket) {
    socket.emit('Error', new UnauthorizedException());
    socket.disconnect();
  }
  async handleDisconnect(socket: Socket) {
    this.logger.log(`socket disconnected: ${socket.id}`);
    await this.connectedUserService.setOffline(socket.id);
    socket.disconnect();
  }

  @SubscribeMessage('get-all-conversations')
  async getAllConversation(socket: Socket, payload) {
    const d = await this.chatService.getAllConversation(
      payload.userID,
      payload.page,
    );
    socket.emit('get-all-conversations', d);
  }

  @SubscribeMessage('get-all-conversations-immediate')
  async getAllConversationImmediate(socket: Socket, payload) {
    const d = await this.chatService.getAllConversation(
      payload.userID,
      payload.page,
    );
    socket.emit('get-all-conversations-immediate', d);
  }

  @SubscribeMessage('send-message')
  async handleSendMessage(socket: Socket, payload) {
    // this.logger.log(payload);
    const d = await this.chatService.addNewMassageBetweenTwoUsers(payload);
    socket.emit('send-message', d);
  }

  @SubscribeMessage('notify-all-on-new-message')
  async handleOnNewMessage(socket: Socket, payload: { user_list: string[] }) {
    payload.user_list.map(async (u_id) => {
      const tobe_send = await this.connectedUserService.getSocketOfOnlineUser(
        u_id,
      );
      // user is active, other wise no need to notify them
      if (tobe_send?.user?.id) {
        const d = await this.chatService.getAllConversation(
          tobe_send.user.id,
          1,
        );
        this.server.to(tobe_send.socketId).emit('notify-all-on-new-message', d);
      }
    });
  }

  @SubscribeMessage('create-new-conversation')
  async createNewConversation(
    socket: Socket,
    payload: { with: string; userId },
  ) {
    const flag = await this.chatService.createNewConversation(payload);
    socket.emit('conversation-exits', { exits: flag });
  }

  @SubscribeMessage('sdp-process')
  async processSDP(socket: Socket, payload: any) {
    console.log(payload);
    socket.broadcast.emit('sdp-process', payload);
  }
}
