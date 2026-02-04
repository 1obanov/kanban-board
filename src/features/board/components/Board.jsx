import { useSelector, useDispatch } from "react-redux";
import Column from "./Column";
import TaskCard from "../../task/components/TaskCard";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { moveTask } from "../../task/taskSlice";
import { moveTaskInColumn } from "../boardSlice";
import { selectFilteredTasks } from "../../task/taskSelectors";
import { EllipsisVertical } from "lucide-react";

/**
 * Kanban Board component
 * - Supports drag & drop between columns
 * - Renders in board or list view based on state
 */
function Board() {
  const columns = useSelector((state) => state.board.columns);
  const viewMode = useSelector((state) => state.board.viewMode);
  const tasks = useSelector(selectFilteredTasks);
  const dispatch = useDispatch();

  /** Handle drag & drop end */
  const handleDragEnd = (result) => {
    const { source, destination, draggableId } = result;
    if (!destination) return;

    // Update task's column in taskSlice
    dispatch(
      moveTask({
        taskId: draggableId,
        destinationColumnId: destination.droppableId,
        destinationIndex: destination.index,
      })
    );

    // Update taskIds array in boardSlice
    dispatch(
      moveTaskInColumn({
        taskId: draggableId,
        sourceColumnId: source.droppableId,
        destinationColumnId: destination.droppableId,
        destinationIndex: destination.index,
      })
    );
  };

  /** Utility: get task object by ID considering filters */
  const getTaskById = (id) => tasks.find((t) => t.id === id);

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <div className="p-3 h-full overflow-hidden">
        {viewMode === "board" ? (
          // Grid view
          <div className="grid auto-cols-[minmax(280px,1fr)] grid-flow-col gap-2.5 h-full overflow-x-auto">
            {columns.map((column) => (
              <Droppable key={column.id} droppableId={column.id}>
                {(provided) => (
                  <Column
                    title={column.title}
                    countTasks={column.taskIds.length}
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                  >
                    {column.taskIds.map((taskId, index) => {
                      const task = getTaskById(taskId);
                      if (!task) return null;
                      return (
                        <Draggable
                          key={task.id}
                          draggableId={task.id}
                          index={index}
                        >
                          {(provided) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                            >
                              <TaskCard task={task} />
                            </div>
                          )}
                        </Draggable>
                      );
                    })}
                    {provided.placeholder}
                  </Column>
                )}
              </Droppable>
            ))}
          </div>
        ) : (
          // List view
          <div className="h-full flex flex-col gap-4 overflow-y-auto">
            {columns.map((column) => {
              // Only show tasks that pass filters
              const colTasks = column.taskIds.map(getTaskById).filter(Boolean);

              return (
                <div key={column.id} className="bg-slate-100 p-3 rounded-lg">
                  <div className="pb-3 mb-3 border-b border-slate-300 flex items-center justify-between">
                    <h3 className="flex items-center gap-1 text-sm capitalize">
                      {column.title}
                      <span className="flex items-center justify-center w-5 h-5 text-xs rounded-[50%] bg-blue-100 text-blue-600">
                        {colTasks.length}
                      </span>
                    </h3>
                    <button className="cursor-pointer p-1">
                      <EllipsisVertical size={14} />
                    </button>
                  </div>

                  <Droppable droppableId={column.id}>
                    {(provided) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.droppableProps}
                        className="flex flex-col gap-2.5 min-h-[40px]"
                      >
                        {colTasks.map((task, index) => (
                          <Draggable
                            key={task.id}
                            draggableId={task.id}
                            index={index}
                          >
                            {(provided) => (
                              <div
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                {...provided.dragHandleProps}
                              >
                                <TaskCard task={task} viewMode={viewMode} />
                              </div>
                            )}
                          </Draggable>
                        ))}
                        {provided.placeholder}
                      </div>
                    )}
                  </Droppable>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </DragDropContext>
  );
}

export default Board;
