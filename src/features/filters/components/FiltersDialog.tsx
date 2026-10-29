import { Dialog, DialogBackdrop, DialogPanel } from "@headlessui/react";
import { Flag, Tag, Users, X } from "lucide-react";
import {
  type Dispatch,
  type FormEvent,
  type SetStateAction,
  useEffect,
  useState,
} from "react";
import { useDispatch, useSelector } from "react-redux";

import Button from "../../../components/Button";
import type { AppDispatch, RootState } from "../../../store";
import type { LabelOption } from "../../../types/label";
import type { PriorityID, PriorityOption } from "../../../types/priority";
import type { UserOption } from "../../../types/user";
import {
  selectLabelsOptions,
  selectPrioritiesOptions,
  selectUserOptions,
} from "../filterSelectors";
import { setAssignees, setLabels, setPriorities } from "../filtersSlice";
import FilterSection from "./FilterSection";

type FiltersDialogProps = {
  isFiltersOpen: boolean;
  onClose: () => void;
};

/**  FiltersDialog component */
export default function FiltersDialog({
  isFiltersOpen,
  onClose,
}: FiltersDialogProps) {
  const dispatch = useDispatch<AppDispatch>();

  const { users, availableLabels, availablePriorities } = useSelector(
    (state: RootState) => state.board,
  );

  const { assignees, labels, priorities } = useSelector(
    (state: RootState) => state.filters,
  );

  const userOptions = useSelector(selectUserOptions);
  const labelsOption = useSelector(selectLabelsOptions);
  const prioritiesOption = useSelector(selectPrioritiesOptions);

  const [selectedAssignees, setSelectedAssignees] =
    useState<UserOption[]>(assignees);
  const [selectedLabels, setSelectedLabels] = useState<LabelOption[]>(labels);
  const [selectedPriorities, setSelectedPriorities] =
    useState<PriorityID[]>(priorities);

  const toggleOption =
    <T extends { value: string }>(updateState: Dispatch<SetStateAction<T[]>>) =>
    (option: T) => {
      updateState((prev) => {
        const exists = prev.some((item) => item.value === option.value);

        return exists
          ? prev.filter((item) => item.value !== option.value)
          : [...prev, option];
      });
    };

  const togglePriority = (option: PriorityOption) => {
    setSelectedPriorities((prev) =>
      prev.includes(option.value)
        ? prev.filter((id) => id !== option.value)
        : [...prev, option.value],
    );
  };

  const clearOptions =
    <T,>(updateState: Dispatch<SetStateAction<T[]>>) =>
    () =>
      updateState([]);

  useEffect(() => {
    if (isFiltersOpen) {
      setSelectedAssignees(assignees);
      setSelectedLabels(labels);
      setSelectedPriorities(priorities);
    }
  }, [isFiltersOpen, assignees, labels, priorities]);

  /** Handle saving filters */
  const handleSaveChanges = (e: FormEvent<HTMLFormElement>): void => {
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
        <DialogPanel className="h-full max-h-max w-full overflow-auto rounded-lg bg-white pb-5 md:w-xl">
          <div className="sticky top-0 z-1 flex justify-between bg-white p-5">
            <div>
              <h3 className="font-bold capitalize">Filters</h3>
              <p className="text-xs text-gray-500">
                Filter cards by assignee, labels, and priority
              </p>
            </div>
            <button
              type="button"
              className="flex h-5 w-5 shrink-0 cursor-pointer items-center justify-center rounded-md bg-gray-100"
              onClick={onClose}
            >
              <X size={14} />
            </button>
          </div>
          <form onSubmit={handleSaveChanges} className="space-y-3 px-5">
            <FilterSection
              title="Assignees"
              icon={Users}
              list={users}
              options={userOptions}
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
              list={availableLabels}
              options={labelsOption}
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
              list={availablePriorities}
              options={prioritiesOption}
              selected={selectedPriorities}
              onToggle={togglePriority}
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
              <Button type="submit">Save changes</Button>
            </div>
          </form>
        </DialogPanel>
      </div>
    </Dialog>
  );
}
