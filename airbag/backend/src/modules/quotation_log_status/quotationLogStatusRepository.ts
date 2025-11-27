import { PrismaClient } from "@prisma/client";
import { TypePayloadQuotationLogStatus } from "./quotationLogStatusModel";

const prisma = new PrismaClient();

export const quotationLogStatusRepository = {
  findAll: async(company_id: string) => {
    return await prisma.quotation_log_status.findMany({
      where: {company_id: company_id},
      orderBy: { created_at: "asc" },
    });
  },
  count: async (company_id: string) => {
    return await prisma.quotation_log_status.count({
      where: {company_id: company_id},
    });
  },

  findByQuotationId: async (quotation_id: string, company_id: string) => {
    return await prisma.quotation_log_status.findMany({
      where: { quotation_id, company_id: company_id },
      include: {
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
  create: async (payload: TypePayloadQuotationLogStatus) => {
    return await prisma.quotation_log_status.create({
      data: {
        quotation_id: payload.quotation_id,
        quotation_status: payload.quotation_status,
        remark: payload.remark,
        company_id: payload.company_id,
        created_by: payload.created_by,
      },
    });
  },
};
