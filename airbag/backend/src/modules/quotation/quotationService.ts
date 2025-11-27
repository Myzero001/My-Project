import { StatusCodes } from "http-status-codes";
import {
  ResponseStatus,
  ServiceResponse,
} from "@common/models/serviceResponse";
import { quotationRepository } from "./quotationRepository";
import { QUOTATION_STATUS, TypePayloadQuotation } from "./quotationModel";
import { master_quotation } from "@prisma/client";
import dayjs from "dayjs";
import { userRepository } from "@modules/users/userRepository";
import { generateQuotationDoc } from "@common/utils/generateQuotationDoc";
import { quotationRepairRepository } from "@modules/quotation-repair/quotationRepairRepository";
import { quotationLogStatusRepository } from "@modules/quotation_log_status/quotationLogStatusRepository";
import { TypePayloadQuotationLogStatus } from "@modules/quotation_log_status/quotationLogStatusModel";
import { fileService } from "@modules/file/fileService";
import { quotationRepairService } from "@modules/quotation-repair/quotationRepairService";
import { repairReceiptService } from "@modules/ms-repair-receipt/repairReceiptService";
import { TypePayloadRepairReceipt } from "@modules/ms-repair-receipt/repairReceiptModel";
import { REPAIR_RECEIPT_LIST_REPAIR_STATUS } from "@modules/repair-receipt-list-repair/repairReceiptListRepairModel";
import { repairReceiptListRepairRepository } from "@modules/repair-receipt-list-repair/repairReceiptListRepairRepository";
import { generateRepairReceiptListRepairBarcodeNumner } from "@common/utils/generateRepairReceiptListRepairBarcodeNumner";
import { companiesRepository } from "@modules/ms-companies/ms_companiesRepository";
import prisma from "@src/db";

