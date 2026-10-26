import { EllipsisVertical } from "lucide-react";
import { forwardRef, type ReactNode } from "react";

type BoardColumnProps = {
  title: string;
  countTasks: number;
  children: ReactNode;
};

/**
 * BoardColumn component for Kanban board
 */
const BoardColumn = forwardRef<HTMLDivElement, BoardColumnProps>(
  ({ title, countTasks, children, ...props }, ref) => {
    return (
      <div className="column flex max-h-full flex-col overflow-auto rounded-lg bg-slate-100 p-3">
        <div className="column__top mb-3 flex items-center justify-between border-b-1 border-slate-300 pb-3">
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

        {/* Container for task cards, receives ref and droppableProps */}
        <div
          ref={ref}
          {...props}
          className="flex min-h-[80px] flex-col gap-2.5 overflow-auto"
        >
          {children}
        </div>
      </div>
    );
  },
);

BoardColumn.displayName = "BoardColumn";

export default BoardColumn;
