export type Label = {
  id: string;
  name: string;
  color: string;
};

export type LabelOption = {
  value: Label["id"];
  label: Label["name"];
  color: Label["color"];
};

/**
 * Mock data for task labels
 */
const list: Label[] = [
  {
    id: "frontend",
    name: "Frontend",
    color: "#3b82f6",
  },
  {
    id: "backend",
    name: "Backend",
    color: "#10b981",
  },
  {
    id: "bug",
    name: "Bug",
    color: "#ef4444",
  },
  {
    id: "feature",
    name: "Feature",
    color: "#f59e0b",
  },
  {
    id: "design",
    name: "Design",
    color: "#8b5cf6",
  },
  {
    id: "urgent",
    name: "Urgent",
    color: "#f43f5e",
  },
];

const options: LabelOption[] = list.map(({ id, name, color }) => ({
  value: id,
  label: name,
  color,
}));

/**
 * Labels data helper
 * - list: full label objects
 * - options: mapped data for select components
 */
export const labels = {
  list,
  options,
};
