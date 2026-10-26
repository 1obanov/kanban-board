import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

import type { BoardColumn, Task, ViewMode } from "../../types/board";
import type { Label } from "../../types/label";
import type { Priority } from "../../types/priority";
import type { User } from "../../types/user";
import { fetchBoardData } from "./boardThunks";

type BoardState = {
  users: User[];
  availableLabels: Label[];
  availablePriorities: Priority[];
  columns: BoardColumn[];
  viewMode: ViewMode;
};

type MoveTaskInColumnPayload = {
  taskId: Task["id"];
  sourceColumnId: BoardColumn["id"];
  destinationColumnId: BoardColumn["id"];
  destinationIndex: number;
};

type AddTaskToColumnPayload = {
  taskId: Task["id"];
  columnId: BoardColumn["id"];
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

    /** Change name of column */
    changeColumnName(
      state,
      action: PayloadAction<Pick<BoardColumn, "id" | "title">>,
    ) {
      const { id, title } = action.payload;

      const column = state.columns.find((col) => col.id === id);

      if (column) {
        column.title = title;
      }
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
    deleteTaskFromColumn(state, action: PayloadAction<Task["id"]>) {
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
    deleteUser(state, action: PayloadAction<User["id"]>) {
      const userId = action.payload;

      state.users = state.users.filter((users) => users.id !== userId);
    },

    /** Add a new label to the board */
    addLabel(state, action: PayloadAction<Label>) {
      state.availableLabels.push(action.payload);
    },

    /** Delete a label from the board */
    deleteLabel(state, action: PayloadAction<Label["id"]>) {
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
  changeColumnName,
  addTaskToColumn,
  deleteTaskFromColumn,
  moveTaskInColumn,
  addUser,
  deleteUser,
  addLabel,
  deleteLabel,
} = boardSlice.actions;

export default boardSlice.reducer;
