import type {
  AddTaskToColumn,
  ChangeColumnName,
  DeleteTaskFromColumn,
} from "../features/columns/columnsThunks";
import type { BoardColumn } from "../types/board";

const API_URL = import.meta.env.VITE_API_URL;

export const getColumns = async (): Promise<BoardColumn[]> => {
  const response = await fetch(`${API_URL}/columns`);

  if (!response.ok) {
    throw new Error("Failed to fetch columns");
  }

  return response.json();
};

export const addTaskToColumn = async ({
  taskId,
  columnId,
}: AddTaskToColumn): Promise<BoardColumn> => {
  const columns = await getColumns();

  const column = columns.find((column) => column.id === columnId);

  if (!column) {
    throw new Error("Column not found");
  }

  const response = await fetch(`${API_URL}/columns/${columnId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      ...column,
      taskIds: [...column.taskIds, taskId],
    }),
  });

  if (!response.ok) {
    throw new Error("Failed to add task to the column");
  }

  return response.json();
};

export const changeColumnName = async ({
  id,
  title,
}: ChangeColumnName): Promise<BoardColumn> => {
  const columns = await getColumns();

  const column = columns.find((column) => column.id === id);

  if (!column) {
    throw new Error("Column not found");
  }

  const response = await fetch(`${API_URL}/columns/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      ...column,
      title: title,
    }),
  });

  if (!response.ok) {
    throw new Error("Failed to change the column name");
  }

  return response.json();
};

export const deleteTaskFromColumn = async ({
  taskId,
  columnId,
}: DeleteTaskFromColumn): Promise<BoardColumn> => {
  const columns = await getColumns();

  const column = columns.find((column) => column.id === columnId);

  if (!column) {
    throw new Error("Column not found");
  }

  const response = await fetch(`${API_URL}/columns/${columnId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      ...column,
      taskIds: column.taskIds.filter((id) => id !== taskId),
    }),
  });

  if (!response.ok) {
    throw new Error("Failed to delete task from the column");
  }

  return response.json();
};

export const moveTaskInColumnApi = async (
  column: BoardColumn,
): Promise<BoardColumn> => {
  const response = await fetch(`${API_URL}/columns/${column.id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(column),
  });

  if (!response.ok) {
    throw new Error(`Failed to update column: ${response.status}`);
  }

  return response.json();
};
