# Kanban Board

> A modern Kanban style task management application built with React and Redux Toolkit, offering an intuitive interface to create, manage, and filter tasks with ease.

### Preview

Explore the live demo of the **Kanban Board** [here](https://1obanov.github.io/kanban-board/).

### Features

- **Task Board:** View tasks in a Kanban board layout with draggable cards.
- **List View:** Switch to a compact list view for a simplified overview.
- **Customizable Columns:** Rename board columns to fit your workflow.
- **Add / Edit / Delete Tasks:** Create new tasks, update existing ones, or delete tasks.
- **API-backed Data:** Load tasks and columns from an API and save changes to them.
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
- REST API
- Vite

### Installation

```
# Clone the repository
git clone https://gitlab.com/your-username/kanban-board.git

# Navigate to the project directory
cd kanban-board

# Install dependencies
npm install

# Configure the API base URL
cp .env.example .env.local
# Set VITE_API_URL in .env.local to the base URL of your API.
# The API must provide /columns and /tasks endpoints.

# Start the development server
npm run dev
```
