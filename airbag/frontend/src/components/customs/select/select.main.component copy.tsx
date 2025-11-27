import React, { useEffect, useState } from "react";
import Select, { ActionMeta, SingleValue } from "react-select";

export type OptionType = {
  label: string;
  value: string | number;
  [key: string]: any; // For additional properties
};

type MasterSelectComponentProps = {
  onChange: (
    option: SingleValue<OptionType>,
    actionMeta: ActionMeta<OptionType>
  ) => void;
  fetchDataFromGetAPI: () => Promise<any>; // Function to fetch data
  valueKey: string; // Key to extract the value from fetched options
  labelKey: string; // Key to extract the label from fetched options
  placeholder?: string;
  onInputChange?: (inputText: string) => void;
  isClearable?: boolean; // Allow clearing the selection
  label?: string; // Optional label for the input
  labelOrientation?: "horizontal" | "vertical"; // Label position
  className?: string;
  classNameSelect?: string;
  classNameLabel?: string;
  heightInput?: string;
  defaultValue?: SingleValue<OptionType> | null;
  isDisabled?: boolean;
  errorMessage?: string;
  require?: string;
};

const MasterSelectComponent: React.FC<MasterSelectComponentProps> = ({
  onChange,
  fetchDataFromGetAPI,
  valueKey,
  labelKey,
  placeholder = "Select an option",
  isClearable = true,
  label = "",
  labelOrientation = "vertical",
  className = "",
  classNameSelect = "",
  classNameLabel = "",
  heightInput = "32px",
  defaultValue,
  isDisabled,
  errorMessage,
  require = "",
}) => {
  const [options, setOptions] = useState<OptionType[]>([]);
  const [value, setValue] = useState<SingleValue<OptionType> | null>(null);

  useEffect(() => {
    const fetchOptions = async () => {
      try {
        const res = await fetchDataFromGetAPI();
        
        const formattedOptions = res?.responseObject?.map((item: any) => ({
          label: item[labelKey],
          value: item[valueKey],
          ...item, // Include additional data if needed
        }));console.log("formattedOptions", formattedOptions)
        setOptions(formattedOptions);
        if (!formattedOptions) {
          setValue(null);
        }
      } catch (error) {
        console.error("Error fetching select options:", error);
      }
    };

    fetchOptions();
  }, [fetchDataFromGetAPI, valueKey, labelKey]);

  useEffect(() => {
    if (defaultValue) {
      const mewValue = options?.filter((o) => o.value === defaultValue.value);
      if (mewValue) {
        setValue(mewValue[0]);
      }
    }
  }, [defaultValue, options]);

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
        onChange={(
          option: SingleValue<OptionType>,
          actionMeta: ActionMeta<OptionType>
        ) => {
          setValue(option);
          onChange(option, actionMeta);
        }}
        // defaultValue={defaultValue}
        value={value}
        placeholder={placeholder}
        isClearable={isClearable}
        classNamePrefix="react-select"
        className={`${classNameSelect}`}
        menuPosition="fixed" 
        styles={{
          control: (base, state) => ({
            ...base,
            minHeight: "32px",
            height: heightInput,
            borderColor: "#d9d9e0",
            backgroundColor: state.isDisabled ? "#f9f9fb" : "#ffffff",
            opacity: 1,
            boxShadow: "none",
            "&:hover": {
              borderColor: "#3b82f6",
            },
          }),
          valueContainer: (base) => ({
            ...base,
            height: heightInput,
            padding: "0 8px",
            fontSize: "14px",
          }),
          singleValue: (base, state) => ({
            ...base,
            color: state.isDisabled ? "#0007149f" : "#000000",
            fontSize: "14px", // สามารถปรับขนาดตัวอักษรได้ตามต้องการ
          }),
          input: (base, state) => ({
            ...base,
            margin: "0",
            color: state.isDisabled ? "#0007149f" : "#000000",
          }),
          indicatorsContainer: (provided, state) => ({
            ...provided,
            height: heightInput,
          }),
          menu: (base) => ({
            ...base,
            zIndex: 9999,
          }),
          menuPortal: (base) => ({
            ...base,
            zIndex: 9999,
          }),
          menuList: (base) => ({
            ...base,
            maxHeight: "200px",
            overflowY: "auto",
          }),
        }}
        isDisabled={isDisabled}
      />
      {errorMessage && (
        <div className=" text-red-600 pt-1 text-xs"> {errorMessage}</div>
      )}
    </div>
  );
};

export default MasterSelectComponent;
