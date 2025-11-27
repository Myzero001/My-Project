import { deliveryScheduleRepository } from "@modules/ms-delivery-shedule/deliveryScheduleRepository";
import { repairReceiptRepository } from "@modules/ms-repair-receipt/repairReceiptRepository";
import dayjs from "dayjs";

export const generateDeliveryScheduleDoc = async () => {
  const datePrefix = dayjs().format("YYYYMMDD");
  let deliveryScheduleDoc = `DS${datePrefix}`;

  const date = new Date();
  const deliveryScheduleByDate =
    await deliveryScheduleRepository.findByDate(date); // ดึงข้อมูลตามวันที่
  if (deliveryScheduleByDate && deliveryScheduleByDate.length > 0) {
    const maxSequence = Math.max(
      ...deliveryScheduleByDate.map((q) => {
        const match = q.delivery_schedule_doc.match(/DS\d{8}(\d{3})/);
        return match ? parseInt(match[1], 10) : 0;
      })
    );

    const newSequence = (maxSequence + 1).toString().padStart(3, "0");
    deliveryScheduleDoc += newSequence;

    console.log("deliveryScheduleDoc", deliveryScheduleDoc);
  } else {
    deliveryScheduleDoc += "001";

    console.log("deliveryScheduleDoc", deliveryScheduleDoc);
  }

  return deliveryScheduleDoc;
};
