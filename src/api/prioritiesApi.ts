import { supabase } from "../lib/supabaseClient";
import type { Priority } from "../types/priority";

export const getPriorities = async (): Promise<Priority[]> => {
  const { data, error } = await supabase.from("priorities").select("*");

  if (error) {
    throw new Error(`Failed to fetch priorities: ${error.message}`);
  }

  return data ?? [];
};
