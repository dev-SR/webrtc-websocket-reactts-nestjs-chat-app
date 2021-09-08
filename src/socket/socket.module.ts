import { Module } from '@nestjs/common';
import { AuthModule } from 'src/auth/auth.module';
import { ChatModule } from 'src/chat/chat.module';
import { UsersModule } from 'src/users/users.module';
import { SocketGateway } from './socket.gateway';

@Module({
  imports: [AuthModule, UsersModule, ChatModule],
  providers: [SocketGateway],
})
export class SocketModule {}
