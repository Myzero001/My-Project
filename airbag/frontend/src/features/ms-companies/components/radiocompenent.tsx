import { Text } from "@radix-ui/themes";
import React, { ChangeEvent, KeyboardEvent, ReactNode , useRef } from "react";
import { TextField } from "@radix-ui/themes";
import { SelectInstance } from "react-select";
import { OptionType } from "dayjs";

interface RadioMainComponentProps {
  labelName: string;
  value: string;
  id?: string;
  selectedValue: string;
  onSelectedChange: (value: string) => void;
  disabled?: boolean;
  name: string;
  onAction?: () => void;
  nextFields?: { left?: string; right?: string; up?: string; down?: string }; // Navigation config
}


const RadioMainComponent = (props: RadioMainComponentProps) => {
  const selectRef = useRef<SelectInstance<OptionType> | null>(null);
  const { labelName, value, selectedValue, onSelectedChange, disabled, name , id , nextFields = {}, onAction } = props;

  const handleKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    const keycode = e.key;
    if (keycode === "Enter") {
      e.preventDefault();
      onSelectedChange(value);
      return;
    }
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
    <Text as="label" size="2" className="flex gap-2 items-center ">
      <input
        type="radio"
        value={value}
        id={id}
        checked={selectedValue === value}
        onChange={() => onSelectedChange(value)} // ส่งค่าที่เลือกไปยัง onSelectedChange
        disabled={disabled}
        className="h-[24px] w-[24px]"
        onKeyDown={handleKeyDown}
        name={name} // ให้ radio เป็นกลุ่มเดียวกัน
      />
      {labelName}
    </Text>
  );
};

export default RadioMainComponent;
