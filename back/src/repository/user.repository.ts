import { Repository } from 'typeorm';
import database from '../data/database';
import { UserEntity } from '../entity/user.entity';
import { HttpException } from '../exception/Exception';
import { IUser, IUserReadOption } from '../interface/user.interface';

class UserRepository {
  public dataSource: Repository<UserEntity>;

  constructor() {
    this.dataSource = database.getRepository(UserEntity);
  }

  public saveUser = async (user: IUser) => {
    try {
      return await this.dataSource.save(user);
    } catch (error) {
      throw new HttpException('URC15');
    }
  };

  public getUsers = async (readOption?: IUserReadOption) => {
    try {
      return await this.dataSource.find({
        select: {
          email: true,
          password: readOption.pwdExposure,
          boards: readOption.joinOption.board && {
            serial: true,
            title: true,
          },
          tasks: readOption.joinOption.task && {
            pk: true,
            content: true,
            done: true,
            in_progress: true,
            subtasks: true,
          },
          notes: readOption.joinOption.note && {
            pk: true,
            content: true,
          },
        },
        relations: {
          boards: readOption.joinOption.board,
          tasks: readOption.joinOption.task,
          notes: readOption.joinOption.note,
        },
        where: readOption.boardSerial && {
          boards: {
            serial: readOption.boardSerial,
          },
        },
      });
    } catch (error) {
      throw new HttpException('URC05');
    }
  };

  public getUser = async (email: string, readOption?: IUserReadOption) => {
    try {
      return await this.dataSource.findOne({
        select: {
          email: true,
          password: readOption.pwdExposure,
          boards: readOption.joinOption.board && {
            serial: true,
            title: true,
          },
          tasks: readOption.joinOption.task && {
            pk: true,
            content: true,
            done: true,
            in_progress: true,
            subtasks: true,
          },
          notes: readOption.joinOption.note && {
            pk: true,
            content: true,
          },
        },
        relations: {
          boards: readOption.joinOption.board,
          tasks: readOption.joinOption.task,
          notes: readOption.joinOption.note,
        },
        where: {
          email,
        },
      });
    } catch (error) {
      throw new HttpException('URC05');
    }
  };

  public editUser = async (user: IUser) => {
    try {
      return await this.dataSource.update(
        { email: user.email },
        { password: user.password, tutorial: user.tutorial }
      );
    } catch (error) {
      throw new HttpException('URU15');
    }
  };

  public removeUser = async (email: string) => {
    try {
      return await this.dataSource.delete(email);
    } catch (error) {
      throw new HttpException('URD15');
    }
  };
}

export default new UserRepository();
