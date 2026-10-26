export type User = {
  id: string;
  name: string;
  email: string;
  avatar: string;
};

export type UserOption = {
  value: User["id"];
  label: User["name"];
};
