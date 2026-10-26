import { createSlice } from "@reduxjs/toolkit";

import { fetchBoardData } from "../board/boardThunks";

type BoardDataState = {
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
};

const initialState: BoardDataState = {
  status: "idle",
  error: null,
};

const boardDataSlice = createSlice({
  name: "boardData",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchBoardData.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchBoardData.fulfilled, (state) => {
        state.status = "succeeded";
        state.error = null;
      })
      .addCase(fetchBoardData.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message ?? "Failed to load board data.";
      });
  },
});

export default boardDataSlice.reducer;
