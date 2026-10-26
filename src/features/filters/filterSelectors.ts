import { createSelector } from "@reduxjs/toolkit";

import type { RootState } from "../../store";
import type { LabelOption } from "../../types/label";
import type { PriorityOption } from "../../types/priority";
import type { UserOption } from "../../types/user";

export const selectUserOptions = createSelector(
  [(state: RootState) => state.board.users],
  (users): UserOption[] =>
    users.map(({ id, name }) => ({
      value: id,
      label: name,
    })),
);

export const selectLabelsOptions = createSelector(
  [(state: RootState) => state.board.availableLabels],
  (label): LabelOption[] =>
    label.map(({ id, name, color }) => ({
      value: id,
      label: name,
      color,
    })),
);

export const selectPrioritiesOptions = createSelector(
  [(state: RootState) => state.board.availablePriorities],
  (priority): PriorityOption[] =>
    priority.map(({ id, name, color }) => ({
      value: id,
      label: name,
      color,
    })),
);
