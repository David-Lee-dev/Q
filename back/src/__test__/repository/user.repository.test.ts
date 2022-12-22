import database from '../../data/database';
import { UserEntity } from '../../entity/user.entity';
import { NoteEntity } from '../../entity/note.entity';
import { TaskEntity } from '../../entity/task.entity';
import UserRepository from '../../repository/user.repository';
import {
  saveBoardMock,
  saveNoteMock,
  saveTaskMock,
  saveUserMock,
} from '../mock';

describe('user repository test', () => {
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

  const repository = UserRepository;

  describe('saveUser', () => {
    test('normal', async () => {
      const result = await repository.saveUser({
        email: 'test',
        password: 'test',
        tutorial: false,
      });
      expect(result instanceof Error).toBeFalsy();
    });
  });

  describe('getUser', () => {
    test('normal', async () => {
      const saved = await saveUserMock('test', 'test');
      await saveBoardMock('serial1', 'title', saved);
      await saveBoardMock('serial2', 'title', saved);
      await saveBoardMock('serial3', 'title', saved);

      const user = await repository.getUser('test');

      expect(user.email).toEqual('test');
      expect(user.boards.length).toBe(3);
    });
  });

  describe('editBoard', () => {
    test('normal', async () => {
      const user = await saveUserMock('test', 'test');
      const board = await saveBoardMock('serial', 'title', user);

      const result = await repository.editUser({
        email: 'test',
        password: 'update',
        tutorial: true,
      });
      expect(result instanceof Error).toBeFalsy();
    });
  });

  describe('removeBoard', () => {
    test('when user is delete, task and note are not deleted ', async () => {
      const user = await saveUserMock('test', 'test');
      const board = await saveBoardMock('serial', 'title', user);
      const task = await saveTaskMock('task', user, board);
      const note = await saveNoteMock('note', user, board);

      await repository.removeUser(user.email);

      const users = await database.manager.find(UserEntity);
      const tasks = await database.manager.find(TaskEntity);
      const notes = await database.manager.find(NoteEntity);

      expect(users.length).toBe(0);
      expect(tasks.length).toBe(1);
      expect(notes.length).toBe(1);
    });
  });
});
