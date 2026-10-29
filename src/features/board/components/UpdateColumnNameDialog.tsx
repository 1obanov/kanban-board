import { Dialog, DialogBackdrop, DialogPanel } from "@headlessui/react";
import { X } from "lucide-react";
import { type FormEvent, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import Button from "../../../components/Button";
import type { AppDispatch, RootState } from "../../../store";
import type { Column } from "../../../types/board";
import { changeColumnNameThunk } from "../../columns/columnsThunks";

type UpdateColumnNameDialogProps = {
  columnId: Column["id"];
  columnTitle: Column["title"];
  isEditOpen: boolean;
  onClose: () => void;
};

/**  UpdateColumnNameDialog component */
export default function UpdateColumnNameDialog({
  columnId,
  columnTitle,
  isEditOpen,
  onClose,
}: UpdateColumnNameDialogProps) {
  const dispatch = useDispatch<AppDispatch>();

  const { changeColumnNameStatus, changeColumnNameError } = useSelector(
    (state: RootState) => state.columns,
  );

  const isSubmitting = changeColumnNameStatus === "loading";

  const [title, setTitle] = useState<Column["title"]>(columnTitle);
  const [titleError, setTitleError] = useState("");

  /** Handle updating column name */
  const handleUpdateColumnName = async (
    e: FormEvent<HTMLFormElement>,
  ): Promise<void> => {
    e.preventDefault();

    if (!title.trim()) {
      setTitleError("Name is required");
      return;
    }

    setTitleError("");

    const newColumnId = title
      .trim()
      .toLowerCase()
      .replace(/[^a-zа-яё\s]/gi, "")
      .replace(/\s+/g, "-");

    try {
      await dispatch(
        changeColumnNameThunk({ id: columnId, newColumnId, title }),
      ).unwrap();

      onClose();
    } catch (error) {
      console.error("Failed to update column name:", error);
    }
  };

  useEffect(() => {
    if (isEditOpen) {
      setTitle(columnTitle);
      setTitleError("");
    }
  }, [isEditOpen, columnTitle]);

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
              <h3 className="font-bold capitalize">Edit Column Name</h3>
              <p className="text-xs text-gray-500">
                Edit column name and save your changes
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
          <form onSubmit={handleUpdateColumnName} className="space-y-3 px-5">
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
                placeholder="Rename column name"
                required
                className={`w-full rounded-md border p-2 text-sm capitalize focus:outline-none ${
                  titleError
                    ? "border-red-500"
                    : "border-slate-300 focus:border-slate-400"
                }`}
              />
              {titleError && (
                <p className="mt-1 text-xs text-red-500">{titleError}</p>
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
            {changeColumnNameError && (
              <p
                className="rounded-lg border border-red-100 bg-red-50 px-2 py-2 text-center text-sm text-red-700"
                role="alert"
              >
                {changeColumnNameError}
              </p>
            )}
          </form>
        </DialogPanel>
      </div>
    </Dialog>
  );
}
