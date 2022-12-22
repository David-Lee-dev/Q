export class TransactionException extends Error {
  constructor() {
    super('database error');
  }
}

export class HttpException extends Error {
  public status: number;
  public message: string;

  constructor(code: string) {
    super(errorCode[code].message);
    this.status = errorCode[code].status;
    this.message = errorCode[code].message;
  }
}
interface IErrorCode {
  [index: string]: {
    code: string;
    status: number;
    message: string;
  };
}
/**
 * code format: OOO[00]
 *              ||| ||___ 4 - client side error, 5 - server side error
 *              ||| |____ effected data
 *              |||
 *              |||______ C - 1, R - 2, U - 3, D - 4
 *              ||_______ C: controller, S: service, R: repository
 *              |________ B: board, U: user, T: task, S: subtask, N: note
 */
export const errorCode: IErrorCode = {
  //repository
  //board
  BRC15: {
    code: 'BRC15',
    status: 500,
    message: 'server error, fail to save board',
  },
  BRR05: {
    code: 'BRR05',
    status: 500,
    message: 'server error, fail to get board',
  },
  BRU15: {
    code: 'BRU15',
    status: 500,
    message: 'server error, fail to edit board',
  },
  BRD15: {
    code: 'BRD15',
    status: 500,
    message: 'server error, fail to remove board',
  },
  //user
  URC15: {
    code: 'URC15',
    status: 500,
    message: 'server error, fail to save user',
  },
  URR05: {
    code: 'URR05',
    status: 500,
    message: 'server error, fail to get user',
  },
  URU15: {
    code: 'URU15',
    status: 500,
    message: 'server error, fail to edit user',
  },
  URD15: {
    code: 'URD15',
    status: 500,
    message: 'server error, fail to remove user',
  },
};
