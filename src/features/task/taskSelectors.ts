import { createSelector } from "@reduxjs/toolkit";

import type { RootState } from "../../store";

export const selectTasks = (state: RootState) => state.tasks.tasks;
export const selectFilters = (state: RootState) => state.filters;

/**
 * Memoized selector that returns a list of tasks filtered by:
 * - assignees
 * - labels
 * - priorities
 * - search query (title + description)
 */
export const selectFilteredTasks = createSelector(
  [selectTasks, selectFilters],
  (tasks, filters) => {
    const searchQuery = filters.search.toLowerCase();

    return tasks.filter((task) => {
      // Filter by assignees
      if (
        filters.assignees.length > 0 &&
        !task.assigneeIds.some((assigneeId) =>
          filters.assignees.some(
            (filteredAssignee) => filteredAssignee.value === assigneeId,
          ),
        )
      ) {
        return false;
      }

      // Filter by labels
      if (
        filters.labels.length > 0 &&
        !task.labelIds.some((labelId) =>
          filters.labels.some(
            (filteredLabel) => filteredLabel.value === labelId,
          ),
        )
      ) {
        return false;
      }

      // Filter by priority
      if (
        filters.priorities.length > 0 &&
        !filters.priorities.includes(task.priorityId)
      ) {
        return false;
      }

      // Filter by search query
      if (
        filters.search &&
        !task.title.toLowerCase().includes(searchQuery) &&
        !task.description.toLowerCase().includes(searchQuery)
      ) {
        return false;
      }
      return true;
    });
  },
);
