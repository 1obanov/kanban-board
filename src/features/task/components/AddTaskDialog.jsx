import { useState } from "react";
import CustomSelect from "../../../components/CustomSelect";
import Button from "../../../components/Button";
import { X, Calendar } from "lucide-react";
import DatePicker from "react-datepicker";
import { Dialog, DialogPanel, DialogBackdrop } from "@headlessui/react";
import { useDispatch, useSelector } from "react-redux";
import { addTask } from "../taskSlice";
import { addTaskToColumn } from "../../board/boardSlice";

import "react-datepicker/dist/react-datepicker.css";

/**
 * AddTaskDialog component
 *
 * Modal dialog for creating a new task and assigning it to a board column.
 */
function AddTaskDialog({ isNewTaskOpen, onClose }) {
  const assigneesData = useSelector((state) => state.board.assigneesData);
  const labelsData = useSelector((state) => state.board.labelsData);
  const prioritiesData = useSelector((state) => state.board.prioritiesData);

  const dispatch = useDispatch();

  const [title, setTitle] = useState("");
  const [titleError, setTitleError] = useState("");
  const [description, setDescription] = useState("");
  const [selectedColumn, setSelectedColumn] = useState("todo");
  const [dueDate, setDueDate] = useState(new Date());
  const [selectedPriority, setSelectedPriority] = useState(
    prioritiesData.options[0]
  );
  const [selectedLabels, setSelectedLabels] = useState([]);
  const [selectedAssignees, setSelectedAssignees] = useState([]);

  /**
   * Toggle label selection by id
   */
  const toggleLabel = (id) => {
    setSelectedLabels((prev) =>
      prev.includes(id) ? prev.filter((el) => el !== id) : [...prev, id]
    );
  };

  /**
   * Toggle assignee selection
   */
  const toggleAssignee = (assignee) => {
    setSelectedAssignees((prev) => {
      const exists = prev.some((el) => el.id === assignee.id);

      return exists
        ? prev.filter((el) => el.id !== assignee.id)
        : [...prev, assignee];
    });
  };

  /**
   * Validate form and create a new task
   */
  const handleAddTask = (e) => {
    e.preventDefault();

    if (!title.trim()) {
      setTitleError("Title is required");
      return;
    }

    setTitleError("");

    const newTask = {
      id: crypto.randomUUID(),
      title,
      description,
      assignees: selectedAssignees,
      labels: selectedLabels,
      priority: selectedPriority.value,
      dueDate: dueDate ? dueDate.toISOString() : null,
    };

    dispatch(addTask(newTask));
    dispatch(addTaskToColumn({ taskId: newTask.id, columnId: selectedColumn }));

    setTitle("");
    setDescription("");
    setDueDate(new Date());
    setSelectedPriority(prioritiesData.options[0]);
    setSelectedLabels([]);
    setSelectedAssignees([]);

    onClose();
  };

  return (
    <Dialog
      open={isNewTaskOpen}
      onClose={onClose}
      transition
      className="fixed inset-0 flex w-screen items-center justify-center bg-black/30 p-4 transition duration-300 ease-out data-closed:opacity-0"
    >
      <DialogBackdrop className="fixed inset-0 bg-black/30" />
      <div className="fixed inset-0 flex w-screen items-center justify-center p-4">
        <DialogPanel className="w-full md:w-xl rounded-lg bg-white pb-5 h-full max-h-max overflow-auto">
          <div className="flex justify-between sticky top-0 z-1 bg-white p-5">
            <div>
              <h3 className="font-bold capitalize">Add New Card</h3>
              <p className="text-xs text-gray-500">Create a new card</p>
            </div>
            <button
              className="w-5 h-5 flex items-center justify-center shrink-0 bg-gray-100 rounded-md cursor-pointer"
              onClick={onClose}
            >
              <X size={14} />
            </button>
          </div>
          <form className="space-y-3 px-5">
            <div>
              <label
                htmlFor="title"
                className="block text-xs font-medium text-gray-700 mb-1"
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
                className={`w-full border rounded-md p-2 text-sm focus:outline-none ${
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
                className="block text-xs font-medium text-gray-700 mb-1"
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
                className="w-full border border-slate-300 rounded-md p-2 text-sm focus:outline-none focus:border-slate-400 resize-none"
              />
            </div>
            <div className="grid md:grid-cols-2 gap-2">
              <div>
                <label
                  htmlFor="select"
                  className="block text-xs font-medium text-gray-700 mb-1"
                >
                  Priority
                  <span className="text-black">*</span>
                </label>
                <CustomSelect
                  value={selectedPriority}
                  onChange={setSelectedPriority}
                  options={prioritiesData.options}
                  placeholder="Priority"
                  optionType="priority"
                  isMulti={false}
                />
              </div>
              <div>
                <label
                  htmlFor="due-date"
                  className="block text-xs font-medium text-gray-700 mb-1"
                >
                  Due date
                </label>
                <DatePicker
                  showIcon
                  selected={dueDate}
                  minDate={new Date()}
                  onChange={(date) => setDueDate(date)}
                  icon={<Calendar size={14} />}
                  className="w-full border border-slate-300 rounded-md !p-2 !ps-7 text-sm focus:outline-none focus:border-slate-400"
                />
              </div>
            </div>
            <div>
              <span className="block text-xs font-medium text-gray-700 mb-1">
                Assignees
              </span>

              {assigneesData.list.length === 0 ? (
                <p className="text-xs text-gray-500 italic">
                  No team members available. Please add users in{" "}
                  <span className="font-medium underline">Settings</span> first.
                </p>
              ) : (
                <div className="flex flex-col gap-1">
                  {assigneesData.list.map((assignee) => {
                    const isActive = selectedAssignees.some(
                      (el) => el.id === assignee.id
                    );

                    return (
                      <button
                        type="button"
                        key={assignee.id}
                        onClick={() => toggleAssignee(assignee)}
                        className={`flex gap-2 p-2 rounded cursor-pointer transition-colors duration-300 ${
                          isActive ? "bg-slate-100" : "hover:bg-slate-100"
                        }`}
                      >
                        <span className="avatar w-7 h-7 flex items-center justify-center rounded-[50%] overflow-hidden">
                          <img src={assignee.avatar} alt={assignee.name} />
                        </span>
                        <div className="flex flex-col items-start">
                          <span className="text-xs">{assignee.name}</span>
                          <span className="text-[10px] text-gray-500">
                            {assignee.email}
                          </span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            <div>
              <span className="block text-xs font-medium text-gray-700 mb-1">
                Lables
              </span>
              {labelsData.list.length === 0 ? (
                <p className="text-xs text-gray-500 italic">
                  No labels available. Please add labels in{" "}
                  <span className="font-medium underline">Settings</span> first.
                </p>
              ) : (
                <div className="flex flex-wrap gap-1">
                  {labelsData.list.map((label) => {
                    const isActive = selectedLabels.includes(label.id);

                    return (
                      <button
                        type="button"
                        key={label.id}
                        onClick={() => toggleLabel(label.id)}
                        className="block capitalize text-[10px] py-0.5 px-2 rounded-lg max-w-max cursor-pointer"
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
              >
                Cancel
              </Button>
              <Button type="submit" onClick={handleAddTask}>
                Add Card
              </Button>
            </div>
          </form>
        </DialogPanel>
      </div>
    </Dialog>
  );
}

export default AddTaskDialog;
