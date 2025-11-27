import { StatusCodes } from "http-status-codes";
import {
  ResponseStatus,
  ServiceResponse,
} from "@common/models/serviceResponse";
import { quotation_log_status } from "@prisma/client";
import { quotationLogStatusRepository } from "./quotationLogStatusRepository";

export const quotationLogStatusService = {
  // ดึงข้อมูลทั้งหมดพร้อม Pagination
  findAll: async (company_id: string) => {
    try {
      const quotations = await quotationLogStatusRepository.findAll(company_id); // ดึงข้อมูล
      const totalCount = await quotationLogStatusRepository.count(company_id); // นับจำนวนทั้งหมด

      return new ServiceResponse(
        ResponseStatus.Success,
        "Get all success",
        {
          data: quotations,
          totalCount, // จำนวนข้อมูลทั้งหมด
        },
        StatusCodes.OK
      );
    } catch (error) {
      return new ServiceResponse(
        ResponseStatus.Failed,
        "Error fetching quotations",
        null,
        StatusCodes.INTERNAL_SERVER_ERROR
      );
    }
  },

  findByQuotationId: async (id: string, company_id: string) => {
    try {
      const quotationLogStatus =
        await quotationLogStatusRepository.findByQuotationId(id, company_id);

      return new ServiceResponse<quotation_log_status[]>(
        ResponseStatus.Success,
        "Quotation Log Status found",
        quotationLogStatus,
        StatusCodes.OK
      );
    } catch (ex) {
      const errorMessage = `Error fetching quotation: ${(ex as Error).message}`;
      return new ServiceResponse(
        ResponseStatus.Failed,
        errorMessage,
        null,
        StatusCodes.INTERNAL_SERVER_ERROR
      );
    }
  },
};
