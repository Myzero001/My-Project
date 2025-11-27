import { Text } from "@radix-ui/themes";

type CheckboxMainComponentProps = {
  labelName?: string;
  defaultChecked?: boolean;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
};
const CheckboxMainComponent = (props: CheckboxMainComponentProps) => {
  const { labelName, defaultChecked, onChange, disabled } = props;
  return (<>
      <Text as="label" size="3" className=" flex  gap-3 mr-20 ">
        {labelName}
      <input
        type="checkbox"
        defaultChecked={defaultChecked}
        onChange={(e) => onChange(e.target.checked)}
        disabled={disabled}
        className=" h-[24px] w-[24px]"
      ></input>
    </Text>
    </>
  );
};

export default CheckboxMainComponent;
