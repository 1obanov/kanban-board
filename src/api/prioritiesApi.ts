import prioritiesResponse from "../mocks/priorities.json";
import type { Priority } from "../types/priority";

export async function getPriorities(): Promise<Priority[]> {
  return prioritiesResponse.data as Priority[];
}
