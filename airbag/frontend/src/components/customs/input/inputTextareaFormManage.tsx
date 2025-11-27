import { HTMLInputTypeAttribute } from "react";
import React, { ChangeEvent, KeyboardEvent, ReactNode , useRef } from "react";
// import { useEffect, useState } from "react";
import { TextField } from "@radix-ui/themes";
import { SelectInstance } from "react-select";
import { OptionType } from "dayjs";


type InputTextareaFormManageProps = {
  register: React.DetailedHTMLProps<
    React.InputHTMLAttributes<HTMLTextAreaElement>,
    HTMLTextAreaElement
  >;
  placeholder: string;
  name: string;
  msgError?: string;
  type?: HTMLInputTypeAttribute | undefined;
  disabled?: boolean;
  required?: boolean;
  showLabel?: boolean;
  rows?: number;
  id?: string;
  nextFields?: { left?: string; right?: string; up?: string; down?: string }; // Navigation config
  onAction?: () => void;
};

const InputTextareaFormManage = ({
  register,
  placeholder,
  name,
  msgError,
  type = "text",
  disabled,
  required,
  showLabel = true,
  rows,
  id,
  nextFields= {},
  onAction
}: InputTextareaFormManageProps) => {

  const selectRef = useRef<SelectInstance<OptionType> | null>(null);
  
  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement | HTMLDivElement>) => {
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

    // ป้องกันอักขระที่ไม่ใช่ตัวเลข หาก type เป็น number หรือ tel
    if (
      (type === "number" || type === "tel") &&
      !/^[0-9]$/.test(keycode) &&
      !["Backspace", "Tab", "ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight", "Enter"].includes(keycode)
    ) {
      e.preventDefault();
      return;
    }

    //  Enter → เรียก onAction หรือ focus ไป nextFields.right
    if (keycode === "Enter") {
      e.preventDefault();
      if (onAction) {
        onAction();
      } else if (nextFields?.right) {
        const nextField = document.getElementById(nextFields.right);
        if (nextField instanceof HTMLElement) {
          nextField.focus();
          if ("select" in nextField) {
            (nextField as HTMLInputElement).select?.();
          }
        }
      }
      return;
    }

    // ลูกศรเลื่อน focus ไป field ถัดไปตามทิศทาง
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

  return (
    <div className=" w-full">
      {showLabel && (
        <label
          className=" flex gap-1 "
          htmlFor={name}
          style={{
            fontWeight: "600",
            fontSize: "16px",
            lineHeight: "28px",
          }}
        >
          {name} {required && <div className=" text-red-500">*</div>}
        </label>
      )}
      <div className=" w-full flex  items-center relative mt-1">
        <textarea
          disabled={disabled}
          id={id}
          onKeyDown={handleKeyDown}
          name={name}
          {...register}
          rows={rows ?? 4}
          maxLength={type === "to" || type === "tel" ? 10 : undefined}
          placeholder={placeholder}
          className={`no-spinners border rounded-lg text-black  p-4 w-full focus:border-gray focus:outline-none `}
        />
      </div>
      {msgError && <div className="text-require">{msgError}</div>}
    </div>
  );
};

export default InputTextareaFormManage;
