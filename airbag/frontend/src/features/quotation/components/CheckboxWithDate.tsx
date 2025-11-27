"use client";

import CheckboxMainComponent from "@/components/customs/checkboxs/checkbox.main.component";
import InputAction from "@/components/customs/input/input.main.component";
import { Flex } from "@radix-ui/themes";

type CheckboxWithInputProps = {
  id: string;
  labelName: string;
  labelInputName: string;
  placeholder: string;
  onChange: (check: boolean, numberValue: string | undefined) => void;
  onChangeCheckBox: (check: boolean, numberValue: string | undefined) => void;
  isChecked: boolean;
  inputValue: string;
  disabled?: boolean;
};
const CheckboxWithInput = (props: CheckboxWithInputProps) => {
  const {
    labelName,
    labelInputName,
    id,
    placeholder,
    onChange,
    onChangeCheckBox,
    isChecked,
    inputValue,
    disabled,
  } = props;

  // const [isChecked, setIschecked] = useState(false);
  // const [inputValue, setInputValue] = useState<string>();

  const handleChangeCheckBox = (e: boolean) => {
    onChangeCheckBox(e, inputValue);
  };
  return (
    <Flex align={"center"} justify={"between"}>
      <CheckboxMainComponent
        labelName={labelName}
        defaultChecked={isChecked}
        onChange={handleChangeCheckBox}
        disabled={disabled}
      />
      <InputAction
        id={id}
        placeholder={placeholder}
        value={inputValue}
        onChange={(e) => {
          // setInputValue(e.target.value);
          onChange(isChecked, e.target.value);
        }}
        disabled={disabled ? disabled : !isChecked}
        label={labelInputName}
        labelOrientation={"horizontal"}
        size={"2"}
        type="number"
        defaultValue={inputValue}
        classNameInput=" w-full max-w-[80px]"
        classNameLabel=" text-[14px] mt-[-1px]"
      />
    </Flex>
  );
};

export default CheckboxWithInput;
