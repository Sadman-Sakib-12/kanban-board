export * from './task';
export * from './column';

import { Column } from './column';
import { Task } from './task';

export interface Board {
  columns: Column[];
  tasks: Task[];
}
