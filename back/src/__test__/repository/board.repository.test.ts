import database from '../../data/database';
import { BoardEntity } from '../../entity/board.entity';
import { NoteEntity } from '../../entity/note.entity';
import { TaskEntity } from '../../entity/task.entity';
import { UserEntity } from '../../entity/user.entity';
import BoardRepository from '../../repository/board.repository';
import {
  saveBoardMock,
  saveNoteMock,
  saveTaskMock,
  saveUserMock,
} from '../mock';

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
      expect(result instanceof Error).toBeFalsy();
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
      expect(result instanceof Error).toBeFalsy();
    });
  });

  describe('getBoards', () => {
    test('normal', async () => {
      const user1 = await saveUserMock('test1', 'test1');
      const user2 = await saveUserMock('test1', 'test1');
      const board = await saveBoardMock('serial1', 'title1', user1, user2);

      const boards1 = await repository.getBoards({
        joinOption: { user: true },
      });

      expect(board.serial).toEqual('serial1');
      expect(board.title).toEqual('title1');
      expect(boards1[0].users.length).toBe(2);
    });
  });

  describe('getBoard', () => {
    test('normal', async () => {
      const user1 = await saveUserMock('test1', 'test1');
      const user2 = await saveUserMock('test1', 'test1');
      await saveBoardMock('serial1', 'title1', user1, user2);

      const board = await repository.getBoard('serial1', {
        joinOption: { user: true },
      });

      expect(board.serial).toEqual('serial1');
      expect(board.title).toEqual('title1');
      expect(board.users.length).toBe(2);
    });
  });

  describe('editBoard', () => {
    test('normal', async () => {
      const user1 = await saveUserMock('test1', 'test1');
      const board = await saveBoardMock('serial1', 'title1', user1);

      const result = await repository.editBoard({
        serial: board.serial,
        title: 'update',
      });
      expect(result instanceof Error).toBeFalsy();
    });
  });

  describe('addUserToBoard', () => {
    test('normal', async () => {
      const user1 = await saveUserMock('test1', 'test1');
      const board = await saveBoardMock('serial1', 'title1', user1);

      const user2 = await saveUserMock('addeduser', 'test1');
      await repository.addUserToBoard(board, user2);

      const result = await repository.getBoard('serial1', {
        joinOption: { user: true },
      });

      expect(result.users.length).toBe(2);
    });
  });

  describe('removeUserFromBoard', () => {
    test('normal', async () => {
      const user1 = await saveUserMock('test1', 'test1');
      const user2 = await saveUserMock('test2', 'test2');
      const board = await saveBoardMock('serial1', 'title1', user1, user2);

      await repository.removeUserFromBoard(board, user2);
      const result = await repository.getBoard('serial1', {
        joinOption: { user: true },
      });

      expect(result.users.length).toBe(1);
    });
  });

  describe('removeBoard', () => {
    test('when board is delete, task and note are also deleted ', async () => {
      const user = await saveUserMock('test', 'test');
      const board = await saveBoardMock('serial', 'title', user);
      const task = await saveTaskMock('task', user, board);
      const note = await saveNoteMock('note', user, board);

      await repository.removeBoard(board.serial);

      const boards = await database.manager.find(BoardEntity);
      const tasks = await database.manager.find(TaskEntity);
      const notes = await database.manager.find(NoteEntity);

      expect(boards.length).toBe(0);
      expect(tasks.length).toBe(0);
      expect(notes.length).toBe(0);
    });
  });
});
