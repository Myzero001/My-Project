import { FaBahtSign } from "react-icons/fa6";
import { Text } from "@radix-ui/themes";
import { ReactNode } from "react";

type CardSummaryProps = {
  value: string | number;
  description: string;
  icon: ReactNode;
};
const CardSummary = (props: CardSummaryProps) => {
  const { value, description, icon } = props;
  return (
    <div className="w-48 flex flex-col gap-1 bg-white rounded-lg p-4">
      {icon}
      <div className=" flex gap-1 items-center">
        <FaBahtSign />
        <Text className=" text-xl font-bold">{value}</Text>
      </div>
      <Text className=" text-sm  ">{description} </Text>
    </div>
  );
};

export default CardSummary;
