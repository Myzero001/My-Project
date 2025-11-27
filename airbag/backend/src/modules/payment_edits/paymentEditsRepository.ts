import { PrismaClient } from "@prisma/client";
import { TypePayloadPaymentEdits } from "./paymentEditsModel";

const prisma = new PrismaClient();

export const paymentEditsRepository = {
  // ดึงข้อมูลทั้งหมดพร้อม pagination
  findAll: async (
    companyId: string,
    skip: number,
    take: number,
    searchText?: string,
    status?: string
  ) => {
    return await prisma.payment_edits.findMany({
      where: {
        company_id: companyId,
        ...(searchText
          ? {
              OR: [
                {
                  master_payment: {
                    payment_doc: {
                      contains: searchText,
                      mode: "insensitive",
                    },
                  },
                },
              ],
              AND: {
                ...(status !== "all" ? { edit_status: status } : {}),
              },
            }
          : { ...(status !== "all" ? { edit_status: status } : {}) }),
      },
      include: {
        master_payment: true,
        created_by_user: true,
      },
      skip,
      take,
      orderBy: { created_at: "desc" },
    });
  },

  // นับจำนวนข้อมูลทั้งหมด
  count: async (companyId: string, searchText?: string, status?: string) => {
    return await prisma.payment_edits.count({
      where: {
        company_id: companyId,
        ...(searchText
          ? {
              OR: [
                {
                  master_payment: {
                    payment_doc: {
                      contains: searchText,
                      mode: "insensitive",
                    },
                  },
                },
              ],
              AND: {
                ...(status !== "all" ? { edit_status: status } : {}),
              },
            }
          : { ...(status !== "all" ? { edit_status: status } : {}) }),
      },
    });
  },

  findAllNoPagination: async () => {
    return await prisma.payment_edits.findMany({
      orderBy: { created_at: "asc" }, // เรียงตามวันที่หรือคอลัมน์ที่คุณต้องการ
    });
  },

  findByDate: async (date: Date) => {
    const startOfDay = new Date(date.setHours(0, 0, 0, 0)); // Start of the day
    const endOfDay = new Date(date.setHours(23, 59, 59, 999)); // End of the day
    return await prisma.payment_edits.findMany({
      where: {
        created_at: {
          gte: startOfDay, // Greater than or equal to start of the day
          lte: endOfDay, // Less than or equal to end of the day
        },
      },
    });
  },

  findAllById: async (id: string) => {
    return await prisma.payment_edits.findUnique({
      where: { id },
      include: {
        master_payment: {
          include: {
            master_delivery_schedule: {
              include: {
                master_repair_receipt: {
                  include: {
                    master_quotation: {
                      include: {
                        master_brand: true,
                        master_brandmodel: true,
                        master_color: true,
                        master_customer: true,
                      },
                    },
                  },
                },
              },
            },
          },
        },
        companies: true,
      },
    });
  },

  findByPaymentId: async (payment_id: string) => {
    return await prisma.payment_edits.findMany({
      where: { payment_id: payment_id },
      include: {
        master_payment: true,
        companies: true,
      },
    });
  },

  findLogByPaymentId: async (payment_id: string) => {
    return await prisma.payment_edits.findMany({
      where: { payment_id: payment_id },
      include: {
        master_payment: true,
        companies: true,
        payment_edits_log: {
          include: {
            created_by_user: true,
          },
          orderBy: {
            created_at: "desc", // หรือ 'asc' สำหรับการจัดเรียงจากน้อยไปมาก
          },
        },
      },
    });
  },

  findById: async (id: string) => {
    return await prisma.payment_edits.findUnique({
      where: { id },
    });
  },

  // สร้างข้อมูลใหม่
  create: async (payload: TypePayloadPaymentEdits) => {
    return await prisma.payment_edits.create({
      data: {
        payment_id: payload.payment_id,
        old_data: payload.old_data,
        new_data: payload.new_data,

        edit_status: payload.edit_status,
        remark: payload.remark,

        company_id: payload.company_id,

        created_by: payload.created_by ?? "",
        updated_by: payload.updated_by ?? "",
      },
    });
  },

  // อัปเดตข้อมูล
  update: async (id: string, payload: Partial<TypePayloadPaymentEdits>) => {
    return await prisma.payment_edits.update({
      where: { id },
      data: {
        payment_id: payload.payment_id,
        old_data: payload.old_data,
        new_data: payload.new_data,

        edit_status: payload.edit_status,
        remark: payload.remark,

        updated_by: payload.updated_by,
      },
    });
  },

  approve: async (id: string, payload: Partial<TypePayloadPaymentEdits>) => {
    return await prisma.payment_edits.update({
      where: { id },
      data: {
        edit_status: payload.edit_status,
        remark: payload.remark,
        updated_by: payload.updated_by,
      },
    });
  },

  cancel: async (id: string, payload: Partial<TypePayloadPaymentEdits>) => {
    return await prisma.payment_edits.update({
      where: { id },
      data: {
        edit_status: payload.edit_status,
        remark: payload.remark,
        updated_by: payload.updated_by,
      },
    });
  },

  reject: async (id: string, payload: Partial<TypePayloadPaymentEdits>) => {
    return await prisma.payment_edits.update({
      where: { id },
      data: {
        edit_status: payload.edit_status,
        remark: payload.remark,
        updated_by: payload.updated_by,
      },
    });
  },

  // ลบข้อมูล
  delete: async (id: string) => {
    return await prisma.payment_edits.delete({
      where: { id },
    });
  },
};
