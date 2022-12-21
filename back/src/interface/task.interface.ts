export interface ITask {
  pk: number;
  content: string;
  done: boolean;
  in_progress: boolean;
  subtasks?: any;
  board?: any;
  user?: any;
}
