import { useParams, useSearchParams } from "react-router-dom";
import { Flex } from "@radix-ui/themes";
import { useEffect, useState } from "react";
import PaymentCreateFeature from "@/features/ms-payment/containers/payment-create-page";

export default function PaymentCreatePage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const { paymentId } = useParams();

  useEffect(() => {
    if (paymentId) {
      // getDeliveryScheduleById(paymentId).then((res) => {
      //   const item = res.responseObject;
      //   setStatusForm(item?.status ?? DOCUMENT_STATUS.PENDING);
      // });
    }
  }, [paymentId]);

  return (
    <div className="container w-full m-auto">
      <Flex gap={"3"} justify={"center"}>
        {/* <Text size="6" weight="bold" className="text-center">
          ชำระเงิน
        </Text> */}
        {/* <BadgeStatus value={statusForm} /> */}
      </Flex>
      <PaymentCreateFeature />
    </div>
  );
}
