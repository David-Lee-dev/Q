import {
  BaseEntity,
  Column,
  CreateDateColumn,
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

  @Column({ name: 'due_date' })
  due_date: Date;

  @CreateDateColumn({ name: 'create_date' })
  create_date: Date;

  @OneToMany(() => SubtaskEntity, (subtask) => subtask.task)
  @JoinColumn({ name: 'subtasks' })
  subtasks?: SubtaskEntity[];

  @ManyToOne(() => BoardEntity, (board) => board.tasks, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'board' })
  board?: BoardEntity;

  @ManyToOne(() => UserEntity, (user) => user.tasks, { onDelete: 'SET NULL' })
  @JoinColumn({ name: 'user' })
  user?: UserEntity;
}
