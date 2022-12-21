export interface IUser {
  email: string;
  password: string;
  tutorial: boolean;
  boards?: any;
  tasks?: any;
  notes?: any;
}

export interface IUserReadOption {
  joinOption?: {
    board?: boolean;
    task?: boolean;
    note?: boolean;
  };
  boardSerial?: string;
  pwdExposure?: boolean;
}
