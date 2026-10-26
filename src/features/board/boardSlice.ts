import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

import type { BoardColumn, ViewMode } from "../../types/board";
import type { Label } from "../../types/label";
import type { Priority } from "../../types/priority";
import type { User } from "../../types/user";
import { fetchBoardData } from "./boardThunks";

export type BoardState = {
  users: User[];
  availableLabels: Label[];
  availablePriorities: Priority[];
  columns: BoardColumn[];
  viewMode: ViewMode;
};

export type MoveTaskInColumnPayload = {
  taskId: string;
  sourceColumnId: string;
  destinationColumnId: string;
  destinationIndex: number;
};

type AddTaskToColumnPayload = {
  taskId: string;
  columnId: string;
};

/**
 * Initial state for Kanban board slice
 */
const initialState: BoardState = {
  users: [],
  availableLabels: [],
  availablePriorities: [],
  columns: [],
  viewMode: "board",
};

const boardSlice = createSlice({
  name: "board",
  initialState,
  reducers: {
    /** Set current board view mode */
    setViewMode(state, action: PayloadAction<ViewMode>) {
      state.viewMode = action.payload;
    },

    /** Add task ID to a column */
    addTaskToColumn(state, action: PayloadAction<AddTaskToColumnPayload>) {
      const { taskId, columnId } = action.payload;
      const column = state.columns.find((col) => col.id === columnId);
      if (column) {
        column.taskIds.push(taskId);
      }
    },

    /** Remove task ID from its column */
    deleteTaskFromColumn(state, action: PayloadAction<string>) {
      const taskId = action.payload;
      const column = state.columns.find((col) => col.taskIds.includes(taskId));

      if (column) {
        column.taskIds = column.taskIds.filter((id) => id !== taskId);
      }
    },

    /** Move task between columns or reorder within the same column */
    moveTaskInColumn(state, action: PayloadAction<MoveTaskInColumnPayload>) {
      const { taskId, sourceColumnId, destinationColumnId, destinationIndex } =
        action.payload;

      const sourceCol = state.columns.find((col) => col.id === sourceColumnId);
      const destCol = state.columns.find(
        (col) => col.id === destinationColumnId,
      );

      if (!sourceCol || !destCol) return;

      sourceCol.taskIds = sourceCol.taskIds.filter((id) => id !== taskId);
      destCol.taskIds.splice(destinationIndex, 0, taskId);
    },

    /** Add a new user to the board */
    addUser(state, action: PayloadAction<User>) {
      state.users.push(action.payload);
    },

    /** Delete an user from the board */
    deleteUser(state, action: PayloadAction<string>) {
      const userId = action.payload;

      state.users = state.users.filter((users) => users.id !== userId);
    },

    /** Add a new label to the board */
    addLabel(state, action: PayloadAction<Label>) {
      state.availableLabels.push(action.payload);
    },

    /** Delete a label from the board */
    deleteLabel(state, action: PayloadAction<string>) {
      const labelId = action.payload;

      state.availableLabels = state.availableLabels.filter(
        (label) => label.id !== labelId,
      );
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchBoardData.fulfilled, (state, action) => {
      state.columns = action.payload.columns;
      state.users = action.payload.users;
      state.availableLabels = action.payload.labels;
      state.availablePriorities = action.payload.priorities;
    });
  },
});

export const {
  setViewMode,
  addTaskToColumn,
  deleteTaskFromColumn,
  moveTaskInColumn,
  addUser,
  deleteUser,
  addLabel,
  deleteLabel,
} = boardSlice.actions;

export default boardSlice.reducer;
