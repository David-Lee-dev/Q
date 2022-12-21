import {
  BaseEntity,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { BoardEntity } from './board.entity';
import { UserEntity } from './user.entity';

@Entity('userToBoard')
export class UserToBoardEntity extends BaseEntity {
  @PrimaryGeneratedColumn({ name: 'pk' })
  pk: number;

  @ManyToOne(() => UserEntity, (user) => user.userToBoard)
  @JoinColumn({ name: 'user' })
  user: UserEntity;

  @ManyToOne(() => BoardEntity, (board) => board.userToBoard)
  @JoinColumn({ name: 'board' })
  board: BoardEntity;
}
