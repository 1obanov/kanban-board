import type { ChangeColumnName } from "../features/columns/columnsThunks";
import { supabase } from "../lib/supabaseClient";
import type { Column } from "../types/board";

export const getColumns = async (): Promise<Column[]> => {
  const { data, error } = await supabase
    .from("columns")
    .select("*")
    .order("position", { ascending: true });

  if (error) {
    throw new Error(`Failed to fetch columns: ${error.message}`);
  }

  return data ?? [];
};

export const changeColumnName = async ({
  id,
  newColumnId,
  title,
}: ChangeColumnName): Promise<Column> => {
  const { data, error } = await supabase
    .from("columns")
    .update({ title, id: newColumnId })
    .eq("id", id)
    .select()
    .single();

  if (error) {
    throw new Error(`Failed to update column name: ${error.message}`);
  }

  return data as Column;
};
