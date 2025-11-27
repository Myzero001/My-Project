import { Text } from "@radix-ui/themes";
import FormCreateReceiveAClaim from "@/features/receive-a-claim/components/FormCreateReceiveAClaim";


export default function SupplierrCreateFeature() {
    return (
        <div className="container w-full m-auto">
            <Text size="6" weight="bold" className="text-center p-2 text-xl sm:text-2xl">
                ใบรับเคลม
            </Text>
            <FormCreateReceiveAClaim />
        </div>
    );
}
