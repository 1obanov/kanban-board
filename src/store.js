import { configureStore } from "@reduxjs/toolkit";
import boardReducer from "./features/board/boardSlice";
import tasksReducer from "./features/task/taskSlice";
import filtersReducer from "./features/filters/filtersSlice";

const store = configureStore({
  reducer: {
    board: boardReducer,
    tasks: tasksReducer,
    filters: filtersReducer,
  },
});

export default store;