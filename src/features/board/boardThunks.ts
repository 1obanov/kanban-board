import { createAsyncThunk } from "@reduxjs/toolkit";

import { getBoard } from "../../api/boardApi";
import { getLabels } from "../../api/labelsApi";
import { getPriorities } from "../../api/prioritiesApi";
import { getUsers } from "../../api/userApi";
import type { AppThunk } from "../../store";
import type { BoardColumn, Task } from "../../types/board";
import type { Label } from "../../types/label";
import type { Priority } from "../../types/priority";
import type { User } from "../../types/user";
import { setAssignees, setLabels } from "../filters/filtersSlice";
import { updateTask } from "../task/taskSlice";
import { deleteLabel, deleteUser } from "./boardSlice";

type BoardData = {
  columns: BoardColumn[];
  tasks: Task[];
  users: User[];
  labels: Label[];
  priorities: Priority[];
};

export const fetchBoardData = createAsyncThunk<BoardData>(
  "board/fetchBoardData",
  async () => {
    const [board, users, labels, priorities] = await Promise.all([
      getBoard(),
      getUsers(),
      getLabels(),
      getPriorities(),
    ]);

    return {
      columns: board.columns,
      tasks: board.tasks,
      users,
      labels,
      priorities,
    };
  },
);

/**
 * Remove an assignee from the board
 * - Deletes assignee from board state
 * - Removes the assignee from all tasks
 * - Updates filters state
 */
export const removeAssignee =
  (userId: User["id"]): AppThunk =>
  (dispatch, getState) => {
    // Remove user from board slice
    dispatch(deleteUser(userId));

    const state = getState();

    const { tasks } = state.tasks;
    const { assignees } = state.filters;

    // Remove the assignee from every task that has it
    tasks.forEach((task) => {
      if (task.assigneeIds.some((id) => id === userId)) {
        dispatch(
          updateTask({
            id: task.id,
            updatedFields: {
              assigneeIds: task.assigneeIds.filter((id) => id !== userId),
            },
          }),
        );
      }
    });

    // Update filters slice
    dispatch(setAssignees(assignees.filter((a) => a.value !== userId)));
  };

/**
 * Remove a label from the board
 * - Deletes label from board state
 * - Removes the label from all tasks
 * - Updates filters state
 */
export const removeLabel =
  (labelId: Label["id"]): AppThunk =>
  (dispatch, getState) => {
    // Remove label from board slice
    dispatch(deleteLabel(labelId));

    const state = getState();

    const { tasks } = state.tasks;
    const { labels } = state.filters;

    // Remove the label from every task that has it
    tasks.forEach((task) => {
      if (task.labelIds.some((a) => a === labelId)) {
        dispatch(
          updateTask({
            id: task.id,
            updatedFields: {
              labelIds: task.labelIds.filter((a) => a !== labelId),
            },
          }),
        );
      }
    });

    // Update filters slice
    dispatch(setLabels(labels.filter((a) => a.value !== labelId)));
  };
