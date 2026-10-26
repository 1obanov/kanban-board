import { Sketch } from "@uiw/react-color";
import { Tag, X } from "lucide-react";
import { type FormEvent, useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import Button from "../../../components/Button";
import type { AppDispatch, RootState } from "../../../store";
import type { Label } from "../../../types/label";
import { addLabel } from "../boardSlice";
import { removeLabel } from "../boardThunks";

/**
 * Tab for managing labels in board settings
 * - Add new labels with color
 * - Delete existing labels
 * - Supports color picker
 */
export default function LabelsTab() {
  const dispatch = useDispatch<AppDispatch>();

  const availableLabels = useSelector(
    (state: RootState) => state.board.availableLabels,
  );

  const [labelName, setLabelName] = useState("");
  const [labelNameError, setLabelNameError] = useState("");
  const [color, setColor] = useState("#ff0000");
  const [displayColorPicker, setDisplayColorPicker] = useState(false);
  const pickerRef = useRef<HTMLDivElement>(null);

  /** Add new label */
  const handleAddLabel = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const labelId = labelName
      .trim()
      .toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/[^a-z0-9-]/g, "");

    if (!labelId) {
      setLabelNameError("Please enter a valid label name");
      return;
    }

    // Check if label already exists
    const labelExists = availableLabels.some((label) => label.id === labelId);
    if (labelExists) {
      setLabelNameError("Label already exists");
      return;
    }

    // Create new label
    const newLabel: Label = {
      id: labelId,
      name: labelName.trim(),
      color,
    };

    dispatch(addLabel(newLabel));

    // Reset form
    setLabelName("");
    setLabelNameError("");
    setColor("#ff0000");
    setDisplayColorPicker(false);
  };

  /** Delete a label */
  const handleDeleteLabel = (labelId: Label["id"]) => {
    dispatch(removeLabel(labelId));
  };

  // Close color picker when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        pickerRef.current &&
        !pickerRef.current.contains(event.target as Node)
      ) {
        setDisplayColorPicker(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div>
      <h3 className="mb-2 font-medium capitalize">Labels</h3>
      <form onSubmit={handleAddLabel} className="mb-3 space-y-3">
        <div className="grid gap-2 md:grid-cols-2">
          <div>
            <label
              htmlFor="label-name"
              className="mb-1 block text-xs font-medium text-gray-700"
            >
              Label name
              <span className="text-black">*</span>
            </label>
            <input
              type="text"
              id="label-name"
              name="label-name"
              value={labelName}
              onChange={(e) => {
                setLabelName(e.target.value);
                if (e.target.value.trim() !== "") {
                  setLabelNameError("");
                }
              }}
              placeholder="Enter name"
              required
              className={`w-full rounded-md border p-2 text-sm focus:outline-none ${
                labelNameError
                  ? "border-red-500"
                  : "border-slate-300 focus:border-slate-400"
              }`}
            />
            {labelNameError && (
              <p className="mt-1 text-xs text-red-500">{labelNameError}</p>
            )}
          </div>
          <div className="relative">
            <label
              htmlFor="color"
              className="mb-1 block text-xs font-medium text-gray-700"
            >
              Color
            </label>

            <div className="h-9.5 w-full rounded-md border-1 border-slate-300 bg-gray-100 p-2">
              <span
                className="block h-full w-full cursor-pointer rounded-sm border-1 border-black"
                style={{ backgroundColor: color }}
                onClick={() => setDisplayColorPicker(!displayColorPicker)}
              />
            </div>

            <div ref={pickerRef} className="relative">
              {displayColorPicker && (
                <div className="absolute z-10 mt-1">
                  <Sketch
                    color={color}
                    onChange={(newColor) => setColor(newColor.hex)}
                  />
                </div>
              )}
            </div>
          </div>
        </div>
        <div>
          <Button
            type="submit"
            className={`flex items-center gap-2 px-2 py-2 text-sm ${
              !labelName.trim()
                ? "!cursor-default opacity-50 hover:bg-slate-900"
                : ""
            }`}
            padding={"px-2 py-2"}
            disabled={!labelName.trim()}
          >
            <Tag size={14} />
            Add label
          </Button>
        </div>
      </form>
      <div>
        <span className="mb-1 block text-xs font-medium text-gray-700">
          Current Labels
        </span>
        {availableLabels.length === 0 ? (
          <p className="text-xs text-gray-500 italic">
            No labels yet. Add a new label to categorize your tasks
          </p>
        ) : (
          <div className="flex flex-wrap gap-1">
            {availableLabels.map((label) => (
              <div
                key={label.id}
                className="flex max-w-max items-center justify-between gap-1 rounded-lg px-2 py-0.5 text-[10px] capitalize"
                style={{
                  backgroundColor: `${label.color}20`,
                  color: label.color,
                }}
              >
                {label.name}

                <button
                  type="button"
                  onClick={() => handleDeleteLabel(label.id)}
                  style={{ backgroundColor: label.color }}
                  className="flex h-3 w-3 cursor-pointer items-center justify-center rounded-full text-white transition duration-300 hover:bg-gray-200"
                >
                  <X size={10} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
