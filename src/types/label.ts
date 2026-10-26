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
