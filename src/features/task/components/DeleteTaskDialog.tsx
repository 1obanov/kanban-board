import { Dialog, DialogBackdrop, DialogPanel } from "@headlessui/react";
import { TriangleAlert, X } from "lucide-react";
import { useSelector } from "react-redux";

import Button from "../../../components/Button";
import type { RootState } from "../../../store";
import type { Task } from "../../../types/board";

type DeleteTaskDialogProps = {
  taskTitle: Task["title"];
  handleDeleteTask: () => void;
  isDeleteOpen: boolean;
  onClose: () => void;
};

/** DeleteTaskDialog component */
export default function DeleteTaskDialog({
  taskTitle,
  handleDeleteTask,
  isDeleteOpen,
  onClose,
}: DeleteTaskDialogProps) {
  const { deleteStatus, deleteError } = useSelector(
    (state: RootState) => state.tasks,
  );

  const isSubmitting = deleteStatus === "loading";

  return (
    <Dialog
      open={isDeleteOpen}
      onClose={onClose}
      transition
      className="fixed inset-0 flex w-screen items-center justify-center bg-black/30 p-4 transition duration-300 ease-out data-closed:opacity-0"
    >
      <DialogBackdrop className="fixed inset-0 bg-black/30" />

      <div className="fixed inset-0 flex w-screen items-center justify-center p-4">
        <DialogPanel className="h-full max-h-max w-full max-w-sm overflow-auto rounded-lg bg-white pb-5">
          <div className="sticky top-0 z-1 flex justify-end bg-white p-5">
            <button
              type="button"
              className="flex h-5 w-5 shrink-0 cursor-pointer items-center justify-center rounded-md bg-gray-100"
              onClick={onClose}
            >
              <X size={14} />
            </button>
          </div>
          <div className="space-y-5 px-5">
            <div className="flex flex-col items-center justify-center gap-3 text-center">
              <span className="flex h-10 w-10 items-center justify-center rounded-md bg-red-100 text-red-600">
                <TriangleAlert size={24} strokeWidth={1.5} />
              </span>
              <h3 className="text-lg font-bold capitalize">Are you sure?</h3>
              <p className="text-xs text-gray-500">
                This action cannot be undone. The task{" "}
                <span className="font-semibold underline">{taskTitle}</span>{" "}
                will be permanently deleted.
              </p>
            </div>
            <div className="flex items-center justify-center gap-2">
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
                type="button"
                onClick={handleDeleteTask}
                border={"border-1 border-red-500"}
                bgColor={"bg-red-500"}
                textColor={"text-white"}
                hoverBgColor={"hover:bg-red-400"}
                minWidth="min-w-[50%] md:min-w-30"
                disabledHoverBgColor="disabled:hover:bg-red-500"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Deleting..." : "Delete"}
              </Button>
            </div>
            {deleteError && (
              <p
                className="rounded-lg border border-red-100 bg-red-50 px-2 py-2 text-center text-sm text-red-700"
                role="alert"
              >
                {deleteError}
              </p>
            )}
          </div>
        </DialogPanel>
      </div>
    </Dialog>
  );
}
