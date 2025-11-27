import { Text } from "@radix-ui/themes";
import FormCreateGetSupplier from "@/features/get-supplier/components/FormCreateGetSupplier";


export default function SupplierrCreateFeature() {
    return (
        <div className="container w-full m-auto">
            <Text size="6" weight="bold" className="text-center text-xl sm:text-2xl p-2">
                ใบรับซ่อมซับพลายเออร์
            </Text>
            <FormCreateGetSupplier />
        </div>
    );
}