export const quotationService = {
  // ดึงข้อมูลทั้งหมดพร้อม Pagination
  findAll: async (
    page: number = 1,
    pageSize: number = 12,
    searchText: string = "",
    status: string = "all",
    company_id: string
  ) => {
    try {
      const skip = (page - 1) * pageSize; // คำนวณ offset
      const quotations = await quotationRepository.findAll(
        skip,
        pageSize,
        searchText,
        status,
        company_id,
      ); // ดึงข้อมูล
      const totalCount = await quotationRepository.count(searchText, status, company_id); // นับจำนวนทั้งหมด

      return new ServiceResponse(
        ResponseStatus.Success,
        "Get all success",
        {
          data: quotations,
          totalCount, // จำนวนข้อมูลทั้งหมด
          totalPages: Math.ceil(totalCount / pageSize), // จำนวนหน้าทั้งหมด
          status: status,
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
  findAllApprove: async (
    page: number = 1,
    pageSize: number = 12,
    searchText: string = "",
    status: string = "all",
    company_id: string
  ) => {
    try {
      const skip = (page - 1) * pageSize; // คำนวณ offset
      const quotations = await quotationRepository.findAllApprove(
        skip,
        pageSize,
        searchText,
        status,
        company_id
      ); // ดึงข้อมูล
      const totalCount = await quotationRepository.countApprove(
        searchText,
        status,
        company_id,
      ); // นับจำนวนทั้งหมด

      return new ServiceResponse(
        ResponseStatus.Success,
        "Get all success",
        {
          data: quotations,
          totalCount, // จำนวนข้อมูลทั้งหมด
          totalPages: Math.ceil(totalCount / pageSize), // จำนวนหน้าทั้งหมด
          status: status,
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

  // สร้าง Quotation
  create: async (
    payload: TypePayloadQuotation,
    userId: string,
    company_id: string
  ) => {
    try {
      payload.quotation_doc = await generateQuotationDoc();
      payload.company_id = company_id;
      payload.created_by = userId;
      payload.updated_by = userId;

      payload.quotation_status = QUOTATION_STATUS.PENDING;

      payload.responsible_by = userId;
      payload.responsible_date = dayjs().format("YYYY-MM-DD HH:mm:ss");

      // สร้างข้อมูลใหม่
      const newQuotation = await quotationRepository.create(payload);

      const payloadLog: TypePayloadQuotationLogStatus = {
        quotation_id: newQuotation.quotation_id,
        quotation_status: QUOTATION_STATUS.PENDING,
        created_by: userId,
        company_id: company_id,
      };

      await quotationLogStatusRepository.create(payloadLog);

      return new ServiceResponse<master_quotation>(
        ResponseStatus.Success,
        "Create quotation success",
        newQuotation,
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

  // อัปเดต Quotation
  update: async (
    quotation_id: string,
    payload: Partial<TypePayloadQuotation>
  ) => {
    try {
      // ตรวจสอบว่า quotation_doc มีอยู่หรือไม่
      const checkQuotation = await quotationRepository.findById(quotation_id);
      if (!checkQuotation) {
        return new ServiceResponse(
          ResponseStatus.Failed,
          "Quotation not found",
          null,
          StatusCodes.BAD_REQUEST
        );
      }

      const quotationRepairs = checkQuotation.quotationRepair;
      const quotationIds = quotationRepairs
        .map((quotationRepair) => quotationRepair.id)
        .join(",");
      await quotationRepairService.deleteByMultiId(quotationIds);

      if (payload.repair_summary) {
        const repairSummary: any = JSON.parse(payload.repair_summary);
        for (const rs of repairSummary) {
          const payloadCreate = {
            quotation_id: quotation_id,
            master_repair_id: rs.master_repair_id,
            price: parseInt(rs.price),
          };
          await quotationRepairRepository.create(payloadCreate);
        }
      }

      // อัปเดตข้อมูล
      const updatedQuotation = await quotationRepository.update(
        quotation_id,
        payload
      );

      return new ServiceResponse<master_quotation>(
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

  approve: async (
    quotation_id: string,
    payload: Partial<TypePayloadQuotation>,
    userId: string,
    company_id: string
  ) => {
    payload.quotation_status = QUOTATION_STATUS.APPROVED;
    payload.approval_date = dayjs().format("YYYY-MM-DD HH:mm:ss");
    payload.approval_by = userId;
    payload.approval_notes = payload.approval_notes;

    try {
      // ตรวจสอบว่า quotation_doc มีอยู่หรือไม่
      const checkQuotation = await quotationRepository.findById(quotation_id);
      if (!checkQuotation) {
        return new ServiceResponse(
          ResponseStatus.Failed,
          "Quotation not found",
          null,
          StatusCodes.BAD_REQUEST
        );
      }

      // อัปเดตข้อมูล
      const updatedQuotation = await quotationRepository.approve(
        quotation_id,
        payload
      );

      const payloadLog: TypePayloadQuotationLogStatus = {
        quotation_id,
        quotation_status: QUOTATION_STATUS.APPROVED,
        created_by: userId,
        remark: payload.approval_notes,
        company_id: company_id,
      };

      await quotationLogStatusRepository.create(payloadLog);

      return new ServiceResponse<master_quotation>(
        ResponseStatus.Success,
        "Approve quotation success",
        updatedQuotation,
        StatusCodes.OK
      );
    } catch (ex) {
      const errorMessage = `Error approve quotation: ${(ex as Error).message}`;
      return new ServiceResponse(
        ResponseStatus.Failed,
        errorMessage,
        null,
        StatusCodes.INTERNAL_SERVER_ERROR
      );
    }
  },

  reject: async (
    quotation_id: string,
    payload: Partial<TypePayloadQuotation>,
    userId: string,
    company_id: string
  ) => {
    payload.quotation_status = QUOTATION_STATUS.REJECT_APPROVED;
    // payload.approval_date = dayjs().format("YYYY-MM-DD HH:mm:ss");
    // payload.approval_by = userId;
    // payload.approval_notes = payload.approval_notes;

    try {
      // ตรวจสอบว่า quotation_doc มีอยู่หรือไม่
      const checkQuotation = await quotationRepository.findById(quotation_id);
      if (!checkQuotation) {
        return new ServiceResponse(
          ResponseStatus.Failed,
          "Quotation not found",
          null,
          StatusCodes.BAD_REQUEST
        );
      }

      // อัปเดตข้อมูล
      const updatedQuotation = await quotationRepository.reject(
        quotation_id,
        payload
      );

      const payloadLog: TypePayloadQuotationLogStatus = {
        quotation_id,
        quotation_status: QUOTATION_STATUS.REJECT_APPROVED,
        created_by: userId,
        remark: payload.approval_notes,
        company_id: company_id,
      };

      await quotationLogStatusRepository.create(payloadLog);

      return new ServiceResponse<master_quotation>(
        ResponseStatus.Success,
        "Approve quotation success",
        updatedQuotation,
        StatusCodes.OK
      );
    } catch (ex) {
      const errorMessage = `Error approve quotation: ${(ex as Error).message}`;
      return new ServiceResponse(
        ResponseStatus.Failed,
        errorMessage,
        null,
        StatusCodes.INTERNAL_SERVER_ERROR
      );
    }
  },

  requestApprove: async (
    quotation_id: string,
    userId: string,
    company_id: string
  ) => {
    const payload: Partial<TypePayloadQuotation> = {
      quotation_status: QUOTATION_STATUS.WAITING_FOR_APPROVE,
    };

    try {
      // ตรวจสอบว่า quotation_doc มีอยู่หรือไม่
      const checkQuotation = await quotationRepository.findById(quotation_id);
      if (!checkQuotation) {
        return new ServiceResponse(
          ResponseStatus.Failed,
          "Quotation not found",
          null,
          StatusCodes.BAD_REQUEST
        );
      }

      // อัปเดตข้อมูล
      const updatedQuotation = await quotationRepository.requestApprove(
        quotation_id,
        payload
      );

      const payloadLog: TypePayloadQuotationLogStatus = {
        quotation_id,
        quotation_status: QUOTATION_STATUS.WAITING_FOR_APPROVE,
        created_by: userId,
        company_id: company_id,
      };

      await quotationLogStatusRepository.create(payloadLog);

      return new ServiceResponse<master_quotation>(
        ResponseStatus.Success,
        "Request approve quotation success",
        updatedQuotation,
        StatusCodes.OK
      );
    } catch (ex) {
      const errorMessage = `Error request approve quotation: ${(ex as Error).message}`;
      return new ServiceResponse(
        ResponseStatus.Failed,
        errorMessage,
        null,
        StatusCodes.INTERNAL_SERVER_ERROR
      );
    }
  },

  requestEdit: async (
    quotation_id: string,
    remark: string,
    userId: string,
    company_id: string
  ) => {
    const payload: Partial<TypePayloadQuotation> = {
      quotation_status: QUOTATION_STATUS.PENDING,
    };

    try {
      // ตรวจสอบว่า quotation_doc มีอยู่หรือไม่
      const checkQuotation = await quotationRepository.findById(quotation_id);
      if (!checkQuotation) {
        return new ServiceResponse(
          ResponseStatus.Failed,
          "Quotation not found",
          null,
          StatusCodes.BAD_REQUEST
        );
      }

      // อัปเดตข้อมูล
      const updatedQuotation = await quotationRepository.requestEdit(
        quotation_id,
        payload
      );

      const payloadLog: TypePayloadQuotationLogStatus = {
        quotation_id,
        quotation_status: QUOTATION_STATUS.PENDING,
        created_by: userId,
        remark: remark,
        company_id: company_id,
      };

      await quotationLogStatusRepository.create(payloadLog);

      return new ServiceResponse<master_quotation>(
        ResponseStatus.Success,
        "Request edit quotation success",
        updatedQuotation,
        StatusCodes.OK
      );
    } catch (ex) {
      const errorMessage = `Error request edit quotation: ${(ex as Error).message}`;
      return new ServiceResponse(
        ResponseStatus.Failed,
        errorMessage,
        null,
        StatusCodes.INTERNAL_SERVER_ERROR
      );
    }
  },

  closeDeal: async (
    quotation_id: string,
    payload: Partial<TypePayloadQuotation>,
    userId: string,
    company_id: string
  ) => {
    payload.quotation_status = QUOTATION_STATUS.CLOSE_DEAL;
    payload.deal_closed_date = dayjs().format("YYYY-MM-DD HH:mm:ss");
    payload.deal_closed_by = userId;

    try {
      // ตรวจสอบว่า quotation_doc มีอยู่หรือไม่
      const checkQuotation = await quotationRepository.findById(quotation_id);
      if (!checkQuotation) {
        return new ServiceResponse(
          ResponseStatus.Failed,
          "Quotation not found",
          null,
          StatusCodes.BAD_REQUEST
        );
      }
      const companyData =
        await companiesRepository.findByIdCompany(quotation_id);

      // อัปเดตข้อมูล
      const updatedQuotation = await quotationRepository.closeDeal(
        quotation_id,
        payload
      );

      const payloadLog: TypePayloadQuotationLogStatus = {
        quotation_id,
        quotation_status: QUOTATION_STATUS.CLOSE_DEAL,
        created_by: userId,
        company_id: company_id,
      };

      await quotationLogStatusRepository.create(payloadLog);

      const payloadRepairReceipt: TypePayloadRepairReceipt = {
        quotation_id: quotation_id,
        repair_receipt_doc: "",
        repair_receipt_status: "",

        repair_receipt_at: "",
        estimated_date_repair_completion: "",
        expected_delivery_date: "",
        total_price: checkQuotation.total_price ?? 0,
        tax: checkQuotation.tax ?? 0,
        company_id: company_id,
      };

      const repairReceipt = await repairReceiptService.create(
        payloadRepairReceipt,
        userId,
        company_id,
      );
      if (payload.repair_summary && repairReceipt.responseObject?.id) {
        const repairSummary: any = JSON.parse(payload.repair_summary);
        for (const rs of repairSummary) {
          const payloadCreate = {
            quotation_id: quotation_id,
            master_repair_id: rs.master_repair_id,
            master_repair_receipt_id: repairReceipt.responseObject?.id,
            price: parseInt(rs.price),
            status: REPAIR_RECEIPT_LIST_REPAIR_STATUS.PENDING,
            barcode: await generateRepairReceiptListRepairBarcodeNumner(
              companyData?.company_code ?? "C0001"
            ),
          };
          await repairReceiptListRepairRepository.create(
            payloadCreate,
            company_id
          );
        }
      }

      return new ServiceResponse<master_quotation>(
        ResponseStatus.Success,
        "Approve quotation success",
        updatedQuotation,
        StatusCodes.OK
      );
    } catch (ex) {
      const errorMessage = `Error approve quotation: ${(ex as Error).message}`;
      return new ServiceResponse(
        ResponseStatus.Failed,
        errorMessage,
        null,
        StatusCodes.INTERNAL_SERVER_ERROR
      );
    }
  },

  cancel: async (
    quotation_id: string,
    remark: string,
    userId: string,
    company_id: string
  ) => {
    const payload: Partial<TypePayloadQuotation> = {
      quotation_status: QUOTATION_STATUS.CANCEL,
    };

    try {
      // ตรวจสอบว่า quotation_doc มีอยู่หรือไม่
      const checkQuotation = await quotationRepository.findById(quotation_id);
      if (!checkQuotation) {
        return new ServiceResponse(
          ResponseStatus.Failed,
          "Quotation not found",
          null,
          StatusCodes.BAD_REQUEST
        );
      }

      // อัปเดตข้อมูล
      const updatedQuotation = await quotationRepository.cancel(
        quotation_id,
        payload
      );

      const payloadLog: TypePayloadQuotationLogStatus = {
        quotation_id,
        quotation_status: QUOTATION_STATUS.CANCEL,
        created_by: userId,
        remark: remark,
        company_id: company_id,
      };

      await quotationLogStatusRepository.create(payloadLog);

      return new ServiceResponse<master_quotation>(
        ResponseStatus.Success,
        "cancel quotation success",
        updatedQuotation,
        StatusCodes.OK
      );
    } catch (ex) {
      const errorMessage = `Error cancel quotation: ${(ex as Error).message}`;
      return new ServiceResponse(
        ResponseStatus.Failed,
        errorMessage,
        null,
        StatusCodes.INTERNAL_SERVER_ERROR
      );
    }
  },

  // ลบ Quotation
  delete: async (id: string) => {
    try {
      const checkQuotation = await quotationRepository.findById(id);
      if (!checkQuotation) {
        return new ServiceResponse(
          ResponseStatus.Failed,
          "Quotation not found",
          null,
          StatusCodes.BAD_REQUEST
        );
      }

      // ลบข้อมูล
      await quotationRepository.delete(id);

      if (checkQuotation.image_url) {
        await fileService.delete(checkQuotation.image_url);
      }

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

  // ค้นหาตาม Doc
  findByDoc: async (quotation_doc: string) => {
    try {
      const quotation =
        await quotationRepository.findByQuotationDoc(quotation_doc);
      if (!quotation) {
        return new ServiceResponse(
          ResponseStatus.Failed,
          "Quotation not found",
          null,
          StatusCodes.BAD_REQUEST
        );
      }

      return new ServiceResponse<master_quotation>(
        ResponseStatus.Success,
        "Quotation found",
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

  findById: async (id: string) => {
    try {
      const quotation = await quotationRepository.findByQuotationId(id);
      if (!quotation) {
        return new ServiceResponse(
          ResponseStatus.Failed,
          "Quotation not found",
          null,
          StatusCodes.BAD_REQUEST
        );
      }

      return new ServiceResponse<master_quotation>(
        ResponseStatus.Success,
        "Quotation found",
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

  // ดึงเฉพาะ Quotation_doc
  findQuotationDocs: async (companyId: string) => {
    try {
      const quotationDocs = await quotationRepository.findQuotationDocs(companyId);
      return new ServiceResponse(
        ResponseStatus.Success,
        "Get quotation docs success",
        quotationDocs,
        StatusCodes.OK
      );
    } catch (error) {
      return new ServiceResponse(
        ResponseStatus.Failed,
        "Error fetching quotation docs",
        null,
        StatusCodes.INTERNAL_SERVER_ERROR
      );
    }
  },

  // ดึงเฉพาะ ResponsibleBy
  findResponsibleBy: async (quotationDoc: string, companyId: string) => {
    try {
      const data = await quotationRepository.findResponsibleBy(quotationDoc);
      if (!data.length) {
        return new ServiceResponse(
          ResponseStatus.Failed,
          `No responsible_by found for quotation_doc: ${quotationDoc}`,
          null,
          StatusCodes.NOT_FOUND
        );
      }
      return new ServiceResponse(
        ResponseStatus.Success,
        "Get responsible_by success",
        data,
        StatusCodes.OK
      );
    } catch (error) {
      return new ServiceResponse(
        ResponseStatus.Failed,
        "Error fetching responsible_by",
        null,
        StatusCodes.INTERNAL_SERVER_ERROR
      );
    }
  },

  // findCalendarRemoval: async (id: string, companyId: string) => {
  //   try {
  //     const quotation = await prisma.master_quotation.findUnique({
  //       where: {
  //         quotation_id: id,
  //         company_id: companyId,
  //       },
  //       select: {
  //         quotation_doc: true,
  //         appointment_date: true,
  //         addr_number: true,
  //         addr_alley: true,
  //         addr_street: true,
  //         addr_subdistrict: true,
  //         addr_district: true,
  //         addr_province: true,
  //         customer_name: true,
  //         contact_number: true,
  //         master_repair_receipt: {
  //           select: {
  //             id: true,
  //             repair_receipt_doc: true,
  //             expected_delivery_date: true,
  //             register: true,
  //             master_delivery_schedule: {
  //               select: {
  //                 status: true,
  //               }
  //             }
  //           },
  //         },
  //         master_customer: {
  //           select: {
  //             customer_name: true,
  //           },
  //         },
  //         master_brand: {
  //           select: {
  //             brand_name: true,
  //           },
  //         },
  //         master_brandmodel: {
  //           select: {
  //             brandmodel_name: true,
  //           },
  //         },
  //         master_color: {
  //           select: {
  //             color_name: true,
  //           },
  //         },
  //       },
  //     });

  //     if (!quotation) {
  //       return new ServiceResponse(
  //         ResponseStatus.Failed,
  //         "Quotation not found",
  //         null,
  //         StatusCodes.BAD_REQUEST
  //       );
  //     }

  //     return new ServiceResponse(
  //       ResponseStatus.Success,
  //       "Calendar removal details found",
  //       quotation,
  //       StatusCodes.OK
  //     );
  //   } catch (ex) {
  //     const errorMessage = `Error fetching calendar removal details: ${(ex as Error).message}`;
  //     return new ServiceResponse(
  //       ResponseStatus.Failed,
  //       errorMessage,
  //       null,
  //       StatusCodes.INTERNAL_SERVER_ERROR
  //     );
  //   }
  // },

  findCalendarRemoval: async (companyId: string , startDateFilter: string , endDateFilter: string) => {
    try {
      const data = await quotationRepository.showCalendarRemoval(companyId , startDateFilter , endDateFilter);

      if (!data) {
        return new ServiceResponse(
          ResponseStatus.Failed,
          "Quotation not found",
          null,
          StatusCodes.BAD_REQUEST
        );
      }

      return new ServiceResponse(
        ResponseStatus.Success,
        "Calendar removal details found",
        data,
        StatusCodes.OK
      );
    } catch (ex) {
      const errorMessage = `Error fetching calendar removal details: ${(ex as Error).message}`;
      return new ServiceResponse(
        ResponseStatus.Failed,
        errorMessage,
        null,
        StatusCodes.INTERNAL_SERVER_ERROR
      );
    }
  }
};
