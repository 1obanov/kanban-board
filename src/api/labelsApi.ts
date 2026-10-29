import { supabase } from "../lib/supabaseClient";
import type { Label } from "../types/label";

export const getLabels = async (): Promise<Label[]> => {
  const { data, error } = await supabase.from("labels").select("*");

  if (error) {
    throw new Error(`Failed to fetch labels: ${error.message}`);
  }

  return data ?? [];
};

export const addLabel = async (label: Omit<Label, "id">): Promise<Label> => {
  const { data, error } = await supabase
    .from("labels")
    .insert(label)
    .select()
    .single();

  if (error) {
    throw new Error(`Failed to add label: ${error.message}`);
  }

  return data as Label;
};

export const deleteLabel = async (labelId: Label["id"]): Promise<void> => {
  const { error } = await supabase.from("labels").delete().eq("id", labelId);

  if (error) {
    throw new Error(`Failed to delete label: ${error.message}`);
  }
};
