import { StatusCodes } from "http-status-codes";
import { ResponseStatus, ServiceResponse } from "@common/models/serviceResponse";
import { receiveForAClaimRepository } from "./receiveForClaimRepository";
import { TypePayloadReceiveForAClaim, ReceiveClaimDocItem } from "./receiveForClaimModel";
import prisma from "@src/db";

export const receiveForAClaimService = {
    findAll: async (
        companyId: string,
        page: number = 1,
        pageSize: number = 12,
        searchText: string = ""
    ) => {
        try {
            const skip = (page - 1) * pageSize;
            const claims = await receiveForAClaimRepository.findAll(companyId, skip, pageSize, searchText);
            if (!claims || claims.length === 0) {
                return new ServiceResponse(
                    ResponseStatus.Success,
                    "No receive for claims found",
                    {
                        data: [],
                        totalCount: 0,
                        totalPages: 0,
                    },
                    StatusCodes.OK
                );
            }
            const totalCount = await receiveForAClaimRepository.count(companyId, searchText);
            return new ServiceResponse(
                ResponseStatus.Success,
                "Get all success",
                {
                    data: claims,
                    totalCount,
                    totalPages: Math.ceil(totalCount / pageSize),
                },
                StatusCodes.OK
            );
        } catch (ex) {
            return new ServiceResponse(
                ResponseStatus.Failed,
                "Error fetching receive for claims",
                (ex as Error).message,
                StatusCodes.INTERNAL_SERVER_ERROR
            );
        }
    },

    create: async (userId: string, companyId: string, payload: TypePayloadReceiveForAClaim) => {

        // Basic validation check (optional, as Zod handles it in router)
        if (!payload || !payload.send_for_a_claim_id) {
             console.error("[Service.create] Invalid payload: send_for_a_claim_id is missing.");
             return new ServiceResponse(ResponseStatus.Failed, "Invalid payload: Missing required fields.", null, StatusCodes.BAD_REQUEST);
        }

        try {
            const newClaim = await receiveForAClaimRepository.create(userId, companyId, payload);

            // Check if repository returned a valid record (it should if no error thrown)
             if (!newClaim || !newClaim.receive_for_a_claim_id) {
                 console.error("[Service.create] Repository call succeeded but returned invalid data.");
                 // This case might indicate an issue fetching the final record in the repo transaction
                 return new ServiceResponse(ResponseStatus.Failed, "Failed to retrieve created record data.", null, StatusCodes.INTERNAL_SERVER_ERROR);
             }

            return new ServiceResponse(
                ResponseStatus.Success,
                "Create receive for claim with list items success",
                newClaim,
                StatusCodes.CREATED
            );
        } catch (ex) {
            // Log the error received from the repository or transaction
            console.error("[Service.create] Error during repository.create call:", ex);

            // Provide a more generic error message to the client, but log the details
            const errorMessage = (ex instanceof Error) ? ex.message : "An unexpected error occurred during creation.";
            return new ServiceResponse(
                ResponseStatus.Failed,
                "Error creating receive for claim",
                // Do not send detailed internal error messages to the client in production
                // Send a generic message or error code instead. For debugging, we send the message.
                 errorMessage, // In production, replace with: "An internal error occurred."
                StatusCodes.INTERNAL_SERVER_ERROR
            );
        }
    },

    update: async (userId: string, id: string, payload: TypePayloadReceiveForAClaim) => {
        try {
            const claim = await receiveForAClaimRepository.findByIdAsync(id);
            if (!claim) {
                return new ServiceResponse(
                    ResponseStatus.Failed,
                    "Receive for claim not found",
                    null,
                    StatusCodes.NOT_FOUND
                );
            }
            const updatedClaim = await receiveForAClaimRepository.update(userId, id, payload);
            return new ServiceResponse(
                ResponseStatus.Success,
                "Update receive for claim success",
                updatedClaim,
                StatusCodes.OK
            );
        } catch (ex) {
            return new ServiceResponse(
                ResponseStatus.Failed,
                "Error updating receive for claim",
                (ex as Error).message,
                StatusCodes.INTERNAL_SERVER_ERROR
            );
        }
    },

    delete: async (userId: string, id: string) => { // userId might still be useful for logging or future checks
        try {
            const result = await prisma.$transaction(async (tx) => {
                // 1. Find parent (Optional but good practice to ensure it exists)
                const claim = await tx.receive_for_a_claim.findUnique({
                    where: { receive_for_a_claim_id: id },
                    select: { receive_for_a_claim_id: true } // Just need to know it exists
                });

                if (!claim) {
                    throw new ServiceResponse(
                        ResponseStatus.Failed, "Receive for claim not found", null, StatusCodes.NOT_FOUND
                    );
                }

                // 2. Optional dependency checks (If needed, e.g., check if it's used elsewhere)
                // ... Add checks here if necessary ...

                // **** START: Delete Child Records ****
                // 3. Delete related receive_for_a_claim_list records FIRST
                await tx.receive_for_a_claim_list.deleteMany({
                    where: {
                        receive_for_a_claim_id: id // Target children of the parent being deleted
                    }
                });
                // **** END: Delete Child Records ****

                // 4. Delete Parent Record
                await tx.receive_for_a_claim.delete({
                    where: {
                        receive_for_a_claim_id: id,
                    },
                });

                // Update success message
                return new ServiceResponse(
                    ResponseStatus.Success, "Receive for claim and related list items deleted successfully.", null, StatusCodes.OK
                );
            }); // End transaction

            return result;

        } catch (ex) {
            console.error("Error processing receive for claim deletion:", ex); // Updated log message
            if (ex instanceof ServiceResponse) {
                return ex;
            }
            return new ServiceResponse(
                ResponseStatus.Failed, "Error processing receive for claim deletion", (ex instanceof Error) ? ex.message : "An unexpected error occurred", StatusCodes.INTERNAL_SERVER_ERROR
            );
        }
    },

    findOne: async (id: string) => {
        try {
            const claim = await receiveForAClaimRepository.findByIdAsync(id);
            if (!claim) {
                return new ServiceResponse(
                    ResponseStatus.Failed,
                    "Receive for claim not found",
                    null,
                    StatusCodes.NOT_FOUND
                );
            }
            return new ServiceResponse(
                ResponseStatus.Success,
                "Get receive for claim success",
                claim,
                StatusCodes.OK
            );
        } catch (ex) {
            return new ServiceResponse(
                ResponseStatus.Failed,
                "Error getting receive for claim",
                (ex as Error).message,
                StatusCodes.INTERNAL_SERVER_ERROR
            );
        }
    },

    findPayloadData: async (
        companyId: string,
        page: number = 1,
        pageSize: number = 12,
        searchText: string = ""
    ) => {
        try {
            const skip = (page - 1) * pageSize;
            const payloadData = await receiveForAClaimRepository.findPayloadData(companyId, skip, pageSize, searchText);
            if (!payloadData || payloadData.length === 0) {
                return new ServiceResponse(
                    ResponseStatus.Success,
                    "No payload data found",
                    {
                        data: [],
                        totalCount: 0,
                        totalPages: 0,
                    },
                    StatusCodes.OK
                );
            }
            const totalCount = await receiveForAClaimRepository.countPayloadData(companyId, searchText);
            return new ServiceResponse(
                ResponseStatus.Success,
                "Get payload data success",
                {
                    data: payloadData,
                    totalCount,
                    totalPages: Math.ceil(totalCount / pageSize),
                },
                StatusCodes.OK
            );
        } catch (ex) {
            return new ServiceResponse(
                ResponseStatus.Failed,
                "Error fetching payload data",
                (ex as Error).message,
                StatusCodes.INTERNAL_SERVER_ERROR
            );
        }
    },

    getSendForClaimDocs: async (companyId: string) => {
        try {
            const docs = await receiveForAClaimRepository.getSendForClaimDocs(companyId);
            
            return new ServiceResponse(
                ResponseStatus.Success,
                "Send for claim documents retrieved successfully",
                docs,
                StatusCodes.OK
            );
        } catch (ex) {
            return new ServiceResponse(
                ResponseStatus.Failed,
                "Error fetching send for claim documents",
                (ex as Error).message,
                StatusCodes.INTERNAL_SERVER_ERROR
            );
        }
    },

    findOnlyReceiveClaimDocsByCompanyId: async (companyId: string): Promise<ServiceResponse<ReceiveClaimDocItem[]>> => {
        try {
            const docsResult = await receiveForAClaimRepository.findOnlyReceiveClaimDocsByCompanyId(companyId);
    
            if (!docsResult) {
                console.error("[Service.findOnlyReceiveClaimDocs] Repository returned unexpected value:", docsResult);
                return new ServiceResponse(
                  ResponseStatus.Failed,
                  "Failed to retrieve receive for claim documents due to an internal repository error.",
                  [],
                  StatusCodes.INTERNAL_SERVER_ERROR
                );
            }
    
            if (docsResult.length === 0) {
                return new ServiceResponse(
                    ResponseStatus.Success,
                    "No receive for claim documents found for this company.",
                    [],
                    StatusCodes.OK
                );
            }
    
            return new ServiceResponse(
                ResponseStatus.Success,
                "Successfully fetched receive for claim documents.",
                docsResult,
                StatusCodes.OK
            );
        } catch (error) {
            const errorMessage = `Error fetching receive for claim documents: ${(error as Error).message}`;
            console.error(errorMessage);
            return new ServiceResponse(
                ResponseStatus.Failed,
                errorMessage,
                [],
                StatusCodes.INTERNAL_SERVER_ERROR
            );
        }
      },

      findResponsibleUserForReceiveForAClaim: async (id: string) => {
        try {
            const claimData = await receiveForAClaimRepository.findOnlyResponsibleUserForReceiveForAClaim(id);

            if (!claimData) { 
                return new ServiceResponse(
                    ResponseStatus.Failed,
                    "Receive for a claim not found.",
                    null,
                    StatusCodes.NOT_FOUND
                );
            }

            if (!claimData.responsible_by_user) { 
                return new ServiceResponse(
                    ResponseStatus.Success,
                    "No responsible user assigned to this receive for a claim.",
                    null,
                    StatusCodes.OK 
                );
            }

            return new ServiceResponse(
                ResponseStatus.Success,
                "Responsible user found for receive for a claim.",
                claimData.responsible_by_user, 
                StatusCodes.OK
            );
        } catch (ex) {
            const errorMessage = `Error fetching responsible user for receive for a claim: ${(ex as Error).message}`;
            return new ServiceResponse(
                ResponseStatus.Failed,
                errorMessage,
                null,
                StatusCodes.INTERNAL_SERVER_ERROR
            );
        }
    },
};