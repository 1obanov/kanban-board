import {
  Book,
  Calendar,
  ChevronsUp,
  Columns,
  Home,
  type LucideIcon,
  Settings,
  Users,
} from "lucide-react";

type SidebarItemId =
  "dashboard" | "kanban" | "calendar" | "documentation" | "users" | "settings";

type SidebarNavItem = {
  id: SidebarItemId;
  label: string;
  icon: LucideIcon;
};

/**
 * Sidebar navigation component
 */
export default function SideBar() {
  const navItems: SidebarNavItem[] = [
    { id: "dashboard", label: "Dashboard", icon: Home },
    { id: "kanban", label: "Kanban Board", icon: Columns },
    { id: "calendar", label: "Calendar", icon: Calendar },
    { id: "documentation", label: "Documentation", icon: Book },
    { id: "users", label: "Users", icon: Users },
    { id: "settings", label: "Settings", icon: Settings },
  ];

  const activeItem = "kanban";

  return (
    <aside className="sidebar flex h-full flex-col">
      <div className="mb-6 flex items-center justify-start gap-1.5 rounded-lg border border-slate-300 bg-white p-3 text-sm max-lg:h-[32px] max-lg:justify-center max-lg:p-0">
        <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-slate-900 text-slate-50 max-lg:h-4 max-lg:w-4">
          <ChevronsUp size={14} />
        </span>
        <span className="font-medium max-lg:hidden">Kanban UI</span>
      </div>

      <ul className="space-y-1">
        {navItems.map(({ id, label, icon: Icon }) => (
          <li
            key={id}
            className={`flex cursor-pointer items-center justify-start gap-2 rounded-md p-2 text-sm transition-colors max-lg:justify-center ${
              activeItem === id
                ? "border border-slate-300 bg-slate-100"
                : "hover:bg-slate-100"
            } `}
          >
            <Icon size={16} className="shrink-0 text-slate-600" />
            <span className="truncate max-lg:hidden">{label}</span>
          </li>
        ))}
      </ul>
    </aside>
  );
}
