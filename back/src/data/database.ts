import * as path from 'path';
import { DataSource } from 'typeorm';
import { NODE_ENV } from '../config';
import { BoardEntity } from '../entity/board.entity';
import { NoteEntity } from '../entity/note.entity';
import { SubtaskEntity } from '../entity/subtask.entity';
import { TaskEntity } from '../entity/task.entity';
import { UserEntity } from '../entity/user.entity';
import { UserToBoardEntity } from '../entity/user.to.board.relay.entity';

const root: string = path.resolve(__dirname, '..');

class DB {
  public datasource: DataSource;

  constructor() {
    if (NODE_ENV === 'test') this.datasource = this.testDB();
  }

  private testDB() {
    return new DataSource({
      type: 'sqlite',
      database: `${root}/data/testdb.sqlite`,
      entities: [
        UserEntity,
        TaskEntity,
        SubtaskEntity,
        NoteEntity,
        BoardEntity,
        UserToBoardEntity,
      ],
      dropSchema: true,
      synchronize: true,
      // logging: true,
    });
  }
}

export default new DB().datasource;
