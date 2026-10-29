import classNames from "classnames";
import type { ButtonHTMLAttributes, ReactNode } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  className?: string;
  minWidth?: string;
  fontSize?: string;
  bgColor?: string;
  border?: string;
  textColor?: string;
  borderRadius?: string;
  padding?: string;
  hoverBgColor?: string;
  disabledHoverBgColor?: string;
}

/** Reusable Button component */
export default function Button({
  children,
  onClick,
  className,
  minWidth = "min-w-max",
  fontSize = "text-xs",
  bgColor = "bg-slate-900",
  border = "border-1 border-slate-900",
  textColor = "text-slate-50",
  borderRadius = "rounded-sm",
  padding = "px-4 py-2.5",
  hoverBgColor = "hover:bg-slate-800",
  disabledHoverBgColor,
  ...props
}: ButtonProps) {
  return (
    <button
      onClick={onClick}
      className={classNames(
        "cursor-pointer capitalize transition duration-300 ease-in-out",
        minWidth,
        fontSize,
        bgColor,
        textColor,
        border,
        borderRadius,
        padding,
        hoverBgColor,
        disabledHoverBgColor,
        "disabled:cursor-not-allowed disabled:opacity-50",
        className,
      )}
      {...props}
    >
      {children}
    </button>
  );
}
