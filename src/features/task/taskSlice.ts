import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

import boardDataJson from "../../data/boardData.json";
import type { PriorityID } from "../../data/priorities";
import type { BoardData, Task } from "../../types/board";

const boardData: BoardData = {
  columns: boardDataJson.columns,
  tasks: boardDataJson.tasks.map((task) => ({
    ...task,
    priority: task.priority as PriorityID,
  })),
};

export type TaskState = {
  tasks: Task[];
};

type UpdateTaskPayload = {
  id: string;
  updatedFields: Partial<Omit<Task, "id">>;
};

/** Initial state for tasks */
const initialState: TaskState = {
  tasks: boardData.tasks,
};

/** Slice to manage tasks: add, delete, update, and move */
const taskSlice = createSlice({
  name: "tasks",
  initialState,
  reducers: {
    /** Add a new task */
    addTask(state, action: PayloadAction<Task>) {
      state.tasks.push(action.payload);
    },

    /** Delete a task by id */
    deleteTask(state, action: PayloadAction<string>) {
      const taskId = action.payload;
      state.tasks = state.tasks.filter((task) => task.id !== taskId);
    },

    /** Update a task by id with new fields */
    updateTask(state, action: PayloadAction<UpdateTaskPayload>) {
      const { id, updatedFields } = action.payload;

      state.tasks = state.tasks.map((task) =>
        task.id === id ? { ...task, ...updatedFields } : task,
      );
    },
  },
});

export const { addTask, deleteTask, updateTask } = taskSlice.actions;
export default taskSlice.reducer;
