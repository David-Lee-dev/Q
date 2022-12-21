import {
  BaseEntity,
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { ITask } from '../interface/task.interface';
import { BoardEntity } from './board.entity';
import { SubtaskEntity } from './subtask.entity';
import { UserEntity } from './user.entity';

@Entity('task')
export class TaskEntity extends BaseEntity implements ITask {
  @PrimaryGeneratedColumn({ name: 'pk' })
  pk: number;

  @Column({ name: 'content' })
  content: string;

  @Column({ name: 'done', default: false })
  done: boolean;

  @Column({ name: 'in_progress', default: false })
  in_progress: boolean;

  @OneToMany(() => SubtaskEntity, (subtask) => subtask.task, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'subtasks' })
  subtasks?: SubtaskEntity[];

  @ManyToOne(() => BoardEntity, (board) => board.tasks)
  @JoinColumn({ name: 'board' })
  board?: BoardEntity;

  @ManyToOne(() => UserEntity, (user) => user.tasks)
  @JoinColumn({ name: 'user' })
  user?: UserEntity;
}
