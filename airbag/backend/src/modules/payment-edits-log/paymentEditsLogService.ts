import { StatusCodes } from "http-status-codes";
import {
  ResponseStatus,
  ServiceResponse,
} from "@common/models/serviceResponse";
import { payment_edits_log } from "@prisma/client";
import { paymentEditsLogRepository } from "./paymentEditsLogRepository";

export const paymentEditsLogService = {
  // ดึงข้อมูลทั้งหมดพร้อม Pagination
  findAll: async () => {
    try {
      const quotations = await paymentEditsLogRepository.findAll(); // ดึงข้อมูล
      const totalCount = await paymentEditsLogRepository.count(); // นับจำนวนทั้งหมด

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
        "Error fetching ",
        null,
        StatusCodes.INTERNAL_SERVER_ERROR
      );
    }
  },

  findByPaymentId: async (id: string) => {
    try {
      const reponse = await paymentEditsLogRepository.findByPaymentId(id);

      return new ServiceResponse<payment_edits_log[]>(
        ResponseStatus.Success,
        "Payment Edits Log Status found",
        reponse,
        StatusCodes.OK
      );
    } catch (ex) {
      const errorMessage = `Error fetching Payment Edits Log: ${(ex as Error).message}`;
      return new ServiceResponse(
        ResponseStatus.Failed,
        errorMessage,
        null,
        StatusCodes.INTERNAL_SERVER_ERROR
      );
    }
  },
};
