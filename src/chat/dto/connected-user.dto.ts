import { Users } from 'src/users/models/users.entity';

export interface ConnectedUserI {
  socketId: string;
  user: Users;
}
