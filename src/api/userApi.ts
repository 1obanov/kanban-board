import usersResponse from "../mocks/users.json";
import type { User } from "../types/user";

export async function getUsers(): Promise<User[]> {
  return usersResponse.data;
}
