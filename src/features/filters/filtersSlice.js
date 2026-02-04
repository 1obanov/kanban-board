import { createSlice } from "@reduxjs/toolkit";

/** Initial state for task filters */
const initialState = {
  search: "",
  assignees: [],
  labels: [],
  priorities: [],
};

/** Slice to manage filters for tasks */
const filtersSlice = createSlice({
  name: "filters",
  initialState,
  reducers: {
    /** Set the search query */
    setSearch: (state, action) => {
      state.search = action.payload;
    },
    /** Set selected assignees */
    setAssignees: (state, action) => {
      state.assignees = action.payload;
    },
    /** Set selected labels */
    setLabels: (state, action) => {
      state.labels = action.payload;
    },
    /** Set selected priorities */
    setPriorities: (state, action) => {
      state.priorities = action.payload;
    },
  },
});

export const { setSearch, setAssignees, setLabels, setPriorities } = filtersSlice.actions;
export default filtersSlice.reducer;