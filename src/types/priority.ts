export type PriorityID = "low" | "medium" | "high" | "critical";

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
