//package
import { QueryRunner, Repository } from 'typeorm';
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
  public boardBuilder: Repository<BoardEntity>;
  public relayBuilder: Repository<UserToBoardEntity>;
  public runner: QueryRunner;

  constructor() {
    this.runner = database.createQueryRunner();
    this.boardBuilder = database.getRepository(BoardEntity);
    this.relayBuilder = database.getRepository(UserToBoardEntity);
  }

  public saveBoard = async (board: IBoard, user?: IUser) => {
    try {
      let result = null;

      const saveBoardQuery = this.boardBuilder
        .createQueryBuilder('board', this.runner)
        .insert()
        .into(BoardEntity)
        .values({ ...board });
      const saveRelationQuery = this.relayBuilder
        .createQueryBuilder('userToBoard', this.runner)
        .insert()
        .into(UserToBoardEntity)
        .values({ board, user });

      if (!user) {
        result = await executeTransaction(this.runner, saveBoardQuery);
      } else {
        result = await executeTransaction(
          this.runner,
          saveBoardQuery,
          saveRelationQuery
        );
      }

      return await this.boardBuilder
        .createQueryBuilder('board')
        .select(['board.serial', 'board.title'])
        .where('serial=:serial', {
          serial: result[0].identifiers[0].serial as string,
        })
        .getOne();
    } catch (error) {
      if (error instanceof TransactionException) throw error;
      throw new HttpException('BRC15');
    }
  };

  public getBoards = async (readOption?: IBoardReadOption) => {
    try {
      return;
    } catch (error) {
      console.log(error);
      throw new HttpException('BRC05');
    }
  };

  // public getBoard = async (serial: string, readOption?: IBoardReadOption) => {
  //   try {
  //     return await this.dataSource.find({
  //       select: {
  //         serial: true,
  //         title: true,
  //         users: readOption.joinOption.user && {
  //           email: true,
  //           tutorial: true,
  //         },
  //         tasks: {
  //           pk: true,
  //           content: true,
  //           done: true,
  //           user: readOption.joinOption.user && {
  //             email: true,
  //           },
  //           in_progress: true,
  //           subtasks: true,
  //         },
  //         notes: {
  //           pk: true,
  //           content: true,
  //           user: readOption.joinOption.user && {
  //             email: true,
  //           },
  //         },
  //       },
  //       relations: {
  //         users: readOption.joinOption.user,
  //         tasks: readOption.joinOption.task,
  //         notes: readOption.joinOption.note,
  //       },
  //       where: {
  //         serial,
  //       },
  //     });
  //   } catch (error) {
  //     throw new HttpException('BRC05');
  //   }
  // };

  // public editBoard = async (board: IBoard) => {
  //   try {
  //     return await this.dataSource.update(
  //       { serial: board.serial },
  //       { title: board.title }
  //     );
  //   } catch (error) {
  //     throw new HttpException('BRU15');
  //   }
  // };

  // public addUserToBoard = async (serial: string, user: IUser) => {
  //   try {
  //     return await this.dataSource
  //       .createQueryBuilder()
  //       .relation(UserEntity, 'users')
  //       .of(serial)
  //       .add(user);
  //   } catch (error) {
  //     throw new HttpException('BRU15');
  //   }
  // };

  // public removeUserFromBoard = async (serial: string, user: IUser) => {
  //   try {
  //     return await this.dataSource
  //       .createQueryBuilder()
  //       .relation(UserEntity, 'users')
  //       .of(serial)
  //       .remove(user);
  //   } catch (error) {
  //     throw new HttpException('BRU15');
  //   }
  // };

  // public removeBoard = async (serial: string) => {
  //   try {
  //     return await this.dataSource.delete(serial);
  //   } catch (error) {
  //     throw new HttpException('BRU15');
  //   }
  // };
}

export default new BoardRepository();
