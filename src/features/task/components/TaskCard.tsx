import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import type { AppDispatch, RootState } from "../../../store";
import type { BoardColumn, Task } from "../../../types/board";
import { isDateExpired } from "../../../utils/dateUtils";
import { deleteTaskFromColumnThunk } from "../../columns/columnsThunks";
import { deleteTaskThunk } from "../tasksThunks";
import BoardTaskCard from "./BoardTaskCard";
import DeleteTaskDialog from "./DeleteTaskDialog";
import ListTaskCard from "./ListTaskCard";
import UpdateTaskDialog from "./UpdateTaskDialog";

type TaskCardProps = {
  task: Task;
  columnId: BoardColumn["id"];
};

/**
 * TaskCard component
 *
 * Displays a single task in either board or list view.
 * Handles task edit and delete actions.
 */
export default function TaskCard({ task, columnId }: TaskCardProps) {
  const dispatch = useDispatch<AppDispatch>();

  const { availablePriorities, viewMode } = useSelector(
    (state: RootState) => state.board,
  );

  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  // Resolve priority config by id
  const priority = availablePriorities.find(
    (priority) => priority.id === task.priorityId,
  );

  if (!priority) {
    throw new Error(`Priority "${task.priorityId}" not found`);
  }

  const isExpired = isDateExpired(task.dueDate);

  // Remove task from store and column
  const handleDeleteTask = async (): Promise<void> => {
    try {
      await dispatch(deleteTaskThunk(task.id)).unwrap();

      await dispatch(
        deleteTaskFromColumnThunk({
          taskId: task.id,
          columnId,
        }),
      ).unwrap();

      setIsDeleteOpen(false);
    } catch (error) {
      console.error("Failed to delete task:", error);
    }
  };

  return (
    <>
      {viewMode !== "list" ? (
        <BoardTaskCard
          task={task}
          priority={priority}
          isExpired={isExpired}
          onEdit={() => setIsEditOpen(true)}
          onDelete={() => setIsDeleteOpen(true)}
        />
      ) : (
        <ListTaskCard
          task={task}
          priority={priority}
          isExpired={isExpired}
          onEdit={() => setIsEditOpen(true)}
          onDelete={() => setIsDeleteOpen(true)}
        />
      )}
      <DeleteTaskDialog
        taskTitle={task.title}
        handleDeleteTask={handleDeleteTask}
        isDeleteOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
      />
      <UpdateTaskDialog
        task={task}
        isEditOpen={isEditOpen}
        onClose={() => setIsEditOpen(false)}
      />
    </>
  );
}
