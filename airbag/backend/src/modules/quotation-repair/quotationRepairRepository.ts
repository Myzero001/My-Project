import { PrismaClient } from "@prisma/client";
import { TypePayloadQuotationRepair } from "./quotationRepairModel";

const prisma = new PrismaClient();

export const quotationRepairRepository = {
  findAll: async (skip: number, take: number) => {
    return await prisma.quotation_repair.findMany({
      include: {
        master_quotation: true,
        master_repair: true,
      },
      skip, // จำนวนข้อมูลที่ต้องข้าม
      take, // จำนวนข้อมูลที่ต้องดึง
      orderBy: { created_at: "desc" }, // เรียงตามวันที่สร้างล่าสุด
    });
  },
  findAllNoPagination: async () => {
    return await prisma.quotation_repair.findMany({
      orderBy: { created_at: "asc" },
    });
  },
  // นับจำนวนข้อมูลทั้งหมด
  count: async () => {
    return await prisma.quotation_repair.count({});
  },

  findByDate: async (date: Date) => {
    return await prisma.quotation_repair.findMany({
      where: {
        created_at: {
          equals: date,
        },
      },
    });
  },

  findById: async (id: string) => {
    return await prisma.quotation_repair.findUnique({
      where: { id },
    });
  },

  findByQuotationId: async (quotationId: string) => {
    return await prisma.quotation_repair.findMany({
      where: { quotation_id: quotationId },
      include: {
        master_repair: true,
      }
    });
  },

  // สร้างข้อมูลใหม่
  create: async (payload: TypePayloadQuotationRepair) => {
    return await prisma.quotation_repair.create({
      data: {
        quotation_id: payload.quotation_id,
        master_repair_id: payload.master_repair_id,
        price: payload.price,
      },
    });
  },

  // อัปเดตข้อมูล
  update: async (id: string, payload: Partial<TypePayloadQuotationRepair>) => {
    return await prisma.quotation_repair.update({
      where: { id },
      data: {
        quotation_id: payload.quotation_id,
        master_repair_id: payload.master_repair_id,
        price: payload.price,
      },
    });
  },

  // ลบข้อมูล
  delete: async (id: string) => {
    return await prisma.quotation_repair.delete({
      where: { id },
    });
  },
};
