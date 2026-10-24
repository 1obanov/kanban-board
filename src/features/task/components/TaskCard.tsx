import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import type { AppDispatch, RootState } from "../../../store";
import type { Task } from "../../../types/board";
import { isDateExpired } from "../../../utils/dateUtils";
import { deleteTaskFromColumn } from "../../board/boardSlice";
import { deleteTask } from "../taskSlice";
import BoardTaskCard from "./BoardTaskCard";
import DeleteTaskDialog from "./DeleteTaskDialog";
import ListTaskCard from "./ListTaskCard";
import UpdateTaskDialog from "./UpdateTaskDialog";

type TaskCardProps = {
  task: Task;
};

/**
 * TaskCard component
 *
 * Displays a single task in either board or list view.
 * Handles task edit and delete actions.
 */
function TaskCard({ task }: TaskCardProps) {
  const prioritiesData = useSelector(
    (state: RootState) => state.board.prioritiesData,
  );
  const viewMode = useSelector((state: RootState) => state.board.viewMode);

  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  const dispatch = useDispatch<AppDispatch>();

  // Resolve priority config by id
  const priority = prioritiesData.list.find(
    (option) => option.id === task.priority,
  );

  if (!priority) {
    throw new Error(`Priority "${task.priority}" not found`);
  }

  const isExpired = isDateExpired(task.dueDate);

  // Remove task from store and column
  const handleDeleteTask = (): void => {
    dispatch(deleteTask(task.id));
    dispatch(deleteTaskFromColumn(task.id));
    setIsDeleteOpen(false);
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

export default TaskCard;
