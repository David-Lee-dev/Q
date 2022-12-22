import { Repository } from 'typeorm';
import database from '../data/database';
import { UserEntity } from '../entity/user.entity';
import { UserToBoardEntity } from '../entity/user.to.board.relay.entity';
import { HttpException, TransactionException } from '../exception/Exception';
import { IUser } from '../interface/user.interface';
import { executeTransaction } from '../lib/executeTransaction';

class UserRepository {
  public userRepository: Repository<UserEntity>;
  public relayRepository: Repository<UserToBoardEntity>;

  constructor() {
    this.userRepository = database.getRepository(UserEntity);
    this.relayRepository = database.getRepository(UserToBoardEntity);
  }

  public async saveUser(user: IUser) {
    try {
      const qr = database.createQueryRunner();

      const query = this.userRepository
        .createQueryBuilder('user', qr)
        .insert()
        .into(UserEntity)
        .values({ ...user });

      return await executeTransaction(qr, query);
    } catch (error) {
      if (error instanceof TransactionException) throw error;
      throw new HttpException('URC15');
    }
  }

  public async getUser(email: string) {
    try {
      const result = await this.userRepository
        .createQueryBuilder('user')
        .select(['user.email'])
        .leftJoinAndSelect('user.userToBoard', 'userToBoard')
        .leftJoinAndSelect('userToBoard.board', 'board')
        .where('email=:email', { email })
        .getOne();

      return {
        email: email,
        boards: result.userToBoard
          ? result.userToBoard.map((item) => item.board)
          : [],
      };
    } catch (error) {
      console.log(error);
      throw new HttpException('URR05');
    }
  }

  public async editUser(user: IUser) {
    try {
      const qr = database.createQueryRunner();
      const query = this.userRepository
        .createQueryBuilder('user', qr)
        .update()
        .set({
          password: user.password,
          tutorial: user.tutorial,
        })
        .where('email=:email', { email: user.email });

      return await executeTransaction(qr, query);
    } catch (error) {
      if (error instanceof TransactionException) throw error;
      throw new HttpException('URR05');
    }
  }

  public async removeUser(email: string) {
    try {
      const qr = database.createQueryRunner();
      const query = this.userRepository
        .createQueryBuilder('user', qr)
        .delete()
        .where('email = :email', { email });

      return await executeTransaction(qr, query);
    } catch (error) {
      if (error instanceof TransactionException) throw error;
      throw new HttpException('URD15');
    }
  }
}

export default new UserRepository();
