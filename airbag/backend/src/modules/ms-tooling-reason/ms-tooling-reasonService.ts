import { StatusCodes } from "http-status-codes";
import {
  ResponseStatus,
  ServiceResponse,
} from "@common/models/serviceResponse";
import { toolingReasonRepository } from "@modules/ms-tooling-reason/ms-tooling-reasonRepository";
import { TypePayloadMasterToolingReason } from "@modules/ms-tooling-reason/ms-tooling-reasonModel";
import { master_tooling_reason } from "@prisma/client";

export const toolingReasonService = {
  findAll: async (
    companyId: string,
    page: number = 1,
    pageSize: number = 12,
    searchText: string = ""
  ) => {
    try {
      const skip = (page - 1) * pageSize;
      const toolingReasons = await toolingReasonRepository.findAll(
        companyId,
        skip,
        pageSize,
        searchText
      );
      const totalCount = await toolingReasonRepository.count(
        companyId,
        searchText
      );

      return new ServiceResponse(
        ResponseStatus.Success,
        "Get all success",
        {
          data: toolingReasons,
          totalCount,
          totalPages: Math.ceil(totalCount / pageSize),
        },
        StatusCodes.OK
      );
    } catch (error) {
      return new ServiceResponse(
        ResponseStatus.Failed,
        "Error fetching tooling reasons",
        null,
        StatusCodes.INTERNAL_SERVER_ERROR
      );
    }
  },

  findAllNoPagination: async (company_id: string) => {
    try {
      const res = await toolingReasonRepository.findAllNoPagination(company_id);
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
    payload: TypePayloadMasterToolingReason
  ) => {
    try {
      const checkName = await toolingReasonRepository.findByName(
        companyId,
        payload.tooling_reason_name
      );
      if (checkName) {
        return new ServiceResponse(
          ResponseStatus.Failed,
          "Tooling reason already taken",
          null,
          StatusCodes.BAD_REQUEST
        );
      }
      const toolingReason = await toolingReasonRepository.create(
        companyId,
        userId,
        payload
      );
      return new ServiceResponse<{ master_tooling_reason_id: string }>(
        ResponseStatus.Success,
        "Create tooling reason success",
        { master_tooling_reason_id: toolingReason.master_tooling_reason_id },
        StatusCodes.OK
      );
    } catch (ex) {
      const errorMessage =
        "Error create tooling reason: " + (ex as Error).message;
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
    master_tooling_reason_id: string,
    payload: TypePayloadMasterToolingReason
  ) => {
    try {
      const checkId = await toolingReasonRepository.findByIdAsync(
        companyId,
        master_tooling_reason_id
      );
      if (!checkId) {
        return new ServiceResponse(
          ResponseStatus.Failed,
          "Tooling reason not found",
          null,
          StatusCodes.BAD_REQUEST
        );
      }
      const checkName = await toolingReasonRepository.findByName(
        companyId,
        payload.tooling_reason_name
      );
      if (checkName) {
        return new ServiceResponse(
          ResponseStatus.Failed,
          "Tooling reason already taken",
          null,
          StatusCodes.BAD_REQUEST
        );
      }

      const updated = await toolingReasonRepository.update(
        companyId,
        userId,
        master_tooling_reason_id,
        payload
      );
      const updatedAt = updated.updated_at ?? new Date();

      return new ServiceResponse<{
        tooling_reason_name: string;
        updated_at: Date;
        updated_by: string;
      }>(
        ResponseStatus.Success,
        "Update tooling reason success",
        {
          tooling_reason_name: updated.tooling_reason_name,
          updated_at: updatedAt,
          updated_by: updated.updated_by,
        },
        StatusCodes.OK
      );
    } catch (ex) {
      const errorMessage =
        "Error update tooling reason: " + (ex as Error).message;
      return new ServiceResponse(
        ResponseStatus.Failed,
        errorMessage,
        null,
        StatusCodes.INTERNAL_SERVER_ERROR
      );
    }
  },

  delete: async (companyId: string, master_tooling_reason_id: string) => {
    try {
      const check = await toolingReasonRepository.findByIdAsync(
        companyId,
        master_tooling_reason_id
      );
      if (!check) {
        return new ServiceResponse(
          ResponseStatus.Failed,
          "Tooling reason not found",
          null,
          StatusCodes.BAD_REQUEST
        );
      }

      // Add check for tooling reason in repair receipt
      const checkToolingReasonInRepairReceipt = await toolingReasonRepository.checkToolingReasonInRepairReceipt(
        companyId,
        master_tooling_reason_id
      );
      if (checkToolingReasonInRepairReceipt) {
        return new ServiceResponse(
          ResponseStatus.Failed,
          "Cannot delete: Tooling reason is being used in repair receipts",
          null,
          StatusCodes.BAD_REQUEST
        );
      }

      await toolingReasonRepository.delete(companyId, master_tooling_reason_id);
      return new ServiceResponse<string>(
        ResponseStatus.Success,
        "Delete tooling reason success",
        "Delete tooling reason success",
        StatusCodes.OK
      );
    } catch (ex) {
      const errorMessage =
        "Error delete tooling reason: " + (ex as Error).message;
      return new ServiceResponse(
        ResponseStatus.Failed,
        errorMessage,
        null,
        StatusCodes.INTERNAL_SERVER_ERROR
      );
    }
  },

  findById: async (companyId: string, master_tooling_reason_id: string) => {
    try {
      const toolingReason = await toolingReasonRepository.findByIdAsync(
        companyId,
        master_tooling_reason_id
      );
      if (!toolingReason) {
        return new ServiceResponse(
          ResponseStatus.Failed,
          "Tooling reason not found",
          null,
          StatusCodes.BAD_REQUEST
        );
      }
      return new ServiceResponse(
        ResponseStatus.Success,
        "Tooling reason found",
        toolingReason,
        StatusCodes.OK
      );
    } catch (ex) {
      const errorMessage = "Error get tooling reason: " + (ex as Error).message;
      return new ServiceResponse(
        ResponseStatus.Failed,
        errorMessage,
        null,
        StatusCodes.INTERNAL_SERVER_ERROR
      );
    }
  },

  findMinimal: async (companyId: string) => {
    try {
      const reasons = await toolingReasonRepository.findMinimal(companyId);
      return new ServiceResponse(
        ResponseStatus.Success,
        "Get minimal tooling reason data success",
        reasons,
        StatusCodes.OK
      );
    } catch (error) {
      return new ServiceResponse(
        ResponseStatus.Failed,
        "Error fetching minimal tooling reason data",
        null,
        StatusCodes.INTERNAL_SERVER_ERROR
      );
    }
  },

  select: async (companyId: string , searchText: string = "") => {
    try {
      const data = await toolingReasonRepository.select(companyId , searchText);
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
