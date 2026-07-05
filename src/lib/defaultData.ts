import { Board, Column, Task } from '@/types';
import { v4 as uuidv4 } from 'uuid';

export const defaultColumns: Column[] = [
  { id: 'col-backlog', title: 'Backlog' },
  { id: 'col-todo', title: 'Todo' },
  { id: 'col-in-progress', title: 'In Progress' },
  { id: 'col-review', title: 'Review' },
  { id: 'col-done', title: 'Done' },
];

export const defaultTasks: Task[] = [
  {
    id: uuidv4(),
    title: 'Initialize Next.js project',
    description: 'Set up Next.js 14 App Router with Tailwind CSS and TypeScript.',
    assignee: { name: 'John Doe' },
    labels: [
      { id: 'lbl-1', name: 'Setup', color: '#3b82f6' },
    ],
    priority: 'High',
    columnId: 'col-done',
    dueDate: new Date().toISOString(),
  },
  {
    id: uuidv4(),
    title: 'Implement Drag and Drop',
    description: 'Use @dnd-kit to allow moving cards between columns and reordering them.',
    assignee: { name: 'Jane Smith' },
    labels: [
      { id: 'lbl-2', name: 'Feature', color: '#060808ff' },
    ],
    priority: 'High',
    columnId: 'col-in-progress',
  },
  {
    id: uuidv4(),
    title: 'Design UI Components',
    description: 'Create reusable components like Button, Input, Modal, and Badge.',
    labels: [
      { id: 'lbl-3', name: 'Design', color: '#8b5cf6' },
    ],
    priority: 'Medium',
    columnId: 'col-todo',
  },
];

export const defaultBoard: Board = {
  columns: defaultColumns,
  tasks: defaultTasks,
};
