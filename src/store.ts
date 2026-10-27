import {
  configureStore,
  type ThunkAction,
  type UnknownAction,
} from "@reduxjs/toolkit";

import boardReducer from "./features/board/boardSlice";
import columnReducer from "./features/columns/columnsSlice";
import filtersReducer from "./features/filters/filtersSlice";
import tasksReducer from "./features/task/taskSlice";

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  UnknownAction
>;

const store = configureStore({
  reducer: {
    board: boardReducer,
    columns: columnReducer,
    tasks: tasksReducer,
    filters: filtersReducer,
  },
});

export default store;
