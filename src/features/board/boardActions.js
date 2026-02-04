import { setAssignees, setLabels } from "../filters/filtersSlice";
import { updateTask } from "../task/taskSlice";
import { deleteAssignee, deleteLabel } from "./boardSlice";

/**
 * Remove an assignee from the board
 * - Deletes assignee from board state
 * - Removes the assignee from all tasks
 * - Updates filters state
 */
export const removeAssignee = (userId) => (dispatch, getState) => {
  // Remove assignee from board slice
  dispatch(deleteAssignee(userId));

  const { tasks } = getState().tasks;
  const { assignees } = getState().filters;

  // Remove the assignee from every task that has it
  tasks.forEach((task) => {
    if (task.assignees.some((a) => a.id === userId)) {
      dispatch(
        updateTask({
          id: task.id,
          updatedFields: {
            assignees: task.assignees.filter((a) => a.id !== userId),
          },
        })
      );
    }
  });

  // Update filters slice
  dispatch(setAssignees(assignees.filter((a) => a.value !== userId)));
};

/**
 * Remove a label from the board
 * - Deletes label from board state
 * - Removes the label from all tasks
 * - Updates filters state
 */
export const removeLabel = (labelId) => (dispatch, getState) => {
  // Remove label from board slice
  dispatch(deleteLabel(labelId));

  const { tasks } = getState().tasks;
  const { labels } = getState().filters;

  // Remove the label from every task that has it
  tasks.forEach((task) => {
    if (task.labels.some((a) => a === labelId)) {
      dispatch(
        updateTask({
          id: task.id,
          updatedFields: {
            labels: task.labels.filter((a) => a !== labelId),
          },
        })
      );
    }
  });

  // Update filters slice
  dispatch(setLabels(labels.filter((a) => a.value !== labelId)));
};
