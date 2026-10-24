import { Calendar, CalendarOff, SquarePen, Trash2 } from "lucide-react";
import { useSelector } from "react-redux";

import type { Priority } from "../../../data/priorities";
import type { RootState } from "../../../store";
import type { Task } from "../../../types/board";
import { formatDueDate } from "../../../utils/dateUtils";

type ListTaskCardProps = {
  task: Task;
  priority: Priority;
  isExpired: boolean;
  onEdit: () => void;
  onDelete: () => void;
};

function ListTaskCard({
  task,
  priority,
  isExpired,
  onEdit,
  onDelete,
}: ListTaskCardProps) {
  const labelsData = useSelector((state: RootState) => state.board.labelsData);

  return (
    <div className="group relative card bg-white border-1 rounded-lg border-slate-300 p-2 hover:cursor-grab">
      <div className="relative flex flex-col md:flex-row justify-between gap-3 md:gap-1">
        <div className="me-12">
          <div className="flex items-center gap-1.5">
            <div className="flex items-center gap-1">
              <span
                className="block w-2.5 h-2.5 rounded-[50%]"
                style={{ backgroundColor: priority.color }}
              />
            </div>
            <div className="card__title font-bold text-sm mb-0.5">
              {task.title}
            </div>
          </div>
          <div className="card__description text-xs text-gray-500 mb-3">
            {task.description}
          </div>
          <div>
            <span
              className={`date flex items-center gap-1 text-xs ${
                isExpired ? "text-red-400" : "text-gray-500"
              }`}
            >
              {!isExpired ? (
                <Calendar size={12} />
              ) : (
                <CalendarOff size={12} className="text-red-400" />
              )}
              {formatDueDate(task.dueDate)}
            </span>
          </div>
        </div>
        <div className="flex flex-col justify-between shrink-0">
          <div className="absolute top-0 right-0 md:relative flex items-center justify-end gap-1 transition-opacity duration-300 opacity-0 group-hover:opacity-100 pointer-coarse:opacity-100">
            <button
              className="w-5 h-5 flex items-center justify-center hover:bg-gray-100 rounded-md transition-colors duration-300 cursor-pointer"
              onClick={() => onEdit()}
            >
              <SquarePen size={14} />
            </button>
            <button
              className="w-5 h-5 flex items-center justify-center hover:bg-gray-100 rounded-md hover:text-red-500 transition-colors duration-300 cursor-pointer"
              onClick={() => onDelete()}
            >
              <Trash2 size={14} />
            </button>
          </div>
          <div className="flex items-start gap-2">
            <div className="card__labels flex items-center gap-1 flex-wrap">
              {task.labels.map((labelId) => {
                const labelOption = labelsData.list.find(
                  (label) => label.id === labelId,
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
                    <img src={assignee.avatar} alt={assignee.name} />
                  </span>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ListTaskCard;
