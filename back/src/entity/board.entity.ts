import {
  BaseEntity,
  Column,
  Entity,
  JoinColumn,
  OneToMany,
  PrimaryColumn,
} from 'typeorm';
import { IBoard } from '../interface/board.interface';
import { NoteEntity } from './note.entity';
import { TaskEntity } from './task.entity';
import { UserToBoardEntity } from './user.to.board.relay.entity';

@Entity('board')
export class BoardEntity extends BaseEntity implements IBoard {
  @PrimaryColumn({ name: 'serial' })
  serial: string;

  @Column({ name: 'title' })
  title: string;

  @OneToMany(() => TaskEntity, (task) => task.board, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'tasks' })
  tasks?: TaskEntity[];

  @OneToMany(() => NoteEntity, (note) => note.board, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'notes' })
  notes?: NoteEntity[];

  @OneToMany(() => UserToBoardEntity, (userToBoard) => userToBoard.board, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'userToBoard' })
  userToBoard: UserToBoardEntity[];
}
