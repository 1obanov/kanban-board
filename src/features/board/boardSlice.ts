import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

import type { ViewMode } from "../../types/board";
import type { RequestError, RequestStatus } from "../../types/common";
import type { Label } from "../../types/label";
import type { Priority } from "../../types/priority";
import type { User } from "../../types/user";
import { fetchBoardData } from "./boardThunks";

type BoardState = {
  users: User[];
  availableLabels: Label[];
  availablePriorities: Priority[];
  viewMode: ViewMode;
  status: RequestStatus;
  error: RequestError;
};

/**
 * Initial state for Kanban board slice
 */
const initialState: BoardState = {
  users: [],
  availableLabels: [],
  availablePriorities: [],
  viewMode: "board",
  status: "idle",
  error: null,
};

const boardSlice = createSlice({
  name: "board",
  initialState,
  reducers: {
    /** Set current board view mode */
    setViewMode(state, action: PayloadAction<ViewMode>) {
      state.viewMode = action.payload;
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
    builder
      .addCase(fetchBoardData.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchBoardData.fulfilled, (state, action) => {
        state.users = action.payload.users;
        state.availableLabels = action.payload.labels;
        state.availablePriorities = action.payload.priorities;

        state.status = "succeeded";
        state.error = null;
      })
      .addCase(fetchBoardData.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message ?? "Failed to load board data.";
      });
  },
});

export const { setViewMode, addUser, deleteUser, addLabel, deleteLabel } =
  boardSlice.actions;

export default boardSlice.reducer;
