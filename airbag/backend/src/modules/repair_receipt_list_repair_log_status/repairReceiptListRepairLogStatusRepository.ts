import { PrismaClient } from "@prisma/client";
import { TypePayloadRepairReceiptListRepairLogStatus } from "./repairReceiptListRepairLogStatusModel";

const prisma = new PrismaClient();

export const repairReceiptListRepairLogRepository = {
  findAll: async (company_id: string) => {
    return await prisma.repair_receipt_list_repair_log_status.findMany({
      where: { company_id: company_id},
      orderBy: { created_at: "asc" },
    });
  },
  count: async (company_id: string) => {
    return await prisma.repair_receipt_list_repair_log_status.count({
      where: { company_id: company_id },
    });
  },

  findById: async (id: string) => {
    return await prisma.repair_receipt_list_repair_log_status.findUnique({
      where: { id },
      include: {
        repair_receipt_list_repair: {
          include: {
            master_repair_receipt: true,
            master_repair: true,
          },
        },
        profile: {
          select: {
            first_name: true,
            last_name: true,
          },
        },
      },
    });
  },

  findByRepairReceiptId: async (repair_receipt_id: string, company_id: string) => {
    return await prisma.repair_receipt_list_repair_log_status.findMany({
      where: {
        company_id: company_id,
        repair_receipt_list_repair: {
          master_repair_receipt_id: repair_receipt_id,
        },
      },
      include: {
        repair_receipt_list_repair: {
          include: {
            master_repair_receipt: true,
            master_repair: true,
          },
        },
        profile: {
          select: {
            first_name: true,
            last_name: true,
          },
        },
      },
      orderBy: { created_at: "desc" },
    });
  },

  create: async (payload: TypePayloadRepairReceiptListRepairLogStatus) => {
    return await prisma.repair_receipt_list_repair_log_status.create({
      data: {
        repair_receipt_list_repair_id: payload.repair_receipt_list_repair_id,
        list_repair_status: payload.list_repair_status,
        company_id: payload.company_id,
        created_by: payload.created_by,
      },
    });
  },
};
