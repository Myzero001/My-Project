import { Button } from "@radix-ui/themes";
import React, { ChangeEvent, KeyboardEvent, ReactNode , MouseEventHandler } from "react";
import { TextField } from "@radix-ui/themes";
import { SelectInstance } from "react-select";
import { OptionType } from "dayjs";

type ButtonsProps = {
  disabled?: boolean;
  children?: ReactNode;
  className?: string;
  btnType:
    | "submit"
    | "cancel"
    | "delete"
    | "default"
    | "search"
    | "primary"
    | "general";
  size?: "1" | "2" | "3";
  onClick?: MouseEventHandler<HTMLButtonElement> | undefined;
  variant?:
    | "classic"
    | "solid"
    | "soft"
    | "surface"
    | "outline"
    | "ghost"
    | undefined;
  loading?: boolean;
  type?: "submit" | "button" | "reset" | undefined;
  id?: string;
  nextFields?: { left?: string; right?: string; up?: string; down?: string }; // Navigation config
  onSelectedChange?: (value: string) => void;
  value?: string;
  onAction?: () => void;
};

const Buttons = ({
  className,
  onClick,
  disabled = false,
  btnType = "default",
  size = "2",
  children,
  variant = "solid",
  loading,
  type,
  id,
  nextFields = {},
  onSelectedChange,
  value,
  onAction,
}: ButtonsProps) => {
  // Define button styles based on `btnType`
  const buttonStyles: Record<string, string> = {
    general: "text-white",
    submit: "bg-save text-white hover:bg-hover_save", // Submit: Green
    cancel: "bg-gray-500 text-white hover:bg-gray-600", // Cancel: Grey
    delete: "bg-red-500 text-white hover:bg-red-600", // Delete: Red
    default:
      "bg-white text-[#00337d] border border-[#00337d] hover:bg-gray-100 ", // Default: White
    search: "bg-[#0DCAF0] text-white hover:bg-[#4FDDF5]", // Search: Info (blue)
    primary: "bg-[#00337d] text-white hover:bg-[#00337d]", // Primary: Indigo
  };

  const classNameBtn = buttonStyles[btnType] || "";
  const loadingBtn = loading ? "opacity-50 !cursor-not-allowed " : "";
  const hoverEffect =
    loading || disabled ? "" : "hover:opacity-100 hover:bg-opacity-80";


  const handleKeyDown = (e: KeyboardEvent<HTMLButtonElement>) => {
    const keycode = e.key;

    const nextFieldId =
      keycode === "ArrowUp"
        ? nextFields.up
        : keycode === "ArrowDown"
        ? nextFields.down
        : keycode === "ArrowLeft"
        ? nextFields.left
        : keycode === "ArrowRight"
        ? nextFields.right
        : null;

    if (keycode === "Enter") {
      if (onAction) {
        onAction(); // Call onAction if provided
      } else if (nextFields.right) {
        // Fallback: move to next field (right) if onAction is not provided
        const nextField = document.getElementById(nextFields.right);
        if (nextField) {
          (nextField as HTMLInputElement).focus();
          (nextField as HTMLInputElement).select();
        }
      }
    } else if (nextFieldId) {
      // Navigate to the specified field based on arrow key
      e.preventDefault();
      const nextField = document.getElementById(nextFieldId);
      if (nextField) {
        (nextField as HTMLInputElement).focus();
        (nextField as HTMLInputElement).select();
      }
    }
  };

  return (
    <Button
      type={type}
      size={size}
      disabled={disabled}
      onClick={onClick}
      variant={variant}
      id={id}
      onKeyDown={handleKeyDown}
      loading={loading}
      className={`h-input_main px-3 rounded ${classNameBtn} ${className} ${loadingBtn} ${hoverEffect} ${
        disabled || loading
          ? "cursor-not-allowed"
          : "opacity-100 hover:opacity-100"
      } `}
      style={{
        boxShadow: btnType === "default" ? "inset 0 0 0 1px #00337d" : "",
      }}
    >
      {children}
    </Button>
  );
};
export default Buttons;
