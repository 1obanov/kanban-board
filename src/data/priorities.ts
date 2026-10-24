export type PriorityID = "low" | "medium" | "high" | "critical";

export type PriorityName = Capitalize<PriorityID>;

type PriorityNameByID = {
  [ID in PriorityID]: Capitalize<ID>;
};

export type Priority = {
  [ID in PriorityID]: {
    id: ID;
    name: PriorityNameByID[ID];
    color: string;
  };
}[PriorityID];

export type PriorityOption = {
  value: Priority["id"];
  label: Priority["name"];
  color: Priority["color"];
};

/**
 * Mock data for task priorities
 */
const list: Priority[] = [
  { id: "low", name: "Low", color: "#22c55e" },
  { id: "medium", name: "Medium", color: "#facc15" },
  { id: "high", name: "High", color: "#f97316" },
  { id: "critical", name: "Critical", color: "#ef4444" },
];

const options: PriorityOption[] = list.map(({ id, name, color }) => ({
  value: id,
  label: name,
  color,
}));

/**
 * Priorities data helper
 * - list: full priority objects
 * - options: mapped data for select components
 */
export const priorities = {
  list,
  options,
};
