import labelsResponse from "../mocks/labels.json";
import type { Label } from "../types/label";

export async function getLabels(): Promise<Label[]> {
  await new Promise((resolve) => setTimeout(resolve, 300));

  return labelsResponse.data;
}
