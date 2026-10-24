import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

import type { AssigneeOption } from "../../data/assignees";
import type { LabelOption } from "../../data/labels";
import type { PriorityID } from "../../data/priorities";

export type FiltersState = {
  search: string;
  assignees: AssigneeOption[];
  labels: LabelOption[];
  priorities: PriorityID[];
};

/** Initial state for task filters */
const initialState: FiltersState = {
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
    setSearch: (state, action: PayloadAction<string>) => {
      state.search = action.payload;
    },

    /** Set selected assignees */
    setAssignees: (state, action: PayloadAction<AssigneeOption[]>) => {
      state.assignees = action.payload;
    },

    /** Set selected labels */
    setLabels: (state, action: PayloadAction<LabelOption[]>) => {
      state.labels = action.payload;
    },

    /** Set selected priorities */
    setPriorities: (state, action: PayloadAction<PriorityID[]>) => {
      state.priorities = action.payload;
    },
  },
});

export const { setSearch, setAssignees, setLabels, setPriorities } =
  filtersSlice.actions;
export default filtersSlice.reducer;
