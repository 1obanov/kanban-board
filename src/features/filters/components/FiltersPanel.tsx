import {
  Flag,
  List,
  Search,
  SlidersHorizontal,
  SquareKanban,
  Tag,
  Users,
} from "lucide-react";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import Button from "../../../components/Button";
import CustomSelect from "../../../components/CustomSelect";
import type { AppDispatch, RootState } from "../../../store";
import type { LabelOption } from "../../../types/label";
import type { PriorityID } from "../../../types/priority";
import type { UserOption } from "../../../types/user";
import { setViewMode } from "../../board/boardSlice";
import {
  selectLabelsOptions,
  selectPrioritiesOptions,
  selectUserOptions,
} from "../filterSelectors";
import {
  setAssignees,
  setLabels,
  setPriorities,
  setSearch,
} from "../filtersSlice";
import FiltersDialog from "./FiltersDialog";

/**  FiltersPanel component */
export default function FiltersPanel() {
  const dispatch = useDispatch<AppDispatch>();

  const { viewMode } = useSelector((state: RootState) => state.board);
  const { search, assignees, labels, priorities } = useSelector(
    (state: RootState) => state.filters,
  );

  const userOptions = useSelector(selectUserOptions);
  const labelsOption = useSelector(selectLabelsOptions);
  const prioritiesOption = useSelector(selectPrioritiesOptions);

  const [isFiltersOpen, setIsFiltersOpen] = useState(false);

  return (
    <div className="flex w-full flex-col gap-2 md:flex-row md:items-center">
      <div className="flex items-center gap-2 rounded-md bg-slate-100 px-2 py-[9px]">
        <Search size={14} className="text-gray-500" />
        <input
          id="search"
          name="search"
          type="text"
          placeholder="Search tasks"
          className="border-0 text-sm placeholder:text-gray-500 focus-visible:outline-0"
          value={search}
          onChange={(e) => dispatch(setSearch(e.target.value))}
        />
      </div>
      <div className="flex flex-col items-center gap-2 sm:flex-row">
        <div className="hidden w-full max-2xl:inline-block sm:w-auto sm:flex-1 md:flex-none">
          <Button
            type="button"
            className="flex w-full items-center justify-center gap-2 md:w-auto md:justify-start"
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
        <div className="grid w-full grid-cols-2 rounded-md bg-gray-100 p-1 sm:w-auto sm:flex-1 md:flex-none">
          <button
            type="button"
            onClick={() => dispatch(setViewMode("board"))}
            className={`flex cursor-pointer items-center justify-center gap-1 rounded-md px-3 py-1.5 text-sm font-medium transition-colors duration-200 ease-in-out md:justify-start ${
              viewMode === "board" ? "bg-white" : "bg-transparent"
            }`}
          >
            <SquareKanban size={14} className="shrink-0" />
            Board
          </button>
          <button
            type="button"
            onClick={() => dispatch(setViewMode("list"))}
            className={`flex cursor-pointer items-center justify-center gap-1 rounded-md px-3 py-1.5 text-sm font-medium transition-colors duration-200 ease-in-out md:justify-start ${
              viewMode === "list" ? "bg-white" : "bg-transparent"
            }`}
          >
            <List size={14} className="shrink-0" />
            List
          </button>
        </div>
      </div>
      <div className="flex items-center gap-2.5 max-2xl:hidden">
        <div className="md:w-56">
          <CustomSelect
            value={assignees}
            onChange={(value) => {
              dispatch(setAssignees(value as UserOption[]));
            }}
            options={userOptions}
            placeholder="Assignees"
            optionType="assignees"
            icon={<Users size={14} />}
          />
        </div>
        <div className="md:w-48">
          <CustomSelect
            value={labels}
            onChange={(value) => {
              dispatch(setLabels(value as LabelOption[]));
            }}
            options={labelsOption}
            placeholder="Labels"
            optionType="labels"
            icon={<Tag size={14} />}
          />
        </div>
        <div className="md:w-52">
          <CustomSelect
            value={prioritiesOption.filter((option) =>
              priorities.includes(option.value),
            )}
            onChange={(value) => {
              dispatch(
                setPriorities(
                  Array.isArray(value)
                    ? value.map((option) => option.value as PriorityID)
                    : [],
                ),
              );
            }}
            options={prioritiesOption}
            placeholder="Priority"
            optionType="priority"
            icon={<Flag size={14} />}
          />
        </div>
      </div>
    </div>
  );
}
