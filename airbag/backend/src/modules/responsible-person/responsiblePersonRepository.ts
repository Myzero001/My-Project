import prisma from "@src/db";
import { log_responsible_person } from "@prisma/client";
import { TypePayloadResponsiblePerson, TypePayloadUpdateResponsiblePerson } from "./responsiblePersonModel";
import { ResponsiblePersonType as PrismaResponsiblePersonType} from "@prisma/client";

export const responsiblePersonRepository = {

  generateDocno: async () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const day = String(today.getDate()).padStart(2, "0");

    // นับจำนวน docno ที่ถูกสร้างในวันเดียวกัน
    const count = await prisma.log_responsible_person.count({
      where: {
        change_date: {
          gte: new Date(`${year}-${month}-${day}T00:00:00Z`),
          lt: new Date(`${year}-${month}-${day}T23:59:59Z`),
        },
      },
    });

    // เพิ่มลำดับ xxxx
    const sequence = String(count + 1).padStart(4, "0");

    // สร้าง docno
    return `DOC${year}${month}${day}${sequence}`;
  },

  findAll: async (companyId: string, skip: number, take: number) => {
    return prisma.log_responsible_person.findMany({
      where: { company_id: companyId },
      skip,
      take,
      orderBy: { created_at: "asc" },
      select: {
        log_id: true,
        type: true,
        docno: true,
        num: true,
        change_date: true,
        before_by: { select: { employee_id: true, username: true } },
        after_by: { select: { employee_id: true, username: true } },
        created_by: { select: { employee_id: true, username: true } },
        quotation_id: true,
        quotation: { select: { quotation_doc: true, quotation_date: true, customer_name: true } },
        master_repair_receipt_id: true,
        master_repair_receipt: { select: { repair_receipt_doc: true, repair_receipt_at: true } },
        supplier_delivery_note_id: true,
        supplier_delivery_note: { select: { supplier_delivery_note_doc: true, date_of_submission: true } },
        supplier_repair_receipt_id: true,
        supplier_repair_receipt: { select: { receipt_doc: true, repair_date_supplier_repair_receipt: true } },
        send_for_a_claim_id: true,
        send_for_a_claim: { select: { send_for_a_claim_doc: true, claim_date: true } },
        receive_for_a_claim_id: true,
        receive_for_a_claim: { select: { receive_for_a_claim_doc: true, receive_date: true } },
      },
    });
  },

  count: async (companyId: string) => {
    return prisma.log_responsible_person.count({ where: { company_id: companyId } });
  },

  findById: async (companyId: string, logId: string) => {
    return prisma.log_responsible_person.findFirst({
      where: { company_id: companyId, log_id: logId },
      select: {
        log_id: true,
        type: true,
        docno: true,
        num: true,
        change_date: true,
        before_by: { select: { employee_id: true, username: true } },
        after_by: { select: { employee_id: true, username: true } },
        created_by: { select: { employee_id: true, username: true } },
        // Select related documents
        quotation_id: true,
        quotation: { select: { quotation_doc: true, quotation_date: true, customer_name: true } },
        master_repair_receipt_id: true,
        master_repair_receipt: { select: { repair_receipt_doc: true, repair_receipt_at: true } },
        supplier_delivery_note_id: true,
        supplier_delivery_note: { select: { supplier_delivery_note_doc: true, date_of_submission: true } },
        supplier_repair_receipt_id: true,
        supplier_repair_receipt: { select: { receipt_doc: true, repair_date_supplier_repair_receipt: true } },
        send_for_a_claim_id: true,
        send_for_a_claim: { select: { send_for_a_claim_doc: true, claim_date: true } },
        receive_for_a_claim_id: true,
        receive_for_a_claim: { select: { receive_for_a_claim_doc: true, receive_date: true } },
      },
    });
  },

  create: async (companyId: string, userId: string, payload: TypePayloadResponsiblePerson) => {
    const {
      type,
      docno,
      change_date,
      before_by_id,
      after_by_id,
      ...documentIds
    } = payload;
    const prismaType = type as PrismaResponsiblePersonType;

    return prisma.log_responsible_person.create({
      data: {
        type: prismaType, 
        docno,
        num: 0,
        change_date,
        company_id: companyId,
        before_by_id,
        after_by_id,
        created_by_id: userId,
        ...documentIds,
      },
    });
  },

  update: async (
    companyId: string,
    logId: string,
    payload: TypePayloadUpdateResponsiblePerson // ใช้ Type ใหม่
  ) => {
    const currentLog = await prisma.log_responsible_person.findFirst({
      where: { log_id: logId, company_id: companyId },
    });

    if (!currentLog) {
      throw new Error("Log not found");
    }

    const updatedNum = currentLog.num + 1;

    // สร้าง data object สำหรับ update เฉพาะ fields ที่มีใน payload
    const dataToUpdate: any = {};
    if (payload.docno) dataToUpdate.docno = payload.docno;
    if (payload.before_by_id) dataToUpdate.before_by_id = payload.before_by_id;
    if (payload.after_by_id) dataToUpdate.after_by_id = payload.after_by_id;

    // ถ้าไม่มี field ไหนถูกส่งมาเพื่อ update ก็ไม่ควรทำอะไร นอกจาก bump `num` และ `change_date`
    // แต่ถ้ามี field ส่งมา ก็ update field นั้นๆ ด้วย
    if (Object.keys(dataToUpdate).length === 0 && !payload.before_by_id && !payload.after_by_id && !payload.docno) {
        // กรณีที่ payload body ว่างเปล่า (นอกจาก log_id) อาจจะแค่ต้องการ bump num (ซึ่งไม่ค่อย make sense)
        // หรือจะ throw error ว่าไม่มีอะไรให้อัพเดทก็ได้
        // ในที่นี้ จะยังคง bump num และ change_date
    }


    return prisma.log_responsible_person.update({
      where: { log_id: logId, company_id: companyId },
      data: {
        ...dataToUpdate, // ใส่ fields ที่ต้องการ update
        change_date: new Date(), // Update change_date ทุกครั้งที่แก้ไข
        num: updatedNum,
      },
      select: { // เลือก field ที่จะ return กลับไป, ควรจะครบถ้วนเหมือน findById
        log_id: true,
        type: true,
        docno: true,
        num: true,
        change_date: true,
        before_by: { select: { employee_id: true, username: true } },
        after_by: { select: { employee_id: true, username: true } },
        created_by: { select: { employee_id: true, username: true } },
        quotation_id: true,
        master_repair_receipt_id: true,
        supplier_delivery_note_id: true,
        supplier_repair_receipt_id: true,
        send_for_a_claim_id: true,
        receive_for_a_claim_id: true,
        // ... (select relation อื่นๆ ถ้ามี)
      },
    });
  },

  delete: async (companyId: string, logId: string) => {
    return prisma.log_responsible_person.delete({
      where: { log_id: logId, company_id: companyId },
    });
  },

};