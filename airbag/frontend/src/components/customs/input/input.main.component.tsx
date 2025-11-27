import React, { ChangeEvent, KeyboardEvent, ReactNode } from "react";
import { TextField } from "@radix-ui/themes";

interface InputActionProps {
  onAction?: () => void;
  onChange?: (e: ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  label?: string;
  labelOrientation?: "horizontal" | "vertical";
  size?: "1" | "2" | "3";
  value: string;
  defaultValue?: string;
  id?: string;
  nextFields?: {
    left?: string;
    right?: string;
    up?: string;
    down?: string;
    enter?: string;
  };
  className?: string;
  classNameInput?: string;
  classNameLabel?: string;
  require?: string;
  disabled?: boolean;
  type?:
    | "number"
    | "search"
    | "text"
    | "time"
    | "hidden"
    | "date"
    | "datetime-local"
    | "email"
    | "month"
    | "password"
    | "tel"
    | "url"
    | "week"
    | undefined;
  inputMode?:
    | "none"
    | "text"
    | "tel"
    | "url"
    | "email"
    | "numeric"
    | "decimal"
    | "search";
  iconLeft?: ReactNode;
  maxLength?: number;
  errorMessage?: string;
  maxValue?: string | number | undefined;
}

const InputAction: React.FC<InputActionProps> = ({
  onAction,
  onChange,
  placeholder = "Enter value...",
  label = "",
  labelOrientation = "vertical",
  size = "2",
  value = "",
  defaultValue = "",
  id = "",
  nextFields = {},
  className = "",
  classNameInput = "",
  classNameLabel = "",
  require = "",
  disabled = false,
  type = "text",
  inputMode,
  iconLeft,
  maxLength,
  errorMessage,
  maxValue,
}) => {
  const handleKeyDown = (
    e: KeyboardEvent<HTMLInputElement | HTMLDivElement>
  ) => {
    const keycode = e.key;

    const nextFieldId =
      keycode === "ArrowUp"
        ? nextFields?.up
        : keycode === "ArrowDown"
        ? nextFields?.down
        : keycode === "ArrowLeft"
        ? nextFields?.left
        : keycode === "ArrowRight"
        ? nextFields?.right
        : null;

    if (keycode === "Enter") {
      e.preventDefault();
      if (onAction) {
        onAction();
      } else if (nextFields?.down) {
        const nextField = document.getElementById(nextFields.down);
        if (nextField instanceof HTMLElement) {
          nextField.focus();
          if ("select" in nextField) {
            (nextField as HTMLInputElement).select?.();
          }
        }
      }
      return;
    }

    if (keycode === "Enter" && nextFields.enter) {
      e.preventDefault();
      const nextField = document.getElementById(nextFields.enter);
      if (nextField) {
        nextField.focus();
      }
      return;
    }

    if (nextFieldId) {
      e.preventDefault();
      const nextField = document.getElementById(nextFieldId);
      if (nextField instanceof HTMLElement) {
        nextField.focus();
        if ("select" in nextField) {
          (nextField as HTMLInputElement).select?.();
        }
      }
    }
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    let inputValue = e.target.value;

    if (type === "number") {
      const sanitized = inputValue.replace(/[^0-9.]/g, "");
      const parts = sanitized.split(".");
      if (parts.length > 2) {
        inputValue = parts[0] + "." + parts.slice(1).join("");
      } else {
        inputValue = sanitized;
      }
      e.target.value = inputValue;
    }

    if (onChange) {
      onChange(e);
    }
  };

  const finalInputMode =
    inputMode ? inputMode : type === "number" ? "decimal" : "text";

  return (
    <div
      className={className || ""}
      style={{
        display: "flex",
        flexDirection: labelOrientation === "horizontal" ? "row" : "column",
        alignItems: labelOrientation === "horizontal" ? "center" : undefined,
        gap: labelOrientation === "horizontal" ? "0.5rem" : undefined,
      }}
    >
      {label && (
        <label
          style={{
            marginBottom: labelOrientation === "vertical" ? "0.5rem" : "0",
          }}
          className={classNameLabel || ""}
        >
          {label}
          {require && <span style={{ color: "red" }}>*</span>}
        </label>
      )}
      <TextField.Root
        className={`h-input_main ${classNameInput} `}
        size={size}
        placeholder={placeholder}
        value={value}
        defaultValue={defaultValue}
        max={maxValue}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        id={id}
        disabled={disabled}
        type={type === "number" ? "text" : type}
        inputMode={finalInputMode}
        maxLength={maxLength}
      >
        {iconLeft && <TextField.Slot>{iconLeft}</TextField.Slot>}
      </TextField.Root>
      {errorMessage && (
        <div className=" text-red-600 pt-1 text-sm"> {errorMessage}</div>
      )}
    </div>
  );
};

export default InputAction;