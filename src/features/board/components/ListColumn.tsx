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
function ListColumn({ title, countTasks, children }: ListColumnProps) {
  return (
    <div className="bg-slate-100 p-3 rounded-lg">
      <div className="pb-3 mb-3 border-b border-slate-300 flex items-center justify-between">
        <h3 className="flex items-center gap-1 text-sm capitalize">
          {title}
          <span className="flex items-center justify-center w-5 h-5 text-xs rounded-[50%] bg-blue-100 text-blue-600">
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

export default ListColumn;
