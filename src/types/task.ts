export type Priority = "High" | "Medium" | "Low";

export interface Label {
  id: string;
  name: string;
  color: string;
}

export interface Assignee {
  name: string;
  avatar?: string;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  assignee?: Assignee;
  labels: Label[];
  dueDate?: string;
  priority: Priority;
  columnId: string;
}
