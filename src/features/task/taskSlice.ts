import { createSlice } from "@reduxjs/toolkit";

import type { Task } from "../../types/board";
import type { RequestError, RequestStatus } from "../../types/common";
import { fetchBoardData } from "../board/boardThunks";
import {
  createTaskThunk,
  deleteTaskThunk,
  updateTaskThunk,
} from "./tasksThunks";

type TaskState = {
  tasks: Task[];
  createStatus: RequestStatus;
  createError: RequestError;
  updateStatus: RequestStatus;
  updateError: RequestError;
  deleteStatus: RequestStatus;
  deleteError: RequestError;
};

/** Initial state for tasks */
const initialState: TaskState = {
  tasks: [],
  createStatus: "idle",
  createError: null,
  updateStatus: "idle",
  updateError: null,
  deleteStatus: "idle",
  deleteError: null,
};

/** Slice to manage tasks: add, delete, update, and move */
const taskSlice = createSlice({
  name: "tasks",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchBoardData.fulfilled, (state, action) => {
        state.tasks = action.payload.tasks;
      })
      .addCase(createTaskThunk.pending, (state) => {
        state.createStatus = "loading";
        state.createError = null;
      })
      .addCase(createTaskThunk.fulfilled, (state, action) => {
        state.tasks.push(action.payload);
        state.createStatus = "succeeded";
        state.createError = null;
      })
      .addCase(createTaskThunk.rejected, (state, action) => {
        state.createStatus = "failed";
        state.createError = action.error.message ?? "Failed to create task";
      })
      .addCase(updateTaskThunk.pending, (state) => {
        state.updateStatus = "loading";
        state.updateError = null;
      })
      .addCase(updateTaskThunk.fulfilled, (state, action) => {
        const updatedTask = action.payload;

        const index = state.tasks.findIndex(
          (task) => task.id === updatedTask.id,
        );

        if (index !== -1) {
          state.tasks[index] = updatedTask;
        }

        state.updateStatus = "succeeded";
        state.updateError = null;
      })
      .addCase(updateTaskThunk.rejected, (state, action) => {
        state.updateStatus = "failed";
        state.updateError = action.error.message ?? "Failed to update task";
      })
      .addCase(deleteTaskThunk.pending, (state) => {
        state.deleteStatus = "loading";
        state.deleteError = null;
      })
      .addCase(deleteTaskThunk.fulfilled, (state, action) => {
        const taskId = action.payload;
        state.tasks = state.tasks.filter((task) => task.id !== taskId);
        state.deleteStatus = "succeeded";
        state.deleteError = null;
      })
      .addCase(deleteTaskThunk.rejected, (state, action) => {
        state.deleteStatus = "failed";
        state.deleteError = action.error.message ?? "Failed to delete task";
      });
  },
});

export default taskSlice.reducer;
