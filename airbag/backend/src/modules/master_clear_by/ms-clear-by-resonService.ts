import { StatusCodes } from "http-status-codes";
import {
  ResponseStatus,
  ServiceResponse,
} from "@common/models/serviceResponse";
import { clearByRepository } from "@modules/master_clear_by/ms-clear-by-resonRepository";
import { TypePayloadMasterClearBy } from "@modules/master_clear_by/ms-clear-by-reasonModel";
import { master_clear_by } from "@prisma/client";
import { clear } from "console";
import { repairReceiptRepository } from "@modules/ms-repair-receipt/repairReceiptRepository";

export const clearByReasonService = {
  findAll: async (
    companyId: string,
    page: number = 1,
    pageSize: number = 12,
    searchText: string = ""
  ) => {
    try {
      const skip = (page - 1) * pageSize;
      const clearByReason = await clearByRepository.findAll(
        companyId,
        skip,
        pageSize,
        searchText
      );
      const totalCount = await clearByRepository.count(companyId, searchText);
      return new ServiceResponse(
        ResponseStatus.Success,
        "Get all success",
        {
          data: clearByReason,
          totalCount,
          totalPages: Math.ceil(totalCount / pageSize),
        },
        StatusCodes.OK
      );
    } catch (ex) {
      const errorMessage =
        "Error get all clearby reason: " + (ex as Error).message;
      return new ServiceResponse(
        ResponseStatus.Failed,
        errorMessage,
        null,
        StatusCodes.INTERNAL_SERVER_ERROR
      );
    }
  },

  findAllNoPagination: async () => {
    try {
      const res = await clearByRepository.findAllNoPagination();
      return new ServiceResponse(
        ResponseStatus.Success,
        "Get all success",
        res,
        StatusCodes.OK
      );
    } catch (error) {
      return new ServiceResponse(
        ResponseStatus.Failed,
        "Error fetching brand",
        null,
        StatusCodes.INTERNAL_SERVER_ERROR
      );
    }
  },

  create: async (
    companyId: string,
    userId: string,
    payload: TypePayloadMasterClearBy
  ) => {
    try {
      const checkName = await clearByRepository.findByName(
        companyId,
        payload.clear_by_name
      );
      if (checkName) {
        return new ServiceResponse(
          ResponseStatus.Failed,
          "clearby reason already taken",
          null,
          StatusCodes.BAD_REQUEST
        );
      }
      const clearByReason = await clearByRepository.create(
        companyId,
        userId,
        payload
      );
      return new ServiceResponse<{ clear_by_id: string }>(
        ResponseStatus.Success,
        "Create clearby reason success",
        { clear_by_id: clearByReason.clear_by_id },
        StatusCodes.OK
      );
    } catch (ex) {
      const errorMessage =
        "Error create clearby reason: " + (ex as Error).message;
      return new ServiceResponse(
        ResponseStatus.Failed,
        errorMessage,
        null,
        StatusCodes.INTERNAL_SERVER_ERROR
      );
    }
  },
  delete: async (companyId: string, clear_by_id: string) => {
   try {
    const checkclearby = await repairReceiptRepository.checkRepairReceipt(companyId, "clear_by_tool_one_id", clear_by_id);
    if (checkclearby)
      return new ServiceResponse(
        ResponseStatus.Failed,
        "Clearby in Repair Receipt",
        null,
        StatusCodes.BAD_REQUEST
      );
      const checkclearby2 = await repairReceiptRepository.checkRepairReceipt(companyId, "clear_by_tool_two_id", clear_by_id);
    if (checkclearby2)
      return new ServiceResponse(
        ResponseStatus.Failed,
        "Clearby in Repair Receipt",
        null,
        StatusCodes.BAD_REQUEST
      );
      const checkclearby3 = await repairReceiptRepository.checkRepairReceipt(companyId, "clear_by_tool_three_id", clear_by_id);
    if (checkclearby3)
      return new ServiceResponse(
        ResponseStatus.Failed,
        "Clearby in Repair Receipt",
        null,
        StatusCodes.BAD_REQUEST
      );
      
    
      await clearByRepository.delete(companyId, clear_by_id);
      return new ServiceResponse<string>(
        ResponseStatus.Success,
        "Delete clearby reason success",
        "Delete clearby reason success",
        StatusCodes.OK
      );
    } catch (ex) {
      const errorMessage =
        "Error delete clearby reason: " + (ex as Error).message;
      return new ServiceResponse(
        ResponseStatus.Failed,
        errorMessage,
        null,
        StatusCodes.INTERNAL_SERVER_ERROR
      );
    }
  },
  update: async (
    companyId: string,
    userId: string,
    clear_by_id: string,
    payload: TypePayloadMasterClearBy
  ) => {
    try {
      const checkId = await clearByRepository.findByIdAsync(
        companyId,
        clear_by_id
      );
      if (!checkId) {
        return new ServiceResponse(
          ResponseStatus.Failed,
          "Tooling reason not found",
          null,
          StatusCodes.BAD_REQUEST
        );
      }
      const checkName = await clearByRepository.findByName(
        companyId,
        payload.clear_by_name
      );
      if (checkName) {
        return new ServiceResponse(
          ResponseStatus.Failed,
          "clearby reason already taken",
          null,
          StatusCodes.BAD_REQUEST
        );
      }
      const updated = await clearByRepository.update(
        companyId,
        userId,
        clear_by_id,
        payload
      );
      const updatedAt = updated.updated_at ?? new Date();
      return new ServiceResponse<{
        clear_by_id: string;
        clear_by_name: string;
        updated_at: Date;
      }>(
        ResponseStatus.Success,
        "Update clearby reason success",
        {
          clear_by_id: updated.clear_by_id,
          clear_by_name: updated.clear_by_name,
          updated_at: updatedAt,
        },
        StatusCodes.OK
      );
    } catch (ex) {
      const errorMessage =
        "Error update clearby reason: " + (ex as Error).message;
      return new ServiceResponse(
        ResponseStatus.Failed,
        errorMessage,
        null,
        StatusCodes.INTERNAL_SERVER_ERROR
      );
    }
  },
  findById: async (companyId: string, clear_by_id: string) => {
    try {
      const clearByReason = await clearByRepository.findByIdAsync(
        companyId,
        clear_by_id
      );
      if (!clearByReason) {
        return new ServiceResponse(
          ResponseStatus.Failed,
          "Clearby reason not found",
          null,
          StatusCodes.BAD_REQUEST
        );
      }
      return new ServiceResponse(
        ResponseStatus.Success,
        "Clearby reason found",
        clearByReason,
        StatusCodes.OK
      );
    } catch (ex) {
      const errorMessage = "Error get clearby reason: " + (ex as Error).message;
      return new ServiceResponse(
        ResponseStatus.Failed,
        errorMessage,
        null,
        StatusCodes.INTERNAL_SERVER_ERROR
      );
    }
  },

  select: async (companyId: string , searchText: string = "") => {
    try {
      const data = await clearByRepository.select(companyId , searchText);
      return new ServiceResponse(
        ResponseStatus.Success,
        "Select success",
        {data},
        StatusCodes.OK
      );
      
    } catch (error) {
      return new ServiceResponse(
        ResponseStatus.Failed,
        "Error fetching select",
        null,
        StatusCodes.INTERNAL_SERVER_ERROR
      );
    }
  },
};
