import { StatusCodes } from "http-status-codes";
import {
  ResponseStatus,
  ServiceResponse,
} from "@common/models/serviceResponse";
import { quotation_repair } from "@prisma/client";
import { repairReceiptListRepairRepository } from "./repairReceiptListRepairRepository";
import { TypePayloadRepairReceiptListRepair } from "./repairReceiptListRepairModel";
import { companiesRepository } from "@modules/ms-companies/ms_companiesRepository";
import { generateRepairReceiptListRepairBarcodeNumner } from "@common/utils/generateRepairReceiptListRepairBarcodeNumner";
import { TypePayloadRepairReceiptListRepairLogStatus } from "@modules/repair_receipt_list_repair_log_status/repairReceiptListRepairLogStatusModel";
import { repairReceiptListRepairLogRepository } from "@modules/repair_receipt_list_repair_log_status/repairReceiptListRepairLogStatusRepository";

export const repairReceiptListRepairService = {
  // ดึงข้อมูลทั้งหมดพร้อม Pagination
  findAll: async (page: number = 1, pageSize: number = 12) => {
    try {
      const skip = (page - 1) * pageSize; // คำนวณ offset
      const quotations = await repairReceiptListRepairRepository.findAll(
        skip,
        pageSize
      ); // ดึงข้อมูล
      const totalCount = await repairReceiptListRepairRepository.count(); // นับจำนวนทั้งหมด

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

  findAllNoPagination: async (company_id: string) => {
    try {
      const customer =
        await repairReceiptListRepairRepository.findAllNoPagination(company_id);
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

  create: async (
    payload: TypePayloadRepairReceiptListRepair,
    company_id: string,
    userId: string
  ) => {
    try {
      const companyData = await companiesRepository.findByIdCompany(
        payload.quotation_id
      );

      const barcode = await generateRepairReceiptListRepairBarcodeNumner(
        companyData?.company_code ?? "C0001"
      );

      payload.barcode = barcode;
      // สร้างข้อมูลใหม่
      const newData = await repairReceiptListRepairRepository.create(
        payload,
        company_id
      );

      const payloadLog: TypePayloadRepairReceiptListRepairLogStatus = {
        repair_receipt_list_repair_id: newData.id,
        list_repair_status: "active",
        created_by: userId,
        company_id: company_id,
      };

      await repairReceiptListRepairLogRepository.create(payloadLog);

      return new ServiceResponse<quotation_repair>(
        ResponseStatus.Success,
        "Create repair receipt list repair success",
        newData,
        StatusCodes.OK
      );
    } catch (ex) {
      const errorMessage = `Error creating repair receipt list repair: ${(ex as Error).message}`;
      return new ServiceResponse(
        ResponseStatus.Failed,
        errorMessage,
        null,
        StatusCodes.INTERNAL_SERVER_ERROR
      );
    }
  },

  update: async (
    id: string,
    payload: Partial<TypePayloadRepairReceiptListRepair>
  ) => {
    try {
      // ตรวจสอบว่า quotation_doc มีอยู่หรือไม่
      const checkQuotation =
        await repairReceiptListRepairRepository.findById(id);
      if (!checkQuotation) {
        return new ServiceResponse(
          ResponseStatus.Failed,
          "Quotation repair not found",
          null,
          StatusCodes.BAD_REQUEST
        );
      }

      // อัปเดตข้อมูล
      const updatedQuotation = await repairReceiptListRepairRepository.update(
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

  updateStatusIsActive: async (
    id: string,
    payload: TypePayloadRepairReceiptListRepair,
    company_id: string,
    userId: string
  ) => {
    try {
      const checkRepairReceiptListRepair =
        await repairReceiptListRepairRepository.findById(id);
      if (!checkRepairReceiptListRepair) {
        return new ServiceResponse(
          ResponseStatus.Failed,
          "Repair Receipt List Repair not found",
          null,
          StatusCodes.BAD_REQUEST
        );
      }

      // อัปเดตข้อมูล
      const updatedQuotation =
        await repairReceiptListRepairRepository.updateStatusIsActive(
          id,
          payload,
          company_id
        );

      const payloadLog: TypePayloadRepairReceiptListRepairLogStatus = {
        repair_receipt_list_repair_id: id,
        list_repair_status: payload.is_active ? "active" : "not_active",
        created_by: userId,
        company_id: company_id,
      };

      await repairReceiptListRepairLogRepository.create(payloadLog);

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
      const checkQuotation =
        await repairReceiptListRepairRepository.findById(id);
      if (!checkQuotation) {
        return new ServiceResponse(
          ResponseStatus.Failed,
          "Quotation not found",
          null,
          StatusCodes.BAD_REQUEST
        );
      }

      // ลบข้อมูล
      await repairReceiptListRepairRepository.delete(id);
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
        await repairReceiptListRepairRepository.delete(id);
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
      const quotation = await repairReceiptListRepairRepository.findById(id);
      if (!quotation) {
        return new ServiceResponse(
          ResponseStatus.Failed,
          "Repair receip list repair not found",
          null,
          StatusCodes.BAD_REQUEST
        );
      }

      return new ServiceResponse<quotation_repair>(
        ResponseStatus.Success,
        "Repair receip list repair found",
        quotation,
        StatusCodes.OK
      );
    } catch (ex) {
      const errorMessage = `Error fetching Repair receip list repair: ${(ex as Error).message}`;
      return new ServiceResponse(
        ResponseStatus.Failed,
        errorMessage,
        null,
        StatusCodes.INTERNAL_SERVER_ERROR
      );
    }
  },

  findByRepairReceiptId: async (id: string, company_id: string) => {
    try {
      const repairList =
        await repairReceiptListRepairRepository.findByRepairReceiptId(id, company_id);

      return new ServiceResponse(
        ResponseStatus.Success,
        "Repair receipt list repair by repair receipt Id",
        repairList,
        StatusCodes.OK
      );
    } catch (ex) {
      const errorMessage = `Error fetching repair receipt list repair by repair receipt Id: ${(ex as Error).message}`;
      return new ServiceResponse(
        ResponseStatus.Failed,
        errorMessage,
        null,
        StatusCodes.INTERNAL_SERVER_ERROR
      );
    }
  },
   findByRepairReceiptIdActive: async (id: string, company_id: string) => {
    try {
      const repairList =
        await repairReceiptListRepairRepository.findByRepairReceiptIdActive(id, company_id);

      return new ServiceResponse(
        ResponseStatus.Success,
        "Repair receipt list repair by repair receipt Id",
        repairList,
        StatusCodes.OK
      );
    } catch (ex) {
      const errorMessage = `Error fetching repair receipt list repair by repair receipt Id: ${(ex as Error).message}`;
      return new ServiceResponse(
        ResponseStatus.Failed,
        errorMessage,
        null,
        StatusCodes.INTERNAL_SERVER_ERROR
      );
    }
  },

  updateStatusCheckedBox: async (
    id: string,
    statusDate: string,
    userId: string
  ) => {
    try {
      const record = await repairReceiptListRepairRepository.findById(id);
      if (!record) {
        return new ServiceResponse(
          ResponseStatus.Failed,
          "Repair receipt list repair not found",
          null,
          StatusCodes.BAD_REQUEST
        );
      }

      const updatedRecord =
        await repairReceiptListRepairRepository.updateStatusCheckedBox(
          id,
          statusDate,
          userId // ส่ง userId จาก token ไปยัง repository
        );

      return new ServiceResponse(
        ResponseStatus.Success,
        "Update status_date and status_by success",
        updatedRecord,
        StatusCodes.OK
      );
    } catch (ex) {
      const errorMessage = `Error updating status_date and status_by: ${(ex as Error).message}`;
      return new ServiceResponse(
        ResponseStatus.Failed,
        errorMessage,
        null,
        StatusCodes.INTERNAL_SERVER_ERROR
      );
    }
  },

  updateStatusUnCheckedBox: async (id: string, userId: string) => {
    try {
      const record = await repairReceiptListRepairRepository.findById(id);
      if (!record) {
        return new ServiceResponse(
          ResponseStatus.Failed,
          "Repair receipt list repair not found",
          null,
          StatusCodes.BAD_REQUEST
        );
      }

      const updatedRecord =
        await repairReceiptListRepairRepository.updateStatusUnCheckedBox(
          id,
          userId // ส่ง userId จาก token ไปยัง repository
        );

      return new ServiceResponse(
        ResponseStatus.Success,
        "Update status to pending success",
        updatedRecord,
        StatusCodes.OK
      );
    } catch (ex) {
      const errorMessage = `Error updating status to pending: ${(ex as Error).message}`;
      return new ServiceResponse(
        ResponseStatus.Failed,
        errorMessage,
        null,
        StatusCodes.INTERNAL_SERVER_ERROR
      );
    }
  },
};
