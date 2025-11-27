import { PrismaClient } from "@prisma/client";
import dayjs from "dayjs";

export const generateCustomerVisitDoc = async (companyId: string) => {
  const prisma = new PrismaClient();
  
  const datePrefix = dayjs().format("YYYYMMDD"); // วันที่ในรูปแบบ YYYYMMDD
  let customerVisitDoc = `CVT${datePrefix}`;

  // ดึงข้อมูล customer_visit ที่เริ่มต้นด้วย CVTYYYYMMDD ใน companyId นั้น
  const customerVisits = await prisma.customer_visit.findMany({
    where: {
      company_id: companyId,
      customer_visit_doc: {
        startsWith: customerVisitDoc, // กรองเอกสารที่เริ่มต้นด้วย CVTYYYYMMDD
      },
    },
  });

  if (customerVisits.length > 0) {
    // หาเลขลำดับสูงสุด (aaa) จาก customer_visit_doc ที่มีอยู่
    const maxSequence = Math.max(
      ...customerVisits.map((visit) => {
        const match = visit.customer_visit_doc.match(/CVT\d{8}(\d{3})/); // หาเลขท้าย aaa
        return match ? parseInt(match[1], 10) : 0; // แปลงเป็นตัวเลข
      })
    );

    const newSequence = (maxSequence + 1).toString().padStart(3, "0"); // เพิ่ม 1 และเติมเลข 0 ด้านหน้าให้ครบ 3 หลัก
    customerVisitDoc += newSequence;
  } else {
    customerVisitDoc += "001"; // เริ่มต้นที่ 001 ถ้าไม่มีเอกสารในวันนั้น
  }

  return customerVisitDoc;
};
