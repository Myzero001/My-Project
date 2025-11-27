// export default InputDatePicker;
import { DatePickerInput } from "@/components/ui/datePickerInput";
import { Label } from "@/components/ui/label";
import { Flex } from "@radix-ui/themes";
import React, { ChangeEvent, KeyboardEvent, ReactNode , MouseEventHandler } from "react";


type InputDatePickerProps = {
  id?: string;
  labelName: string;
  onchange: (date: Date | undefined) => void;
  defaultDate?: Date | undefined;
  disabled?: boolean;
  labelOrientation?: "horizontal" | "vertical"; // Label position
  nextFields?: { left?: string; right?: string; up?: string; down?: string }; // Navigation config
  onAction?: () => void;
};

const InputDatePicker = (props: InputDatePickerProps) => {
  const {
    id,
    labelName,
    onchange,
    defaultDate,
    disabled,
    labelOrientation = "vertical",
    nextFields = {},
    onAction,
  } = props;

  const handleKeyDown = (e: KeyboardEvent<HTMLElement>) => {
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
    <Flex direction={labelOrientation === "horizontal" ? "row" : "column"} gap="2">
      <Label
        htmlFor={id}
        style={{
          marginBottom: labelOrientation === "vertical" ? "0" : "0",
        }}
        className=" text-base"
      >
        {labelName}
      </Label>

      <DatePickerInput
        id={id}
        onchange={onchange}
        defaultDate={defaultDate}
        disabled={disabled}
        onKeyDown={handleKeyDown}
        
        // labelOrientation={labelOrientation}
      />
    </Flex>
  );
};

export default InputDatePicker;
