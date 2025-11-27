import { TextArea } from "@radix-ui/themes";
import { UseFormRegisterReturn } from "react-hook-form";

interface TextAreaFormProps {
  placeholder: string;
  register: UseFormRegisterReturn; // Proper typing for register
  msgError?: string;
}

const TextAreaForm = (props: TextAreaFormProps) => {
  const { register, placeholder, msgError } = props;
  return (
    <>
      <TextArea
        {...register}
        variant="soft"
        placeholder={placeholder}
        className="[&>*]:!text-white [&>*]:!border-[1px] [&>*]:!border-solid [&>*]:!outline-main [&>*]:!placeholder-white"
      />
      {msgError && <div className="text-require">{msgError}</div>}
    </>
  );
};

export default TextAreaForm;
