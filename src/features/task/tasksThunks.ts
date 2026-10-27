import { createAsyncThunk } from "@reduxjs/toolkit";

import { createTask, deleteTask, updateTask } from "../../api/tasksApi";
import type { Task } from "../../types/board";

export const createTaskThunk = createAsyncThunk<Task, Omit<Task, "id">>(
  "tasks/createTask",
  async (task) => {
    return createTask(task);
  },
);

export const updateTaskThunk = createAsyncThunk<
  Task,
  {
    id: Task["id"];
    updatedFields: Omit<Task, "id">;
  }
>("tasks/updateTask", async ({ id, updatedFields }) => {
  return updateTask(id, updatedFields);
});

export const deleteTaskThunk = createAsyncThunk<Task["id"], Task["id"]>(
  "tasks/deleteTask",
  async (taskId) => {
    await deleteTask(taskId);

    return taskId;
  },
);
