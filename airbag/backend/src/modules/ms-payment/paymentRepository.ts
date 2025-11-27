import { PrismaClient } from "@prisma/client";
import { TypePayloadPayment } from "./paymentModel";
import { PAYMENT_STATUS } from "./paymentModel";

const prisma = new PrismaClient();

export const paymentRepository = {
  // ดึงข้อมูลทั้งหมดพร้อม pagination
  findAll: async (
    companyId: string,
    skip: number,
    take: number,
    searchText?: string,
    status?: string
  ) => {
    return await prisma.master_payment.findMany({
      where: {
        company_id: companyId,
        ...(searchText
          ? {
              OR: [
                {
                  payment_doc: {
                    contains: searchText,
                    mode: "insensitive",
                  },
                },
                {
                  master_delivery_schedule: {
                    master_repair_receipt: {
                      repair_receipt_doc: {
                        contains: searchText,
                        mode: "insensitive",
                      },
                    },
                  },
                },
                {
                  master_delivery_schedule: {
                    delivery_schedule_doc: {
                      contains: searchText,
                      mode: "insensitive",
                    },
                  },
                },
                {
                  master_delivery_schedule: {
                    master_repair_receipt: {
                      master_quotation: {
                        master_customer: {
                          contact_name: {
                            contains: searchText,
                            mode: "insensitive",
                          },
                        },
                      },
                    },
                  },
                },
              ],
              AND: {
                ...(status !== "all" ? { option_payment: status } : {}),
              },
            }
          : { ...(status !== "all" ? { option_payment: status } : {}) }),
      },
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
      skip,
      take,
      orderBy: { created_at: "desc" },
    });
  },

  // นับจำนวนข้อมูลทั้งหมด
  count: async (companyId: string, searchText?: string, status?: string) => {
    return await prisma.master_payment.count({
      where: {
        company_id: companyId,
        ...(searchText
          ? {
              OR: [
                {
                  master_delivery_schedule: {
                    master_repair_receipt: {
                      repair_receipt_doc: {
                        contains: searchText,
                        mode: "insensitive",
                      },
                    },
                  },
                },
                {
                  master_delivery_schedule: {
                    master_repair_receipt: {
                      master_quotation: {
                        master_customer: {
                          contact_name: {
                            contains: searchText,
                            mode: "insensitive",
                          },
                        },
                      },
                    },
                  },
                },
              ],
              AND: {
                ...(status !== "all" ? { option_payment: status } : {}),
              },
            }
          : { ...(status !== "all" ? { option_payment: status } : {}) }),
      },
    });
  },

  findAllNoPagination: async (company_id: string) => {
    return await prisma.master_payment.findMany({
      where:{company_id: company_id},
      orderBy: { created_at: "asc" }, // เรียงตามวันที่หรือคอลัมน์ที่คุณต้องการ
    });
  },

  findByDate: async (date: Date) => {
    const startOfDay = new Date(date.setHours(0, 0, 0, 0)); // Start of the day
    const endOfDay = new Date(date.setHours(23, 59, 59, 999)); // End of the day
    return await prisma.master_payment.findMany({
      where: {
        created_at: {
          gte: startOfDay, // Greater than or equal to start of the day
          lte: endOfDay, // Less than or equal to end of the day
        },
      },
    });
  },

  findAllById: async (id: string) => {
    return await prisma.master_payment.findUnique({
      where: { id },
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
        companies: true,
      },
    });
  },
  findAllByRepairReceiptId: async (repairReceiptId: string) => {
    return await prisma.master_payment.findMany({
      where: {
        master_delivery_schedule: {
          master_repair_receipt: {
            id: repairReceiptId,
          },
        },
      },
      include: {
        master_delivery_schedule: {
          include: {
            master_repair_receipt: true,
          },
        },
        companies: true,
      },
      orderBy: { created_at: "desc" },
    });
  },

  findById: async (id: string) => {
    return await prisma.master_payment.findUnique({
      where: { id },
    });
  },

  // สร้างข้อมูลใหม่
  create: async (payload: TypePayloadPayment) => {
    return await prisma.master_payment.create({
      data: {
        payment_doc: payload.payment_doc,
        delivery_schedule_id: payload.delivery_schedule_id,
        option_payment: payload.option_payment,
        type_money: payload.type_money,
        price: payload.price,
        tax: payload.tax,
        tax_rate: payload.tax_rate,
        tax_status: payload.tax_status,
        total_price: payload.total_price,
        payment_image_url: payload.payment_image_url,
        remark: payload.remark,

        check_date: payload.check_date,
        check_number: payload.check_number,
        bank_name: payload.bank_name,

        status: payload.status,

        company_id: payload.company_id,

        created_by: payload.created_by ?? "",
        updated_by: payload.updated_by ?? "",
      },
    });
  },

  // อัปเดตข้อมูล
  update: async (id: string, payload: Partial<TypePayloadPayment>) => {
    return await prisma.master_payment.update({
      where: { id },
      data: {
        option_payment: payload.option_payment,
        type_money: payload.type_money,
        price: payload.price,
        tax: payload.tax,
        tax_rate: payload.tax_rate,
        tax_status: payload.tax_status,
        total_price: payload.total_price,
        payment_image_url: payload.payment_image_url,
        remark: payload.remark,

        check_date: payload.check_date,
        check_number: payload.check_number,
        bank_name: payload.bank_name,

        updated_by: payload.updated_by,
      },
    });
  },

  // ลบข้อมูล
  delete: async (id: string) => {
    return await prisma.master_payment.delete({
      where: { id },
    });
  },
};
