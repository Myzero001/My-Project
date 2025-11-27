import { Text } from "@radix-ui/themes";
import FormCreate from "@/features/ms-supplier/components/formCreate";

export default function SupplierrCreateFeature() {
    return (
        <div className="container w-full m-auto">
            <Text size="6" weight="bold" className="text-center p-2 text-xl sm:text-2xl">
                ข้อมูลร้านค้า
            </Text>
            <FormCreate />
        </div>
    );
}
