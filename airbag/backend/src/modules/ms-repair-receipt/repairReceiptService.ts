import { StatusCodes } from "http-status-codes";
import {
  ResponseStatus,
  ServiceResponse,
} from "@common/models/serviceResponse";
import { master_quotation, master_repair_receipt } from "@prisma/client";
import dayjs from "dayjs";
import { userRepository } from "@modules/users/userRepository";
import { generateQuotationDoc } from "@common/utils/generateQuotationDoc";
import { quotationRepairRepository } from "@modules/quotation-repair/quotationRepairRepository";
import { quotationLogStatusRepository } from "@modules/quotation_log_status/quotationLogStatusRepository";
import { TypePayloadQuotationLogStatus } from "@modules/quotation_log_status/quotationLogStatusModel";
import { fileService } from "@modules/file/fileService";
import { quotationRepairService } from "@modules/quotation-repair/quotationRepairService";
import { repairReceiptRepository } from "./repairReceiptRepository";
import {
  REPAIR_RECEIPT_STATUS,
  TypePayloadRepairReceipt,
  RepairDocItem,
} from "./repairReceiptModel";
import { generateRepairReceiptDoc } from "@common/utils/generateRepairReceipt";

export const repairReceiptService = {
  findAll: async (
    companyId: string,
    page: number = 1,
    pageSize: number = 12,
    searchText: string = "",
    status: string = "all"
  ) => {
    try {
      const skip = (page - 1) * pageSize;
      const receipts = await repairReceiptRepository.findAll(
        companyId,
        skip,
        pageSize,
        searchText,
        status
      );
      const totalCount = await repairReceiptRepository.count(
        companyId,
        searchText,
        status
      );

      return new ServiceResponse(
        ResponseStatus.Success,
        "Get all success",
        {
          data: receipts,
          totalCount,
          totalPages: Math.ceil(totalCount / pageSize),
        },
        StatusCodes.OK
      );
    } catch (error) {
      return new ServiceResponse(
        ResponseStatus.Failed,
        "Error fetching repair receipts",
        null,
        StatusCodes.INTERNAL_SERVER_ERROR
      );
    }
  },
  findAllNoPagination: async (company_id: string) => {
    try {
      const customer = await repairReceiptRepository.findAllNoPagination(company_id);
      return new ServiceResponse(
        ResponseStatus.Success,
        "Get all success",
        customer,
        StatusCodes.OK
      );
    } catch (error) {
      return new ServiceResponse(
        ResponseStatus.Failed,
        "Error fetching repair",
        null,
        StatusCodes.INTERNAL_SERVER_ERROR
      );
    }
  },

  findAllNotDeliveryNoPagination: async (company_id: string) => {
    try {
      const customer =
        await repairReceiptRepository.findAllNotDeliveryNoPagination(company_id);
      return new ServiceResponse(
        ResponseStatus.Success,
        "Get all success",
        customer,
        StatusCodes.OK
      );
    } catch (error) {
      return new ServiceResponse(
        ResponseStatus.Failed,
        "Error fetching repair",
        null,
        StatusCodes.INTERNAL_SERVER_ERROR
      );
    }
  },

  create: async (payload: TypePayloadRepairReceipt, userId: string, company_id: string) => {
    try {
      payload.repair_receipt_doc = await generateRepairReceiptDoc();
      payload.repair_receipt_status = REPAIR_RECEIPT_STATUS.PENDING;

      payload.created_by = userId;
      payload.updated_by = userId;
      payload.responsible_by = userId;
      // สร้างข้อมูลใหม่
      const newQuotation = await repairReceiptRepository.create(payload, company_id);
      return new ServiceResponse<master_repair_receipt>(
        ResponseStatus.Success,
        "Create repair receipt success",
        newQuotation,
        StatusCodes.OK
      );
    } catch (ex) {
      const errorMessage = `Error creating repair receipt: ${(ex as Error).message}`;
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
    payload: Partial<TypePayloadRepairReceipt>,
    userId: string
  ) => {
    try {
      const checkRepairReceipt = await repairReceiptRepository.findById(id);
      if (!checkRepairReceipt) {
        return new ServiceResponse(
          ResponseStatus.Failed,
          "Repair Receipt not found",
          null,
          StatusCodes.BAD_REQUEST
        );
      }

      payload.updated_by = userId;
      // อัปเดตข้อมูล
      const updatedRepairReceipt = await repairReceiptRepository.updateHome(
        id,
        payload
      );

      return new ServiceResponse<master_repair_receipt>(
        ResponseStatus.Success,
        "Update Repair Receipt success",
        updatedRepairReceipt,
        StatusCodes.OK
      );
    } catch (ex) {
      const errorMessage = `Error updating Repair Receipt: ${(ex as Error).message}`;
      return new ServiceResponse(
        ResponseStatus.Failed,
        errorMessage,
        null,
        StatusCodes.INTERNAL_SERVER_ERROR
      );
    }
  },

  updateBox: async (
    id: string,
    payload: Partial<TypePayloadRepairReceipt>,
    userId: string
  ) => {
    try {
      const checkRepairReceipt = await repairReceiptRepository.findById(id);
      if (!checkRepairReceipt) {
        return new ServiceResponse(
          ResponseStatus.Failed,
          "Repair Receipt not found",
          null,
          StatusCodes.BAD_REQUEST
        );
      }

      payload.updated_by = userId;
      // อัปเดตข้อมูล
      const updatedRepairReceipt = await repairReceiptRepository.updateBox(
        id,
        payload
      );

      return new ServiceResponse<master_repair_receipt>(
        ResponseStatus.Success,
        "Update Repair Receipt success",
        updatedRepairReceipt,
        StatusCodes.OK
      );
    } catch (ex) {
      const errorMessage = `Error updating Repair Receipt: ${(ex as Error).message}`;
      return new ServiceResponse(
        ResponseStatus.Failed,
        errorMessage,
        null,
        StatusCodes.INTERNAL_SERVER_ERROR
      );
    }
  },
  success: async (id: string, payload: Partial<TypePayloadRepairReceipt>) => {
    payload.repair_receipt_status = REPAIR_RECEIPT_STATUS.SUCCESS;

    try {
      const checkRepairReceipt = await repairReceiptRepository.findById(id);
      if (!checkRepairReceipt) {
        return new ServiceResponse(
          ResponseStatus.Failed,
          "Repair Receipt not found",
          null,
          StatusCodes.BAD_REQUEST
        );
      }

      // อัปเดตข้อมูล
      const updatedRepairReceipt = await repairReceiptRepository.success(
        id,
        payload
      );

      return new ServiceResponse<master_repair_receipt>(
        ResponseStatus.Success,
        "update status repair receipt success",
        updatedRepairReceipt,
        StatusCodes.OK
      );
    } catch (ex) {
      const errorMessage = `Error approve update status repair receipt: ${(ex as Error).message}`;
      return new ServiceResponse(
        ResponseStatus.Failed,
        errorMessage,
        null,
        StatusCodes.INTERNAL_SERVER_ERROR
      );
    }
  },
  cancel: async (id: string, payload: Partial<TypePayloadRepairReceipt>) => {
    payload.repair_receipt_status = REPAIR_RECEIPT_STATUS.CANCEL;

    try {
      const checkRepairReceipt = await repairReceiptRepository.findById(id);
      if (!checkRepairReceipt) {
        return new ServiceResponse(
          ResponseStatus.Failed,
          "Repair Receipt not found",
          null,
          StatusCodes.BAD_REQUEST
        );
      }

      // อัปเดตข้อมูล
      const updatedRepairReceipt = await repairReceiptRepository.cancel(
        id,
        payload
      );

      return new ServiceResponse<master_repair_receipt>(
        ResponseStatus.Success,
        "update status repair receipt success",
        updatedRepairReceipt,
        StatusCodes.OK
      );
    } catch (ex) {
      const errorMessage = `Error approve update status repair receipt: ${(ex as Error).message}`;
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
      const checkRepairReceipt = await repairReceiptRepository.findById(id);
      if (!checkRepairReceipt) {
        return new ServiceResponse(
          ResponseStatus.Failed,
          "Repair receipt not found",
          null,
          StatusCodes.BAD_REQUEST
        );
      }

      // ลบข้อมูล
      await repairReceiptRepository.delete(id);

      if (checkRepairReceipt.repair_receipt_image_url) {
        await fileService.delete(checkRepairReceipt.repair_receipt_image_url);
      }

      if (checkRepairReceipt.box_before_file_url) {
        await fileService.delete(checkRepairReceipt.box_before_file_url);
      }

      if (checkRepairReceipt.box_after_file_url) {
        await fileService.delete(checkRepairReceipt.box_after_file_url);
      }

      return new ServiceResponse<string>(
        ResponseStatus.Success,
        "Delete Repair receipt success",
        "Repair receipt deleted successfully",
        StatusCodes.OK
      );
    } catch (ex) {
      const errorMessage = `Error deleting Repair receipt: ${(ex as Error).message}`;
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
      const quotation = await repairReceiptRepository.findById(id);
      if (!quotation) {
        return new ServiceResponse(
          ResponseStatus.Failed,
          "Repair receipt not found",
          null,
          StatusCodes.BAD_REQUEST
        );
      }

      return new ServiceResponse<master_repair_receipt>(
        ResponseStatus.Success,
        "Repair receipt found",
        quotation,
        StatusCodes.OK
      );
    } catch (ex) {
      const errorMessage = `Error fetching Repair receipt: ${(ex as Error).message}`;
      return new ServiceResponse(
        ResponseStatus.Failed,
        errorMessage,
        null,
        StatusCodes.INTERNAL_SERVER_ERROR
      );
    }
  },

  findAllById: async (id: string) => {
    try {
      const quotation = await repairReceiptRepository.findAllById(id);
      if (!quotation) {
        return new ServiceResponse(
          ResponseStatus.Failed,
          "Repair receipt not found",
          null,
          StatusCodes.BAD_REQUEST
        );
      }

      return new ServiceResponse<master_repair_receipt>(
        ResponseStatus.Success,
        "Repair receipt found",
        quotation,
        StatusCodes.OK
      );
    } catch (ex) {
      const errorMessage = `Error fetching Repair receipt: ${(ex as Error).message}`;
      return new ServiceResponse(
        ResponseStatus.Failed,
        errorMessage,
        null,
        StatusCodes.INTERNAL_SERVER_ERROR
      );
    }
  },

  findSelectedFieldsById: async (id: string) => {
    try {
      const data = await repairReceiptRepository.findSelectedFieldsById(id);
      if (!data) {
        return new ServiceResponse(
          ResponseStatus.Failed,
          "Repair receipt not found",
          null,
          StatusCodes.BAD_REQUEST
        );
      }

      // ตรวจสอบ quotation_status
      if (data.master_quotation?.quotation_status !== "close_deal") {
        return new ServiceResponse(
          ResponseStatus.Failed,
          "Repair receipt is not in close deal status",
          null,
          StatusCodes.BAD_REQUEST
        );
      }

      const formattedData = {
        repair_receipt_doc: data.repair_receipt_doc,
        register: data.register || null,
        estimated_date_repair_completion:
          data.estimated_date_repair_completion || null,
        contact_name:
          data.master_quotation?.master_customer?.contact_name || null,
        brandmodel_name:
          data.master_quotation?.master_brandmodel?.brandmodel_name || null,
        deal_closed_date: data.master_quotation?.deal_closed_date || null,
        quotation_status: data.master_quotation?.quotation_status || null,
      };

      return new ServiceResponse(
        ResponseStatus.Success,
        "Repair receipt found",
        formattedData,
        StatusCodes.OK
      );
    } catch (ex) {
      const errorMessage = `Error fetching repair receipt: ${(ex as Error).message}`;
      return new ServiceResponse(
        ResponseStatus.Failed,
        errorMessage,
        null,
        StatusCodes.INTERNAL_SERVER_ERROR
      );
    }
  },

  setFinishToTrue: async (id: string) => {
    try {
      const repairReceipt = await repairReceiptRepository.findById(id);
      if (!repairReceipt) {
        return new ServiceResponse(
          ResponseStatus.Failed,
          "Repair Receipt not found",
          null,
          StatusCodes.NOT_FOUND
        );
      }

      const updatedRepairReceipt =
        await repairReceiptRepository.updateFinishToTrue(id);
      return new ServiceResponse(
        ResponseStatus.Success,
        "Repair Receipt marked as finished",
        updatedRepairReceipt, // คืนค่าเฉพาะฟิลด์ finish
        StatusCodes.OK
      );
    } catch (error) {
      return new ServiceResponse(
        ResponseStatus.Failed,
        `Error updating Repair Receipt: ${(error as Error).message}`,
        null,
        StatusCodes.INTERNAL_SERVER_ERROR
      );
    }
  },

  setFinishToFalse: async (id: string) => {
    try {
      const repairReceipt = await repairReceiptRepository.findById(id);
      if (!repairReceipt) {
        return new ServiceResponse(
          ResponseStatus.Failed,
          "Repair Receipt not found",
          null,
          StatusCodes.NOT_FOUND
        );
      }

      const updatedRepairReceipt =
        await repairReceiptRepository.updateFinishToFalse(id);
      return new ServiceResponse(
        ResponseStatus.Success,
        "Repair Receipt marked as unfinished",
        updatedRepairReceipt, // คืนค่าเฉพาะฟิลด์ finish
        StatusCodes.OK
      );
    } catch (error) {
      return new ServiceResponse(
        ResponseStatus.Failed,
        `Error updating Repair Receipt: ${(error as Error).message}`,
        null,
        StatusCodes.INTERNAL_SERVER_ERROR
      );
    }
  },

  findByFinishStatusAndId: async (id: string, isFinished: boolean) => {
    try {
      const repairReceipt =
        await repairReceiptRepository.findByFinishStatusAndId(id, isFinished);

      if (!repairReceipt) {
        return new ServiceResponse(
          ResponseStatus.Failed,
          "Repair receipt not found or does not match finish status",
          null,
          StatusCodes.OK
        );
      }

      const formattedData = {
        repair_receipt_doc: repairReceipt.repair_receipt_doc,
        register: repairReceipt.register || null,
        contact_name:
          repairReceipt.master_quotation?.master_customer?.contact_name || null,
        brandmodel_name:
          repairReceipt.master_quotation?.master_brandmodel?.brandmodel_name ||
          null,
        deal_closed_date:
          repairReceipt.master_quotation?.deal_closed_date || null,
        appointment_date:
          repairReceipt.master_quotation?.appointment_date || null,
      };

      return new ServiceResponse(
        ResponseStatus.Success,
        "Repair receipt found",
        formattedData,
        StatusCodes.OK
      );
    } catch (error) {
      return new ServiceResponse(
        ResponseStatus.Failed,
        `Error fetching repair receipt: ${(error as Error).message}`,
        null,
        StatusCodes.INTERNAL_SERVER_ERROR
      );
    }
  },

  findSelect: async (companyId: string) => {
    try {
      const brands = await repairReceiptRepository.findSelect(companyId);
      return new ServiceResponse(
        ResponseStatus.Success,
        "Get select RR. data success",
        brands,
        StatusCodes.OK
      );
    } catch (error) {
      return new ServiceResponse(
        ResponseStatus.Failed,
        "Error fetching select RR. data",
        null,
        StatusCodes.INTERNAL_SERVER_ERROR
      );
    }
  },

  findCalendarRemoval: async (id: string, companyId: string) => {
    try {
      const data = await repairReceiptRepository.findCalendarRemoval(
        id,
        companyId
      );
      if (!data) {
        return new ServiceResponse(
          ResponseStatus.Failed,
          "Repair receipt not found",
          null,
          StatusCodes.BAD_REQUEST
        );
      }

      return new ServiceResponse(
        ResponseStatus.Success,
        "Get calendar removal data success",
        data,
        StatusCodes.OK
      );
    } catch (ex) {
      const errorMessage = `Error fetching calendar removal data: ${(ex as Error).message}`;
      return new ServiceResponse(
        ResponseStatus.Failed,
        errorMessage,
        null,
        StatusCodes.INTERNAL_SERVER_ERROR
      );
    }
  },

  findDocAndId: async (companyId: string) => {
    try {
      const brands = await repairReceiptRepository.findDocAndId(companyId);
      return new ServiceResponse(
        ResponseStatus.Success,
        "Get select RR. data success",
        brands,
        StatusCodes.OK
      );
    } catch (error) {
      return new ServiceResponse(
        ResponseStatus.Failed,
        "Error fetching select RR. data",
        null,
        StatusCodes.INTERNAL_SERVER_ERROR
      );
    }
  },

  findRepairDocsByCompanyId: async (companyId: string): Promise<ServiceResponse<RepairDocItem[]>> => {
    try {
      const docsResult = await repairReceiptRepository.findRepairDocsByCompanyId(companyId);

      if (!docsResult || docsResult.length === 0) {
        return new ServiceResponse(
          ResponseStatus.Success,
          "No repair receipt documents found for this company.",
          [], 
          StatusCodes.OK
        );
      }
      return new ServiceResponse(
        ResponseStatus.Success,
        "Successfully fetched repair receipt documents",
        docsResult, 
        StatusCodes.OK
      );
    } catch (error) {
      const errorMessage = `Error fetching repair receipt documents: ${(error as Error).message}`;
      console.error(errorMessage);
      return new ServiceResponse(
        ResponseStatus.Failed,
        errorMessage,
        [], 
        StatusCodes.INTERNAL_SERVER_ERROR
      );
    }
  },

  findResponsibleUserForRepairReceipt: async (id: string) => {     try {
        const repairReceiptData = await repairReceiptRepository.findOnlyResponsibleUser(id); 

        if (!repairReceiptData) { 
            return new ServiceResponse(
                ResponseStatus.Failed,
                "Repair receipt not found.",
                null,
                StatusCodes.NOT_FOUND
            );
        }

        if (!repairReceiptData.responsible_by_user) { 
            return new ServiceResponse(
                ResponseStatus.Success, 
                "No responsible user assigned to this repair receipt.",
                null, 
                StatusCodes.OK 
            );
        }
        return new ServiceResponse(
            ResponseStatus.Success,
            "Responsible user found.",
            repairReceiptData.responsible_by_user, 
            StatusCodes.OK
        );
    } catch (ex) {
        const errorMessage = `Error fetching responsible user for repair receipt: ${(ex as Error).message}`;
        return new ServiceResponse(
            ResponseStatus.Failed,
            errorMessage,
            null,
            StatusCodes.INTERNAL_SERVER_ERROR
        );
    }
},

updateResponsibleBy: async (id: string, responsibleById: string, userId: string) => {
  try {
    const checkRepairReceipt = await repairReceiptRepository.findById(id);
    if (!checkRepairReceipt) {
      return new ServiceResponse(
        ResponseStatus.Failed,
        "Repair Receipt not found",
        null,
        StatusCodes.NOT_FOUND
      );
    }
    const updatedRepairReceipt = await repairReceiptRepository.updateResponsibleBy(id, responsibleById, userId);
    return new ServiceResponse(
      ResponseStatus.Success,
      "Successfully updated responsible person for Repair Receipt.",
      updatedRepairReceipt,
      StatusCodes.OK
    );
  } catch (ex) {
    const errorMessage = `Error updating responsible person for Repair Receipt: ${(ex as Error).message}`;
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
      const data = await repairReceiptRepository.select(companyId , searchText);
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

  findAllJobs: async (
    companyId: string,
    page: number = 1,
    pageSize: number = 25,
    status: 'all' | 'pending' | 'success' = 'all',
    searchText: string = ""
  ) => {
    try {
      const skip = (page - 1) * pageSize;
      // รับค่า data, totalCount, และ summary จาก Repository
      const { data, totalCount, summary } = await repairReceiptRepository.findJobs(
        companyId,
        skip,
        pageSize,
        status,
        searchText
      );

      // แปลงข้อมูลที่ได้จาก Raw Query (อาจจะเป็น BigInt) ให้เป็น Number
      const formattedData = (data as any[]).map(job => ({
        ...job,
        total_repairs: Number(job.total_repairs),
        completed_repairs: Number(job.completed_repairs),
      }));

      return new ServiceResponse(
        ResponseStatus.Success,
        "Get all jobs success",
        {
          data: formattedData,
          totalCount,
          totalPages: Math.ceil(totalCount / pageSize),
          summary, // ส่ง summary ไปยัง Frontend
        },
        StatusCodes.OK
      );
    } catch (error) {
      const errorMessage = `Error fetching jobs: ${(error as Error).message}`;
      console.error(errorMessage);
      return new ServiceResponse(
        ResponseStatus.Failed,
        errorMessage,
        null,
        StatusCodes.INTERNAL_SERVER_ERROR
      );
    }
  },
};
