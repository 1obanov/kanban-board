import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

import type { LabelOption } from "../../types/label";
import type { PriorityID } from "../../types/priority";
import type { UserOption } from "../../types/user";

type FiltersState = {
  search: string;
  assignees: UserOption[];
  labels: LabelOption[];
  priorities: PriorityID[];
};

/** Initial state for filters slice */
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
    setAssignees: (state, action: PayloadAction<UserOption[]>) => {
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
