import { Check } from "lucide-react";

/**
 * FilterSection component
 * Renders a list of filter options with selectable checkboxes and a "Clear All" button.
 * Used in the FiltersDialog for Assignees, Labels, and Priorities.
 */
function FilterSection({
  title,
  icon: Icon,
  list = [],
  options = [],
  selected = [],
  onToggle,
  onClear,
  emptyMessage,
}) {
  return (
    <div>
      <span className="flex items-center justify-between pb-1 mb-1 border-b border-slate-200">
        <span className="flex items-center gap-1 text-sm font-medium text-gray-700">
          <Icon size={14} />
          {title}
        </span>
        {selected.length > 0 && (
          <button
            type="button"
            onClick={onClear}
            className="text-sm cursor-pointer underline"
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
              const isActive = selected.some((el) => el.value === option.value);

              return (
                <button
                  type="button"
                  key={option.value}
                  onClick={() => onToggle(option)}
                  className="flex items-center gap-1.5 py-2 rounded cursor-pointer transition-colors duration-300"
                >
                  <span
                    className={`flex items-center justify-center w-4 h-4 rounded-sm border ${
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

export default FilterSection;
