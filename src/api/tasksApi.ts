import { supabase } from "../lib/supabaseClient";
import type { Task } from "../types/board";

export const getTasks = async (): Promise<Task[]> => {
  const { data, error } = await supabase
    .from("tasks")
    .select("*")
    .order("created_at", { ascending: false })
    .order("position", { ascending: true });

  if (error) {
    throw new Error(`Failed to fetch tasks: ${error.message}`);
  }

  return data ?? [];
};

export const createTask = async (
  task: Omit<Task, "id" | "created_at">,
): Promise<Task> => {
  const { data, error } = await supabase
    .from("tasks")
    .insert(task)
    .select()
    .single();

  if (error) {
    throw new Error(`Failed to create task: ${error.message}`);
  }

  return data as Task;
};

export const updateTask = async (
  taskId: Task["id"],
  updatedFields: Partial<
    Omit<Task, "id" | "status" | "created_at" | "position">
  >,
): Promise<Task> => {
  const { data, error } = await supabase
    .from("tasks")
    .update(updatedFields)
    .eq("id", taskId)
    .select()
    .single();

  if (error) {
    throw new Error(`Failed to update task: ${error.message}`);
  }

  return data as Task;
};

export const deleteTask = async (taskId: Task["id"]): Promise<void> => {
  const { error } = await supabase.from("tasks").delete().eq("id", taskId);

  if (error) {
    throw new Error(`Failed to delete task: ${error.message}`);
  }
};

export const moveTaskInColumn = async (
  taskId: string,
  status: string,
  position: number,
): Promise<void> => {
  const { error } = await supabase
    .from("tasks")
    .update({ status, position })
    .eq("id", taskId);

  if (error) {
    throw new Error(`Failed to move task: ${error.message}`);
  }
};
