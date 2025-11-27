import { PrismaClient } from "@prisma/client";
import {
  REPAIR_RECEIPT_LIST_REPAIR_STATUS,
  TypePayloadRepairReceiptListRepair,
} from "./repairReceiptListRepairModel";

const prisma = new PrismaClient();

export const repairReceiptListRepairRepository = {
  findAll: async (skip: number, take: number) => {
    return await prisma.repair_receipt_list_repair.findMany({
      include: {
        master_quotation: true,
        master_repair: true,
      },
      skip, // จำนวนข้อมูลที่ต้องข้าม
      take, // จำนวนข้อมูลที่ต้องดึง
      orderBy: { created_at: "desc" }, // เรียงตามวันที่สร้างล่าสุด
    });
  },
  findAllNoPagination: async (company_id: string) => {
    return await prisma.repair_receipt_list_repair.findMany({
      where: { company_id: company_id},
      orderBy: { created_at: "asc" },
    });
  },
  // นับจำนวนข้อมูลทั้งหมด
  count: async () => {
    return await prisma.repair_receipt_list_repair.count({});
  },

  findByDate: async (date: Date) => {
    return await prisma.repair_receipt_list_repair.findMany({
      where: {
        created_at: {
          equals: date,
        },
      },
    });
  },

  findByDateStartEnd: async (date: Date) => {
    const startOfDay = new Date(date.setHours(0, 0, 0, 0)); // Start of the day
    const endOfDay = new Date(date.setHours(23, 59, 59, 999)); // End of the day
    return await prisma.repair_receipt_list_repair.findMany({
      where: {
        created_at: {
          gte: startOfDay, // Greater than or equal to start of the day
          lte: endOfDay, // Less than or equal to end of the day
        },
      },
    });
  },

  findByBarcode: async (barcode: string) => {
    return await prisma.repair_receipt_list_repair.findFirst({
      where: { barcode: barcode },
    });
  },

  findById: async (id: string) => {
    return await prisma.repair_receipt_list_repair.findUnique({
      where: { id },
    });
  },

  findByRepairReceiptId: async (repairReceiptId: string, company_id: string) => {
    return await prisma.repair_receipt_list_repair.findMany({
      where: { master_repair_receipt_id: repairReceiptId, company_id: company_id },
      include: {
        master_repair: {
          select: {
            master_repair_id: true,
            master_repair_name: true,
          },
        },
      },
    });
  },
  findByRepairReceiptIdActive: async (repairReceiptId: string, company_id: string) => {
    return await prisma.repair_receipt_list_repair.findMany({
      where: { master_repair_receipt_id: repairReceiptId, company_id: company_id, is_active: true },
      include: {
        master_repair: {
          select: {
            master_repair_id: true,
            master_repair_name: true,
          },
        },
      },
    });
  },

  // สร้างข้อมูลใหม่
  create: async (
    payload: TypePayloadRepairReceiptListRepair,
    company_id: string
  ) => {
    return await prisma.repair_receipt_list_repair.create({
      data: {
        quotation_id: payload.quotation_id,
        master_repair_id: payload.master_repair_id,
        master_repair_receipt_id: payload.master_repair_receipt_id,
        price: payload.price,
        status: payload.status,
        company_id: company_id,
        barcode: payload.barcode,
      },
    });
  },

  // อัปเดตข้อมูล
  update: async (
    id: string,
    payload: Partial<TypePayloadRepairReceiptListRepair>
  ) => {
    return await prisma.repair_receipt_list_repair.update({
      where: { id },
      data: {
        quotation_id: payload.quotation_id,
        master_repair_id: payload.master_repair_id,
        price: payload.price,
      },
    });
  },

  updateStatusIsActive: async (
    id: string,
    payload: Partial<TypePayloadRepairReceiptListRepair>,
    company_id: string
  ) => {
    return await prisma.repair_receipt_list_repair.update({
      where: { id },
      data: {
        is_active: payload.is_active,
        company_id: company_id,
      },
    });
  },

  // ลบข้อมูล
  delete: async (id: string) => {
    return await prisma.repair_receipt_list_repair.delete({
      where: { id },
    });
  },

  // สถานะการติ้ก
  updateStatusCheckedBox: async (
    id: string,
    statusDate: string,
    statusBy: string
  ) => {
    return await prisma.repair_receipt_list_repair.update({
      where: { id },
      data: {
        status: REPAIR_RECEIPT_LIST_REPAIR_STATUS.SUCCESS,
        status_date: statusDate,
        status_by: statusBy,
      },
    });
  },

  // สถานะการเอาติ๊กออก
  updateStatusUnCheckedBox: async (id: string, statusBy: string) => {
    return await prisma.repair_receipt_list_repair.update({
      where: { id },
      data: {
        status: REPAIR_RECEIPT_LIST_REPAIR_STATUS.PENDING,
        status_date: null,
        status_by: statusBy,
      },
    });
  },
};
