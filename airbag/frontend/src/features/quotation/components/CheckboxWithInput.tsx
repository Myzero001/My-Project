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
  nextFields?: { left?: string; right?: string; up?: string; down?: string };
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
    nextFields = {},
  } = props;

  const inputFieldId = `${id}-input`;

  const handleChangeCheckBox = (checked: boolean) => {
    onChangeCheckBox(checked, inputValue);

    if (checked === true) {
      setTimeout(() => {
        const inputElement = document.getElementById(inputFieldId);
        inputElement?.focus();
        if (inputElement && "select" in inputElement) {
          (inputElement as HTMLInputElement).select();
        }
      }, 0);
    }
  };

  return (
    <Flex className="w-full items-center justify-between">
      <div className="min-w-0 flex">
        <CheckboxMainComponent
          id={id}
          labelName={labelName}
          checked={isChecked}
          onChange={handleChangeCheckBox}
          disabled={disabled}
          nextFields={{
            left: nextFields.left,
            right: nextFields.right,
          }}
        />
      </div>

      <div className="flex items-center gap-1">
        <label htmlFor={inputFieldId} className="text-[14px] whitespace-nowrap">
          {labelInputName}
        </label>
        <InputAction
          id={inputFieldId}
          placeholder={placeholder}
          value={inputValue}
          onChange={(e) => {
            onChange(isChecked, e.target.value);
          }}
          disabled={disabled ? disabled : !isChecked}
          label={undefined}
          size="2"
          type="number"
          defaultValue={inputValue}
          classNameInput="w-[80px] text-right"
          nextFields={{
            left: id,
            right: nextFields.right,
            enter: nextFields.right,
          }}
        />
      </div>
    </Flex>
  );
};

export default CheckboxWithInput;