import {
  BaseEntity,
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { ISubtask } from '../interface/subtask.interface';
import { TaskEntity } from './task.entity';

@Entity('subtask')
export class SubtaskEntity extends BaseEntity implements ISubtask {
  @PrimaryGeneratedColumn({ name: 'pk' })
  pk: number;

  @Column({ name: 'content' })
  content: string;

  @Column({ name: 'done', default: false })
  done: boolean;

  @ManyToOne(() => TaskEntity, (task) => task.subtasks, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'task' })
  task?: TaskEntity;
}
