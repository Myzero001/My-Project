import { StatusCodes } from "http-status-codes";
import { ResponseStatus, ServiceResponse } from "@common/models/serviceResponse";
import { responsiblePersonRepository } from "./responsiblePersonRepository";
import { TypePayloadResponsiblePerson, TypePayloadUpdateResponsiblePerson } from "./responsiblePersonModel";
import { ResponsiblePersonType } from "./responsiblePersonModel";
import prisma from "@src/db";

export const responsiblePersonService = {
  findAll: async (companyId: string, page: number = 1, pageSize: number = 12) => {
    const skip = (page - 1) * pageSize;
    const data = await responsiblePersonRepository.findAll(companyId, skip, pageSize);
    const totalCount = await responsiblePersonRepository.count(companyId);

    return new ServiceResponse(
      ResponseStatus.Success,
      "Fetched all logs successfully",
      { data, totalCount, totalPages: Math.ceil(totalCount / pageSize) },
      StatusCodes.OK
    );
  },

  findById: async (companyId: string, logId: string) => {
    const log = await responsiblePersonRepository.findById(companyId, logId);
    if (!log) {
      return new ServiceResponse(ResponseStatus.Failed, "Log not found", null, StatusCodes.NOT_FOUND);
    }
    return new ServiceResponse(ResponseStatus.Success, "Log fetched successfully", log, StatusCodes.OK);
  },

  create: async (companyId: string, userId: string, payload: TypePayloadResponsiblePerson) => {
    try {
      // Check if before_by_id exists
      const beforeUser = await prisma.users.findUnique({
        where: { company_id: companyId, employee_id: payload.before_by_id }, // ควรเช็ค company_id ด้วย
      });

      if (!beforeUser) {
        return new ServiceResponse(ResponseStatus.Failed, "Before user not found in this company", null, StatusCodes.BAD_REQUEST);
      }

      // Check if after_by_id exists
      const afterUser = await prisma.users.findUnique({
        where: { company_id: companyId, employee_id: payload.after_by_id }, // ควรเช็ค company_id ด้วย
      });

      if (!afterUser) {
        return new ServiceResponse(ResponseStatus.Failed, "After user not found in this company", null, StatusCodes.BAD_REQUEST);
      }

      // Validate existence of the source document based on type
      let documentFound = false;
      let documentNotFoundMessage = "Associated document not found.";

      switch (payload.type) {
        case ResponsiblePersonType.QUOTATION:
          if (payload.quotation_id) {
            const doc = await prisma.master_quotation.findUnique({ where: { company_id: companyId, quotation_id: payload.quotation_id } });
            if (doc) documentFound = true;
            else documentNotFoundMessage = "Quotation not found.";
          }
          break;
        case ResponsiblePersonType.REPAIR:
          if (payload.master_repair_receipt_id) {
            const doc = await prisma.master_repair_receipt.findUnique({ where: { company_id: companyId, id: payload.master_repair_receipt_id } });
            if (doc) documentFound = true;
            else documentNotFoundMessage = "Master Repair Receipt not found.";
          }
          break;
        case ResponsiblePersonType.SUBMIT_SUB:
          if (payload.supplier_delivery_note_id) {
            const doc = await prisma.supplier_delivery_note.findUnique({ where: { company_id: companyId, supplier_delivery_note_id: payload.supplier_delivery_note_id } });
            if (doc) documentFound = true;
            else documentNotFoundMessage = "Supplier Delivery Note (Submit Sub) not found.";
          }
          break;
        case ResponsiblePersonType.RECEIVE_SUB:
          if (payload.supplier_repair_receipt_id) {
            const doc = await prisma.supplier_repair_receipt.findUnique({ where: { company_id: companyId, id: payload.supplier_repair_receipt_id } });
            if (doc) documentFound = true;
            else documentNotFoundMessage = "Supplier Repair Receipt (Receive Sub) not found.";
          }
          break;
        case ResponsiblePersonType.SUBMIT_CLAIM:
          if (payload.send_for_a_claim_id) {
            const doc = await prisma.send_for_a_claim.findUnique({ where: { company_id: companyId, send_for_a_claim_id: payload.send_for_a_claim_id } });
            if (doc) documentFound = true;
            else documentNotFoundMessage = "Send For a Claim document not found.";
          }
          break;
        case ResponsiblePersonType.RECEIVE_CLAIM:
          if (payload.receive_for_a_claim_id) {
            const doc = await prisma.receive_for_a_claim.findUnique({ where: { company_id: companyId, receive_for_a_claim_id: payload.receive_for_a_claim_id } }); // Assuming company_id is on this model
            if (doc) documentFound = true;
            else documentNotFoundMessage = "Receive For a Claim document not found.";
          }
          break;
        default:
          // Should not happen if Zod validation is correct
          return new ServiceResponse(ResponseStatus.Failed, "Invalid document type.", null, StatusCodes.BAD_REQUEST);
      }

      if (!documentFound) {
        return new ServiceResponse(ResponseStatus.Failed, documentNotFoundMessage, null, StatusCodes.BAD_REQUEST);
      }

      const log = await responsiblePersonRepository.create(companyId, userId, payload);

      // ส่งคืน ID ที่เกี่ยวข้องกับ type นั้นๆ ไปด้วย
      const responseData: any = {
        log_id: log.log_id,
        type: log.type,
        docno: log.docno,
        change_date: log.change_date
      };
      if (log.quotation_id) responseData.quotation_id = log.quotation_id;
      if (log.master_repair_receipt_id) responseData.master_repair_receipt_id = log.master_repair_receipt_id;
      if (log.supplier_delivery_note_id) responseData.supplier_delivery_note_id = log.supplier_delivery_note_id;
      if (log.supplier_repair_receipt_id) responseData.supplier_repair_receipt_id = log.supplier_repair_receipt_id;
      if (log.send_for_a_claim_id) responseData.send_for_a_claim_id = log.send_for_a_claim_id;
      if (log.receive_for_a_claim_id) responseData.receive_for_a_claim_id = log.receive_for_a_claim_id;


      return new ServiceResponse(
        ResponseStatus.Success,
        "Log created successfully",
        responseData,
        StatusCodes.CREATED
      );
    } catch (error: any) {
      console.error('Create log error:', error);
      // Check for Prisma specific errors if needed, e.g., unique constraint violation
      return new ServiceResponse(
        ResponseStatus.Failed,
        error.message || "Failed to create log",
        null,
        StatusCodes.INTERNAL_SERVER_ERROR
      );
    }
  },

  update: async (
    companyId: string,
    logId: string,
    payload: TypePayloadUpdateResponsiblePerson // ใช้ Type ใหม่
  ) => {
    try {
      // ตรวจสอบว่า log ที่จะ update มีอยู่จริง (repository ทำแล้ว แต่ service อาจจะ check อีกทีก่อน)
      const existingLog = await prisma.log_responsible_person.findUnique({
        where: { log_id: logId, company_id: companyId }
      });
      if (!existingLog) {
        return new ServiceResponse(ResponseStatus.Failed, "Log not found for update.", null, StatusCodes.NOT_FOUND);
      }

      // Check if before_by_id exists if provided
      if (payload.before_by_id) {
        const beforeUser = await prisma.users.findUnique({
          where: { company_id: companyId, employee_id: payload.before_by_id },
        });
        if (!beforeUser) {
          return new ServiceResponse(ResponseStatus.Failed, "Updated 'before by' user not found in this company.", null, StatusCodes.BAD_REQUEST);
        }
      }

      // Check if after_by_id exists if provided
      if (payload.after_by_id) {
        const afterUser = await prisma.users.findUnique({
          where: { company_id: companyId, employee_id: payload.after_by_id },
        });
        if (!afterUser) {
          return new ServiceResponse(ResponseStatus.Failed, "Updated 'after by' user not found in this company.", null, StatusCodes.BAD_REQUEST);
        }
      }

      const updatedLog = await responsiblePersonRepository.update(companyId, logId, payload);

      return new ServiceResponse(
        ResponseStatus.Success,
        "Log updated successfully",
        updatedLog, // ส่งข้อมูล log ที่ update แล้วกลับไปทั้งหมด
        StatusCodes.OK
      );
    } catch (error: any) {
      console.error('Update log error:', error);
      if (error.message === "Log not found") { // Error จาก repository
        return new ServiceResponse(ResponseStatus.Failed, "Log not found.", null, StatusCodes.NOT_FOUND);
      }
      return new ServiceResponse(
        ResponseStatus.Failed,
        error.message || "Failed to update log",
        null,
        StatusCodes.INTERNAL_SERVER_ERROR
      );
    }
  },

  delete: async (companyId: string, logId: string) => {
    try {
        await responsiblePersonRepository.delete(companyId, logId);
        return new ServiceResponse(ResponseStatus.Success, "Log deleted successfully", null, StatusCodes.OK);
    } catch (error: any) {
        console.error('Delete log error:', error);
        // Prisma's delete throws an error if record not found (P2025)
        if (error.code === 'P2025') {
             return new ServiceResponse(ResponseStatus.Failed, "Log not found for deletion.", null, StatusCodes.NOT_FOUND);
        }
        return new ServiceResponse(ResponseStatus.Failed, "Failed to delete log", null, StatusCodes.INTERNAL_SERVER_ERROR);
    }
  },

  getResponsiblePersonsTypes: async () => {
    try {
      const types = Object.values(ResponsiblePersonType); // ใช้ enum ที่เรา define

      return new ServiceResponse(
        ResponseStatus.Success,
        "Fetched ResponsiblePersonType successfully",
        types,
        StatusCodes.OK
      );
    } catch (error) {
      return new ServiceResponse(
        ResponseStatus.Failed,
        "Failed to fetch ResponsiblePersonType",
        null,
        StatusCodes.INTERNAL_SERVER_ERROR
      );
    }
  },
};