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
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendForAClaimService = void 0;
const http_status_codes_1 = require("http-status-codes");
const serviceResponse_1 = require("@common/models/serviceResponse");
const sendForAClaimRepository_1 = require("@modules/send-for-a-claim/sendForAClaimRepository");
const generateSendForAClaimDoc_1 = require("@common/utils/generateSendForAClaimDoc");
exports.sendForAClaimService = {
    findAll: (companyId_1, ...args_1) => __awaiter(void 0, [companyId_1, ...args_1], void 0, function* (companyId, page = 1, pageSize = 12, searchText = "") {
        try {
            const skip = (page - 1) * pageSize;
            const receipts = yield sendForAClaimRepository_1.sendForAClaimRepository.findAll(companyId, skip, pageSize, searchText);
            if (!receipts) {
                return new serviceResponse_1.ServiceResponse(serviceResponse_1.ResponseStatus.Failed, "No send for a claim found", null, http_status_codes_1.StatusCodes.NOT_FOUND);
            }
            const totalCount = yield sendForAClaimRepository_1.sendForAClaimRepository.count(companyId, searchText);
            return new serviceResponse_1.ServiceResponse(serviceResponse_1.ResponseStatus.Success, "Get all success", {
                data: receipts,
                totalCount,
                totalPages: Math.ceil(totalCount / pageSize),
            }, http_status_codes_1.StatusCodes.OK);
        }
        catch (ex) {
            return new serviceResponse_1.ServiceResponse(serviceResponse_1.ResponseStatus.Failed, "Error fetching send for a claim", ex.message, http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR);
        }
    }),
    create: (companyId, userId, payload) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            payload.send_for_a_claim_doc = yield (0, generateSendForAClaimDoc_1.generateSendForAClaimDoc)(companyId);
            const claim = yield sendForAClaimRepository_1.sendForAClaimRepository.create(companyId, userId, payload);
            if (!claim) {
                return new serviceResponse_1.ServiceResponse(serviceResponse_1.ResponseStatus.Failed, "Error creating send for a claim", null, http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR);
            }
            return new serviceResponse_1.ServiceResponse(serviceResponse_1.ResponseStatus.Success, "Send for a claim created successfully", claim, http_status_codes_1.StatusCodes.OK);
        }
        catch (ex) {
            return new serviceResponse_1.ServiceResponse(serviceResponse_1.ResponseStatus.Failed, "Error creating send for a claim", ex.message, http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR);
        }
    }),
    update: (companyId, userId, send_for_a_claim_id, payload) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const claim = yield sendForAClaimRepository_1.sendForAClaimRepository.findByIdAsync(companyId, send_for_a_claim_id);
            if (!claim) {
                return new serviceResponse_1.ServiceResponse(serviceResponse_1.ResponseStatus.Failed, "Send for a claim not found", null, http_status_codes_1.StatusCodes.NOT_FOUND);
            }
            const claimUpdated = yield sendForAClaimRepository_1.sendForAClaimRepository.update(companyId, userId, send_for_a_claim_id, payload);
            if (!claim) {
                return new serviceResponse_1.ServiceResponse(serviceResponse_1.ResponseStatus.Failed, "Error updating send for a claim", null, http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR);
            }
            return new serviceResponse_1.ServiceResponse(serviceResponse_1.ResponseStatus.Success, "Send for a claim updated successfully", "Send for a claim updated successfully", http_status_codes_1.StatusCodes.OK);
        }
        catch (ex) {
            return new serviceResponse_1.ServiceResponse(serviceResponse_1.ResponseStatus.Failed, "Error updating send for a claim", ex.message, http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR);
        }
    }),
    delete: (companyId, send_for_a_claim_id) => __awaiter(void 0, void 0, void 0, function* () {
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
            const checkClaiminReceiveForAClaim = yield sendForAClaimRepository_1.sendForAClaimRepository.checkClaiminReceiveForAClaim(companyId, send_for_a_claim_id);
            if (checkClaiminReceiveForAClaim != null) {
                return new serviceResponse_1.ServiceResponse(serviceResponse_1.ResponseStatus.Failed, "send for a claim have in receive for a claim", null, http_status_codes_1.StatusCodes.BAD_REQUEST);
            }
            const claim = yield sendForAClaimRepository_1.sendForAClaimRepository.findByIdAsync(companyId, send_for_a_claim_id);
            if (!claim) {
                return new serviceResponse_1.ServiceResponse(serviceResponse_1.ResponseStatus.Failed, "Send for a claim not found", null, http_status_codes_1.StatusCodes.NOT_FOUND);
            }
            yield sendForAClaimRepository_1.sendForAClaimRepository.deleteBySendForAClaimId(companyId, send_for_a_claim_id);
            yield sendForAClaimRepository_1.sendForAClaimRepository.delete(companyId, send_for_a_claim_id);
            return new serviceResponse_1.ServiceResponse(serviceResponse_1.ResponseStatus.Success, "Send for a claim deleted successfully", "Send for a claim deleted successfully", http_status_codes_1.StatusCodes.OK);
        }
        catch (ex) {
            return new serviceResponse_1.ServiceResponse(serviceResponse_1.ResponseStatus.Failed, "Error deleting send for a claim", ex.message, http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR);
        }
    }),
    findById: (companyId, send_for_a_claim_id) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const claim = yield sendForAClaimRepository_1.sendForAClaimRepository.findByIdAsync(companyId, send_for_a_claim_id);
            if (!claim) {
                return new serviceResponse_1.ServiceResponse(serviceResponse_1.ResponseStatus.Failed, "Send for a claim not found", null, http_status_codes_1.StatusCodes.BAD_REQUEST);
            }
            return new serviceResponse_1.ServiceResponse(serviceResponse_1.ResponseStatus.Success, "Send for a claim success", claim, http_status_codes_1.StatusCodes.OK);
        }
        catch (ex) {
            const errorMessage = "Error get send for a claim: " + ex.message;
            return new serviceResponse_1.ServiceResponse(serviceResponse_1.ResponseStatus.Failed, errorMessage, null, http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR);
        }
    }),
    findDoc: (companyId) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const result = yield sendForAClaimRepository_1.sendForAClaimRepository.getAllSendForAClaimDoc(companyId);
            if (!result) {
                return new serviceResponse_1.ServiceResponse(serviceResponse_1.ResponseStatus.Failed, "No supplier repair receipt docs found", null, http_status_codes_1.StatusCodes.NOT_FOUND);
            }
            return new serviceResponse_1.ServiceResponse(serviceResponse_1.ResponseStatus.Success, "Get supplier repair receipt docs success", result, http_status_codes_1.StatusCodes.OK);
        }
        catch (ex) {
            const errorMessage = "Error getting supplier repair receipt docs: " + ex.message;
            return new serviceResponse_1.ServiceResponse(serviceResponse_1.ResponseStatus.Failed, errorMessage, null, http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR);
        }
    }),
    findBySupplierRepairReceiptId: (companyId, id) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const srr = yield sendForAClaimRepository_1.sendForAClaimRepository.findBySupplierRepairReceiptIdAsync(companyId, id);
            if (!srr) {
                return new serviceResponse_1.ServiceResponse(serviceResponse_1.ResponseStatus.Failed, "Supplier repair receipt not found", null, http_status_codes_1.StatusCodes.BAD_REQUEST);
            }
            return new serviceResponse_1.ServiceResponse(serviceResponse_1.ResponseStatus.Success, "Supplier repair receipt success", srr, http_status_codes_1.StatusCodes.OK);
        }
        catch (ex) {
            const errorMessage = "Error get Supplier repair receipt: " + ex.message;
            return new serviceResponse_1.ServiceResponse(serviceResponse_1.ResponseStatus.Failed, errorMessage, null, http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR);
        }
    }),
    findOnlySendClaimDocsByCompanyId: (companyId) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const docsResult = yield sendForAClaimRepository_1.sendForAClaimRepository.findOnlySendClaimDocsByCompanyId(companyId);
            if (!docsResult) {
                console.error("[Service.findOnlySendClaimDocs] Repository returned unexpected value:", docsResult);
                return new serviceResponse_1.ServiceResponse(serviceResponse_1.ResponseStatus.Failed, "Failed to retrieve send for claim documents due to an internal repository error.", [], http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR);
            }
            if (docsResult.length === 0) {
                return new serviceResponse_1.ServiceResponse(serviceResponse_1.ResponseStatus.Success, "No send for claim documents found for this company.", [], http_status_codes_1.StatusCodes.OK);
            }
            return new serviceResponse_1.ServiceResponse(serviceResponse_1.ResponseStatus.Success, "Successfully fetched send for claim documents.", docsResult, http_status_codes_1.StatusCodes.OK);
        }
        catch (error) {
            const errorMessage = `Error fetching send for claim documents: ${error.message}`;
            console.error(errorMessage);
            return new serviceResponse_1.ServiceResponse(serviceResponse_1.ResponseStatus.Failed, errorMessage, [], http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR);
        }
    }),
    findResponsibleUserForSendForAClaim: (companyId, send_for_a_claim_id) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const claimData = yield sendForAClaimRepository_1.sendForAClaimRepository.findOnlyResponsibleUserForSendForAClaim(companyId, send_for_a_claim_id);
            if (!claimData) {
                return new serviceResponse_1.ServiceResponse(serviceResponse_1.ResponseStatus.Failed, "Send for a claim not found.", null, http_status_codes_1.StatusCodes.NOT_FOUND);
            }
            if (!claimData.responsible_by_user) {
                return new serviceResponse_1.ServiceResponse(serviceResponse_1.ResponseStatus.Success, "No responsible user assigned to this send for a claim.", null, http_status_codes_1.StatusCodes.OK);
            }
            return new serviceResponse_1.ServiceResponse(serviceResponse_1.ResponseStatus.Success, "Responsible user found for send for a claim.", claimData.responsible_by_user, http_status_codes_1.StatusCodes.OK);
        }
        catch (ex) {
            const errorMessage = `Error fetching responsible user for send for a claim: ${ex.message}`;
            return new serviceResponse_1.ServiceResponse(serviceResponse_1.ResponseStatus.Failed, errorMessage, null, http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR);
        }
    }),
    select: (companyId_1, ...args_1) => __awaiter(void 0, [companyId_1, ...args_1], void 0, function* (companyId, searchText = "") {
        try {
            const data = yield sendForAClaimRepository_1.sendForAClaimRepository.select(companyId, searchText);
            return new serviceResponse_1.ServiceResponse(serviceResponse_1.ResponseStatus.Success, "Select success", { data }, http_status_codes_1.StatusCodes.OK);
        }
        catch (error) {
            return new serviceResponse_1.ServiceResponse(serviceResponse_1.ResponseStatus.Failed, "Error fetching select", null, http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR);
        }
    }),
};
