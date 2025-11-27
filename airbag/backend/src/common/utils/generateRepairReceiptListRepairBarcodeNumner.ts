import { repairReceiptListRepairRepository } from "@modules/repair-receipt-list-repair/repairReceiptListRepairRepository";
import dayjs from "dayjs";

export const generateRepairReceiptListRepairBarcodeNumner = async (
  companyCode: string
) => {
  const datePrefix = dayjs().format("YYYYMMDD");
  let repairReceiptDoc = `${companyCode}${datePrefix}`;

  const date = new Date();
  const repairReceiptListRepairByDate =
    await repairReceiptListRepairRepository.findByDateStartEnd(date);
  if (
    repairReceiptListRepairByDate &&
    repairReceiptListRepairByDate.length > 0
  ) {
    const maxSequence = Math.max(
      ...repairReceiptListRepairByDate.map((q) => {
        const regex = new RegExp(`${companyCode}\\d{8}(\\d{4})`);
        const match = q.barcode.match(regex);
        return match ? parseInt(match[1], 10) : 0;
      })
    );

    const newSequence = (maxSequence + 1).toString().padStart(4, "0");
    repairReceiptDoc += newSequence;

    console.log("repairReceiptDoc", repairReceiptDoc);
  } else {
    repairReceiptDoc += "0001";

    console.log("repairReceiptDoc", repairReceiptDoc);
  }

  return repairReceiptDoc;
};
