import database from '../../data/database';
import { BoardEntity } from '../../entity/board.entity';
import { UserEntity } from '../../entity/user.entity';
import { UserToBoardEntity } from '../../entity/user.to.board.relay.entity';
import { TransactionException } from '../../exception/Exception';
import * as trx from '../../lib/executeTransaction';
import BoardRepository from '../../repository/board.repository';

describe('board repository test', () => {
  beforeEach((done) => {
    database
      .initialize()
      .then()
      .catch((err) => {
        console.log('db connecting error: ', err);
      })
      .finally(() => {
        done();
      });
  });

  afterEach((done) => {
    database
      .destroy()
      .then()
      .catch((err) => {
        console.log('db destory error: ', err);
      })
      .finally(() => {
        done();
      });
  });

  const repository = BoardRepository;

  describe('saveBoard', () => {
    test('normal', async () => {
      const testboard = {
        serial: 'testserialnumber',
        title: 'title',
      };

      const result = await repository.saveBoard(testboard);
      expect(result).toEqual(testboard);
    });

    test('send transaction with user entity', async () => {
      const testboard = {
        serial: 'testserialnumber',
        title: 'title',
      };
      const testuser = {
        email: 'test@test.com',
        password: 'testpassword',
        tutorial: true,
      };

      await database.manager.save(UserEntity, testuser);

      const result = await repository.saveBoard(testboard, testuser);
      expect(result).toEqual(testboard);
    });

    test('when transaction error, throw TransactionException', async () => {
      const mock = jest
        .spyOn(trx, 'executeTransaction')
        .mockRejectedValue(new TransactionException());

      const testboard = {
        serial: 'testserialnumber',
        title: 'title',
      };
      const testuser = {
        email: 'test@test.com',
        password: 'testpassword',
        tutorial: true,
      };

      await database.manager.save(UserEntity, testuser);

      try {
        await repository.saveBoard(testboard, testuser);
      } catch (error) {
        expect(error).toEqual(new TransactionException());
      }

      mock.mockClear();
    });
  });

  // describe('getBoards', () => {
  //   test('normal', async () => {
  //     const board = await database.manager.save(BoardEntity, {
  //       serial: 'testboard1',
  //       title: 'testboard1',
  //     });

  //     const user = await database.manager.save(UserEntity, {
  //       email: 'testuser',
  //       password: 'testuser',
  //     });

  //     await database.manager.save(UserToBoardEntity, { user, board });

  //     const users = await database
  //       .getRepository(UserEntity)
  //       .createQueryBuilder('user')
  //       .leftJoinAndSelect('user.userToBoard', 'userToBoard')
  //       .leftJoinAndSelect('userToBoard.board', 'board')
  //       .getMany();

  //     const boards = await database
  //       .getRepository(BoardEntity)
  //       .createQueryBuilder('board')
  //       .leftJoinAndSelect('board.userToBoard', 'userToBoard')
  //       .leftJoinAndSelect('userToBoard.user', 'user')
  //       .getMany();

  //     const userResult = users.map((user) => {
  //       return {
  //         ...user,
  //         boards: user.userToBoard ? user.userToBoard.map((item) => item.board) : [],
  //       };
  //     });
  //     const boardResult = boards.map((board) => {
  //       return {
  //         ...board,
  //         boards: board.userToBoard ? board.userToBoard.map((item) => item.user) : [],
  //       };
  //     });

  //     console.log(userResult);
  //     console.log(boardResult);
  //   });
  // });
});
