import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Socket } from 'dgram';
import { Users } from 'src/users/models/users.entity';
import { Repository } from 'typeorm';
import { ConnectedUserI } from './dto/connected-user.dto';
import { ConnectedUser } from './models/connected-user.entity';

interface ConnectedUserInfo {
  socketId: string;
  userId: string;
}

@Injectable()
export class ConnectedUserService {
  constructor(
    @InjectRepository(ConnectedUser)
    private readonly connectedUserRepository: Repository<ConnectedUser>,
    @InjectRepository(Users)
    private readonly userRepository: Repository<Users>,
  ) {}
  private readonly logger = new Logger(ConnectedUserService.name);

  async setOnline(data: ConnectedUserInfo) {
    const user = await this.userRepository.findOne({
      id: data.userId,
    });
    const connected_user = await this.findByUser(user);
    this.logger.log('connected_user:', JSON.stringify(connected_user));

    // user exist in connected_user but "socket id" is new
    if (connected_user && connected_user.socketId !== data.socketId)
      return await this.connectedUserRepository.update(connected_user.id, {
        socketId: data.socketId,
      });

    await this.userRepository.update(user.id, { is_active: true });
    const cu = new ConnectedUser();
    cu.socketId = data.socketId;
    cu.user = user;
    const newCU = await this.connectedUserRepository.save(cu);
    // this.logger.log('new connected_user:', JSON.stringify(newCU));
  }

  async findByUser(user: Users): Promise<ConnectedUser> {
    return await this.connectedUserRepository.findOne({ user });
  }

  async findBySocketId(socketId: string): Promise<ConnectedUser> {
    return await this.connectedUserRepository
      .createQueryBuilder('cu')
      .leftJoinAndSelect('cu.user', 'u')
      .where('cu.socketId = :id', { id: socketId })
      .getOne();
  }

  async deleteBySocketId(socketId: string) {
    return this.connectedUserRepository.delete({ socketId });
  }

  async setOffline(socketId: string) {
    const connected_user = await this.findBySocketId(socketId);
    this.logger.log('setOffline', connected_user);
    await this.userRepository.update(connected_user.user.id, {
      is_active: false,
    });

    await this.deleteBySocketId(socketId);
  }
  async getSocketOfOnlineUser(user_id: string): Promise<ConnectedUser> {
    const res = await this.connectedUserRepository.findOne({
      where: {
        user: {
          id: user_id,
        },
      },
      // select: ['socketId'],
      relations: ['user'],
    });
    return res;
  }
}
