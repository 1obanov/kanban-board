import type { Task } from "../types/board";

export const isDateExpired = (date: Task["dueDate"]) => {
  const today = new Date().setHours(0, 0, 0, 0);
  const dueDate = new Date(date).setHours(0, 0, 0, 0);

  return dueDate < today;
};

export const formatDueDate = (date: Task["dueDate"]) =>
  new Date(date).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
