import {
  BaseEntity,
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { INote } from '../interface/note.interface';
import { BoardEntity } from './board.entity';
import { UserEntity } from './user.entity';

@Entity('note')
export class NoteEntity extends BaseEntity implements INote {
  @PrimaryGeneratedColumn({ name: 'pk' })
  pk: number;

  @Column({ name: 'content' })
  content: string;

  @ManyToOne(() => UserEntity, (user) => user.notes, { onDelete: 'SET NULL' })
  @JoinColumn({ name: 'user' })
  user?: UserEntity;

  @ManyToOne(() => BoardEntity, (board) => board.notes, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'board' })
  board?: BoardEntity;
}
