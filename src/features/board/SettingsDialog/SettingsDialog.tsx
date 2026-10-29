import {
  Dialog,
  DialogBackdrop,
  DialogPanel,
  Tab,
  TabGroup,
  TabList,
  TabPanel,
  TabPanels,
} from "@headlessui/react";
import { X } from "lucide-react";

import LabelsTab from "./LabelsTab";
import UsersTab from "./UsersTab";

type SettingsDialogProps = {
  isSettingOpen: boolean;
  onClose: () => void;
};

/** Helper to join conditional class names */
function classNames(...classes: string[]): string {
  return classes.filter(Boolean).join(" ");
}

/**  SettingsDialog component */
export default function SettingsDialog({
  isSettingOpen,
  onClose,
}: SettingsDialogProps) {
  return (
    <Dialog
      open={isSettingOpen}
      onClose={onClose}
      transition
      className="fixed inset-0 flex w-screen items-center justify-center bg-black/30 p-4 transition duration-300 ease-out data-closed:opacity-0"
    >
      <DialogBackdrop className="fixed inset-0 bg-black/30" />
      <div className="fixed inset-0 flex w-screen items-center justify-center p-4">
        <DialogPanel className="h-full max-h-max w-full overflow-auto rounded-lg bg-white pb-5 md:w-xl">
          <div className="sticky top-0 z-1 flex justify-between bg-white p-5">
            <div>
              <h3 className="font-bold capitalize">Board Settings</h3>
              <p className="text-xs text-gray-500">
                Configure your board settings, manage users, and customize
                labels and priorities
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
          <div className="px-5">
            <TabGroup>
              <TabList className="mb-4 grid grid-cols-2 rounded-[14px] bg-gray-100 p-1">
                <Tab
                  className={({ selected }) =>
                    classNames(
                      "px-3 py-1.5 text-sm font-medium",
                      selected
                        ? "rounded-xl bg-white"
                        : "cursor-pointer hover:text-gray-700",
                    )
                  }
                >
                  Users
                </Tab>
                <Tab
                  className={({ selected }) =>
                    classNames(
                      "px-3 py-1.5 text-sm font-medium",
                      selected
                        ? "rounded-xl bg-white"
                        : "cursor-pointer hover:text-gray-700",
                    )
                  }
                >
                  Labels
                </Tab>
              </TabList>
              <TabPanels className="">
                <TabPanel>
                  <UsersTab />
                </TabPanel>
                <TabPanel>
                  <LabelsTab />
                </TabPanel>
              </TabPanels>
            </TabGroup>
          </div>
        </DialogPanel>
      </div>
    </Dialog>
  );
}
