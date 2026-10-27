import labelsResponse from "../mocks/labels.json";
import type { Label } from "../types/label";

export async function getLabels(): Promise<Label[]> {
  return labelsResponse.data;
}
