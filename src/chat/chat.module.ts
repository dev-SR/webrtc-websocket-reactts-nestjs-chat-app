import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Conversation } from './models/conversation.entity';
import { Message } from './models/messages.entity';
import { Participants } from './models/participants.entity';
import { ChatService } from './chat.service';
import { Users } from 'src/users/models/users.entity';
import { ConnectedUser } from './models/connected-user.entity';
import { ConnectedUserService } from './connected-service.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Conversation,
      Message,
      Participants,
      Users,
      ConnectedUser,
    ]),
  ],
  providers: [ChatService, ConnectedUserService],
  exports: [ChatService, ConnectedUserService], // exporting for socket getaway
})
export class ChatModule {}
