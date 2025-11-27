import { Text } from "@radix-ui/themes";
import FormCreateSendForAClaim from "@/features/send-for-a-claim/components/FormCreateSendForAClaim";


export default function SupplierrCreateFeature() {
    return (
        <div className="container w-full m-auto">
            <Text size="6" weight="bold" className="text-center sm:text-xl p-2">
                ใบส่งเคลม
            </Text>
            <FormCreateSendForAClaim />
        </div>
    );
}
