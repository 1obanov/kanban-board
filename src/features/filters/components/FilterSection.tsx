import { Check, type LucideIcon } from "lucide-react";

import type { PriorityID } from "../../../types/priority";

type FilterTitle = "Assignees" | "Labels" | "Priority";

type FilterOption = {
  value: string;
  label: string;
  color?: string;
};

type FilterSectionProps<Option extends FilterOption, Item> = {
  title: FilterTitle;
  icon: LucideIcon;
  list: Item[];
  options: Option[];
  selected: Option[] | PriorityID[];
  onToggle: (option: Option) => void;
  onClear: () => void;
  emptyMessage: React.ReactNode;
};

/**  FilterSection component */
export default function FilterSection<Option extends FilterOption, Item>({
  title,
  icon: Icon,
  list = [],
  options = [],
  selected = [],
  onToggle,
  onClear,
  emptyMessage,
}: FilterSectionProps<Option, Item>) {
  const isPriority = title === "Priority";

  return (
    <div>
      <span className="mb-1 flex items-center justify-between border-b border-slate-200 pb-1">
        <span className="flex items-center gap-1 text-sm font-medium text-gray-700">
          <Icon size={14} />
          {title}
        </span>
        {selected.length > 0 && (
          <button
            type="button"
            onClick={onClear}
            className="cursor-pointer text-sm underline"
          >
            Clear All
          </button>
        )}
      </span>
      <div>
        {list.length === 0 ? (
          <p className="text-xs text-gray-500 italic">{emptyMessage}</p>
        ) : (
          <div className="flex flex-col">
            {options.map((option) => {
              const isActive = isPriority
                ? (selected as PriorityID[]).includes(
                    option.value as PriorityID,
                  )
                : (selected as Option[]).some(
                    (item) => item.value === option.value,
                  );

              return (
                <button
                  type="button"
                  key={option.value}
                  onClick={() => onToggle(option)}
                  className="flex cursor-pointer items-center gap-1.5 rounded py-2 transition-colors duration-300"
                >
                  <span
                    className={`flex h-4 w-4 items-center justify-center rounded-sm border ${
                      isActive
                        ? "border-slate-900 bg-slate-900 text-slate-50"
                        : "border-gray-300"
                    }`}
                  >
                    {isActive && <Check size={14} />}
                  </span>

                  <span className="text-xs">{option.label}</span>
                </button>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
