import { useState } from "react";
import Button from "./components/Button";
import SettingsDialog from "./features/board/SettingsDialog/SettingsDialog";
import Board from "./features/board/components/Board";
import FiltersPanel from "./features/filters/components/FiltersPanel";
import AddTaskDialog from "./features/task/components/AddTaskDialog";
import { Settings } from "lucide-react";
import SideBar from "./components/SideBar";

function App() {
  const [isNewTaskOpen, setIsNewTaskOpen] = useState(false);
  const [isSettingOpen, setIsSettingOpen] = useState(false);

  return (
    <div className="app-container grid grid-cols-[200px_1fr] max-lg:grid-cols-[32px_1fr] p-2 gap-2 h-screen">
      <SideBar />
      <div className="bg-white border-1 rounded-lg border-slate-300 min-w-0 h-full flex flex-col max-h-[calc(100vh-(--spacing(4)))]">
        <div className="p-3 border-b-1 border-slate-300">
          <div className="flex items-center justify-between gap-2">
            <h1 className="font-bold">Kanban Board</h1>
            <Button
              type="button"
              className="text-sm flex items-center gap-2"
              border={"border-1 border-gray-300"}
              padding={"px-2 py-1"}
              bgColor={"bg-white"}
              textColor={"text-black"}
              hoverBgColor={"hover:bg-gray-100"}
              onClick={() => setIsSettingOpen(true)}
            >
              <Settings size={14} />
              Setting
            </Button>
            <SettingsDialog
              isSettingOpen={isSettingOpen}
              onClose={() => setIsSettingOpen(false)}
            />
          </div>
          <div className="relative flex flex-col md:flex-row items-center justify-between gap-2 py-3 w-full">
            <FiltersPanel />
            <Button
              className="w-full md:w-auto"
              onClick={() => setIsNewTaskOpen(true)}
            >
              Add task
            </Button>
            <AddTaskDialog
              isNewTaskOpen={isNewTaskOpen}
              onClose={() => setIsNewTaskOpen(false)}
            />
          </div>
        </div>
        <Board />
      </div>
    </div>
  );
}

export default App;
