import { Dialog, DialogBackdrop, DialogPanel } from "@headlessui/react";
import { TriangleAlert, X } from "lucide-react";
import Button from "../../../components/Button";

/**
 * DeleteTaskDialog component
 */
function DeleteTaskDialog({ taskTitle, handleDeleteTask, isDeleteOpen, onClose }) {
  return (
    <Dialog
      open={isDeleteOpen}
      onClose={onClose}
      transition
      className="fixed inset-0 flex w-screen items-center justify-center bg-black/30 p-4 transition duration-300 ease-out data-closed:opacity-0"
    >
      <DialogBackdrop className="fixed inset-0 bg-black/30" />

      <div className="fixed inset-0 flex w-screen items-center justify-center p-4">
        <DialogPanel className="w-full max-w-sm rounded-lg bg-white pb-5 h-full max-h-max overflow-auto">
          <div className="flex justify-end sticky top-0 z-1 bg-white p-5">
            <button
              className="w-5 h-5 flex items-center justify-center shrink-0 bg-gray-100 rounded-md cursor-pointer"
              onClick={onClose}
            >
              <X size={14} />
            </button>
          </div>
          <div className="space-y-5 px-5">
            <div className="flex flex-col items-center justify-center gap-3 text-center">
              <span className="w-10 h-10 bg-red-100 text-red-600 flex items-center justify-center rounded-md">
                <TriangleAlert size={24} strokeWidth={1.5} />
              </span>
              <h3 className="font-bold text-lg capitalize">Are you sure?</h3>
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
              >
                Delete
              </Button>
            </div>
          </div>
        </DialogPanel>
      </div>
    </Dialog>
  );
}

export default DeleteTaskDialog;
