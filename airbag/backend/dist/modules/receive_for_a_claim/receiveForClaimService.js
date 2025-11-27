"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.receiveForAClaimService = void 0;
const http_status_codes_1 = require("http-status-codes");
const serviceResponse_1 = require("@common/models/serviceResponse");
const receiveForClaimRepository_1 = require("./receiveForClaimRepository");
const db_1 = __importDefault(require("@src/db"));
exports.receiveForAClaimService = {
    findAll: (companyId_1, ...args_1) => __awaiter(void 0, [companyId_1, ...args_1], void 0, function* (companyId, page = 1, pageSize = 12, searchText = "") {
        try {
            const skip = (page - 1) * pageSize;
            const claims = yield receiveForClaimRepository_1.receiveForAClaimRepository.findAll(companyId, skip, pageSize, searchText);
            if (!claims || claims.length === 0) {
                return new serviceResponse_1.ServiceResponse(serviceResponse_1.ResponseStatus.Success, "No receive for claims found", {
                    data: [],
                    totalCount: 0,
                    totalPages: 0,
                }, http_status_codes_1.StatusCodes.OK);
            }
            const totalCount = yield receiveForClaimRepository_1.receiveForAClaimRepository.count(companyId, searchText);
            return new serviceResponse_1.ServiceResponse(serviceResponse_1.ResponseStatus.Success, "Get all success", {
                data: claims,
                totalCount,
                totalPages: Math.ceil(totalCount / pageSize),
            }, http_status_codes_1.StatusCodes.OK);
        }
        catch (ex) {
            return new serviceResponse_1.ServiceResponse(serviceResponse_1.ResponseStatus.Failed, "Error fetching receive for claims", ex.message, http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR);
        }
    }),
    create: (userId, companyId, payload) => __awaiter(void 0, void 0, void 0, function* () {
        // Basic validation check (optional, as Zod handles it in router)
        if (!payload || !payload.send_for_a_claim_id) {
            console.error("[Service.create] Invalid payload: send_for_a_claim_id is missing.");
            return new serviceResponse_1.ServiceResponse(serviceResponse_1.ResponseStatus.Failed, "Invalid payload: Missing required fields.", null, http_status_codes_1.StatusCodes.BAD_REQUEST);
        }
        try {
            const newClaim = yield receiveForClaimRepository_1.receiveForAClaimRepository.create(userId, companyId, payload);
            // Check if repository returned a valid record (it should if no error thrown)
            if (!newClaim || !newClaim.receive_for_a_claim_id) {
                console.error("[Service.create] Repository call succeeded but returned invalid data.");
                // This case might indicate an issue fetching the final record in the repo transaction
                return new serviceResponse_1.ServiceResponse(serviceResponse_1.ResponseStatus.Failed, "Failed to retrieve created record data.", null, http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR);
            }
            return new serviceResponse_1.ServiceResponse(serviceResponse_1.ResponseStatus.Success, "Create receive for claim with list items success", newClaim, http_status_codes_1.StatusCodes.CREATED);
        }
        catch (ex) {
            // Log the error received from the repository or transaction
            console.error("[Service.create] Error during repository.create call:", ex);
            // Provide a more generic error message to the client, but log the details
            const errorMessage = (ex instanceof Error) ? ex.message : "An unexpected error occurred during creation.";
            return new serviceResponse_1.ServiceResponse(serviceResponse_1.ResponseStatus.Failed, "Error creating receive for claim", 
            // Do not send detailed internal error messages to the client in production
            // Send a generic message or error code instead. For debugging, we send the message.
            errorMessage, // In production, replace with: "An internal error occurred."
            http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR);
        }
    }),
    update: (userId, id, payload) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const claim = yield receiveForClaimRepository_1.receiveForAClaimRepository.findByIdAsync(id);
            if (!claim) {
                return new serviceResponse_1.ServiceResponse(serviceResponse_1.ResponseStatus.Failed, "Receive for claim not found", null, http_status_codes_1.StatusCodes.NOT_FOUND);
            }
            const updatedClaim = yield receiveForClaimRepository_1.receiveForAClaimRepository.update(userId, id, payload);
            return new serviceResponse_1.ServiceResponse(serviceResponse_1.ResponseStatus.Success, "Update receive for claim success", updatedClaim, http_status_codes_1.StatusCodes.OK);
        }
        catch (ex) {
            return new serviceResponse_1.ServiceResponse(serviceResponse_1.ResponseStatus.Failed, "Error updating receive for claim", ex.message, http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR);
        }
    }),
    delete: (userId, id) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const result = yield db_1.default.$transaction((tx) => __awaiter(void 0, void 0, void 0, function* () {
                // 1. Find parent (Optional but good practice to ensure it exists)
                const claim = yield tx.receive_for_a_claim.findUnique({
                    where: { receive_for_a_claim_id: id },
                    select: { receive_for_a_claim_id: true } // Just need to know it exists
                });
                if (!claim) {
                    throw new serviceResponse_1.ServiceResponse(serviceResponse_1.ResponseStatus.Failed, "Receive for claim not found", null, http_status_codes_1.StatusCodes.NOT_FOUND);
                }
                // 2. Optional dependency checks (If needed, e.g., check if it's used elsewhere)
                // ... Add checks here if necessary ...
                // **** START: Delete Child Records ****
                // 3. Delete related receive_for_a_claim_list records FIRST
                yield tx.receive_for_a_claim_list.deleteMany({
                    where: {
                        receive_for_a_claim_id: id // Target children of the parent being deleted
                    }
                });
                // **** END: Delete Child Records ****
                // 4. Delete Parent Record
                yield tx.receive_for_a_claim.delete({
                    where: {
                        receive_for_a_claim_id: id,
                    },
                });
                // Update success message
                return new serviceResponse_1.ServiceResponse(serviceResponse_1.ResponseStatus.Success, "Receive for claim and related list items deleted successfully.", null, http_status_codes_1.StatusCodes.OK);
            })); // End transaction
            return result;
        }
        catch (ex) {
            console.error("Error processing receive for claim deletion:", ex); // Updated log message
            if (ex instanceof serviceResponse_1.ServiceResponse) {
                return ex;
            }
            return new serviceResponse_1.ServiceResponse(serviceResponse_1.ResponseStatus.Failed, "Error processing receive for claim deletion", (ex instanceof Error) ? ex.message : "An unexpected error occurred", http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR);
        }
    }),
    findOne: (id) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const claim = yield receiveForClaimRepository_1.receiveForAClaimRepository.findByIdAsync(id);
            if (!claim) {
                return new serviceResponse_1.ServiceResponse(serviceResponse_1.ResponseStatus.Failed, "Receive for claim not found", null, http_status_codes_1.StatusCodes.NOT_FOUND);
            }
            return new serviceResponse_1.ServiceResponse(serviceResponse_1.ResponseStatus.Success, "Get receive for claim success", claim, http_status_codes_1.StatusCodes.OK);
        }
        catch (ex) {
            return new serviceResponse_1.ServiceResponse(serviceResponse_1.ResponseStatus.Failed, "Error getting receive for claim", ex.message, http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR);
        }
    }),
    findPayloadData: (companyId_1, ...args_1) => __awaiter(void 0, [companyId_1, ...args_1], void 0, function* (companyId, page = 1, pageSize = 12, searchText = "") {
        try {
            const skip = (page - 1) * pageSize;
            const payloadData = yield receiveForClaimRepository_1.receiveForAClaimRepository.findPayloadData(companyId, skip, pageSize, searchText);
            if (!payloadData || payloadData.length === 0) {
                return new serviceResponse_1.ServiceResponse(serviceResponse_1.ResponseStatus.Success, "No payload data found", {
                    data: [],
                    totalCount: 0,
                    totalPages: 0,
                }, http_status_codes_1.StatusCodes.OK);
            }
            const totalCount = yield receiveForClaimRepository_1.receiveForAClaimRepository.countPayloadData(companyId, searchText);
            return new serviceResponse_1.ServiceResponse(serviceResponse_1.ResponseStatus.Success, "Get payload data success", {
                data: payloadData,
                totalCount,
                totalPages: Math.ceil(totalCount / pageSize),
            }, http_status_codes_1.StatusCodes.OK);
        }
        catch (ex) {
            return new serviceResponse_1.ServiceResponse(serviceResponse_1.ResponseStatus.Failed, "Error fetching payload data", ex.message, http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR);
        }
    }),
    getSendForClaimDocs: (companyId) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const docs = yield receiveForClaimRepository_1.receiveForAClaimRepository.getSendForClaimDocs(companyId);
            return new serviceResponse_1.ServiceResponse(serviceResponse_1.ResponseStatus.Success, "Send for claim documents retrieved successfully", docs, http_status_codes_1.StatusCodes.OK);
        }
        catch (ex) {
            return new serviceResponse_1.ServiceResponse(serviceResponse_1.ResponseStatus.Failed, "Error fetching send for claim documents", ex.message, http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR);
        }
    }),
    findOnlyReceiveClaimDocsByCompanyId: (companyId) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const docsResult = yield receiveForClaimRepository_1.receiveForAClaimRepository.findOnlyReceiveClaimDocsByCompanyId(companyId);
            if (!docsResult) {
                console.error("[Service.findOnlyReceiveClaimDocs] Repository returned unexpected value:", docsResult);
                return new serviceResponse_1.ServiceResponse(serviceResponse_1.ResponseStatus.Failed, "Failed to retrieve receive for claim documents due to an internal repository error.", [], http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR);
            }
            if (docsResult.length === 0) {
                return new serviceResponse_1.ServiceResponse(serviceResponse_1.ResponseStatus.Success, "No receive for claim documents found for this company.", [], http_status_codes_1.StatusCodes.OK);
            }
            return new serviceResponse_1.ServiceResponse(serviceResponse_1.ResponseStatus.Success, "Successfully fetched receive for claim documents.", docsResult, http_status_codes_1.StatusCodes.OK);
        }
        catch (error) {
            const errorMessage = `Error fetching receive for claim documents: ${error.message}`;
            console.error(errorMessage);
            return new serviceResponse_1.ServiceResponse(serviceResponse_1.ResponseStatus.Failed, errorMessage, [], http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR);
        }
    }),
    findResponsibleUserForReceiveForAClaim: (id) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const claimData = yield receiveForClaimRepository_1.receiveForAClaimRepository.findOnlyResponsibleUserForReceiveForAClaim(id);
            if (!claimData) {
                return new serviceResponse_1.ServiceResponse(serviceResponse_1.ResponseStatus.Failed, "Receive for a claim not found.", null, http_status_codes_1.StatusCodes.NOT_FOUND);
            }
            if (!claimData.responsible_by_user) {
                return new serviceResponse_1.ServiceResponse(serviceResponse_1.ResponseStatus.Success, "No responsible user assigned to this receive for a claim.", null, http_status_codes_1.StatusCodes.OK);
            }
            return new serviceResponse_1.ServiceResponse(serviceResponse_1.ResponseStatus.Success, "Responsible user found for receive for a claim.", claimData.responsible_by_user, http_status_codes_1.StatusCodes.OK);
        }
        catch (ex) {
            const errorMessage = `Error fetching responsible user for receive for a claim: ${ex.message}`;
            return new serviceResponse_1.ServiceResponse(serviceResponse_1.ResponseStatus.Failed, errorMessage, null, http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR);
        }
    }),
};
