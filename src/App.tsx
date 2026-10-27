import { Settings } from "lucide-react";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import Button from "./components/Button";
import ErrorMessage from "./components/ErrorMessage";
import Loader from "./components/Loader";
import SideBar from "./components/SideBar";
import { fetchBoardData } from "./features/board/boardThunks";
import Board from "./features/board/components/Board";
import SettingsDialog from "./features/board/SettingsDialog/SettingsDialog";
import FiltersPanel from "./features/filters/components/FiltersPanel";
import AddTaskDialog from "./features/task/components/AddTaskDialog";
import type { AppDispatch, RootState } from "./store";

export default function App() {
  const dispatch = useDispatch<AppDispatch>();

  const { status, error } = useSelector((state: RootState) => state.board);

  const [isNewTaskOpen, setIsNewTaskOpen] = useState(false);
  const [isSettingOpen, setIsSettingOpen] = useState(false);

  useEffect(() => {
    dispatch(fetchBoardData());
  }, [dispatch]);

  if (status === "loading" || status === "idle") {
    return <Loader />;
  }

  if (status === "failed") {
    return (
      <ErrorMessage
        message={error ?? "Something went wrong."}
        onRetry={() => {
          dispatch(fetchBoardData());
        }}
      />
    );
  }

  return (
    <div className="app-container grid h-screen grid-cols-[200px_1fr] gap-2 p-2 max-lg:grid-cols-[32px_1fr]">
      <SideBar />
      <div className="flex h-full max-h-[calc(100vh-(--spacing(4)))] min-w-0 flex-col rounded-lg border-1 border-slate-300 bg-white">
        <div className="border-b-1 border-slate-300 p-3">
          <div className="flex items-center justify-between gap-2">
            <h1 className="font-bold">Kanban Board</h1>
            <Button
              type="button"
              className="flex items-center gap-2 text-sm"
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
          <div className="relative flex w-full flex-col items-center justify-between gap-2 py-3 md:flex-row">
            <FiltersPanel />
            <Button
              type="button"
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
