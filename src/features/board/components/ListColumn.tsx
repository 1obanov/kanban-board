import { EllipsisVertical } from "lucide-react";
import { type ReactNode } from "react";

type ListColumnProps = {
  title: string;
  countTasks: number;
  children: ReactNode;
};

/**
 * ListColumn component for Kanban board
 */
export default function ListColumn({
  title,
  countTasks,
  children,
}: ListColumnProps) {
  return (
    <div className="rounded-lg bg-slate-100 p-3">
      <div className="mb-3 flex items-center justify-between border-b border-slate-300 pb-3">
        <h3 className="flex items-center gap-1 text-sm capitalize">
          {title}
          <span className="flex h-5 w-5 items-center justify-center rounded-[50%] bg-blue-100 text-xs text-blue-600">
            {countTasks}
          </span>
        </h3>

        <button type="button" className="cursor-pointer p-1">
          <EllipsisVertical size={14} />
        </button>
      </div>

      {children}
    </div>
  );
}
