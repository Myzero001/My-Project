import { StatusCodes } from "http-status-codes";
import {
  ResponseStatus,
  ServiceResponse,
} from "@common/models/serviceResponse";
import { quotationRepairRepository } from "./quotationRepairRepository";
import { TypePayloadQuotationRepair } from "./quotationRepairModel";
import dayjs from "dayjs";
import { userRepository } from "@modules/users/userRepository";
import { generateQuotationDoc } from "@common/utils/generateQuotationDoc";
import { quotation_repair } from "@prisma/client";

export const quotationRepairService = {
  // ดึงข้อมูลทั้งหมดพร้อม Pagination
  findAll: async (page: number = 1, pageSize: number = 12) => {
    try {
      const skip = (page - 1) * pageSize; // คำนวณ offset
      const quotations = await quotationRepairRepository.findAll(
        skip,
        pageSize
      ); // ดึงข้อมูล
      const totalCount = await quotationRepairRepository.count(); // นับจำนวนทั้งหมด

      return new ServiceResponse(
        ResponseStatus.Success,
        "Get all success",
        {
          data: quotations,
          totalCount, // จำนวนข้อมูลทั้งหมด
          totalPages: Math.ceil(totalCount / pageSize), // จำนวนหน้าทั้งหมด
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

  findAllNoPagination: async () => {
    try {
      const customer = await quotationRepairRepository.findAllNoPagination();
      return new ServiceResponse(
        ResponseStatus.Success,
        "Get all success",
        customer,
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

  create: async (payload: TypePayloadQuotationRepair) => {
    try {
      // สร้างข้อมูลใหม่
      const newQuotationRepair =
        await quotationRepairRepository.create(payload);
      return new ServiceResponse<quotation_repair>(
        ResponseStatus.Success,
        "Create quotation repair success",
        newQuotationRepair,
        StatusCodes.OK
      );
    } catch (ex) {
      const errorMessage = `Error creating quotation: ${(ex as Error).message}`;
      return new ServiceResponse(
        ResponseStatus.Failed,
        errorMessage,
        null,
        StatusCodes.INTERNAL_SERVER_ERROR
      );
    }
  },

  update: async (id: string, payload: Partial<TypePayloadQuotationRepair>) => {
    try {
      // ตรวจสอบว่า quotation_doc มีอยู่หรือไม่
      const checkQuotation = await quotationRepairRepository.findById(id);
      if (!checkQuotation) {
        return new ServiceResponse(
          ResponseStatus.Failed,
          "Quotation repair not found",
          null,
          StatusCodes.BAD_REQUEST
        );
      }

      // อัปเดตข้อมูล
      const updatedQuotation = await quotationRepairRepository.update(
        id,
        payload
      );
      return new ServiceResponse<quotation_repair>(
        ResponseStatus.Success,
        "Update quotation success",
        updatedQuotation,
        StatusCodes.OK
      );
    } catch (ex) {
      const errorMessage = `Error updating quotation: ${(ex as Error).message}`;
      return new ServiceResponse(
        ResponseStatus.Failed,
        errorMessage,
        null,
        StatusCodes.INTERNAL_SERVER_ERROR
      );
    }
  },

  delete: async (id: string) => {
    try {
      const checkQuotation = await quotationRepairRepository.findById(id);
      if (!checkQuotation) {
        return new ServiceResponse(
          ResponseStatus.Failed,
          "Quotation not found",
          null,
          StatusCodes.BAD_REQUEST
        );
      }

      // ลบข้อมูล
      await quotationRepairRepository.delete(id);
      return new ServiceResponse<string>(
        ResponseStatus.Success,
        "Delete quotation success",
        "Quotation deleted successfully",
        StatusCodes.OK
      );
    } catch (ex) {
      const errorMessage = `Error deleting quotation: ${(ex as Error).message}`;
      return new ServiceResponse(
        ResponseStatus.Failed,
        errorMessage,
        null,
        StatusCodes.INTERNAL_SERVER_ERROR
      );
    }
  },

  deleteByMultiId: async (ids: string) => {
    try {
      const allId = ids;
      for (const id of allId.split(",")) {
        await quotationRepairRepository.delete(id);
      }

      return new ServiceResponse<string>(
        ResponseStatus.Success,
        "Delete quotation repair success",
        "Quotation repair deleted successfully",
        StatusCodes.OK
      );
    } catch (ex) {
      const errorMessage = `Error deleting quotation repair: ${(ex as Error).message}`;
      return new ServiceResponse(
        ResponseStatus.Failed,
        errorMessage,
        null,
        StatusCodes.INTERNAL_SERVER_ERROR
      );
    }
  },

  findById: async (id: string) => {
    try {
      const quotation = await quotationRepairRepository.findById(id);
      if (!quotation) {
        return new ServiceResponse(
          ResponseStatus.Failed,
          "Quotation repair not found",
          null,
          StatusCodes.BAD_REQUEST
        );
      }

      return new ServiceResponse<quotation_repair>(
        ResponseStatus.Success,
        "Quotation repair found",
        quotation,
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

  findByQuotationId: async (id: string) => {
    try {
      const quotations = await quotationRepairRepository.findByQuotationId(id);
      if (!quotations) {
        return new ServiceResponse(
          ResponseStatus.Failed,
          "Quotation repair by quotation Id not found",
          null,
          StatusCodes.BAD_REQUEST
        );
      }

      return new ServiceResponse<quotation_repair[]>(
        ResponseStatus.Success,
        "Quotation repair by quotation Id found",
        quotations,
        StatusCodes.OK
      );
    } catch (ex) {
      const errorMessage = `Error fetching quotation by quotation Id: ${(ex as Error).message}`;
      return new ServiceResponse(
        ResponseStatus.Failed,
        errorMessage,
        null,
        StatusCodes.INTERNAL_SERVER_ERROR
      );
    }
  },
};
