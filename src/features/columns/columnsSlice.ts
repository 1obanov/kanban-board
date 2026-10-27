import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

import type { BoardColumn } from "../../types/board";
import type { RequestError, RequestStatus } from "../../types/common";
import { fetchBoardData } from "../board/boardThunks";
import {
  addTaskToColumnThunk,
  changeColumnNameThunk,
  deleteTaskFromColumnThunk,
  type MoveTaskInColumn,
  moveTaskInColumnThunk,
} from "./columnsThunks";

type ColumnsState = {
  columns: BoardColumn[];
  addTaskToColumnStatus: RequestStatus;
  addTaskToColumnError: RequestError;
  changeColumnNameStatus: RequestStatus;
  changeColumnNameError: RequestError;
  deleteTaskFromColumnStatus: RequestStatus;
  deleteTaskFromColumnError: RequestError;
};

const updateColumnInState = (
  state: ColumnsState,
  updatedColumn: BoardColumn,
) => {
  const index = state.columns.findIndex(
    (column) => column.id === updatedColumn.id,
  );

  if (index !== -1) {
    state.columns[index] = updatedColumn;
  }
};

/**
 * Initial state for Kanban column slice
 */
const initialState: ColumnsState = {
  columns: [],
  addTaskToColumnStatus: "idle",
  addTaskToColumnError: null,
  changeColumnNameStatus: "idle",
  changeColumnNameError: null,
  deleteTaskFromColumnStatus: "idle",
  deleteTaskFromColumnError: null,
};

const columnsSlice = createSlice({
  name: "columns",
  initialState,
  reducers: {
    /** Move task between columns or reorder within the same column */
    moveTaskInColumn(state, action: PayloadAction<MoveTaskInColumn>) {
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
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchBoardData.fulfilled, (state, action) => {
        state.columns = action.payload.columns;
      })
      .addCase(addTaskToColumnThunk.pending, (state) => {
        state.addTaskToColumnStatus = "loading";
        state.addTaskToColumnError = null;
      })
      .addCase(addTaskToColumnThunk.fulfilled, (state, action) => {
        updateColumnInState(state, action.payload);

        state.addTaskToColumnStatus = "succeeded";
        state.addTaskToColumnError = null;
      })
      .addCase(addTaskToColumnThunk.rejected, (state, action) => {
        state.addTaskToColumnStatus = "failed";
        state.addTaskToColumnError =
          action.error.message ?? "Failed to add task to column";
      })
      .addCase(changeColumnNameThunk.pending, (state) => {
        state.changeColumnNameStatus = "loading";
        state.changeColumnNameError = null;
      })
      .addCase(changeColumnNameThunk.fulfilled, (state, action) => {
        updateColumnInState(state, action.payload);

        state.changeColumnNameStatus = "succeeded";
        state.changeColumnNameError = null;
      })
      .addCase(changeColumnNameThunk.rejected, (state, action) => {
        state.changeColumnNameStatus = "failed";
        state.changeColumnNameError =
          action.error.message ?? "Failed to change the column name";
      })
      .addCase(deleteTaskFromColumnThunk.pending, (state) => {
        state.deleteTaskFromColumnStatus = "loading";
        state.deleteTaskFromColumnError = null;
      })
      .addCase(deleteTaskFromColumnThunk.fulfilled, (state, action) => {
        updateColumnInState(state, action.payload);

        state.deleteTaskFromColumnStatus = "succeeded";
        state.deleteTaskFromColumnError = null;
      })
      .addCase(deleteTaskFromColumnThunk.rejected, (state, action) => {
        state.deleteTaskFromColumnStatus = "failed";
        state.deleteTaskFromColumnError =
          action.error.message ?? "Failed to delete task from column";
      })
      .addCase(moveTaskInColumnThunk.rejected, (_, action) => {
        console.error("Failed to save task position:", action.error.message);
      });
  },
});

export const { moveTaskInColumn } = columnsSlice.actions;

export default columnsSlice.reducer;
