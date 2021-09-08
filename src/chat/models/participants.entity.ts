import {
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Users } from '../../users/models/users.entity';
import { Conversation } from './conversation.entity';

@Entity()
export class Participants {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  // @PrimaryGeneratedColumn()
  // id: number;

  @ManyToOne(() => Users, (user: Users) => user.conversations, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  user: Users;

  @ManyToOne(() => Conversation, (con) => con.participants)
  conversation: Conversation;

  @CreateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP(6)',
  })
  created_at: Date;

  @UpdateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP(6)',
    onUpdate: 'CURRENT_TIMESTAMP(6)',
  })
  updated_at: Date;
}
