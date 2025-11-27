import { Text } from "@radix-ui/themes";
import { KeyboardEvent } from "react";

type CheckboxMainComponentProps = {
  labelName?: string;
  checked?: boolean;
  defaultChecked?: boolean;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
  id?: string;
  nextFields?: { left?: string; right?: string; up?: string; down?: string };
  onAction?: () => void;
};

const CheckboxMainComponent = (props: CheckboxMainComponentProps) => {
  const {
    labelName,
    checked,
    defaultChecked,
    onChange,
    disabled,
    id,
    nextFields = {},
    onAction,
  } = props;

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    const keycode = e.key;

    if (keycode === "Enter") {
      e.preventDefault();
      e.stopPropagation();
      onChange(!checked);
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
    <Text as="label" size="2" className="items-center gap-2 cursor-pointer flex">
      <input
        id={id}
        type="checkbox"
        checked={checked}
        defaultChecked={defaultChecked}
        onChange={(e) => onChange(e.target.checked)}
        onKeyDown={handleKeyDown} // ผูก event ที่อัปเดตแล้ว
        disabled={disabled}
        className="h-[24px] w-[24px] flex-shrink-0"
      />
      {labelName}
    </Text>
  );
};

export default CheckboxMainComponent;