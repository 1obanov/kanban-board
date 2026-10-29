import { createAction } from "@reduxjs/toolkit";

import type { Task } from "../../types/board";

export const updateTasksLocally = createAction<Task[]>(
  "tasks/updateTasksLocally",
);
