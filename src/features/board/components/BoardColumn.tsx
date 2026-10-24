import { EllipsisVertical } from "lucide-react";
import { forwardRef, type ReactNode } from "react";

type BoardColumn = {
  title: string;
  countTasks: number;
  children: ReactNode;
};

/**
 * BoardColumn component for Kanban board
 */
const BoardColumn = forwardRef<HTMLDivElement, BoardColumn>(
  ({ title, countTasks, children, ...props }, ref) => {
    return (
      <div className="column bg-slate-100 p-3 rounded-lg flex flex-col max-h-full overflow-auto">
        <div className="column__top pb-3 mb-3 border-b-1 border-slate-300 flex items-center justify-between">
          <h3 className="flex items-center gap-1 text-sm capitalize">
            {title}
            <span className="flex items-center justify-center w-5 h-5 text-xs rounded-[50%] bg-blue-100 text-blue-600">
              {countTasks}
            </span>
          </h3>
          <button className="cursor-pointer p-1">
            <EllipsisVertical size={14} />
          </button>
        </div>

        {/* Container for task cards, receives ref and droppableProps */}
        <div
          ref={ref}
          {...props}
          className="flex flex-col gap-2.5 min-h-[80px] overflow-auto"
        >
          {children}
        </div>
      </div>
    );
  },
);

BoardColumn.displayName = "BoardColumn";

export default BoardColumn;
