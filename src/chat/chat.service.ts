import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Users } from 'src/users/models/users.entity';
import { Repository } from 'typeorm';
import { AddNewMassageBetweenTwoUsers } from './dto/add-new-message-of-two.dto';
import { Conversation } from './models/conversation.entity';
import { Message } from './models/messages.entity';
import { Participants } from './models/participants.entity';

@Injectable()
export class ChatService {
  constructor(
    @InjectRepository(Users) private readonly userRepository: Repository<Users>,
    @InjectRepository(Conversation)
    private readonly conversationRepository: Repository<Conversation>,
    @InjectRepository(Message)
    private readonly messageRepository: Repository<Message>,
    @InjectRepository(Participants)
    private readonly participantsRepository: Repository<Participants>,
  ) {}

  async addNewMassageBetweenTwoUsers(data: AddNewMassageBetweenTwoUsers) {
    const { sender_id, receiver_id, content } = data;

    const conservationExistBetweenSR = await this.participantsRepository
      .createQueryBuilder('p')
      .leftJoinAndSelect('p.conversation', 'c')
      .where('c.creatorId = :c1 AND p.userId = :p2', {
        //conversation is created by c1, or participated by p2
        c1: sender_id,
        p2: receiver_id,
      })
      .orWhere('c.creatorId = :c2 AND p.userId = :p1', {
        c2: receiver_id,
        p1: sender_id,
      })
      .getMany();

    if (conservationExistBetweenSR.length >= 2) {
      const sender = await this.userRepository.findOne(sender_id);

      conservationExistBetweenSR.map(async (c) => {
        const conversation_id = c.conversation.id;

        const message = this.messageRepository.create({
          sender,
          content,
          conversation: { id: conversation_id },
        });
        await this.messageRepository.save(message);
      });
      // const conservationExistBetweenSR = await this.participantsRepository
      //   .createQueryBuilder('p')
      //   .leftJoinAndSelect('p.conversation', 'c')
      //   .where('c.creatorId = :c1 AND p.userId = :p2', {
      //     //conversation is created by c1, or participated by p2
      //     c1: sender_id,
      //     p2: receiver_id,
      //   })
      //   .orWhere('c.creatorId = :c2 AND p.userId = :p1', {
      //     c2: receiver_id,
      //     p1: sender_id,
      //   })
      //   .getCount();
      // console.log({ receiver_conversation, sender_conversation });
      // save into both Sender and Receiver's Conversation
      // const sender = await this.userRepository.findOne(sender_id);
      // await this.messageRepository
      //   .createQueryBuilder('r')
      //   .insert()
      //   .values([
      //     { content, conversation: { id: receiver_conversation.id }, sender },
      //   ])
      //   .execute();
      // await this.messageRepository
      //   .createQueryBuilder('s')
      //   .insert()
      //   .values([
      //     {
      //       content,
      //       conversation: { id: sender_conversation.id },
      //       sender,
      //     },
      //   ])
      //   .execute();
    }

    return conservationExistBetweenSR;
  }

  async getAllConversation(userId: string, page = Number(10)) {
    const limit = 10;
    const offset = limit * page - limit;
    return await this.conversationRepository
      .createQueryBuilder('c')
      .leftJoinAndSelect('c.creator', 'u')
      .leftJoinAndSelect('c.participants', 'p')
      .leftJoinAndSelect('p.user', 'u2')
      .leftJoinAndSelect('c.messages', 'm')
      .leftJoinAndSelect('m.sender', 'sender')
      .select([
        'c',
        'u.id',
        'u.name',
        'p',
        'u2.id',
        'u2.name',
        'u2.is_active',
        'm',
        'm.id',
        'm.content',
        'm.updated_at',
        'sender.id',
        'sender.name',
      ])
      .where('c.creator = :id', { id: userId })
      .andWhere('u2.id != :id', { id: userId })
      // .limit(limit)
      // .offset(offset)
      .orderBy('m.updated_at', 'ASC')
      .getMany();
  }

  async createNewConversation(data: { with: string; userId }): Promise<1 | 0> {
    const userA = await this.userRepository.findOne({ id: data.userId });
    const userB = await this.userRepository.findOne({ email: data.with });

    // console.log({ userA, userB });

    const conservationExistBetweenSR = await this.participantsRepository
      .createQueryBuilder('p')
      .leftJoinAndSelect('p.conversation', 'c')
      .where('c.creatorId = :c1 AND p.userId = :p2', {
        //conversation is created by c1, or participated by p2
        c1: userA.id,
        p2: userB.id,
      })
      .orWhere('c.creatorId = :c2 AND p.userId = :p1', {
        c2: userB.id,
        p1: userA.id,
      })
      .getCount();

    if (conservationExistBetweenSR >= 2) {
      console.log(conservationExistBetweenSR);
      return 1;
    }

    const conversationA = this.conversationRepository.create({
      creator: { id: userA.id },
    });

    const savedConversationA = await this.conversationRepository.save(
      conversationA,
    );

    const participantsForA = await this.participantsRepository.create({
      user: { id: userB.id }, //B is participating with A
      conversation: { id: savedConversationA.id },
    });

    await this.participantsRepository.save(participantsForA);

    const conversationB = this.conversationRepository.create({
      creator: { id: userB.id },
    });

    const savedConversationB = await this.conversationRepository.save(
      conversationB,
    );
    const participantsForB = await this.participantsRepository.create({
      user: { id: userA.id },
      conversation: { id: savedConversationB.id },
    });

    await this.participantsRepository.save(participantsForB);

    // const generateMessageForAA = await this.messageRepository.create({
    //   content: `Start your chat with ${userB.name}`,
    //   sender: { id: userA.id },
    //   conversation: { id: savedConversationA.id },
    // });
    // await this.messageRepository.save(generateMessageForAA);
    // const generateMessageForAB = await this.messageRepository.create({
    //   content: `Start your chat with ${userB.name}`,
    //   sender: { id: userA.id },
    //   conversation: { id: savedConversationB.id },
    // });
    // await this.messageRepository.save(generateMessageForAB);

    // const generateMessageForBB = await this.messageRepository.create({
    //   content: `Start your chat with ${userA.name}`,
    //   sender: { id: userB.id },
    //   conversation: { id: savedConversationB.id },
    // });
    // await this.messageRepository.save(generateMessageForBB);
    // const generateMessageForBA = await this.messageRepository.create({
    //   content: `Start your chat with ${userA.name}`,
    //   sender: { id: userB.id },
    //   conversation: { id: savedConversationA.id },
    // });
    // await this.messageRepository.save(generateMessageForBA);

    return 0;
  }
}
