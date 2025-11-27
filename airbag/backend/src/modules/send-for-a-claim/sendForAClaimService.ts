import { StatusCodes } from "http-status-codes";
import { ResponseStatus, ServiceResponse } from "@common/models/serviceResponse";
import { sendForAClaimRepository } from "@modules/send-for-a-claim/sendForAClaimRepository";
import { TypePayloadSendForAClaim, SendClaimDocItem } from "@modules/send-for-a-claim/sendForAClaimModel";
import { generateSendForAClaimDoc } from "@common/utils/generateSendForAClaimDoc";
import prisma from "@src/db";
import { supplierRepairReceiptRepository } from "@modules/supplier_repair_receipt/supplierRepairReceiptRepository";

export const sendForAClaimService = {
    findAll: async (
        companyId: string,
        page: number = 1,
        pageSize: number = 12,
        searchText: string = ""
    ) => {
        try {
            const skip = (page - 1) * pageSize;
            const receipts = await sendForAClaimRepository.findAll(companyId, skip, pageSize, searchText);
            if (!receipts) {
                return new ServiceResponse(
                    ResponseStatus.Failed,
                    "No send for a claim found",
                    null,
                    StatusCodes.NOT_FOUND
                );
            }
            const totalCount = await sendForAClaimRepository.count(companyId, searchText);
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
                "Error fetching send for a claim",
                (ex as Error).message,
                StatusCodes.INTERNAL_SERVER_ERROR
            );
        }
    },

    create: async (companyId: string, userId: string, payload: TypePayloadSendForAClaim) => {
        try {
            payload.send_for_a_claim_doc = await generateSendForAClaimDoc(companyId);

            const claim = await sendForAClaimRepository.create(companyId, userId, payload);
            if (!claim) {
                return new ServiceResponse(
                    ResponseStatus.Failed,
                    "Error creating send for a claim",
                    null,
                    StatusCodes.INTERNAL_SERVER_ERROR
                );
            }
            return new ServiceResponse(
                ResponseStatus.Success,
                "Send for a claim created successfully",
                claim,
                StatusCodes.OK
            );
        } catch (ex) {
            return new ServiceResponse(
                ResponseStatus.Failed,
                "Error creating send for a claim",
                (ex as Error).message,
                StatusCodes.INTERNAL_SERVER_ERROR
            );
        }
    },

    update: async (companyId: string, userId: string, send_for_a_claim_id: string, payload: TypePayloadSendForAClaim) => {
        try {
            const claim = await sendForAClaimRepository.findByIdAsync(companyId, send_for_a_claim_id);
            if (!claim) {
                return new ServiceResponse(
                    ResponseStatus.Failed,
                    "Send for a claim not found",
                    null,
                    StatusCodes.NOT_FOUND
                );
            }
            const claimUpdated = await sendForAClaimRepository.update(companyId, userId, send_for_a_claim_id, payload);
            if (!claim) {
                return new ServiceResponse(
                    ResponseStatus.Failed,
                    "Error updating send for a claim",
                    null,
                    StatusCodes.INTERNAL_SERVER_ERROR
                );
            }
            return new ServiceResponse(
                ResponseStatus.Success,
                "Send for a claim updated successfully",
                "Send for a claim updated successfully",
                StatusCodes.OK
            );
        } catch (ex) {
            return new ServiceResponse(
                ResponseStatus.Failed,
                "Error updating send for a claim",
                (ex as Error).message,
                StatusCodes.INTERNAL_SERVER_ERROR
            );
        }
    },

    delete: async (companyId: string, send_for_a_claim_id: string) => {
        try {
            //ใบที่จะลบมี รายการซ่อมที่ส่งเคลมอยู่ในใบไหม
            // const checkClaimListinClaim = await sendForAClaimRepository.checkClaimListinClaim(companyId, send_for_a_claim_id);
            // if (checkClaimListinClaim != null) {
            //     return new ServiceResponse(
            //         ResponseStatus.Failed,
            //         "send for a claim list have send for a claim",
            //         null,
            //         StatusCodes.BAD_REQUEST
            //     );
            // }
            //ใบที่จะลบมีอยู่ในใบรับบรับเคลมไหม
            const checkClaiminReceiveForAClaim = await sendForAClaimRepository.checkClaiminReceiveForAClaim(companyId, send_for_a_claim_id);
            if (checkClaiminReceiveForAClaim != null) {
                return new ServiceResponse(
                    ResponseStatus.Failed,
                    "send for a claim have in receive for a claim",
                    null,
                    StatusCodes.BAD_REQUEST
                );
            }
            const claim = await sendForAClaimRepository.findByIdAsync(companyId, send_for_a_claim_id);
            if (!claim) {
                return new ServiceResponse(
                    ResponseStatus.Failed,
                    "Send for a claim not found",
                    null,
                    StatusCodes.NOT_FOUND
                );
            }
            await sendForAClaimRepository.deleteBySendForAClaimId(companyId, send_for_a_claim_id);
            await sendForAClaimRepository.delete(companyId, send_for_a_claim_id);
            return new ServiceResponse(
                ResponseStatus.Success,
                "Send for a claim deleted successfully",
                "Send for a claim deleted successfully",
                StatusCodes.OK
            )
        } catch (ex) {
            return new ServiceResponse(
                ResponseStatus.Failed,
                "Error deleting send for a claim",
                (ex as Error).message,
                StatusCodes.INTERNAL_SERVER_ERROR
            );
        }
    },

    findById: async (companyId: string, send_for_a_claim_id: string) => {
        try {
            const claim = await sendForAClaimRepository.findByIdAsync(companyId, send_for_a_claim_id);
            if (!claim) {
                return new ServiceResponse(
                    ResponseStatus.Failed,
                    "Send for a claim not found",
                    null,
                    StatusCodes.BAD_REQUEST
                )
            }
            return new ServiceResponse(
                ResponseStatus.Success,
                "Send for a claim success",
                claim,
                StatusCodes.OK
            );
        } catch (ex) {
            const errorMessage = "Error get send for a claim: " + (ex as Error).message;
            return new ServiceResponse(
                ResponseStatus.Failed,
                errorMessage,
                null,
                StatusCodes.INTERNAL_SERVER_ERROR
            );
        }
    },

    findDoc: async (companyId: string) => {
        try {
            const result = await sendForAClaimRepository.getAllSendForAClaimDoc(companyId);

            if (!result) {
                return new ServiceResponse(
                    ResponseStatus.Failed,
                    "No supplier repair receipt docs found",
                    null,
                    StatusCodes.NOT_FOUND
                )
            }
            return new ServiceResponse(
                ResponseStatus.Success,
                "Get supplier repair receipt docs success",
                result,
                StatusCodes.OK
            );
        } catch (ex) {
            const errorMessage = "Error getting supplier repair receipt docs: " + (ex as Error).message;
            return new ServiceResponse(
                ResponseStatus.Failed,
                errorMessage,
                null,
                StatusCodes.INTERNAL_SERVER_ERROR
            );
        }
    },


    findBySupplierRepairReceiptId: async (companyId: string, id: string) => {
        try {
            const srr = await sendForAClaimRepository.findBySupplierRepairReceiptIdAsync(companyId, id);
            if (!srr) {
                return new ServiceResponse(
                    ResponseStatus.Failed,
                    "Supplier repair receipt not found",
                    null,
                    StatusCodes.BAD_REQUEST
                )
            }
            return new ServiceResponse(
                ResponseStatus.Success,
                "Supplier repair receipt success",
                srr,
                StatusCodes.OK
            );
        } catch (ex) {
            const errorMessage = "Error get Supplier repair receipt: " + (ex as Error).message;
            return new ServiceResponse(
                ResponseStatus.Failed,
                errorMessage,
                null,
                StatusCodes.INTERNAL_SERVER_ERROR
            );
        }
    },

    findOnlySendClaimDocsByCompanyId: async (companyId: string): Promise<ServiceResponse<SendClaimDocItem[]>> => {
        try {
            const docsResult = await sendForAClaimRepository.findOnlySendClaimDocsByCompanyId(companyId);

            if (!docsResult) {
                console.error("[Service.findOnlySendClaimDocs] Repository returned unexpected value:", docsResult);
                return new ServiceResponse(
                    ResponseStatus.Failed,
                    "Failed to retrieve send for claim documents due to an internal repository error.",
                    [],
                    StatusCodes.INTERNAL_SERVER_ERROR
                );
            }

            if (docsResult.length === 0) {
                return new ServiceResponse(
                    ResponseStatus.Success,
                    "No send for claim documents found for this company.",
                    [],
                    StatusCodes.OK
                );
            }

            return new ServiceResponse(
                ResponseStatus.Success,
                "Successfully fetched send for claim documents.",
                docsResult,
                StatusCodes.OK
            );
        } catch (error) {
            const errorMessage = `Error fetching send for claim documents: ${(error as Error).message}`;
            console.error(errorMessage);
            return new ServiceResponse(
                ResponseStatus.Failed,
                errorMessage,
                [],
                StatusCodes.INTERNAL_SERVER_ERROR
            );
        }
    },

    findResponsibleUserForSendForAClaim: async (companyId: string, send_for_a_claim_id: string) => {
        try {
            const claimData = await sendForAClaimRepository.findOnlyResponsibleUserForSendForAClaim(companyId, send_for_a_claim_id);

            if (!claimData) { 
                return new ServiceResponse(
                    ResponseStatus.Failed,
                    "Send for a claim not found.",
                    null,
                    StatusCodes.NOT_FOUND
                );
            }

            if (!claimData.responsible_by_user) { 
                return new ServiceResponse(
                    ResponseStatus.Success,
                    "No responsible user assigned to this send for a claim.",
                    null,
                    StatusCodes.OK 
                );
            }

            return new ServiceResponse(
                ResponseStatus.Success,
                "Responsible user found for send for a claim.",
                claimData.responsible_by_user,
                StatusCodes.OK
            );
        } catch (ex) {
            const errorMessage = `Error fetching responsible user for send for a claim: ${(ex as Error).message}`;
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
          const data = await sendForAClaimRepository.select(companyId , searchText);
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
