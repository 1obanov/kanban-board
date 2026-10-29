import { supabase } from "../lib/supabaseClient";
import type { User } from "../types/user";

export const getUsers = async (): Promise<User[]> => {
  const { data, error } = await supabase
    .from("users")
    .select("*")
    .order("name", { ascending: true });

  if (error) {
    throw new Error(`Failed to fetch users: ${error.message}`);
  }

  return data ?? [];
};

export const addUser = async (user: Omit<User, "id">): Promise<User> => {
  const { data, error } = await supabase
    .from("users")
    .insert(user)
    .select()
    .single();

  if (error) {
    throw new Error(`Failed to add user: ${error.message}`);
  }

  return data as User;
};

export const deleteUser = async (userId: User["id"]): Promise<void> => {
  const { error } = await supabase.from("users").delete().eq("id", userId);

  if (error) {
    throw new Error(`Failed to delete user: ${error.message}`);
  }
};
