import { paymentRepository } from "@modules/ms-payment/paymentRepository";
import dayjs from "dayjs";

export const generatePaymentDoc = async () => {
  const datePrefix = dayjs().format("YYYYMMDD");
  let PaymentDoc = `PM${datePrefix}`;

  const date = new Date();
  const PaymentByDate = await paymentRepository.findByDate(date); // ดึงข้อมูลตามวันที่
  if (PaymentByDate && PaymentByDate.length > 0) {
    const maxSequence = Math.max(
      ...PaymentByDate.map((q) => {
        const match = q.payment_doc.match(/PM\d{8}(\d{3})/);
        return match ? parseInt(match[1], 10) : 0;
      })
    );

    const newSequence = (maxSequence + 1).toString().padStart(3, "0");
    PaymentDoc += newSequence;

    console.log("PaymentDoc", PaymentDoc);
  } else {
    PaymentDoc += "001";

    console.log("PaymentDoc", PaymentDoc);
  }

  return PaymentDoc;
};
