import { Flex } from "@radix-ui/themes";
import ApproveEditPaymentCreateFeature from "@/features/ms-approve-edit-payment/containers/approve-edit-payment-create-page";

export default function PaymentCreatePage() {
  return (
    <div className="container w-full m-auto">
      <Flex gap={"3"} justify={"center"}>
        {/* <Text size="6" weight="bold" className="text-center">
          ชำระเงิน
        </Text> */}
        {/* <BadgeStatus value={statusForm} /> */}
      </Flex>
      <ApproveEditPaymentCreateFeature />
    </div>
  );
}
