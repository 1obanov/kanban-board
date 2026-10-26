import {
  DragDropContext,
  Draggable,
  Droppable,
  type DropResult,
} from "@hello-pangea/dnd";
import { useDispatch, useSelector } from "react-redux";

import type { AppDispatch, RootState } from "../../../store";
import TaskCard from "../../task/components/TaskCard";
import { selectFilteredTasks } from "../../task/taskSelectors";
import { moveTaskInColumn } from "../boardSlice";
import BoardColumn from "./BoardColumn";
import ListColumn from "./ListColumn";

/**
 * Kanban Board component
 * - Supports drag & drop between columns
 * - Renders in board or list view based on state
 */
export default function Board() {
  const dispatch = useDispatch<AppDispatch>();

  const { columns, viewMode } = useSelector((state: RootState) => state.board);

  const tasks = useSelector(selectFilteredTasks);

  /** Handle drag & drop end */
  const handleDragEnd = (result: DropResult) => {
    const { source, destination, draggableId } = result;

    if (!destination) return;

    // Update taskIds array in boardSlice
    dispatch(
      moveTaskInColumn({
        taskId: draggableId,
        sourceColumnId: source.droppableId,
        destinationColumnId: destination.droppableId,
        destinationIndex: destination.index,
      }),
    );
  };

  /** Utility: get task object by ID considering filters */
  const getTaskById = (id: string) => tasks.find((t) => t.id === id);

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <div className="h-full overflow-hidden p-3">
        {viewMode === "board" ? (
          // Grid view
          <div className="grid h-full auto-cols-[minmax(280px,1fr)] grid-flow-col gap-2.5 overflow-x-auto">
            {columns.map((column) => (
              <Droppable key={column.id} droppableId={column.id}>
                {(provided) => (
                  <BoardColumn
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
                  </BoardColumn>
                )}
              </Droppable>
            ))}
          </div>
        ) : (
          // List view
          <div className="flex h-full flex-col gap-4 overflow-y-auto">
            {columns.map((column) => {
              // Only show tasks that pass filters
              const colTasks = column.taskIds
                .map(getTaskById)
                .filter((task) => task !== undefined);

              return (
                <ListColumn
                  key={column.id}
                  title={column.title}
                  countTasks={colTasks.length}
                >
                  <Droppable droppableId={column.id}>
                    {(provided) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.droppableProps}
                        className="flex min-h-[40px] flex-col gap-2.5"
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
                                <TaskCard task={task} />
                              </div>
                            )}
                          </Draggable>
                        ))}
                        {provided.placeholder}
                      </div>
                    )}
                  </Droppable>
                </ListColumn>
              );
            })}
          </div>
        )}
      </div>
    </DragDropContext>
  );
}
