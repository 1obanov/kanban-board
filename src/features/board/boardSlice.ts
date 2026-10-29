import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

import type { ViewMode } from "../../types/board";
import type { RequestError, RequestStatus } from "../../types/common";
import type { Label } from "../../types/label";
import type { Priority } from "../../types/priority";
import type { User } from "../../types/user";
import {
  addLabelThunk,
  addUserThunk,
  deleteLabelThunk,
  deleteUserThunk,
  fetchBoardData,
} from "./boardThunks";

type BoardState = {
  users: User[];
  availableLabels: Label[];
  availablePriorities: Priority[];
  viewMode: ViewMode;
  createUserStatus: RequestStatus;
  createUserError: RequestError;
  createLabelStatus: RequestStatus;
  createLabelError: RequestError;
  status: RequestStatus;
  error: RequestError;
};

/** Initial state for Kanban board slice */
const initialState: BoardState = {
  users: [],
  availableLabels: [],
  availablePriorities: [],
  viewMode: "board",
  createUserStatus: "idle",
  createUserError: null,
  createLabelStatus: "idle",
  createLabelError: null,
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
        state.error = action.error.message ?? "Failed to load board data";
      })
      .addCase(addUserThunk.pending, (state) => {
        state.createUserStatus = "loading";
        state.createUserError = null;
      })
      .addCase(addUserThunk.fulfilled, (state, action) => {
        state.users.push(action.payload);
        state.createUserStatus = "succeeded";
        state.createUserError = null;
      })
      .addCase(addUserThunk.rejected, (state, action) => {
        state.createUserStatus = "failed";
        state.createUserError = action.error.message ?? "Failed to add user";
      })
      .addCase(deleteUserThunk.fulfilled, (state, action) => {
        state.users = state.users.filter((user) => user.id !== action.payload);
      })
      .addCase(addLabelThunk.pending, (state) => {
        state.createLabelStatus = "loading";
        state.createLabelError = null;
      })
      .addCase(addLabelThunk.fulfilled, (state, action) => {
        state.availableLabels.push(action.payload);
        state.createLabelStatus = "succeeded";
        state.createLabelError = null;
      })
      .addCase(addLabelThunk.rejected, (state, action) => {
        state.createLabelStatus = "failed";
        state.createLabelError = action.error.message ?? "Failed to add label";
      })
      .addCase(deleteLabelThunk.fulfilled, (state, action) => {
        state.availableLabels = state.availableLabels.filter(
          (label) => label.id !== action.payload,
        );
      });
  },
});

export const { setViewMode } = boardSlice.actions;

export default boardSlice.reducer;
