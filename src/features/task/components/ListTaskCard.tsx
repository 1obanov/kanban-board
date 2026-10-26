import { Calendar, CalendarOff, SquarePen, Trash2 } from "lucide-react";
import { useSelector } from "react-redux";

import type { RootState } from "../../../store";
import type { Task } from "../../../types/board";
import type { Priority } from "../../../types/priority";
import { formatDueDate } from "../../../utils/dateUtils";

type ListTaskCardProps = {
  task: Task;
  priority: Priority;
  isExpired: boolean;
  onEdit: () => void;
  onDelete: () => void;
};

export default function ListTaskCard({
  task,
  priority,
  isExpired,
  onEdit,
  onDelete,
}: ListTaskCardProps) {
  const { users, availableLabels } = useSelector(
    (state: RootState) => state.board,
  );

  return (
    <div className="group card relative cursor-grab rounded-lg border-1 border-slate-300 bg-white p-2 active:cursor-grabbing">
      <div className="relative flex flex-col justify-between gap-3 md:flex-row md:gap-1">
        <div className="me-12">
          <div className="flex items-center gap-1.5">
            <div className="flex items-center gap-1">
              <span
                className="block h-2.5 w-2.5 rounded-[50%]"
                style={{ backgroundColor: priority.color }}
              />
            </div>
            <div className="card__title mb-0.5 text-sm font-bold">
              {task.title}
            </div>
          </div>
          <div className="card__description mb-3 text-xs text-gray-500">
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
        <div className="flex shrink-0 flex-col justify-between">
          <div className="absolute top-0 right-0 flex items-center justify-end gap-1 opacity-0 transition-opacity duration-300 group-hover:opacity-100 md:relative pointer-coarse:opacity-100">
            <button
              type="button"
              className="flex h-5 w-5 cursor-pointer items-center justify-center rounded-md transition-colors duration-300 hover:bg-gray-100"
              onClick={() => onEdit()}
            >
              <SquarePen size={14} />
            </button>
            <button
              type="button"
              className="flex h-5 w-5 cursor-pointer items-center justify-center rounded-md transition-colors duration-300 hover:bg-gray-100 hover:text-red-500"
              onClick={() => onDelete()}
            >
              <Trash2 size={14} />
            </button>
          </div>
          <div className="flex items-start gap-2">
            <div className="card__labels flex flex-wrap items-center gap-1">
              {task.labelIds.map((labelId) => {
                const labelOption = availableLabels.find(
                  (label) => label.id === labelId,
                );
                if (!labelOption) return null;

                return (
                  <span
                    key={labelId}
                    className="block max-w-max rounded-lg px-2 py-0.5 text-[10px] capitalize"
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
            <div className="assignees ms-auto flex items-center -space-x-1">
              {task.assigneeIds.map((assigneeId) => {
                const user = users.find((user) => user.id === assigneeId);
                if (!user) return null;

                return (
                  <span
                    key={user.id}
                    className="flex h-5 w-5 items-center justify-center overflow-hidden rounded-[50%] border-2 border-white"
                  >
                    <img src={user.avatar} alt={user.name} />
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
