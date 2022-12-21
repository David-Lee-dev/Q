import { IUser } from './user.interface';

export interface IBoard {
  serial: string;
  title: string;
  user?: any;
  task?: any;
  note?: any;
}

export interface IBoardReadOption {
  joinOption?: { user?: boolean; task?: boolean; note?: boolean };
  user?: IUser;
}
