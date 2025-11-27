import { PrismaClient } from "@prisma/client";
import dayjs from "dayjs";

export const generateSendForAClaimDoc = async (companyId: string) => {
  const prisma = new PrismaClient();
  
  const datePrefix = dayjs().format("YYYYMMDD"); // วันที่ในรูปแบบ YYYYMMDD
  let sendForAClaimDoc = `CMS${datePrefix}`;

  // ดึงข้อมูล customer_visit ที่เริ่มต้นด้วย CVTYYYYMMDD ใน companyId นั้น
  const sendForAClaims = await prisma.send_for_a_claim.findMany({
    where: {
      company_id: companyId,
      send_for_a_claim_doc: {
        startsWith: sendForAClaimDoc, // กรองเอกสารที่เริ่มต้นด้วย CVTYYYYMMDD
      },
    },
  });

  if (sendForAClaims.length > 0) {
    // หาเลขลำดับสูงสุด (aaa) จาก customer_visit_doc ที่มีอยู่
    const maxSequence = Math.max(
      ...sendForAClaims.map((claim) => {
        const match = claim.send_for_a_claim_doc.match(/CMS\d{8}(\d{3})/); // หาเลขท้าย aaa
        return match ? parseInt(match[1], 10) : 0; // แปลงเป็นตัวเลข
      })
    );

    const newSequence = (maxSequence + 1).toString().padStart(3, "0"); // เพิ่ม 1 และเติมเลข 0 ด้านหน้าให้ครบ 3 หลัก
    sendForAClaimDoc += newSequence;
  } else {
    sendForAClaimDoc += "001"; // เริ่มต้นที่ 001 ถ้าไม่มีเอกสารในวันนั้น
  }

  return sendForAClaimDoc;
};
