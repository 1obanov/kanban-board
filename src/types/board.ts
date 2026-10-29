import type { PriorityID } from "./priority";

export type ViewMode = "board" | "list";

export type Column = {
  id: string;
  title: string;
  position: number;
  created_at: string;
};

export type Task = {
  id: string;
  title: string;
  description: string;
  status: string;
  position: number;
  assignee_ids: string[];
  label_ids: string[];
  priority_id: PriorityID;
  due_date: string | null;
  created_at: string;
};
