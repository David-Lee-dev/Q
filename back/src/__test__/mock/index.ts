import database from '../../data/database';
import { BoardEntity } from '../../entity/board.entity';
import { NoteEntity } from '../../entity/note.entity';
import { SubtaskEntity } from '../../entity/subtask.entity';
import { TaskEntity } from '../../entity/task.entity';
import { UserEntity } from '../../entity/user.entity';
import { UserToBoardEntity } from '../../entity/user.to.board.relay.entity';
import { IBoard } from '../../interface/board.interface';
import { ITask } from '../../interface/task.interface';
import { IUser } from '../../interface/user.interface';

export const saveUserMock = async (email: string, password: string) => {
  return await database.manager.save(UserEntity, { email, password });
};
export const saveBoardMock = async (
  serial: string,
  title: string,
  ...users: IUser[]
) => {
  const board = await database.manager.save(BoardEntity, { serial, title });
  if (users) {
    for (const user of users) {
      await database.manager.save(UserToBoardEntity, { user, board });
    }
  }

  return board;
};

export const saveTaskMock = async (
  content: string,
  user?: IUser,
  board?: IBoard
) => {
  return await database.manager.save(TaskEntity, {
    content,
    due_date: new Date(),
    user,
    board,
  });
};

export const saveNoteMock = async (
  content: string,
  user?: IUser,
  board?: IBoard
) => {
  return await database.manager.save(NoteEntity, { content, user, board });
};

export const saveSubtaskMock = async (content: string, task: ITask) => {
  return await database.manager.save(SubtaskEntity, { content, task });
};
