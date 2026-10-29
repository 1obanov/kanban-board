import { createAsyncThunk } from "@reduxjs/toolkit";

import {
  createTask,
  deleteTask,
  moveTaskInColumn,
  updateTask,
} from "../../api/tasksApi";
import type { RootState } from "../../store";
import type { Column, Task } from "../../types/board";
import { updateTasksLocally } from "./tasksActions";

export type MoveTaskInColumn = {
  taskId: Task["id"];
  sourceColumnId: Column["id"];
  destinationColumnId: Column["id"];
  destinationIndex: number;
};

export const createTaskThunk = createAsyncThunk<
  Task,
  Omit<Task, "id" | "created_at" | "position">,
  { state: RootState }
>("tasks/createTask", async (newTask, { getState }) => {
  const { tasks } = getState().tasks;

  const columnTasks = tasks.filter((task) => task.status === newTask.status);

  const nextPosition =
    columnTasks.reduce((max, task) => Math.max(max, task.position), -1) + 1;

  return createTask({
    ...newTask,
    position: nextPosition,
  });
});

export const updateTaskThunk = createAsyncThunk<
  Task,
  {
    taskId: Task["id"];
    updatedFields: Partial<
      Omit<Task, "id" | "status" | "created_at" | "position">
    >;
  }
>("tasks/updateTask", async ({ taskId, updatedFields }) => {
  return updateTask(taskId, updatedFields);
});

export const deleteTaskThunk = createAsyncThunk<Task["id"], Task["id"]>(
  "tasks/deleteTask",
  async (taskId) => {
    await deleteTask(taskId);

    return taskId;
  },
);

export const moveTaskInColumnThunk = createAsyncThunk<
  Task[],
  MoveTaskInColumn,
  { state: RootState }
>(
  "tasks/moveTaskInColumn",
  async (
    { taskId, sourceColumnId, destinationColumnId, destinationIndex },
    { getState, dispatch },
  ) => {
    const { tasks } = getState().tasks;

    const sameColumn = sourceColumnId === destinationColumnId;

    const sourceTasks = tasks
      .filter((task) => task.status === sourceColumnId)
      .sort((a, b) => a.position - b.position);

    const sourceIndex = sourceTasks.findIndex((task) => task.id === taskId);

    if (sourceIndex === -1) {
      throw new Error(`Task not found: ${taskId}`);
    }

    const [movedTask] = sourceTasks.splice(sourceIndex, 1);

    const destinationTasks = sameColumn
      ? sourceTasks
      : tasks
          .filter((task) => task.status === destinationColumnId)
          .sort((a, b) => a.position - b.position);

    destinationTasks.splice(
      Math.max(0, Math.min(destinationIndex, destinationTasks.length)),
      0,
      movedTask,
    );

    const updatedTasks: Task[] = [];

    if (sameColumn) {
      destinationTasks.forEach((task, index) => {
        updatedTasks.push({
          ...task,
          position: index,
        });
      });
    } else {
      sourceTasks.forEach((task, index) => {
        updatedTasks.push({
          ...task,
          position: index,
        });
      });

      destinationTasks.forEach((task, index) => {
        updatedTasks.push({
          ...task,
          status: destinationColumnId,
          position: index,
        });
      });
    }

    dispatch(updateTasksLocally(updatedTasks));

    try {
      await Promise.all(
        updatedTasks.map(async (task) => {
          await moveTaskInColumn(task.id, task.status, task.position);
        }),
      );
    } catch (error) {
      console.error("Supabase save failed:", error);
      throw error;
    }

    return updatedTasks;
  },
);
