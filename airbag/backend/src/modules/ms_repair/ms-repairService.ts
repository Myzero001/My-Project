// backend/src/modules/ms_repair/ms-repairService.ts
import { StatusCodes } from "http-status-codes";
import {
  ResponseStatus,
  ServiceResponse,
} from "@common/models/serviceResponse";
import { repairRepository } from "@modules/ms_repair/ms-repairRepository";
import { TypePayloadMasterRepair } from "@modules/ms_repair/ms-repairModel";
import { master_repair } from "@prisma/client";
import { groupRepairRepository } from "@modules/ms-group-repair/ms-group-repairRepository";
import e from "express";

export const repairService = {


  findAllNoPagination: async (companyId: string) => {
    try {
      const res = await repairRepository.findAllNoPagination(companyId);
      return new ServiceResponse(
        ResponseStatus.Success,
        "Get all success",
        res,
        StatusCodes.OK
      );
    } catch (error) {
      return new ServiceResponse(
        ResponseStatus.Failed,
        "Error fetching repairs",
        null,
        StatusCodes.INTERNAL_SERVER_ERROR
      );
    }
  },

  findAll: async (companyId: string, page: number = 1, pageSize: number = 12, searchText: string = "") => {
    try {
      const skip = (page - 1) * pageSize;
      const repair = await repairRepository.findAll(companyId, skip, pageSize, searchText);
      const totalCount = await repairRepository.count(companyId, searchText);
      return new ServiceResponse(
        ResponseStatus.Success,
        "Get all success",
        {
          data: repair,
          totalCount,
          totalPages: Math.ceil(totalCount / pageSize),
        },
        StatusCodes.OK
      );
    } catch (ex) {
      const errorMessage = "Error fetching repairs: " + (ex as Error).message;
      return new ServiceResponse(
        ResponseStatus.Failed,
        "Error fetching repairs",
        errorMessage,
        StatusCodes.INTERNAL_SERVER_ERROR
      );
    }
  },

  create: async (companyId: string, userId: string, payload: TypePayloadMasterRepair) => {
    try {
      const checkId = await groupRepairRepository.findById(companyId, payload.master_group_repair_id);
      if (!checkId) {
        return new ServiceResponse(
          ResponseStatus.Failed,
          "Group repair not found",
          null,
          StatusCodes.BAD_REQUEST
        )
      }
      const CheckRepair = await repairRepository.findByName(companyId, payload);
      if (CheckRepair) {
        return new ServiceResponse(
          ResponseStatus.Failed,
          "Repair already exists",
          null,
          StatusCodes.BAD_REQUEST
        )
      }
      const repair = await repairRepository.create(companyId, userId, payload);
      return new ServiceResponse(
        ResponseStatus.Success,
        "Create repair success",
        "Create repair success",
        StatusCodes.OK
      )
    } catch (ex) {
      const errorMessage = "Error create  repair: " + (ex as Error).message;
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
    master_repair_id: string,
    payload: TypePayloadMasterRepair
  ) => {
    try {
      const checkRepairId = await repairRepository.findByIdAsync(
        companyId,
        master_repair_id
      );
      if (!checkRepairId) {
        return new ServiceResponse(
          ResponseStatus.Failed,
          "Group repair not found",
          null,
          StatusCodes.BAD_REQUEST
        );
      }
      const checkRepair = await repairRepository.findByName(
        companyId,
        payload
      );
      if (checkRepair) {
        return new ServiceResponse(
          ResponseStatus.Failed,
          "Repair already exists",
          null,
          StatusCodes.BAD_REQUEST
        );
      }
      const repair = await repairRepository.update(
        companyId,
        userId,
        master_repair_id,
        payload
      );
      return new ServiceResponse(
        ResponseStatus.Success,
        "Success",
        "Update repair success",
        StatusCodes.OK
      );
    } catch (ex) {
      const errorMessage = "Error update repair: " + (ex as Error).message;
      return new ServiceResponse(
        ResponseStatus.Failed,
        errorMessage,
        null,
        StatusCodes.INTERNAL_SERVER_ERROR
      );
    }
  },

  delete: async (companyId: string, master_repair_id: string) => {
    try {
      const checkRepair = await repairRepository.findByIdAsync(companyId, master_repair_id);
      if (!checkRepair) {
        return new ServiceResponse(
          ResponseStatus.Failed,
          "repair not found",
          null,
          StatusCodes.BAD_REQUEST
        );
      }
      const checkRepairinQuotation = await repairRepository.checkRepairinQuotation(companyId, master_repair_id);
      if (checkRepairinQuotation != null) {  // ใช้ != null เพื่อป้องกันปัญหาเช็คค่าเป็น false
        return new ServiceResponse(
          ResponseStatus.Failed,
          "repair in quotation",
          null,
          StatusCodes.BAD_REQUEST
        );
      }
      else {
        await repairRepository.delete(companyId, master_repair_id);
        return new ServiceResponse<string>(
          ResponseStatus.Success,
          "repair found",
          "Delete repair success",
          StatusCodes.OK
        );
      }
    } catch (ex) {
      const errorMessage = "Error delete repair: " + (ex as Error).message;
      return new ServiceResponse(
        ResponseStatus.Failed,
        errorMessage,
        null,
        StatusCodes.INTERNAL_SERVER_ERROR
      );
    }
  },

  findById: async (companyId: string, master_repair_id: string) => {
    try {
      const repair = await repairRepository.findByIdAsync(
        companyId,
        master_repair_id
      );
      if (!repair) {
        return new ServiceResponse(
          ResponseStatus.Failed,
          "repair not found",
          null,
          StatusCodes.BAD_REQUEST
        );
      }
      return new ServiceResponse<master_repair>(
        ResponseStatus.Success,
        "repair found",
        repair,
        StatusCodes.OK
      );
    } catch (ex) {
      const errorMessage = "Error get repair request: " + (ex as Error).message;
      return new ServiceResponse(
        ResponseStatus.Failed,
        errorMessage,
        null,
        StatusCodes.INTERNAL_SERVER_ERROR
      );
    }
  },

  findRepairNames: async (companyId: string) => {
    try {
      const repairNames = await repairRepository.findRepairNames(companyId);

      return new ServiceResponse(
        ResponseStatus.Success,
        "Get repair names success",
        repairNames,
        StatusCodes.OK
      );
    } catch (error) {
      return new ServiceResponse(
        ResponseStatus.Failed,
        "Error fetching repair names",
        null,
        StatusCodes.INTERNAL_SERVER_ERROR
      );
    }
  },

};
