# Kanban Board

> A modern Kanban-style task management application built with React and Redux Toolkit. Create, manage, and filter tasks in a responsive board or list view, with data stored in Supabase.

### Preview

Explore the live demo of the **Kanban Board** [here](https://1obanov.github.io/kanban-board/).

### Features

- **Task Board:** View tasks in a Kanban board layout with draggable cards.
- **List View:** Switch to a compact list view for a simplified overview.
- **Customizable Columns:** Rename board columns to fit your workflow.
- **Add / Edit / Delete Tasks:** Create new tasks, update existing ones, or delete tasks.
- **Supabase Data:** Load and persist board data through Supabase.
- **Task Details:** Assign priority, labels, assignees, and due dates for tasks.
- **Filters:** Filter tasks by search query, assignees, labels, and priority.
- **Responsive Design:** Fully responsive layout for desktop and mobile.
- **Drag & Drop:** Move tasks between columns and reorder them easily.

### Technologies

- React
- Redux Toolkit
- TypeScript
- Tailwind CSS
- Headless UI
- Supabase
- Vite

### Installation

```
# Clone the repository
git clone https://github.com/1obanov/kanban-board.git

# Navigate to the project directory
cd kanban-board

# Install dependencies
npm install

# Configure Supabase
cp .env.example .env.local
# Set VITE_SUPABASE_URL and VITE_SUPABASE_PUBLISHABLE_KEY in .env.local.

# Configure your Supabase project with the tables used by the app:
# columns, tasks, users, labels, and priorities.
# Add any initial board columns and priorities in Supabase; the app has no mock data.

# Start the development server
npm run dev
```
