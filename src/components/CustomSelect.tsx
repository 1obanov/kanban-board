import { Check } from "lucide-react";
import React, { type ReactNode } from "react";
import Select, {
  components,
  type GroupBase,
  type MultiValue,
  type OptionProps,
  type Props,
  type SingleValue,
  type ValueContainerProps,
} from "react-select";

type SelectOption = {
  label: string;
  value: string;
  color?: string;
};

type OptionType = "assignees" | "labels" | "priority";

type CustomOptionProps = OptionProps<
  SelectOption,
  boolean,
  GroupBase<SelectOption>
> & {
  optionType: OptionType;
};

/**
 * Custom Option renderer for react-select
 * - assignees: shows label + checkbox
 * - labels / priority: shows color dot + label
 */
export const CustomOption = ({ optionType, ...props }: CustomOptionProps) => {
  if (optionType === "assignees") {
    // Checkbox option for assignees
    return (
      <components.Option {...props}>
        <span className="flex items-center justify-between gap-0.5">
          <span>{props.label}</span>
          <span>{props.isSelected && <Check size={14} />}</span>
        </span>
      </components.Option>
    );
  }

  // Color-dot option for labels and priority
  return (
    <components.Option {...props}>
      <span className="flex items-center justify-between gap-0.5">
        <span className="flex items-center justify-between gap-2">
          <span
            className="h-3 w-3 rounded-[50%]"
            style={{
              backgroundColor: props.data.color,
            }}
          ></span>
          <span>{props.label}</span>
        </span>
        <span>{props.isSelected && <Check size={14} />}</span>
      </span>
    </components.Option>
  );
};

type CustomValueContainerProps = ValueContainerProps<
  SelectOption,
  boolean,
  GroupBase<SelectOption>
> & {
  icon?: ReactNode;
};

/**
 * Custom ValueContainer
 * - shows icon (if provided)
 * - shows selected value for single select
 * - shows placeholder + count for multi select
 */
const ValueContainer = ({
  children,
  getValue,
  selectProps,
  icon,
  ...props
}: CustomValueContainerProps) => {
  const selected = getValue()[0];
  const length = getValue().length;

  return (
    <components.ValueContainer
      {...props}
      getValue={getValue}
      selectProps={selectProps}
    >
      {icon && <span className="mr-1">{icon}</span>}

      {!selectProps.isMulti && selected?.color && (
        <span
          className="h-3 w-3 rounded-full"
          style={{ backgroundColor: selected.color }}
        />
      )}

      {!selectProps.isMulti && selected && <span>{selected.label}</span>}

      {!selectProps.inputValue &&
        selectProps.isMulti &&
        `${selectProps.placeholder ?? ""}${length > 0 ? ` (${length})` : ""}`}

      {React.Children.map(children, (child) =>
        React.isValidElement(child) && child.type === components.Input
          ? child
          : null,
      )}
    </components.ValueContainer>
  );
};

interface CustomSelectProps extends Omit<
  Props<SelectOption, boolean, GroupBase<SelectOption>>,
  "options" | "value" | "onChange" | "isMulti" | "components"
> {
  options: SelectOption[];
  value?: SingleValue<SelectOption> | MultiValue<SelectOption>;
  onChange?: (
    value: SingleValue<SelectOption> | MultiValue<SelectOption>,
  ) => void;
  placeholder?: string;
  optionType: OptionType;
  isMulti?: boolean;
  icon?: ReactNode;
}

/**
 * Reusable Custom Select component
 */
const CustomSelect = ({
  value,
  onChange,
  options,
  placeholder = "Select...",
  optionType,
  isMulti = true,
  icon,
  ...rest
}: CustomSelectProps) => {
  const selectedValue =
    !isMulti && value == null && options.length > 0 ? options[0] : value;

  return (
    <Select<SelectOption, boolean, GroupBase<SelectOption>>
      {...rest}
      value={selectedValue}
      onChange={(newValue) => onChange?.(newValue)}
      isMulti={isMulti}
      options={options}
      placeholder={placeholder}
      hideSelectedOptions={false}
      components={{
        Option: (props) => <CustomOption {...props} optionType={optionType} />,
        ValueContainer: (props) => <ValueContainer {...props} icon={icon} />,
      }}
      styles={{
        valueContainer: (provided) => ({
          ...provided,
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          gap: "4px",
        }),
        control: (provided, state) => ({
          ...provided,
          fontSize: "14px",
          borderColor: state.isFocused ? "#90a1b9" : "#cad5e2",
          boxShadow: "none",
          borderRadius: "6px",
          "&:hover": {
            borderColor: "#90a1b9",
          },
        }),
        menu: (provided) => ({
          ...provided,
          borderRadius: "4px",
          boxShadow: "0 0 0 1px #cad5e2",
        }),
        menuList: (provided) => ({
          ...provided,
          padding: "0",
          borderRadius: "4px",
        }),
        option: (provided, state) => ({
          ...provided,
          fontSize: "14px",
          backgroundColor: state.isFocused ? "#f1f5f9" : "white",
          color: "black",
          textTransform: "capitalize",
          cursor: "pointer",
          ":active": {
            backgroundColor: "#f1f5f9",
          },
          borderBottom: "1px solid #cad5e2",
          ":last-child": {
            borderBottom: "none",
          },
        }),
        noOptionsMessage: (base) => ({
          ...base,
          fontSize: "14px",
          color: "black",
          backgroundColor: "#ffffff",
        }),
      }}
    />
  );
};

export default CustomSelect;
