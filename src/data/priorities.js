/**
 * Mock data for task priorities
 */
const list = [
  { id: "low", name: "Low", color: "#22c55e" },
  { id: "medium", name: "Medium", color: "#facc15" },
  { id: "high", name: "High", color: "#f97316" },
  { id: "critical", name: "Critical", color: "#ef4444" },
];

/**
 * Priorities data helper
 * - list: full priority objects
 * - options: mapped data for select components
 */
export const priorities = {
  list,
  options: list.map(({ id, name, color }) => ({
    value: id,
    label: name,
    color,
  })),
};
