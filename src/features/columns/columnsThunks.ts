import { createAsyncThunk } from "@reduxjs/toolkit";

import {
  addTaskToColumn,
  changeColumnName,
  deleteTaskFromColumn,
  moveTaskInColumnApi,
} from "../../api/columnsApi";
import type { RootState } from "../../store";
import type { BoardColumn, Task } from "../../types/board";

export type AddTaskToColumn = {
  taskId: Task["id"];
  columnId: BoardColumn["id"];
};

export type ChangeColumnName = Pick<BoardColumn, "id" | "title">;

export type DeleteTaskFromColumn = {
  taskId: Task["id"];
  columnId: BoardColumn["id"];
};

export type MoveTaskInColumn = {
  taskId: Task["id"];
  sourceColumnId: BoardColumn["id"];
  destinationColumnId: BoardColumn["id"];
  destinationIndex: number;
};

export const addTaskToColumnThunk = createAsyncThunk<
  BoardColumn,
  AddTaskToColumn
>("columns/addTaskToColumn", async (payload) => {
  return addTaskToColumn(payload);
});

export const changeColumnNameThunk = createAsyncThunk<
  BoardColumn,
  ChangeColumnName
>("columns/changeColumnName", async (payload) => {
  return changeColumnName(payload);
});

export const deleteTaskFromColumnThunk = createAsyncThunk<
  BoardColumn,
  DeleteTaskFromColumn
>("columns/deleteTaskFromColumn", async (payload) => {
  return deleteTaskFromColumn(payload);
});

export const moveTaskInColumnThunk = createAsyncThunk<
  BoardColumn[],
  MoveTaskInColumn,
  { state: RootState }
>(
  "columns/moveTaskInColumnApi",
  async ({ sourceColumnId, destinationColumnId }, { getState }) => {
    const { columns } = getState().columns;

    const columnIds =
      sourceColumnId === destinationColumnId
        ? [sourceColumnId]
        : [sourceColumnId, destinationColumnId];

    const savedColumns: BoardColumn[] = [];

    for (const columnId of columnIds) {
      const column = columns.find((item) => item.id === columnId);

      if (!column) {
        throw new Error(`Column not found: ${columnId}`);
      }

      savedColumns.push(await moveTaskInColumnApi(column));
    }

    return savedColumns;
  },
);
