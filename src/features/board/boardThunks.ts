import { createAsyncThunk } from "@reduxjs/toolkit";

import { getColumns } from "../../api/columnsApi";
import { addLabel, deleteLabel, getLabels } from "../../api/labelsApi";
import { getPriorities } from "../../api/prioritiesApi";
import { getTasks } from "../../api/tasksApi";
import { addUser, deleteUser, getUsers } from "../../api/userApi";
import type { AppThunk } from "../../store";
import type { Column, Task } from "../../types/board";
import type { Label } from "../../types/label";
import type { Priority } from "../../types/priority";
import type { User } from "../../types/user";
import { setAssignees, setLabels } from "../filters/filtersSlice";
import { updateTaskThunk } from "../task/tasksThunks";

type BoardData = {
  columns: Column[];
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

export const addUserThunk = createAsyncThunk<User, Omit<User, "id">>(
  "board/addUser",
  async (user) => {
    return addUser(user);
  },
);

export const deleteUserThunk = createAsyncThunk<User["id"], User["id"]>(
  "board/deleteUser",
  async (userId) => {
    await deleteUser(userId);

    return userId;
  },
);

export const addLabelThunk = createAsyncThunk<Label, Omit<Label, "id">>(
  "board/addLabel",
  async (label) => {
    return addLabel(label);
  },
);

export const deleteLabelThunk = createAsyncThunk<Label["id"], Label["id"]>(
  "board/deleteLabel",
  async (labelId) => {
    await deleteLabel(labelId);

    return labelId;
  },
);

export const removeAssignee =
  (userId: User["id"]): AppThunk<Promise<void>> =>
  async (dispatch, getState) => {
    const { tasks } = getState().tasks;

    // Find tasks assigned to this user
    const affectedTasks = tasks.filter((task) =>
      task.assignee_ids.includes(userId),
    );

    // Update affected tasks one by one
    for (const task of affectedTasks) {
      const { id, ...updatedFields } = task;

      await dispatch(
        updateTaskThunk({
          taskId: id,
          updatedFields: {
            ...updatedFields,
            assignee_ids: task.assignee_ids.filter(
              (assigneeId) => assigneeId !== userId,
            ),
          },
        }),
      ).unwrap();
    }

    await dispatch(deleteUserThunk(userId)).unwrap();

    const { assignees } = getState().filters;

    // Update filters
    dispatch(setAssignees(assignees.filter((a) => a.value !== userId)));
  };

export const removeLabel =
  (labelId: Label["id"]): AppThunk<Promise<void>> =>
  async (dispatch, getState) => {
    const { tasks } = getState().tasks;

    // Find tasks assigned to this user
    const affectedTasks = tasks.filter((task) =>
      task.label_ids.includes(labelId),
    );

    // Update affected tasks one by one
    for (const task of affectedTasks) {
      const { id, ...updatedFields } = task;

      await dispatch(
        updateTaskThunk({
          taskId: id,
          updatedFields: {
            ...updatedFields,
            label_ids: task.label_ids.filter((a) => a !== labelId),
          },
        }),
      ).unwrap();
    }

    await dispatch(deleteLabelThunk(labelId)).unwrap();

    const { labels } = getState().filters;

    // Update filters
    dispatch(setLabels(labels.filter((a) => a.value !== labelId)));
  };
