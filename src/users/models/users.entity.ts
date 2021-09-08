import { Exclude } from 'class-transformer';
import { ConnectedUser } from 'src/chat/models/connected-user.entity';
import { Conversation } from 'src/chat/models/conversation.entity';
import { Message } from 'src/chat/models/messages.entity';
import { Participants } from 'src/chat/models/participants.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Users {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  // @PrimaryGeneratedColumn()
  // id: number;

  @Column({ unique: true })
  email: string;

  @Column()
  name: string;

  @Column({ default: false })
  is_active: boolean;

  @Column()
  @Exclude()
  password: string;

  @OneToMany(() => Message, (m) => m.sender, { cascade: true })
  massages: Message[];

  @OneToMany(() => Participants, (m) => m.user, { cascade: true })
  participant_with: Participants[];

  @OneToMany(() => Conversation, (m) => m.creator, { cascade: true })
  conversations: Conversation[];

  // connected users...
  @OneToMany(() => ConnectedUser, (connection) => connection.user)
  connections: ConnectedUser[];
}
