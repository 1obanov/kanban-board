import Button from "../../../components/Button";
import { X, Users, Tag, Flag } from "lucide-react";
import { Dialog, DialogPanel, DialogBackdrop } from "@headlessui/react";
import { useDispatch, useSelector } from "react-redux";
import { setAssignees, setLabels, setPriorities } from "../filtersSlice";
import { useEffect, useState } from "react";
import FilterSection from "./FilterSection";

/** Dialog component to manage task filters */
function FiltersDialog({ isFiltersOpen, onClose }) {
  const dispatch = useDispatch();

  /** Get board data for filter options */
  const { assigneesData, labelsData, prioritiesData } = useSelector(
    (state) => state.board
  );

  /** Get currently selected filters */
  const { assignees, labels, priorities } = useSelector(
    (state) => state.filters
  );

  /** Local state for selected filters */
  const [selectedAssignees, setSelectedAssignees] = useState(assignees);
  const [selectedLabels, setSelectedLabels] = useState(labels);
  const [selectedPriorities, setSelectedPriorities] = useState(priorities);

  /** Toggle a filter option */
  const toggleOption = (updateState) => (option) => {
    updateState((prev) => {
      const exists = prev.some((item) => item.value === option.value);
      return exists
        ? prev.filter((item) => item.value !== option.value)
        : [...prev, option];
    });
  };

  /** Clear all selected options */
  const clearOptions = (updateState) => () => updateState([]);

  /** Update local state when global filters change */
  useEffect(() => {
    setSelectedAssignees(assignees);
    setSelectedLabels(labels);
    setSelectedPriorities(priorities);
  }, [assignees, labels, priorities]);

  /** Save changes and update global state */
  const handleSaveChanges = (e) => {
    e.preventDefault();
    dispatch(setAssignees(selectedAssignees));
    dispatch(setLabels(selectedLabels));
    dispatch(setPriorities(selectedPriorities));
    onClose();
  };

  return (
    <Dialog
      open={isFiltersOpen}
      onClose={onClose}
      transition
      className="fixed inset-0 flex w-screen items-center justify-center bg-black/30 p-4 transition duration-300 ease-out data-closed:opacity-0"
    >
      <DialogBackdrop className="fixed inset-0 bg-black/30" />
      <div className="fixed inset-0 flex w-screen items-center justify-center p-4">
        <DialogPanel className="w-full md:w-xl rounded-lg bg-white pb-5 h-full max-h-max overflow-auto">
          <div className="flex justify-between sticky top-0 z-1 bg-white p-5">
            <div>
              <h3 className="font-bold capitalize">Filters</h3>
              <p className="text-xs text-gray-500">
                Filter cards by assignee, labels, and priority
              </p>
            </div>
            <button
              className="w-5 h-5 flex items-center justify-center shrink-0 bg-gray-100 rounded-md cursor-pointer"
              onClick={onClose}
            >
              <X size={14} />
            </button>
          </div>
          <form className="space-y-3 px-5">
            <FilterSection
              title="Assignees"
              icon={Users}
              list={assigneesData.list}
              options={assigneesData.options}
              selected={selectedAssignees}
              onToggle={toggleOption(setSelectedAssignees)}
              onClear={clearOptions(setSelectedAssignees)}
              emptyMessage={
                <>
                  No team members available. Please add users in{" "}
                  <span className="font-medium underline">Settings</span> first.
                </>
              }
            />
            <FilterSection
              title="Labels"
              icon={Tag}
              list={labelsData.list}
              options={labelsData.options}
              selected={selectedLabels}
              onToggle={toggleOption(setSelectedLabels)}
              onClear={clearOptions(setSelectedLabels)}
              emptyMessage={
                <>
                  No labels available. Please add labels in{" "}
                  <span className="font-medium underline">Settings</span> first.
                </>
              }
            />
            <FilterSection
              title="Priority"
              icon={Flag}
              list={prioritiesData.list}
              options={prioritiesData.options}
              selected={selectedPriorities}
              onToggle={toggleOption(setSelectedPriorities)}
              onClear={clearOptions(setSelectedPriorities)}
              emptyMessage="No priorities available."
            />
            <div className="flex items-center justify-end gap-2">
              <Button
                type="button"
                onClick={onClose}
                border={"border-1 border-gray-300"}
                bgColor={"bg-white"}
                textColor={"text-black"}
                hoverBgColor={"hover:bg-gray-100"}
              >
                Cancel
              </Button>
              <Button type="submit" onClick={handleSaveChanges}>
                Save changes
              </Button>
            </div>
          </form>
        </DialogPanel>
      </div>
    </Dialog>
  );
}

export default FiltersDialog;
