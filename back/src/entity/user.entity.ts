import { Column, Entity, JoinColumn, OneToMany, PrimaryColumn } from 'typeorm';
import { BaseEntity } from 'typeorm/repository/BaseEntity';
import { IUser } from '../interface/user.interface';
import { NoteEntity } from './note.entity';
import { TaskEntity } from './task.entity';
import { UserToBoardEntity } from './user.to.board.relay.entity';

@Entity('user')
export class UserEntity extends BaseEntity implements IUser {
  @PrimaryColumn({ name: 'email' })
  email: string;

  @Column({ name: 'password' })
  password: string;

  @Column({ name: 'tutorial', default: false })
  tutorial: boolean;

  @OneToMany(() => TaskEntity, (task) => task.user, { onDelete: 'SET NULL' })
  @JoinColumn({ name: 'tasks' })
  tasks?: TaskEntity[];

  @OneToMany(() => NoteEntity, (note) => note.user, { onDelete: 'SET NULL' })
  @JoinColumn({ name: 'notes' })
  notes?: NoteEntity[];

  @OneToMany(() => UserToBoardEntity, (userToBoard) => userToBoard.user, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'userToBoard' })
  userToBoard: UserToBoardEntity[];
}
