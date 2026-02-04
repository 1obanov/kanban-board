import { createSlice } from "@reduxjs/toolkit";
import boardData from "../../data/boardData.json";

/** Initial state for tasks */
const initialState = {
  tasks: boardData.tasks,
};

/** Slice to manage tasks: add, delete, update, and move */
const taskSlice = createSlice({
  name: "tasks",
  initialState,
  reducers: {
    /** Add a new task */
    addTask(state, action) {
      state.tasks.push(action.payload);
    },
    /** Delete a task by id */
    deleteTask(state, action) {
      const taskId = action.payload;
      state.tasks = state.tasks.filter((task) => task.id !== taskId);
    },
    /** Update a task by id with new fields */
    updateTask(state, action) {
      const { id, updatedFields } = action.payload;

      state.tasks = state.tasks.map((task) =>
        task.id === id ? { ...task, ...updatedFields } : task
      );
    },
    /** Move task to another column and reorder */
    moveTask(state, action) {
      const { taskId, destinationColumnId, destinationIndex } = action.payload;
      const task = state.tasks.find((t) => t.id === taskId);
      if (!task) return;

      task.columnId = destinationColumnId;
      task.order = destinationIndex;
    },
  },
});

export const { addTask, deleteTask, updateTask, moveTask } = taskSlice.actions;
export default taskSlice.reducer;
