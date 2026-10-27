import {
  DragDropContext,
  Draggable,
  Droppable,
  type DropResult,
} from "@hello-pangea/dnd";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import type { AppDispatch, RootState } from "../../../store";
import type { BoardColumn } from "../../../types/board";
import { moveTaskInColumn } from "../../columns/columnsSlice";
import { moveTaskInColumnThunk } from "../../columns/columnsThunks";
import TaskCard from "../../task/components/TaskCard";
import { selectFilteredTasks } from "../../task/taskSelectors";
import BoardView from "./BoardView";
import ListView from "./ListView";
import UpdateColumnNameDialog from "./UpdateColumnNameDialog";

/**
 * Kanban Board component
 * - Supports drag & drop between columns
 * - Renders in board or list view based on state
 */
export default function Board() {
  const dispatch = useDispatch<AppDispatch>();

  const { viewMode } = useSelector((state: RootState) => state.board);
  const { columns } = useSelector((state: RootState) => state.columns);

  const tasks = useSelector(selectFilteredTasks);

  const [editingColumn, setEditingColumn] = useState<BoardColumn | null>(null);

  /** Handle drag & drop end */
  const handleDragEnd = (result: DropResult) => {
    const { source, destination, draggableId } = result;

    if (!destination) return;

    if (
      source.droppableId === destination.droppableId &&
      source.index === destination.index
    ) {
      return;
    }

    const payload = {
      taskId: draggableId,
      sourceColumnId: source.droppableId,
      destinationColumnId: destination.droppableId,
      destinationIndex: destination.index,
    };

    // Optimistic update: immediately update Redux
    dispatch(moveTaskInColumn(payload));

    // Persist changes to MockAPI
    dispatch(moveTaskInColumnThunk(payload));
  };

  /** Utility: get task object by ID considering filters */
  const getTaskById = (id: string) => tasks.find((t) => t.id === id);

  return (
    <>
      <DragDropContext onDragEnd={handleDragEnd}>
        <div className="h-full overflow-hidden p-3">
          {viewMode === "board" ? (
            // Board view
            <div className="grid h-full auto-cols-[minmax(280px,1fr)] grid-flow-col gap-2.5 overflow-x-auto">
              {columns.map((column) => (
                <Droppable key={column.id} droppableId={column.id}>
                  {(provided) => (
                    <BoardView
                      title={column.title}
                      countTasks={column.taskIds.length}
                      onEdit={() => setEditingColumn(column)}
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
                                <TaskCard task={task} columnId={column.id} />
                              </div>
                            )}
                          </Draggable>
                        );
                      })}
                      {provided.placeholder}
                    </BoardView>
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
                  <ListView
                    key={column.id}
                    title={column.title}
                    countTasks={colTasks.length}
                    onEdit={() => setEditingColumn(column)}
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
                                  <TaskCard task={task} columnId={column.id} />
                                </div>
                              )}
                            </Draggable>
                          ))}
                          {provided.placeholder}
                        </div>
                      )}
                    </Droppable>
                  </ListView>
                );
              })}
            </div>
          )}
        </div>
      </DragDropContext>

      {editingColumn && (
        <UpdateColumnNameDialog
          columnId={editingColumn.id}
          columnTitle={editingColumn.title}
          isEditOpen={Boolean(editingColumn)}
          onClose={() => setEditingColumn(null)}
        />
      )}
    </>
  );
}
