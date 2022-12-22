export interface ITask {
  pk: number;
  content: string;
  done: boolean;
  in_progress: boolean;
  due_date: Date;
  create_date?: Date;
  subtasks?: any;
  board?: any;
  user?: any;
}
