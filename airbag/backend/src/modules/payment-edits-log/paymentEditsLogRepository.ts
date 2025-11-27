import { PrismaClient } from "@prisma/client";
import { TypePayloadPaymentEditsLog } from "./paymentEditsLogModel";

const prisma = new PrismaClient();

export const paymentEditsLogRepository = {
  findAll: async () => {
    return await prisma.payment_edits_log.findMany({
      orderBy: { created_at: "asc" },
    });
  },
  count: async () => {
    return await prisma.payment_edits_log.count({});
  },

  findById: async (id: string) => {
    return await prisma.payment_edits_log.findUnique({
      where: { id },
      include: {
        master_payment: true,
        payment_edits: true,
        created_by_user: {
          select: {
            first_name: true,
            last_name: true,
          },
        },
      },
    });
  },

  findByPaymentId: async (id: string) => {
    return await prisma.payment_edits_log.findMany({
      where: {
        payment_id: id,
      },
      include: {
        master_payment: true,
        payment_edits: true,
        created_by_user: {
          select: {
            first_name: true,
            last_name: true,
          },
        },
      },
      orderBy: { created_at: "desc" },
    });
  },

  create: async (payload: TypePayloadPaymentEditsLog) => {
    return await prisma.payment_edits_log.create({
      data: {
        payment_edit_id: payload.payment_edit_id,
        payment_id: payload.payment_id,
        old_data: payload.old_data,
        new_data: payload.new_data,
        edit_status: payload.edit_status,

        company_id: payload.company_id,

        remark: payload.remark,

        created_by: payload.created_by ?? "",
        updated_by: payload.updated_by ?? "",
      },
    });
  },
};
