import {
  DragDropContext,
  Draggable,
  Droppable,
  type DropResult,
} from "@hello-pangea/dnd";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import type { AppDispatch, RootState } from "../../../store";
import type { Column } from "../../../types/board";
import TaskCard from "../../task/components/TaskCard";
import { selectFilteredTasks } from "../../task/taskSelectors";
import { moveTaskInColumnThunk } from "../../task/tasksThunks";
import BoardView from "./BoardView";
import ListView from "./ListView";
import UpdateColumnNameDialog from "./UpdateColumnNameDialog";

/**  Board component */
export default function Board() {
  const dispatch = useDispatch<AppDispatch>();

  const { viewMode } = useSelector((state: RootState) => state.board);
  const { columns } = useSelector((state: RootState) => state.columns);

  const tasks = useSelector(selectFilteredTasks);

  const [editingColumn, setEditingColumn] = useState<Column | null>(null);

  /** Handle moving task between columns or reordering within a column */
  const handleDragEnd = async (result: DropResult): Promise<void> => {
    const { source, destination, draggableId } = result;

    if (!destination) return;

    if (
      source.droppableId === destination.droppableId &&
      source.index === destination.index
    ) {
      return;
    }

    try {
      await dispatch(
        moveTaskInColumnThunk({
          taskId: draggableId,
          sourceColumnId: source.droppableId,
          destinationColumnId: destination.droppableId,
          destinationIndex: destination.index,
        }),
      ).unwrap();
    } catch (error) {
      console.error("Failed to move task:", error);
    }
  };

  const getColumnTasks = (columnId: string) =>
    tasks
      .filter((task) => task.status === columnId)
      .sort((a, b) => a.position - b.position);

  return (
    <>
      <DragDropContext onDragEnd={handleDragEnd}>
        <div className="h-full overflow-hidden p-3">
          {viewMode === "board" ? (
            <div className="grid h-full auto-cols-[minmax(280px,1fr)] grid-flow-col gap-2.5 overflow-x-auto">
              {columns.map((column) => {
                const columnTasks = getColumnTasks(column.id);

                return (
                  <Droppable key={column.id} droppableId={column.id}>
                    {(provided) => (
                      <BoardView
                        title={column.title}
                        countTasks={columnTasks.length}
                        onEdit={() => setEditingColumn(column)}
                        ref={provided.innerRef}
                        {...provided.droppableProps}
                      >
                        {columnTasks.map((task, index) => (
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
                      </BoardView>
                    )}
                  </Droppable>
                );
              })}
            </div>
          ) : (
            <div className="flex h-full flex-col gap-4 overflow-y-auto">
              {columns.map((column) => {
                const columnTasks = getColumnTasks(column.id);

                return (
                  <ListView
                    key={column.id}
                    title={column.title}
                    countTasks={columnTasks.length}
                    onEdit={() => setEditingColumn(column)}
                  >
                    <Droppable droppableId={column.id}>
                      {(provided) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.droppableProps}
                          className="flex min-h-[40px] flex-col gap-2.5"
                        >
                          {columnTasks.map((task, index) => (
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
