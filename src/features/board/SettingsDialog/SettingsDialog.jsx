import { Dialog, DialogPanel, DialogBackdrop } from "@headlessui/react";
import { TabGroup, TabList, Tab, TabPanels, TabPanel } from "@headlessui/react";
import { X } from "lucide-react";
import AssigneesTab from "./AssigneesTab";
import LabelsTab from "./LabelsTab";

/** Helper to join conditional class names */
function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

/**
 * Board Settings dialog component
 * - Manages board settings in tabs (Users / Labels)
 * - Uses Headless UI Dialog & Tabs
 */
function SettingsDialog({ isSettingOpen, onClose }) {
  return (
    <Dialog
      open={isSettingOpen}
      onClose={onClose}
      transition
      className="fixed inset-0 flex w-screen items-center justify-center bg-black/30 p-4 transition duration-300 ease-out data-closed:opacity-0"
    >
      <DialogBackdrop className="fixed inset-0 bg-black/30" />
      <div className="fixed inset-0 flex w-screen items-center justify-center p-4">
        <DialogPanel className="w-full md:w-xl rounded-lg bg-white pb-5 h-full max-h-max overflow-auto">
          <div className="flex justify-between sticky top-0 z-1 bg-white p-5">
            <div>
              <h3 className="font-bold capitalize">Board Settings</h3>
              <p className="text-xs text-gray-500">
                Configure your board settings, manage users, and customize
                labels and priorities
              </p>
            </div>
            <button
              className="w-5 h-5 flex items-center justify-center shrink-0 bg-gray-100 rounded-md cursor-pointer"
              onClick={onClose}
            >
              <X size={14} />
            </button>
          </div>
          <div className="px-5">
            <TabGroup>
              <TabList className="grid grid-cols-2 bg-gray-100 rounded-[14px] p-1 mb-4">
                <Tab
                  className={({ selected }) =>
                    classNames(
                      "px-3 py-1.5 text-sm font-medium",
                      selected
                        ? "bg-white rounded-xl"
                        : " hover:text-gray-700 cursor-pointer"
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
                        ? "bg-white rounded-xl"
                        : " hover:text-gray-700 cursor-pointer"
                    )
                  }
                >
                  Labels
                </Tab>
              </TabList>
              <TabPanels className="">
                <TabPanel>
                  <AssigneesTab />
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

export default SettingsDialog;
