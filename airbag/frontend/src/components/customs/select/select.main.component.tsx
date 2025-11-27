import React, { useEffect, useState, useRef } from "react";
import Select, { ActionMeta, SingleValue, SelectInstance } from "react-select";

export type OptionType = {
  label: string;
  value: string | number | null;
  [key: string]: any;
};


type MasterSelectComponentProps = {
  onChange: (
    option: SingleValue<OptionType>,
    actionMeta: ActionMeta<OptionType>
  ) => void;
  id?: string;
  nextFields?: { left?: string; right?: string; up?: string; down?: string };
  fetchDataFromGetAPI: () => Promise<any>;
  onInputChange?: (inputText: string) => void;
  valueKey: string;
  labelKey: string;
  placeholder?: string;
  isClearable?: boolean;
  label?: string;
  labelOrientation?: "horizontal" | "vertical";
  className?: string;
  classNameSelect?: string;
  classNameLabel?: string;
  require?: string;
  heightInput?: string;
  value?: SingleValue<OptionType> | null;
  defaultValue?: SingleValue<OptionType> | null;
  isDisabled?: boolean;
  errorMessage?: string;
  isServerSideSearch?: boolean;
};

const MasterSelectComponent: React.FC<MasterSelectComponentProps> = ({
  onChange,
  id = "",
  nextFields = {},
  fetchDataFromGetAPI,
  onInputChange,
  valueKey,
  labelKey,
  placeholder = "Select an option",
  isClearable = true,
  label = "",
  labelOrientation = "vertical",
  className = "",
  classNameSelect = "",
  classNameLabel = "",
  require = "",
  heightInput = "32px",
  value: controlledValue,
  defaultValue,
  isDisabled,
  errorMessage,
  isServerSideSearch = false,
}) => {
  const [options, setOptions] = useState<OptionType[]>([]);
  const [internalValue, setInternalValue] = useState<SingleValue<OptionType> | null>(null);
  const selectRef = useRef<SelectInstance<OptionType> | null>(null);
  const isControlled = controlledValue !== undefined;
  const value = isControlled ? controlledValue : internalValue;

  useEffect(() => {
    const fetchOptions = async () => {
      try {
        const res = await fetchDataFromGetAPI();
        
        const formattedOptions = res?.responseObject?.map((item: any) => ({
          label: item[labelKey],
          value: item[valueKey],
          ...item,
        }));
        setOptions(formattedOptions);

        if (!isControlled && defaultValue) {
          const foundDefault = formattedOptions?.find((o: OptionType) => o.value === defaultValue.value);
          if (foundDefault) {
            setInternalValue(foundDefault);
          }
        }

      } catch (error) {
        console.error("Error fetching select options:", error);
      }
    };

    fetchOptions();
  }, [fetchDataFromGetAPI, valueKey, labelKey, defaultValue, isControlled]);

  const handleChange = (
    option: SingleValue<OptionType>,
    actionMeta: ActionMeta<OptionType>
  ) => {
    // ถ้าไม่ใช่ Controlled component ให้ update state ภายใน
    if (!isControlled) {
      setInternalValue(option);
    }
    // เรียก callback ของ Parent เสมอ
    onChange(option, actionMeta);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    const key = e.key;

    if (key === "Enter") {
      selectRef.current?.focus();
      selectRef.current?.onMenuOpen?.();
      e.preventDefault();
      return;
    }

    const nextFieldId =
      key === "ArrowUp"
        ? nextFields?.up
        : key === "ArrowDown"
          ? nextFields?.down
          : key === "ArrowLeft"
            ? nextFields?.left
            : key === "ArrowRight"
              ? nextFields?.right
              : null;

    if (nextFieldId) {
      const nextEl = document.getElementById(nextFieldId);
      if (nextEl) {
        nextEl.focus();
        (nextEl as HTMLInputElement).select?.();
      }
      e.preventDefault();
    }
  };


  return (
    <div
      className={className || ""}
      style={{
        display: labelOrientation === "horizontal" ? "flex" : "block",
        alignItems: labelOrientation === "horizontal" ? "center" : undefined,
        gap: labelOrientation === "horizontal" ? "0.5rem" : undefined,
      }}
    >
      {label && (
        <div
          style={{
            marginBottom: labelOrientation === "vertical" ? "0.5rem" : "0",
          }}
          className={classNameLabel || ""}
        >
          <label>{label}</label>
          {require && <span style={{ color: "red" }}>*</span>}
        </div>
      )}
      <Select
        options={options}
        onChange={handleChange}
        onInputChange={(inputValue, { action }) => {
          if (action === "input-change" && onInputChange) {
            onInputChange(inputValue);
          }
        }}
        defaultValue={defaultValue}
        value={value}
        placeholder={placeholder}
        isClearable={isClearable}
        classNamePrefix="react-select"
        className={classNameSelect}
        ref={selectRef}
        inputId={id}
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            const menuList = document.querySelector(".react-select__menu-list");
            const focusedOption = menuList?.querySelector(".react-select__option--is-focused") as HTMLElement;
            if (focusedOption) {
              focusedOption.click();
              e.preventDefault();
              return;
            }
          }

          handleKeyDown(e); // คีย์อื่น ๆ ใช้ logic เดิมของคุณ
        }}
        isDisabled={isDisabled}
        styles={{
          control: (base, state) => ({
            ...base,
            minHeight: "32px",
            height: heightInput,
            borderColor: "#d9d9e0",
            backgroundColor: state.isDisabled ? "#f9f9fb" : "#ffffff",
            opacity: 1,
            boxShadow: "none",
            width: "100%",
            "&:hover": {
              borderColor: "#3b82f6",
            },
          }),
          valueContainer: (base) => ({
            ...base,
            height: heightInput,
            padding: "0 8px",
            fontSize: "14px",
            whiteSpace: "nowrap",
          }),
          singleValue: (base, state) => ({
            ...base,
            color: state.isDisabled ? "#0007149f" : "#000000",
            fontSize: "14px",
          }),
          input: (base, state) => ({
            ...base,
            margin: "0",
            color: state.isDisabled ? "#0007149f" : "#000000",
          }),
          indicatorsContainer: (provided) => ({
            ...provided,
            height: heightInput,
          }),

        }}
      />
      {errorMessage && (
        <div className=" text-red-600 pt-1 text-xs"> {errorMessage}</div>
      )}
    </div>
  );
};

export default MasterSelectComponent;
