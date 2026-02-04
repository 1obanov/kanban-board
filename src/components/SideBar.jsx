import {
  Home,
  Columns,
  Calendar,
  Book,
  Users,
  ChevronsUp,
  Settings,
} from "lucide-react";

/**
 * Sidebar navigation component
 */
function SideBar() {
  const navItems = [
    { id: "dashboard", label: "Dashboard", icon: Home },
    { id: "kanban", label: "Kanban Board", icon: Columns },
    { id: "calendar", label: "Calendar", icon: Calendar },
    { id: "docs", label: "Documentation", icon: Book },
    { id: "users", label: "Users", icon: Users },
    { id: "settings", label: "Settings", icon: Settings },
  ];

  const activeItem = "kanban";

  return (
    <aside className="sidebar h-full flex flex-col">
      <div className="flex items-center justify-start max-lg:justify-center gap-1.5 text-sm bg-white border rounded-lg border-slate-300 p-3 max-lg:p-0 max-lg:h-[32px] mb-6">
        <span className="flex items-center justify-center bg-slate-900 text-slate-50 w-6 max-lg:w-4 h-6 max-lg:h-4 rounded-lg">
          <ChevronsUp size={14} />
        </span>
        <span className="font-medium max-lg:hidden">Kanban UI</span>
      </div>

      <ul className="space-y-1">
        {navItems.map(({ id, label, icon: Icon }) => (
          <li
            key={id}
            className={`flex items-center justify-start max-lg:justify-center gap-2 p-2 text-sm rounded-md cursor-pointer transition-colors
              ${
                activeItem === id
                  ? "bg-slate-100 border border-slate-300"
                  : "hover:bg-slate-100"
              }
            `}
          >
            <Icon size={16} className="shrink-0 text-slate-600" />
            <span className="truncate max-lg:hidden">{label}</span>
          </li>
        ))}
      </ul>
    </aside>
  );
}

export default SideBar;
