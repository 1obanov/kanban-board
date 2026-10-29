import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import type { AppDispatch, RootState } from "../../../store";
import type { Task } from "../../../types/board";
import { isDateExpired } from "../../../utils/dateUtils";
import { deleteTaskThunk } from "../tasksThunks";
import BoardTaskCard from "./BoardTaskCard";
import DeleteTaskDialog from "./DeleteTaskDialog";
import ListTaskCard from "./ListTaskCard";
import UpdateTaskDialog from "./UpdateTaskDialog";

type TaskCardProps = {
  task: Task;
};

/** TaskCard component */
export default function TaskCard({ task }: TaskCardProps) {
  const dispatch = useDispatch<AppDispatch>();

  const { availablePriorities, viewMode } = useSelector(
    (state: RootState) => state.board,
  );

  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  const priority = availablePriorities.find(
    (priority) => priority.id === task.priority_id,
  );

  if (!priority) {
    throw new Error(`Priority "${task.priority_id}" not found`);
  }

  const isExpired = isDateExpired(task.due_date);

  /** Handle deleting task */
  const handleDeleteTask = async (): Promise<void> => {
    try {
      await dispatch(deleteTaskThunk(task.id)).unwrap();

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
