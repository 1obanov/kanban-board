import { createAsyncThunk } from "@reduxjs/toolkit";

import { getColumns } from "../../api/columnsApi";
import { getLabels } from "../../api/labelsApi";
import { getPriorities } from "../../api/prioritiesApi";
import { getTasks } from "../../api/tasksApi";
import { getUsers } from "../../api/userApi";
import type { AppThunk } from "../../store";
import type { BoardColumn, Task } from "../../types/board";
import type { Label } from "../../types/label";
import type { Priority } from "../../types/priority";
import type { User } from "../../types/user";
import { setAssignees, setLabels } from "../filters/filtersSlice";
import { updateTaskThunk } from "../task/tasksThunks";
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
    const [columns, tasks, users, labels, priorities] = await Promise.all([
      getColumns(),
      getTasks(),
      getUsers(),
      getLabels(),
      getPriorities(),
    ]);

    return {
      columns,
      tasks,
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
  (userId: User["id"]): AppThunk<Promise<void>> =>
  async (dispatch, getState) => {
    const { tasks } = getState().tasks;
    const { assignees } = getState().filters;

    // Find tasks assigned to this user
    const affectedTasks = tasks.filter((task) =>
      task.assigneeIds.includes(userId),
    );

    // Update affected tasks one by one
    for (const task of affectedTasks) {
      const { id, ...updatedFields } = task;

      await dispatch(
        updateTaskThunk({
          id,
          updatedFields: {
            ...updatedFields,
            assigneeIds: task.assigneeIds.filter(
              (assigneeId) => assigneeId !== userId,
            ),
          },
        }),
      ).unwrap();
    }

    // Remove user from Redux only after all API requests succeed
    dispatch(deleteUser(userId));

    // Update filters
    dispatch(setAssignees(assignees.filter((a) => a.value !== userId)));
  };

/**
 * Remove a label from the board
 * - Deletes label from board state
 * - Removes the label from all tasks
 * - Updates filters state
 */
export const removeLabel =
  (labelId: Label["id"]): AppThunk<Promise<void>> =>
  async (dispatch, getState) => {
    const { tasks } = getState().tasks;
    const { labels } = getState().filters;

    // Find tasks assigned to this user
    const affectedTasks = tasks.filter((task) =>
      task.labelIds.includes(labelId),
    );

    // Update affected tasks one by one
    for (const task of affectedTasks) {
      const { id, ...updatedFields } = task;

      await dispatch(
        updateTaskThunk({
          id,
          updatedFields: {
            ...updatedFields,
            labelIds: task.labelIds.filter((a) => a !== labelId),
          },
        }),
      ).unwrap();
    }

    // Remove label from board slice
    dispatch(deleteLabel(labelId));

    // Update filters slice
    dispatch(setLabels(labels.filter((a) => a.value !== labelId)));
  };
