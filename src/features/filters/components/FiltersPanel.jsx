import { useDispatch, useSelector } from "react-redux";
import CustomSelect from "../../../components/CustomSelect";
import {
  Users,
  Tag,
  Flag,
  Search,
  SquareKanban,
  List,
  SlidersHorizontal,
} from "lucide-react";
import {
  setSearch,
  setAssignees,
  setLabels,
  setPriorities,
} from "../filtersSlice";
import { setViewMode } from "../../board/boardSlice";
import Button from "../../../components/Button";
import FiltersDialog from "./FiltersDialog";
import { useState } from "react";

/**
 * FiltersPanel component
 * Renders search input, filters button, view mode toggle, and select dropdowns for mobile.
 * Works with Redux state to control board filters and view mode.
 */
function FiltersPanel() {
  const assigneesData = useSelector((state) => state.board.assigneesData);
  const labelsData = useSelector((state) => state.board.labelsData);
  const prioritiesData = useSelector((state) => state.board.prioritiesData);
  const viewMode = useSelector((state) => state.board.viewMode);

  const search = useSelector((state) => state.filters.search);
  const assignees = useSelector((state) => state.filters.assignees);
  const labels = useSelector((state) => state.filters.labels);
  const priorities = useSelector((state) => state.filters.priorities);

  const [isFiltersOpen, setIsFiltersOpen] = useState(false);

  const dispatch = useDispatch();

  return (
    <div className="flex md:items-center flex-col md:flex-row gap-2 w-full">
      <div className="flex items-center gap-2 rounded-md bg-slate-100 px-2 py-[9px]">
        <Search size={14} className="text-gray-500" />
        <input
          id="search"
          name="search"
          type="text"
          placeholder="Search cards"
          className="text-sm focus-visible:outline-0 border-0 placeholder:text-gray-500"
          value={search}
          onChange={(e) => dispatch(setSearch(e.target.value))}
        />
      </div>
      <div className="flex items-center flex-col sm:flex-row gap-2">
        <div className="hidden w-full sm:w-auto sm:flex-1 md:flex-none max-2xl:inline-block">
          <Button
            type="button"
            className="flex items-center justify-center md:justify-start gap-2 w-full md:w-auto"
            border={"border-1 border-gray-300"}
            bgColor={"bg-white"}
            textColor={"text-black"}
            hoverBgColor={"hover:bg-gray-100"}
            onClick={() => setIsFiltersOpen(true)}
          >
            <SlidersHorizontal size={14} />
            Filters
          </Button>
          <FiltersDialog
            isFiltersOpen={isFiltersOpen}
            onClose={() => setIsFiltersOpen(false)}
          />
        </div>
        <div className="w-full sm:w-auto sm:flex-1 md:flex-none grid grid-cols-2 bg-gray-100 rounded-md p-1">
          <button
            type="button"
            onClick={() => dispatch(setViewMode("board"))}
            className={`flex items-center justify-center md:justify-start gap-1 px-3 py-1.5 text-sm font-medium rounded-md cursor-pointer transition-colors duration-200 ease-in-out ${
              viewMode === "board" ? "bg-white" : "bg-transparent"
            }`}
          >
            <SquareKanban size={14} className="shrink-0" />
            Board
          </button>
          <button
            type="button"
            onClick={() => dispatch(setViewMode("list"))}
            className={`flex items-center justify-center md:justify-start gap-1 px-3 py-1.5 text-sm font-medium rounded-md cursor-pointer transition-colors duration-200 ease-in-out ${
              viewMode === "list" ? "bg-white" : "bg-transparent"
            }`}
          >
            <List size={14} className="shrink-0" />
            List
          </button>
        </div>
      </div>
      <div className="flex max-2xl:hidden items-center gap-2.5">
        <div className="md:w-56">
          <CustomSelect
            value={assignees}
            onChange={(value) => dispatch(setAssignees(value))}
            options={assigneesData.options}
            placeholder="Assignees"
            optionType="assignees"
            icon={<Users size={14} />}
          />
        </div>
        <div className="md:w-48">
          <CustomSelect
            value={labels}
            onChange={(value) => dispatch(setLabels(value))}
            options={labelsData.options}
            placeholder="Labels"
            optionType="labels"
            icon={<Tag size={14} />}
          />
        </div>
        <div className="md:w-52">
          <CustomSelect
            value={priorities}
            onChange={(value) => dispatch(setPriorities(value))}
            options={prioritiesData.options}
            placeholder="Priority"
            optionType="priority"
            icon={<Flag size={14} />}
          />
        </div>
      </div>
    </div>
  );
}

export default FiltersPanel;
