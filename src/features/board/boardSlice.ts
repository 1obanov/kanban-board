import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

import { type Assignee,assignees } from "../../data/assignees";
import boardDataJson from "../../data/boardData.json";
import { type Label,labels } from "../../data/labels";
import { priorities } from "../../data/priorities";
import type { BoardColumn, ViewMode } from "../../types/board";

export type BoardState = {
  assigneesData: typeof assignees;
  labelsData: typeof labels;
  prioritiesData: typeof priorities;
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
  assigneesData: assignees,
  labelsData: labels,
  prioritiesData: priorities,
  columns: boardDataJson.columns,
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

    /** Add a new assignee to the board */
    addAssignee(state, action: PayloadAction<Assignee>) {
      const user = action.payload;

      state.assigneesData.list.push(user);

      state.assigneesData.options.push({
        value: user.id,
        label: user.name,
      });
    },

    /** Delete an assignee from the board */
    deleteAssignee(state, action: PayloadAction<string>) {
      const assigneeId = action.payload;

      state.assigneesData.list = state.assigneesData.list.filter(
        (assignee) => assignee.id !== assigneeId,
      );

      state.assigneesData.options = state.assigneesData.options.filter(
        (assignee) => assignee.value !== assigneeId,
      );
    },

    /** Add a new label to the board */
    addLabel(state, action: PayloadAction<Label>) {
      const label = action.payload;

      state.labelsData.list.push(label);

      state.labelsData.options.push({
        value: label.id,
        label: label.name,
        color: label.color,
      });
    },

    /** Delete a label from the board */
    deleteLabel(state, action: PayloadAction<string>) {
      const labelId = action.payload;

      state.labelsData.list = state.labelsData.list.filter(
        (label) => label.id !== labelId,
      );

      state.labelsData.options = state.labelsData.options.filter(
        (label) => label.value !== labelId,
      );
    },
  },
});

export const {
  setViewMode,
  addTaskToColumn,
  deleteTaskFromColumn,
  moveTaskInColumn,
  addAssignee,
  deleteAssignee,
  addLabel,
  deleteLabel,
} = boardSlice.actions;

export default boardSlice.reducer;
