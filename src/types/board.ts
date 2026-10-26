import type { PriorityID } from "./priority";

export type ViewMode = "board" | "list";

export type BoardColumn = {
  id: string;
  title: string;
  taskIds: string[];
};

export type Task = {
  id: string;
  title: string;
  description: string;
  assigneeIds: string[];
  labelIds: string[];
  priorityId: PriorityID;
  dueDate: string;
};

export type Board = {
  columns: BoardColumn[];
  tasks: Task[];
};
