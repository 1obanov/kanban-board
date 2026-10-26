import usersResponse from "../mocks/users.json";
import type { User } from "../types/user";

export async function getUsers(): Promise<User[]> {
  await new Promise((resolve) => setTimeout(resolve, 300));

  return usersResponse.data;
}
