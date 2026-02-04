import { createSelector } from "@reduxjs/toolkit";

export const selectTasks = (state) => state.tasks.tasks;
export const selectFilters = (state) => state.filters;

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
    return tasks.filter((task) => {
      // Filter by assignees
      if (
        filters.assignees.length > 0 &&
        !task.assignees.some((assignee) =>
          filters.assignees.some(
            (filteredAssignee) => filteredAssignee.value === assignee.id
          )
        )
      ) {
        return false;
      }

      // Filter by labels
      if (
        filters.labels.length > 0 &&
        !task.labels.some((label) =>
          filters.labels.some((filteredLabel) => filteredLabel.value === label)
        )
      ) {
        return false;
      }

      // Filter by priority
      if (
        filters.priorities.length > 0 &&
        !filters.priorities.some((f) => f.value === task.priority)
      ) {
        return false;
      }

      // Filter by search query
      if (
        filters.search &&
        !task.title.toLowerCase().includes(filters.search.toLowerCase()) &&
        !task.description.toLowerCase().includes(filters.search.toLowerCase())
      ) {
        return false;
      }
      return true;
    });
  }
);
