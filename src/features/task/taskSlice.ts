import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

import type { Task } from "../../types/board";
import { fetchBoardData } from "../board/boardThunks";

export type TaskState = {
  tasks: Task[];
};

type UpdateTaskPayload = {
  id: string;
  updatedFields: Partial<Omit<Task, "id">>;
};

/** Initial state for tasks */
const initialState: TaskState = {
  tasks: [],
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

      const task = state.tasks.find((task) => task.id === id);

      if (task) {
        Object.assign(task, updatedFields);
      }
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchBoardData.fulfilled, (state, action) => {
      state.tasks = action.payload.tasks;
    });
  },
});

export const { addTask, deleteTask, updateTask } = taskSlice.actions;

export default taskSlice.reducer;
