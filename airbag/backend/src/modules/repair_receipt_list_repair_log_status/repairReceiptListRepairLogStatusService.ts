import { StatusCodes } from "http-status-codes";
import {
  ResponseStatus,
  ServiceResponse,
} from "@common/models/serviceResponse";
import {
  quotation_log_status,
  repair_receipt_list_repair_log_status,
} from "@prisma/client";
import { repairReceiptListRepairLogRepository } from "./repairReceiptListRepairLogStatusRepository";
import { TypePayloadRepairReceiptListRepairLogStatus } from "./repairReceiptListRepairLogStatusModel";

export const repairReceiptListRepairLogStatusService = {
  // ดึงข้อมูลทั้งหมดพร้อม Pagination
  findAll: async (company_id: string) => {
    try {
      const quotations = await repairReceiptListRepairLogRepository.findAll(company_id); // ดึงข้อมูล
      const totalCount = await repairReceiptListRepairLogRepository.count(company_id); // นับจำนวนทั้งหมด

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

  findByRepairReceiptId: async (id: string, company_id: string) => {
    try {
      const reponse =
        await repairReceiptListRepairLogRepository.findByRepairReceiptId(id, company_id);

      return new ServiceResponse<repair_receipt_list_repair_log_status[]>(
        ResponseStatus.Success,
        "Repair Receipt List Repair Log Status found",
        reponse,
        StatusCodes.OK
      );
    } catch (ex) {
      const errorMessage = `Error fetching Repair Receipt List Repair: ${(ex as Error).message}`;
      return new ServiceResponse(
        ResponseStatus.Failed,
        errorMessage,
        null,
        StatusCodes.INTERNAL_SERVER_ERROR
      );
    }
  },

  create: async (
    payload: TypePayloadRepairReceiptListRepairLogStatus,
    userId: string,
    company_id: string
  ) => {
    try {
      const checkRepairReceiptListRepair =
        await repairReceiptListRepairLogRepository.findById(
          payload.repair_receipt_list_repair_id
        );
      if (!checkRepairReceiptListRepair) {
        return new ServiceResponse(
          ResponseStatus.Failed,
          "not found",
          null,
          StatusCodes.BAD_REQUEST
        );
      }

      const payloadLog: TypePayloadRepairReceiptListRepairLogStatus = {
        repair_receipt_list_repair_id: payload.repair_receipt_list_repair_id,
        list_repair_status: payload.list_repair_status,
        created_by: userId,
        company_id: company_id,
      };

      const update =
        await repairReceiptListRepairLogRepository.create(payloadLog);

      return new ServiceResponse<repair_receipt_list_repair_log_status>(
        ResponseStatus.Success,
        "create log success",
        update,
        StatusCodes.OK
      );
    } catch (ex) {
      const errorMessage = `Error create log: ${(ex as Error).message}`;
      return new ServiceResponse(
        ResponseStatus.Failed,
        errorMessage,
        null,
        StatusCodes.INTERNAL_SERVER_ERROR
      );
    }
  },
};
