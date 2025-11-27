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
exports.toolingReasonService = void 0;
const http_status_codes_1 = require("http-status-codes");
const serviceResponse_1 = require("@common/models/serviceResponse");
const ms_tooling_reasonRepository_1 = require("@modules/ms-tooling-reason/ms-tooling-reasonRepository");
exports.toolingReasonService = {
    findAll: (companyId_1, ...args_1) => __awaiter(void 0, [companyId_1, ...args_1], void 0, function* (companyId, page = 1, pageSize = 12, searchText = "") {
        try {
            const skip = (page - 1) * pageSize;
            const toolingReasons = yield ms_tooling_reasonRepository_1.toolingReasonRepository.findAll(companyId, skip, pageSize, searchText);
            const totalCount = yield ms_tooling_reasonRepository_1.toolingReasonRepository.count(companyId, searchText);
            return new serviceResponse_1.ServiceResponse(serviceResponse_1.ResponseStatus.Success, "Get all success", {
                data: toolingReasons,
                totalCount,
                totalPages: Math.ceil(totalCount / pageSize),
            }, http_status_codes_1.StatusCodes.OK);
        }
        catch (error) {
            return new serviceResponse_1.ServiceResponse(serviceResponse_1.ResponseStatus.Failed, "Error fetching tooling reasons", null, http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR);
        }
    }),
    findAllNoPagination: (company_id) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const res = yield ms_tooling_reasonRepository_1.toolingReasonRepository.findAllNoPagination(company_id);
            return new serviceResponse_1.ServiceResponse(serviceResponse_1.ResponseStatus.Success, "Get all success", res, http_status_codes_1.StatusCodes.OK);
        }
        catch (error) {
            return new serviceResponse_1.ServiceResponse(serviceResponse_1.ResponseStatus.Failed, "Error fetching brand", null, http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR);
        }
    }),
    create: (companyId, userId, payload) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const checkName = yield ms_tooling_reasonRepository_1.toolingReasonRepository.findByName(companyId, payload.tooling_reason_name);
            if (checkName) {
                return new serviceResponse_1.ServiceResponse(serviceResponse_1.ResponseStatus.Failed, "Tooling reason already taken", null, http_status_codes_1.StatusCodes.BAD_REQUEST);
            }
            const toolingReason = yield ms_tooling_reasonRepository_1.toolingReasonRepository.create(companyId, userId, payload);
            return new serviceResponse_1.ServiceResponse(serviceResponse_1.ResponseStatus.Success, "Create tooling reason success", { master_tooling_reason_id: toolingReason.master_tooling_reason_id }, http_status_codes_1.StatusCodes.OK);
        }
        catch (ex) {
            const errorMessage = "Error create tooling reason: " + ex.message;
            return new serviceResponse_1.ServiceResponse(serviceResponse_1.ResponseStatus.Failed, errorMessage, null, http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR);
        }
    }),
    update: (companyId, userId, master_tooling_reason_id, payload) => __awaiter(void 0, void 0, void 0, function* () {
        var _a;
        try {
            const checkId = yield ms_tooling_reasonRepository_1.toolingReasonRepository.findByIdAsync(companyId, master_tooling_reason_id);
            if (!checkId) {
                return new serviceResponse_1.ServiceResponse(serviceResponse_1.ResponseStatus.Failed, "Tooling reason not found", null, http_status_codes_1.StatusCodes.BAD_REQUEST);
            }
            const checkName = yield ms_tooling_reasonRepository_1.toolingReasonRepository.findByName(companyId, payload.tooling_reason_name);
            if (checkName) {
                return new serviceResponse_1.ServiceResponse(serviceResponse_1.ResponseStatus.Failed, "Tooling reason already taken", null, http_status_codes_1.StatusCodes.BAD_REQUEST);
            }
            const updated = yield ms_tooling_reasonRepository_1.toolingReasonRepository.update(companyId, userId, master_tooling_reason_id, payload);
            const updatedAt = (_a = updated.updated_at) !== null && _a !== void 0 ? _a : new Date();
            return new serviceResponse_1.ServiceResponse(serviceResponse_1.ResponseStatus.Success, "Update tooling reason success", {
                tooling_reason_name: updated.tooling_reason_name,
                updated_at: updatedAt,
                updated_by: updated.updated_by,
            }, http_status_codes_1.StatusCodes.OK);
        }
        catch (ex) {
            const errorMessage = "Error update tooling reason: " + ex.message;
            return new serviceResponse_1.ServiceResponse(serviceResponse_1.ResponseStatus.Failed, errorMessage, null, http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR);
        }
    }),
    delete: (companyId, master_tooling_reason_id) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const check = yield ms_tooling_reasonRepository_1.toolingReasonRepository.findByIdAsync(companyId, master_tooling_reason_id);
            if (!check) {
                return new serviceResponse_1.ServiceResponse(serviceResponse_1.ResponseStatus.Failed, "Tooling reason not found", null, http_status_codes_1.StatusCodes.BAD_REQUEST);
            }
            // Add check for tooling reason in repair receipt
            const checkToolingReasonInRepairReceipt = yield ms_tooling_reasonRepository_1.toolingReasonRepository.checkToolingReasonInRepairReceipt(companyId, master_tooling_reason_id);
            if (checkToolingReasonInRepairReceipt) {
                return new serviceResponse_1.ServiceResponse(serviceResponse_1.ResponseStatus.Failed, "Cannot delete: Tooling reason is being used in repair receipts", null, http_status_codes_1.StatusCodes.BAD_REQUEST);
            }
            yield ms_tooling_reasonRepository_1.toolingReasonRepository.delete(companyId, master_tooling_reason_id);
            return new serviceResponse_1.ServiceResponse(serviceResponse_1.ResponseStatus.Success, "Delete tooling reason success", "Delete tooling reason success", http_status_codes_1.StatusCodes.OK);
        }
        catch (ex) {
            const errorMessage = "Error delete tooling reason: " + ex.message;
            return new serviceResponse_1.ServiceResponse(serviceResponse_1.ResponseStatus.Failed, errorMessage, null, http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR);
        }
    }),
    findById: (companyId, master_tooling_reason_id) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const toolingReason = yield ms_tooling_reasonRepository_1.toolingReasonRepository.findByIdAsync(companyId, master_tooling_reason_id);
            if (!toolingReason) {
                return new serviceResponse_1.ServiceResponse(serviceResponse_1.ResponseStatus.Failed, "Tooling reason not found", null, http_status_codes_1.StatusCodes.BAD_REQUEST);
            }
            return new serviceResponse_1.ServiceResponse(serviceResponse_1.ResponseStatus.Success, "Tooling reason found", toolingReason, http_status_codes_1.StatusCodes.OK);
        }
        catch (ex) {
            const errorMessage = "Error get tooling reason: " + ex.message;
            return new serviceResponse_1.ServiceResponse(serviceResponse_1.ResponseStatus.Failed, errorMessage, null, http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR);
        }
    }),
    findMinimal: (companyId) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const reasons = yield ms_tooling_reasonRepository_1.toolingReasonRepository.findMinimal(companyId);
            return new serviceResponse_1.ServiceResponse(serviceResponse_1.ResponseStatus.Success, "Get minimal tooling reason data success", reasons, http_status_codes_1.StatusCodes.OK);
        }
        catch (error) {
            return new serviceResponse_1.ServiceResponse(serviceResponse_1.ResponseStatus.Failed, "Error fetching minimal tooling reason data", null, http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR);
        }
    }),
    select: (companyId_1, ...args_1) => __awaiter(void 0, [companyId_1, ...args_1], void 0, function* (companyId, searchText = "") {
        try {
            const data = yield ms_tooling_reasonRepository_1.toolingReasonRepository.select(companyId, searchText);
            return new serviceResponse_1.ServiceResponse(serviceResponse_1.ResponseStatus.Success, "Select success", { data }, http_status_codes_1.StatusCodes.OK);
        }
        catch (error) {
            return new serviceResponse_1.ServiceResponse(serviceResponse_1.ResponseStatus.Failed, "Error fetching select", null, http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR);
        }
    }),
};
