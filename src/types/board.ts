import type { Assignee } from "../data/assignees";
import type { PriorityID } from "../data/priorities";

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
  assignees: Assignee[];
  labels: string[];
  priority: PriorityID;
  dueDate: string;
};

export type BoardData = {
  columns: BoardColumn[];
  tasks: Task[];
};
