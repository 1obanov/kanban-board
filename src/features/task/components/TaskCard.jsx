import { useState } from "react";
import { Calendar, SquarePen, Trash2 } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { deleteTaskFromColumn } from "../../board/boardSlice";
import { deleteTask } from "../taskSlice";
import UpdateTaskDialog from "./UpdateTaskDialog";
import DeleteTaskDialog from "./DeleteTaskDialog";

/**
 * TaskCard component
 *
 * Displays a single task in either board or list view.
 * Handles task edit and delete actions.
 */
function TaskCard({ task, viewMode }) {
  const labelsData = useSelector((state) => state.board.labelsData);
  const prioritiesData = useSelector((state) => state.board.prioritiesData);

  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  const dispatch = useDispatch();

  // Resolve priority config by id
  const priority = prioritiesData.list.find(
    (option) => option.id === task.priority
  );

  // Remove task from store and column
  const handleDeleteTask = () => {
    dispatch(deleteTask(task.id));
    dispatch(deleteTaskFromColumn(task.id));
    setIsDeleteOpen(false);
  };

  return (
    <>
      {viewMode !== "list" ? (
        <div className="group relative card bg-white border-1 rounded-lg border-slate-300 p-2 hover:cursor-grab">
          <div className="card__priority mb-3">
            <div className="flex items-center justify-between gap-1">
              <div className="flex items-center gap-1">
                <span
                  className="block w-2.5 h-2.5 rounded-[50%]"
                  style={{ backgroundColor: priority.color }}
                ></span>
                <span className="capitalize text-xs">{task.priority}</span>
              </div>
              <div className="absolute top-0 right-0 md:relative flex items-center gap-1 transition-opacity duration-300 opacity-0 group-hover:opacity-100 pointer-coarse:opacity-100">
                <button
                  className="w-5 h-5 flex items-center justify-center hover:bg-gray-100 rounded-md transition-colors duration-300 cursor-pointer"
                  onClick={() => setIsEditOpen(true)}
                >
                  <SquarePen size={14} />
                </button>
                <button
                  className="w-5 h-5 flex items-center justify-center hover:bg-gray-100 rounded-md hover:text-red-500 transition-colors duration-300 cursor-pointer"
                  onClick={() => setIsDeleteOpen(true)}
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          </div>
          <div className="card__title font-bold text-sm mb-0.5">
            {task.title}
          </div>
          <div className="card__description text-xs text-gray-500 mb-3">
            {task.description}
          </div>
          <div className="card__labels flex items-center gap-1 flex-wrap mb-3">
            {task.labels &&
              task.labels.map((labelId) => {
                const labelOption = labelsData.list.find(
                  (label) => label.id === labelId
                );
                if (!labelOption) return null;

                return (
                  <span
                    key={labelId}
                    className="block capitalize text-[10px] py-0.5 px-2 rounded-lg max-w-max"
                    style={{
                      backgroundColor: `${labelOption.color}20`,
                      color: labelOption.color,
                    }}
                  >
                    {labelOption.name}
                  </span>
                );
              })}
          </div>
          <div className="flex items-center justify-between gap-1">
            {task.dueDate && (
              <span className="date flex items-center gap-1 text-xs text-gray-500">
                <Calendar size={12} />
                {new Date(task.dueDate).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                })}
              </span>
            )}
            <div className="assignees flex -space-x-1 items-center ms-auto">
              {task.assignees.map((assignee) => {
                return (
                  <span
                    key={assignee.id}
                    className="flex items-center justify-center w-5 h-5 rounded-[50%] border-2 border-white overflow-hidden"
                  >
                    <img src={assignee.avatar} alt={assignee.name}></img>
                  </span>
                );
              })}
            </div>
          </div>
        </div>
      ) : (
        <div className="group relative card bg-white border-1 rounded-lg border-slate-300 p-2 hover:cursor-grab">
          <div className="relative flex flex-col md:flex-row justify-between gap-3 md:gap-1">
            <div className="me-12">
              <div className="flex items-center gap-1.5">
                <div className="flex items-center gap-1">
                  <span
                    className="block w-2.5 h-2.5 rounded-[50%]"
                    style={{ backgroundColor: priority.color }}
                  ></span>
                </div>
                <div className="card__title font-bold text-sm mb-0.5">
                  {task.title}
                </div>
              </div>
              <div className="card__description text-xs text-gray-500 mb-3">
                {task.description}
              </div>
              <div>
                {task.dueDate && (
                  <span className="date flex items-center gap-1 text-xs text-gray-500">
                    <Calendar size={12} />
                    {new Date(task.dueDate).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </span>
                )}
              </div>
            </div>
            <div className="flex flex-col justify-between shrink-0">
              <div className="absolute top-0 right-0 md:relative flex items-center justify-end gap-1 transition-opacity duration-300 opacity-0 group-hover:opacity-100 pointer-coarse:opacity-100">
                <button
                  className="w-5 h-5 flex items-center justify-center hover:bg-gray-100 rounded-md transition-colors duration-300 cursor-pointer"
                  onClick={() => setIsEditOpen(true)}
                >
                  <SquarePen size={14} />
                </button>
                <button
                  className="w-5 h-5 flex items-center justify-center hover:bg-gray-100 rounded-md hover:text-red-500 transition-colors duration-300 cursor-pointer"
                  onClick={() => setIsDeleteOpen(true)}
                >
                  <Trash2 size={14} />
                </button>
              </div>
              <div className="flex items-start gap-2">
                <div className="card__labels flex items-center gap-1 flex-wrap">
                  {task.labels &&
                    task.labels.map((labelId) => {
                      const labelOption = labelsData.list.find(
                        (label) => label.id === labelId
                      );
                      if (!labelOption) return null;

                      return (
                        <span
                          key={labelId}
                          className="block capitalize text-[10px] py-0.5 px-2 rounded-lg max-w-max"
                          style={{
                            backgroundColor: `${labelOption.color}20`,
                            color: labelOption.color,
                          }}
                        >
                          {labelOption.name}
                        </span>
                      );
                    })}
                </div>
                <div className="assignees flex -space-x-1 items-center ms-auto">
                  {task.assignees.map((assignee) => {
                    return (
                      <span
                        key={assignee.id}
                        className="flex items-center justify-center w-5 h-5 rounded-[50%] border-2 border-white overflow-hidden"
                      >
                        <img src={assignee.avatar} alt={assignee.name}></img>
                      </span>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
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
