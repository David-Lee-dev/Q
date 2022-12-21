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

  @ManyToOne(() => UserEntity, (user) => user.notes)
  @JoinColumn({ name: 'user' })
  user?: UserEntity;

  @ManyToOne(() => BoardEntity, (board) => board.notes)
  @JoinColumn({ name: 'board' })
  board?: BoardEntity;
}
