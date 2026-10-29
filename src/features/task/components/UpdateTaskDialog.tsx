import "react-datepicker/dist/react-datepicker.css";

import { Dialog, DialogBackdrop, DialogPanel } from "@headlessui/react";
import { Calendar, X } from "lucide-react";
import { type FormEvent, useEffect, useState } from "react";
import DatePicker from "react-datepicker";
import { useDispatch, useSelector } from "react-redux";

import Button from "../../../components/Button";
import CustomSelect from "../../../components/CustomSelect";
import type { AppDispatch, RootState } from "../../../store";
import type { Task } from "../../../types/board";
import type { PriorityOption } from "../../../types/priority";
import type { User } from "../../../types/user";
import { selectPrioritiesOptions } from "../../filters/filterSelectors";
import { updateTaskThunk } from "../tasksThunks";

type UpdateTaskDialogProps = {
  task: Task;
  isEditOpen: boolean;
  onClose: () => void;
};

/** UpdateTaskDialog component */
export default function UpdateTaskDialog({
  task,
  isEditOpen,
  onClose,
}: UpdateTaskDialogProps) {
  const dispatch = useDispatch<AppDispatch>();

  const { users, availableLabels } = useSelector(
    (state: RootState) => state.board,
  );

  const { updateStatus, updateError } = useSelector(
    (state: RootState) => state.tasks,
  );

  const isSubmitting = updateStatus === "loading";

  const prioritiesOption = useSelector(selectPrioritiesOptions);

  const [title, setTitle] = useState<Task["title"]>(task.title);
  const [titleError, setTitleError] = useState("");
  const [description, setDescription] = useState<Task["description"]>(
    task.description,
  );
  const [dueDate, setDueDate] = useState<Date>(
    task.due_date ? new Date(task.due_date) : new Date(),
  );

  const priority = prioritiesOption.find(
    (option) => option.value === task.priority_id,
  );

  if (!priority) {
    throw new Error(`Priority "${task.priority_id}" not found`);
  }

  const [selectedPriority, setSelectedPriority] = useState(priority);
  const [selectedLabels, setSelectedLabels] = useState(task.label_ids);
  const [selectedAssignees, setSelectedAssignees] = useState(task.assignee_ids);

  const toggleLabel = (id: string): void => {
    setSelectedLabels((prev) =>
      prev.includes(id) ? prev.filter((el) => el !== id) : [...prev, id],
    );
  };

  const toggleAssignee = (assignee: User): void => {
    setSelectedAssignees((prev) => {
      const exists = prev.includes(assignee.id);

      return exists
        ? prev.filter((id) => id !== assignee.id)
        : [...prev, assignee.id];
    });
  };

  /** Handle submiting updated task */
  const handleUpdateTask = async (
    e: FormEvent<HTMLFormElement>,
  ): Promise<void> => {
    e.preventDefault();

    if (!title.trim()) {
      setTitleError("Title is required");
      return;
    }

    setTitleError("");

    const updatedFields: Omit<
      Task,
      "id" | "status" | "created_at" | "position"
    > = {
      title: title.trim(),
      description,
      assignee_ids: selectedAssignees,
      label_ids: selectedLabels,
      priority_id: selectedPriority.value,
      due_date: dueDate.toISOString().split("T")[0],
    };

    try {
      await dispatch(
        updateTaskThunk({ taskId: task.id, updatedFields }),
      ).unwrap();

      onClose();
    } catch (error) {
      console.error("Failed to update task:", error);
    }
  };

  useEffect(() => {
    if (isEditOpen) {
      setTitle(task.title);
      setTitleError("");
      setDescription(task.description);
      setSelectedPriority(priority);
      setSelectedLabels(task.label_ids);
      setSelectedAssignees(task.assignee_ids);
      setDueDate(task.due_date ? new Date(task.due_date) : new Date());
    }
  }, [
    isEditOpen,
    task.title,
    task.description,
    priority,
    task.label_ids,
    task.assignee_ids,
    task.due_date,
  ]);

  return (
    <Dialog
      open={isEditOpen}
      onClose={onClose}
      transition
      className="fixed inset-0 flex w-screen items-center justify-center bg-black/30 p-4 transition duration-300 ease-out data-closed:opacity-0"
    >
      <DialogBackdrop className="fixed inset-0 bg-black/30" />
      <div className="fixed inset-0 flex w-screen items-center justify-center p-4">
        <DialogPanel className="h-full max-h-max w-full overflow-auto rounded-lg bg-white pb-5 md:w-xl">
          <div className="sticky top-0 z-1 flex justify-between bg-white p-5">
            <div>
              <h3 className="font-bold capitalize">Edit Task</h3>
              <p className="text-xs text-gray-500">
                Make changes to the task details and save your changes
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
          <form onSubmit={handleUpdateTask} className="space-y-3 px-5">
            <div>
              <label
                htmlFor="title"
                className="mb-1 block text-xs font-medium text-gray-700"
              >
                Title
                <span className="text-black">*</span>
              </label>
              <input
                type="text"
                id="title"
                name="title"
                value={title}
                onChange={(e) => {
                  setTitle(e.target.value);
                  if (e.target.value.trim() !== "") {
                    setTitleError("");
                  }
                }}
                placeholder="Enter task title"
                required
                className={`w-full rounded-md border p-2 text-sm focus:outline-none ${
                  titleError
                    ? "border-red-500"
                    : "border-slate-300 focus:border-slate-400"
                }`}
              />
              {titleError && (
                <p className="mt-1 text-xs text-red-500">{titleError}</p>
              )}
            </div>
            <div>
              <label
                htmlFor="description"
                className="mb-1 block text-xs font-medium text-gray-700"
              >
                Description
              </label>
              <textarea
                id="description"
                name="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Enter task description"
                rows={4}
                className="w-full rounded-md border border-slate-300 p-2 text-sm focus:border-slate-400 focus:outline-none"
              />
            </div>
            <div className="grid gap-2 md:grid-cols-2">
              <div>
                <label
                  htmlFor="select"
                  className="mb-1 block text-xs font-medium text-gray-700"
                >
                  Priority
                  <span className="text-black">*</span>
                </label>
                <CustomSelect
                  value={selectedPriority}
                  onChange={(value) => {
                    if (value && !Array.isArray(value)) {
                      setSelectedPriority(value as PriorityOption);
                    }
                  }}
                  options={prioritiesOption}
                  placeholder="Priority"
                  optionType="priority"
                  isMulti={false}
                />
              </div>
              <div>
                <label
                  htmlFor="due-date"
                  className="mb-1 block text-xs font-medium text-gray-700"
                >
                  Due date
                </label>
                <DatePicker
                  showIcon
                  selected={dueDate}
                  minDate={new Date()}
                  onChange={(date) => {
                    if (date) setDueDate(date);
                  }}
                  icon={<Calendar size={14} />}
                  className="w-full rounded-md border border-slate-300 !p-2 !ps-7 text-sm focus:border-slate-400 focus:outline-none"
                />
              </div>
            </div>
            <div>
              <span className="mb-1 block text-xs font-medium text-gray-700">
                Assignees
              </span>
              {users.length === 0 ? (
                <p className="text-xs text-gray-500 italic">
                  No team members available. Please add users in{" "}
                  <span className="font-medium underline">Settings</span> first.
                </p>
              ) : (
                <div className="flex flex-col gap-1">
                  {users.map((user) => {
                    const isActive = selectedAssignees.includes(user.id);

                    return (
                      <button
                        type="button"
                        key={user.id}
                        onClick={() => toggleAssignee(user)}
                        className={`flex cursor-pointer gap-2 rounded p-2 transition-colors duration-300 ${
                          isActive ? "bg-slate-100" : "hover:bg-slate-100"
                        }`}
                      >
                        <span className="avatar flex h-7 w-7 items-center justify-center overflow-hidden rounded-[50%]">
                          <img src={user.avatar} alt={user.name}></img>
                        </span>
                        <div className="flex flex-col items-start">
                          <span className="text-xs">{user.name}</span>
                          <span className="text-[10px] text-gray-500">
                            {user.email}
                          </span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
            <div>
              <span className="mb-1 block text-xs font-medium text-gray-700">
                Labels
              </span>
              {availableLabels.length === 0 ? (
                <p className="text-xs text-gray-500 italic">
                  No labels available. Please add labels in{" "}
                  <span className="font-medium underline">Settings</span> first.
                </p>
              ) : (
                <div className="flex flex-wrap gap-1">
                  {availableLabels.map((label) => {
                    const isActive = selectedLabels.includes(label.id);

                    return (
                      <button
                        type="button"
                        key={label.id}
                        onClick={() => toggleLabel(label.id)}
                        className="block max-w-max cursor-pointer rounded-lg px-2 py-0.5 text-[10px] capitalize"
                        style={{
                          backgroundColor: isActive
                            ? label.color
                            : `${label.color}20`,
                          color: isActive ? "white" : label.color,
                        }}
                      >
                        {label.name}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
            <div className="flex items-center justify-end gap-2">
              <Button
                type="button"
                onClick={onClose}
                border={"border-1 border-gray-300"}
                bgColor={"bg-white"}
                textColor={"text-black"}
                hoverBgColor={"hover:bg-gray-100"}
                minWidth="min-w-[50%] md:min-w-30"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                minWidth="min-w-[50%] md:min-w-30"
                disabledHoverBgColor="disabled:hover:bg-slate-900"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Saving..." : "Save changes"}
              </Button>
            </div>
            {updateError && (
              <p
                className="rounded-lg border border-red-100 bg-red-50 px-2 py-2 text-center text-sm text-red-700"
                role="alert"
              >
                {updateError}
              </p>
            )}
          </form>
        </DialogPanel>
      </div>
    </Dialog>
  );
}
