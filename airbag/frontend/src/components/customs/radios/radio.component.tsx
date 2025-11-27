import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

const RadioComponent = () => {
  return (
    <RadioGroup defaultValue="option-one">
      <div className="flex items-center space-x-2">
        <RadioGroupItem value="option-one" id="option-one" />
        <Label htmlFor="option-one">Option One</Label>
      </div>
    </RadioGroup>
  );
};

export default RadioComponent;
