import React from "react";
import Select, { components } from "react-select";
import { Check } from "lucide-react";

/**
 * Custom Option renderer for react-select
 * - assignees: shows label + checkbox
 * - labels / priority: shows color dot + label
 */
export const CustomOption = ({ optionType, ...props }) => {
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
            className=" w-3 h-3 rounded-[50%]"
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

/**
 * Custom ValueContainer
 * - shows icon (if provided)
 * - shows selected value for single select
 * - shows placeholder + count for multi select
 */
const ValueContainer = ({ children, getValue, ...props }) => {
  const length = getValue().length;
  const selected = getValue()[0];

  return (
    <components.ValueContainer {...props}>
      {/* Optional icon on the left */}
      {props.selectProps.icon && (
        <span style={{ marginRight: "4px" }}>{props.selectProps.icon}</span>
      )}
      {/* Color dot for single select */}
      {!props.selectProps.isMulti && selected && (
        <span
          className=" w-3 h-3 rounded-[50%]"
          style={{
            backgroundColor: selected.color,
          }}
        ></span>
      )}
      {/* Label for single select */}
      {!props.selectProps.isMulti && selected && (
        <>
          <span>{selected.label}</span>
        </>
      )}
      {/* Placeholder with count for multi select */}
      {!props.selectProps.inputValue &&
        props.selectProps.isMulti &&
        `${props.selectProps.placeholder}${length > 0 ? ` (${length})` : ""}`}
      {React.Children.map(children, (child) =>
        child.type === components.Input ? child : null
      )}
    </components.ValueContainer>
  );
};

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
  ...rest
}) => {
  // Default value for single select if value is not provided
  const defaultValue =
    !isMulti && !value && options.length > 0 ? options[0] : value;

  const handleChange = (selected) => {
    if (onChange) {
      onChange(selected);
    }
  };

  return (
    <Select
      value={defaultValue}
      onChange={handleChange}
      isMulti={isMulti}
      options={options}
      placeholder={placeholder}
      hideSelectedOptions={false}
      components={{
        Option: (props) => <CustomOption {...props} optionType={optionType} />,
        ValueContainer,
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
          backgroundColor: state.isFocused
            ? "#f1f5f9"
            : state.isSelected
            ? "white"
            : "white",
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
      {...rest}
    />
  );
};

export default CustomSelect;
