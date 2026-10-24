import { Sketch } from "@uiw/react-color";
import { Tag, X } from "lucide-react";
import { type FormEvent,useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import Button from "../../../components/Button";
import type { Label } from "../../../data/labels";
import type { AppDispatch, RootState } from "../../../store";
import { addLabel } from "../boardSlice";
import { removeLabel } from "../boardThunks";

/**
 * Tab for managing labels in board settings
 * - Add new labels with color
 * - Delete existing labels
 * - Supports color picker
 */
function LabelsTab() {
  const labelsData = useSelector((state: RootState) => state.board.labelsData);

  const dispatch = useDispatch<AppDispatch>();

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
    const labelExists = labelsData.list.some((label) => label.id === labelId);
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
      <h3 className="font-medium capitalize mb-2">Labels</h3>
      <form onSubmit={handleAddLabel} className="space-y-3 mb-3">
        <div className="grid md:grid-cols-2 gap-2">
          <div>
            <label
              htmlFor="label-name"
              className="block text-xs font-medium text-gray-700 mb-1"
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
              className={`w-full border rounded-md p-2 text-sm focus:outline-none ${
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
              className="block text-xs font-medium text-gray-700 mb-1"
            >
              Color
            </label>

            <div className="w-full h-9.5 rounded-md bg-gray-100 border-1 border-slate-300 p-2">
              <span
                className="block w-full h-full cursor-pointer rounded-sm border-1 border-black"
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
            className={`text-sm flex items-center gap-2 px-2 py-2 
    ${
      !labelName.trim() ? "opacity-50 hover:bg-slate-900 !cursor-default " : ""
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
        <span className="block text-xs font-medium text-gray-700 mb-1">
          Current Labels
        </span>
        {labelsData.list.length === 0 ? (
          <p className="text-xs text-gray-500 italic">
            No labels yet. Add a new label to categorize your tasks
          </p>
        ) : (
          <div className="flex flex-wrap gap-1">
            {labelsData.list.map((label) => (
              <div
                key={label.id}
                className="flex items-center justify-between gap-1 capitalize text-[10px] py-0.5 px-2 rounded-lg max-w-max"
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
                  className="w-3 h-3 flex items-center justify-center rounded-full text-white hover:bg-gray-200 cursor-pointer transition duration-300"
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

export default LabelsTab;
