import prioritiesResponse from "../mocks/priorities.json";
import type { Priority } from "../types/priority";

export async function getPriorities(): Promise<Priority[]> {
  await new Promise((resolve) => setTimeout(resolve, 300));

  return prioritiesResponse.data as Priority[];
}
