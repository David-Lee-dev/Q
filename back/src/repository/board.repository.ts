//package
import { Repository } from 'typeorm';
//entity
import { BoardEntity } from '../entity/board.entity';
import { UserToBoardEntity } from '../entity/user.to.board.relay.entity';
//module
import database from '../data/database';
import { executeTransaction } from '../lib/executeTransaction';
import { HttpException, TransactionException } from '../exception/Exception';
//interface
import { IBoard, IBoardReadOption } from '../interface/board.interface';
import { IUser } from '../interface/user.interface';

class BoardRepository {
  public boardRepository: Repository<BoardEntity>;
  public relayRepository: Repository<UserToBoardEntity>;

  constructor() {
    this.boardRepository = database.getRepository(BoardEntity);
    this.relayRepository = database.getRepository(UserToBoardEntity);
  }

  public async saveBoard(board: IBoard, user?: IUser) {
    try {
      const qr = database.createQueryRunner();

      const saveQuery = this.boardRepository
        .createQueryBuilder('board', qr)
        .insert()
        .into(BoardEntity)
        .values({ ...board });
      const relayQuery = this.relayRepository
        .createQueryBuilder('userToBoard', qr)
        .insert()
        .into(UserToBoardEntity)
        .values({ board, user });

      if (user) return await executeTransaction(qr, saveQuery, relayQuery);
      if (!user) return await executeTransaction(qr, saveQuery);
    } catch (error) {
      if (error instanceof TransactionException) throw error;
      throw new HttpException('BRC15');
    }
  }

  public async getBoard(serial: string, readOption?: IBoardReadOption) {
    try {
      const query = this.boardRepository
        .createQueryBuilder('board')
        .select(['board.serial', 'board.title']);

      if (readOption?.joinOption?.user) {
        query
          .leftJoinAndSelect('board.userToBoard', 'userToBoard')
          .addSelect(['user.email'])
          .leftJoin('userToBoard.user', 'user');
      }

      const result = await query.where('serial=:serial', { serial }).getOne();

      return {
        serial: result.serial,
        title: result.title,
        users: result.userToBoard
          ? result.userToBoard.map((item) => item.user)
          : [],
      };
    } catch (error) {
      throw new HttpException('BRR05');
    }
  }

  public editBoard = async (board: IBoard) => {
    try {
      const qr = database.createQueryRunner();
      const query = this.boardRepository
        .createQueryBuilder('board', qr)
        .update()
        .set({
          title: board.title,
        })
        .where('serial=:serial', { serial: board.serial });

      return await executeTransaction(qr, query);
    } catch (error) {
      if (error instanceof TransactionException) throw error;
      throw new HttpException('BRU15');
    }
  };

  public addUserToBoard = async (board: IBoard, user: IUser) => {
    try {
      const qr = database.createQueryRunner();
      const query = this.relayRepository
        .createQueryBuilder('userToBoard', qr)
        .insert()
        .into(UserToBoardEntity)
        .values({ user, board });

      return await executeTransaction(qr, query);
    } catch (error) {
      if (error instanceof TransactionException) throw error;
      throw new HttpException('BRU15');
    }
  };

  public removeUserFromBoard = async (board: IBoard, user: IUser) => {
    try {
      const relation = await this.relayRepository.findOne({
        where: { user, board },
      });

      const qr = database.createQueryRunner();
      const query = this.relayRepository
        .createQueryBuilder('userToBoard', qr)
        .delete()
        .where('pk = :pk', { pk: relation.pk });

      return await executeTransaction(qr, query);
    } catch (error) {
      if (error instanceof TransactionException) throw error;
      throw new HttpException('BRD15');
    }
  };

  public removeBoard = async (serial: string) => {
    try {
      const qr = database.createQueryRunner();
      const query = this.boardRepository
        .createQueryBuilder('board', qr)
        .delete()
        .where('serial = :serial', { serial });

      return await executeTransaction(qr, query);
    } catch (error) {
      if (error instanceof TransactionException) throw error;
      throw new HttpException('BRD15');
    }
  };
}

export default new BoardRepository();
