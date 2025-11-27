import { quotationRepository } from "@modules/quotation/quotationRepository";
import dayjs from "dayjs";

export const generateQuotationDoc = async () => {
  const datePrefix = dayjs().format("YYYYMMDD"); // วันที่ในรูปแบบ YYYYMMDD
  let quotationDoc = `QTN${datePrefix}`;

  const date = new Date();
  const quotationByDate = await quotationRepository.findByDate(date); // ดึงข้อมูลตามวันที่
  if (quotationByDate && quotationByDate.length > 0) {
    // ดึงส่วนลำดับเลขสูงสุด (aaa) จาก quotation_doc ที่มีอยู่
    const maxSequence = Math.max(
      ...quotationByDate.map((q) => {
        const match = q.quotation_doc.match(/QTN\d{8}(\d{3})/); // หาเลขท้าย aaa
        return match ? parseInt(match[1], 10) : 0; // แปลงเป็นตัวเลข
      })
    );

    const newSequence = (maxSequence + 1).toString().padStart(3, "0"); // เพิ่ม 1 และเติมเลข 0 ด้านหน้าให้ครบ 3 หลัก
    quotationDoc += newSequence;

    console.log("quotationDoc", quotationDoc)
  } else {
    quotationDoc += "001"; // เริ่มต้นที่ 001 ถ้าไม่มีเอกสารในวันนั้น
    
    console.log("quotationDoc", quotationDoc)

  }

  return quotationDoc;
};
