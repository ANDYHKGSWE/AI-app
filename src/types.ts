export interface Subtask {
  name: string;
  estimatedTime: number;
}

export interface Task {
  id: string;
  name: string;
  estimatedTime: number;
  subtasks: Subtask[];
}