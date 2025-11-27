import { Text } from "@radix-ui/themes";
import FormCreate from "@/features/visiting-customer/components/formCreate";

export default function VisitCustomerCreateFeature() {
    return (
        <div className="container w-full m-auto">
            <Text size="6" weight="bold" className="text-center p-2">
                เยี่ยมลูกค้า
            </Text>
            <FormCreate />
        </div>
    );
}
