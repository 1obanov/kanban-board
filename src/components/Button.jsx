import classNames from "classnames";

/**
 * Reusable Button component
 */
const Button = ({
  children,
  onClick,
  className,
  fontSize = "text-xs",
  bgColor = "bg-slate-900",
  border = "border-1 border-slate-900",
  textColor = "text-slate-50",
  borderRadius = "rounded-sm",
  padding = "px-4 py-2.5",
  hoverBgColor = "hover:bg-slate-800",
  ...props
}) => {
  return (
    <button
      onClick={onClick}
      className={classNames(
        "min-w-max cursor-pointer capitalize transition duration-300 ease-in-out",
        fontSize,
        bgColor,
        textColor,
        borderRadius,
        padding,
        hoverBgColor,
        className,
        border
      )}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;
