/**
 * Mock data for task assignees
 */
const list = [
  {
    id: "bob",
    name: "Bob Smith",
    email: "bob.smith@gmail.com",
    avatar: "https://i.pravatar.cc/150?img=10",
  },
  {
    id: "carol",
    name: "Carol Davis",
    email: "carol.davis@gmail.com",
    avatar: "https://i.pravatar.cc/150?img=28",
  },
  {
    id: "alice",
    name: "Alice Johnson",
    email: "alice.johnson@gmail.com",
    avatar: "https://i.pravatar.cc/150?img=5",
  },
  {
    id: "john",
    name: "John Williams",
    email: "john.williams@gmail.com",
    avatar: "https://i.pravatar.cc/150?img=12",
  },
  {
    id: "mary",
    name: "Mary Brown",
    email: "mary.brown@gmail.com",
    avatar: "https://i.pravatar.cc/150?img=16",
  },
];

/**
 * Assignees data helper
 * - list: full assignee objects
 * - options: mapped data for select components
 */
export const assignees = {
  list,
  options: list.map(({ id, name }) => ({ value: id, label: name })),
};
