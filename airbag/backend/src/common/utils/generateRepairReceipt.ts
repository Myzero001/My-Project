import { repairReceiptRepository } from "@modules/ms-repair-receipt/repairReceiptRepository";
import dayjs from "dayjs";

export const generateRepairReceiptDoc = async () => {
  const datePrefix = dayjs().format("YYYYMMDD"); // วันที่ในรูปแบบ YYYYMMDD
  let repairReceiptDoc = `RP${datePrefix}`;

  const date = new Date();
  const repairReceiptByDate = await repairReceiptRepository.findByDate(date); // ดึงข้อมูลตามวันที่
  if (repairReceiptByDate && repairReceiptByDate.length > 0) {
    // ดึงส่วนลำดับเลขสูงสุด (aaa) จาก repairReceipt_doc ที่มีอยู่
    const maxSequence = Math.max(
      ...repairReceiptByDate.map((q) => {
        const match = q.repair_receipt_doc.match(/RP\d{8}(\d{3})/); // หาเลขท้าย aaa
        return match ? parseInt(match[1], 10) : 0; // แปลงเป็นตัวเลข
      })
    );

    const newSequence = (maxSequence + 1).toString().padStart(3, "0"); // เพิ่ม 1 และเติมเลข 0 ด้านหน้าให้ครบ 3 หลัก
    repairReceiptDoc += newSequence;

    console.log("repairReceiptDoc", repairReceiptDoc);
  } else {
    repairReceiptDoc += "001"; // เริ่มต้นที่ 001 ถ้าไม่มีเอกสารในวันนั้น

    console.log("repairReceiptDoc", repairReceiptDoc);
  }

  return repairReceiptDoc;
};
