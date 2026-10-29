import { createSlice } from "@reduxjs/toolkit";

import type { Column } from "../../types/board";
import type { RequestError, RequestStatus } from "../../types/common";
import { fetchBoardData } from "../board/boardThunks";
import { changeColumnNameThunk } from "./columnsThunks";

type ColumnsState = {
  columns: Column[];
  changeColumnNameStatus: RequestStatus;
  changeColumnNameError: RequestError;
};

/** Initial state for Kanban column slice */
const initialState: ColumnsState = {
  columns: [],
  changeColumnNameStatus: "idle",
  changeColumnNameError: null,
};

const columnsSlice = createSlice({
  name: "columns",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchBoardData.fulfilled, (state, action) => {
        state.columns = action.payload.columns;
      })
      .addCase(changeColumnNameThunk.pending, (state) => {
        state.changeColumnNameStatus = "loading";
        state.changeColumnNameError = null;
      })
      .addCase(changeColumnNameThunk.fulfilled, (state, action) => {
        const { oldId, column } = action.payload;

        const index = state.columns.findIndex((item) => item.id === oldId);

        if (index !== -1) {
          state.columns[index] = column;
        }

        state.changeColumnNameStatus = "succeeded";
        state.changeColumnNameError = null;
      })
      .addCase(changeColumnNameThunk.rejected, (state, action) => {
        state.changeColumnNameStatus = "failed";
        state.changeColumnNameError =
          action.error.message ?? "Failed to update column name";
      });
  },
});

export default columnsSlice.reducer;
