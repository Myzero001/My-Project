import { StatusCodes } from "http-status-codes";
import { ResponseStatus, ServiceResponse } from "@common/models/serviceResponse";
import { supplierRepairReceiptRepository } from "./supplierRepairReceiptRepository";
import { TypePayloadSupplierRepairReceipt, SupplierReceiptDocItem } from "./supplierRepairReceiptModel";
import { generateRepairReceiptNumber } from "@modules/supplier_repair_receipt/generateRepairReceiptNumber";
import prisma from "@src/db";

export const supplierRepairReceiptService = {
    findAll: async (
        companyId: string,
        page: number = 1,
        pageSize: number = 12,
        searchText: string = ""
    ) => {
        try {
            const skip = (page - 1) * pageSize;
            const receipts = await supplierRepairReceiptRepository.findAll(companyId, skip, pageSize, searchText);
            if (!receipts) {
                return new ServiceResponse(
                    ResponseStatus.Failed,
                    "No repair receipts found",
                    null,
                    StatusCodes.NOT_FOUND
                );
            }
            const totalCount = await supplierRepairReceiptRepository.count(companyId, searchText);
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
        } catch (ex) {
            return new ServiceResponse(
                ResponseStatus.Failed,
                "Error fetching repair receipts",
                (ex as Error).message,
                StatusCodes.INTERNAL_SERVER_ERROR
            );
        }
    },

    create: async (companyId: string, userId: string, supplierDeliveryNoteId: string) => {
        try {
            // 1. Find the related supplier_delivery_note to get supplier_id (if needed)
            const existingNote = await supplierRepairReceiptRepository.findSupplierDeliveryNoteById(supplierDeliveryNoteId);

            if (!existingNote) {
                return new ServiceResponse(
                    ResponseStatus.Failed,
                    "Supplier delivery note not found",
                    null,
                    StatusCodes.NOT_FOUND
                );
            }

            // 2. Call repository's create function, passing necessary IDs
            // The repository will now handle the creation and inclusion of related data
            const newReceiptWithIncludes = await supplierRepairReceiptRepository.create(
                companyId,
                userId,
                supplierDeliveryNoteId,
                existingNote.supplier_id // Pass the supplier_id
            );

            // No need to manually check if newReceipt exists if repo throws on failure
            // Repository's create now returns the object with included relations

            return new ServiceResponse(
                ResponseStatus.Success,
                "Repair receipt header created successfully with related data", // Updated message
                newReceiptWithIncludes, // Return the enriched object
                StatusCodes.CREATED
            );
        } catch (ex) {
            console.error("Error creating repair receipt header:", ex);
            // Handle potential Prisma errors (like unique constraint violation if receipt_doc generation is flawed)
            // if (ex instanceof Prisma.PrismaClientKnownRequestError && ex.code === 'P2002') { ... }
            return new ServiceResponse(
                ResponseStatus.Failed,
                "Error creating repair receipt header",
                (ex as Error).message,
                StatusCodes.INTERNAL_SERVER_ERROR
            );
        }
    },

    update: async (companyId: string, userId: string, id: string, payload: TypePayloadSupplierRepairReceipt) => {
        try {
            // ตรวจสอบว่ามีค่า repair_date_supplier_repair_receipt หรือไม่ แล้วแปลงเป็น Date
            const updatedPayload = {
                ...payload,
                repair_date_supplier_repair_receipt: payload.repair_date_supplier_repair_receipt 
                    ? new Date(payload.repair_date_supplier_repair_receipt)
                    : undefined,
                updated_by: userId,
                updated_at: new Date(),
            };
    
            const updatedReceipt = await prisma.supplier_repair_receipt.update({
                where: {
                    company_id: companyId,
                    id: id,
                },
                data: updatedPayload,
            });
    
            return new ServiceResponse(
                ResponseStatus.Success,
                "Update repair receipt success",
                updatedReceipt,
                StatusCodes.OK
            );
        } catch (ex) {
            return new ServiceResponse(
                ResponseStatus.Failed,
                "Error updating repair receipt",
                (ex as Error).message,
                StatusCodes.INTERNAL_SERVER_ERROR
            );
        }
    },

    delete: async (companyId: string, userId: string, id: string) => { // userId might not be needed for delete ops, but keep for consistency if used elsewhere
        try {
            const result = await prisma.$transaction(async (tx) => {
                const receiptExists = await tx.supplier_repair_receipt.findUnique({
                    where: { id: id, company_id: companyId },
                    select: { id: true } // Just need to know if it exists
                });

                if (!receiptExists) {
                    throw new ServiceResponse(ResponseStatus.Failed, "Repair receipt not found", null, StatusCodes.NOT_FOUND);
                }

                const claimListReference = await tx.send_for_a_claim_list.findFirst({
                    where: {
                        supplier_repair_receipt_list: {
                            supplier_repair_receipt_id: id
                        },
                        company_id: companyId
                    },
                    select: { send_for_a_claim_list_id: true }
                });
                if (claimListReference) {
                    throw new ServiceResponse(ResponseStatus.Failed, "Cannot delete: Associated list items are referenced in 'Send For Claim List'.", null, StatusCodes.BAD_REQUEST);
                }

                const claimReference = await tx.send_for_a_claim.findFirst({
                    where: { supplier_repair_receipt_id: id, company_id: companyId },
                    select: { send_for_a_claim_id: true }
                });
                if (claimReference) {
                    throw new ServiceResponse(ResponseStatus.Failed, "Cannot delete: This repair receipt is referenced in 'Send For Claim'.", null, StatusCodes.BAD_REQUEST);
                }

                await tx.supplier_repair_receipt_list.deleteMany({
                    where: {
                        supplier_repair_receipt_id: id, // Target all children of the receipt being deleted
                        company_id: companyId // Ensure company scope
                    }
                });
                
                await tx.supplier_repair_receipt.delete({
                    where: { id: id, company_id: companyId },
                });

                // Update success message
                return new ServiceResponse(ResponseStatus.Success, "Repair receipt and related list items deleted successfully.", null, StatusCodes.OK);
            });

            return result;

        } catch (ex) {
            console.error("Error processing repair receipt deletion:", ex); // Updated log message

            if (ex instanceof ServiceResponse) {
                return ex;
            }

            return new ServiceResponse(ResponseStatus.Failed, "Error processing repair receipt deletion", (ex instanceof Error) ? ex.message : "An unexpected error occurred", StatusCodes.INTERNAL_SERVER_ERROR);
        }
    },

    findOne: async (companyId: string, id: string) => {
        try {
            const receipt = await supplierRepairReceiptRepository.findByIdAsync(companyId, id);
            if (!receipt) {
                return new ServiceResponse(
                    ResponseStatus.Failed,
                    "Repair receipt not found",
                    null,
                    StatusCodes.BAD_REQUEST
                );
            }
            return new ServiceResponse(
                ResponseStatus.Success,
                "Get repair receipt success",
                receipt,
                StatusCodes.OK
            );
        } catch (ex) {
            return new ServiceResponse(
                ResponseStatus.Failed,
                "Error getting repair receipt",
                (ex as Error).message,
                StatusCodes.INTERNAL_SERVER_ERROR
            );
        }
    },

    findPayload: async (companyId: string, id: string) => {
        try {
            const receipt = await supplierRepairReceiptRepository.findPayloadById(companyId, id);
            if (!receipt) {
                return new ServiceResponse(
                    ResponseStatus.Failed,
                    "Repair receipt not found",
                    null,
                    StatusCodes.NOT_FOUND
                );
            }
    
            const payload = {
                receipt_doc: receipt.receipt_doc,
                supplier_delivery_note_doc: receipt.supplier_delivery_note?.supplier_delivery_note_doc,
                date_of_submission: receipt.supplier_delivery_note?.date_of_submission,
                repair_date_supplier_repair_receipt: receipt.repair_date_supplier_repair_receipt,
                supplier_name: receipt.master_supplier?.supplier_name,
                amount: receipt.supplier_delivery_note?.amount,
            };
    
            return new ServiceResponse(
                ResponseStatus.Success,
                "Get repair receipt payload success",
                payload,
                StatusCodes.OK
            );
        } catch (ex) {
            return new ServiceResponse(
                ResponseStatus.Failed,
                "Error getting repair receipt payload",
                (ex as Error).message,
                StatusCodes.INTERNAL_SERVER_ERROR
            );
        }
    },

    findReceiptDocsByCompanyId: async (companyId: string): Promise<ServiceResponse<SupplierReceiptDocItem[]>> => {
        try {
          const docsResult = await supplierRepairReceiptRepository.findReceiptDocsByCompanyId(companyId);
    
          if (!docsResult || docsResult.length === 0) {
            return new ServiceResponse(
              ResponseStatus.Success, // หรือ Failed + NOT_FOUND
              "No supplier repair receipt documents found for this company.",
              [], // คืนค่า Array ว่างที่ตรงกับ SupplierReceiptDocItem[]
              StatusCodes.OK // หรือ NOT_FOUND
            );
          }
    
          return new ServiceResponse(
            ResponseStatus.Success,
            "Successfully fetched supplier repair receipt documents.",
            docsResult, // <-- คืนค่า docsResult โดยตรง ซึ่งเป็น SupplierReceiptDocItem[]
            StatusCodes.OK
          );
        } catch (error) {
          const errorMessage = `Error fetching supplier repair receipt documents: ${(error as Error).message}`;
          console.error(errorMessage);
          return new ServiceResponse(
            ResponseStatus.Failed,
            errorMessage,
            [], 
            StatusCodes.INTERNAL_SERVER_ERROR
          );
        }
      },

      findResponsibleUserForSupplierRepairReceipt: async (companyId: string, id: string) => {
        try {
            const repairReceiptData = await supplierRepairReceiptRepository.findOnlyResponsibleUserForSupplierRepairReceipt(companyId, id);

            if (!repairReceiptData) { // ตรวจสอบว่า supplier repair receipt มีอยู่จริง
                return new ServiceResponse(
                    ResponseStatus.Failed,
                    "Supplier repair receipt not found.",
                    null,
                    StatusCodes.NOT_FOUND
                );
            }

            if (!repairReceiptData.responsible_by_user) { // ตรวจสอบว่ามีข้อมูลผู้รับผิดชอบหรือไม่
                return new ServiceResponse(
                    ResponseStatus.Success,
                    "No responsible user assigned to this supplier repair receipt.",
                    null,
                    StatusCodes.OK // หรือ NOT_FOUND ถ้าต้องการ
                );
            }

            // คืนเฉพาะส่วน responsible_by_user
            return new ServiceResponse(
                ResponseStatus.Success,
                "Responsible user found for supplier repair receipt.",
                repairReceiptData.responsible_by_user, // ส่งเฉพาะ object นี้กลับไป
                StatusCodes.OK
            );
        } catch (ex) {
            const errorMessage = `Error fetching responsible user for supplier repair receipt: ${(ex as Error).message}`;
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
          const data = await supplierRepairReceiptRepository.select(companyId , searchText);
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