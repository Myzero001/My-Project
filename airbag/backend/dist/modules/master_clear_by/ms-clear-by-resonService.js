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
exports.clearByReasonService = void 0;
const http_status_codes_1 = require("http-status-codes");
const serviceResponse_1 = require("@common/models/serviceResponse");
const ms_clear_by_resonRepository_1 = require("@modules/master_clear_by/ms-clear-by-resonRepository");
const repairReceiptRepository_1 = require("@modules/ms-repair-receipt/repairReceiptRepository");
exports.clearByReasonService = {
    findAll: (companyId_1, ...args_1) => __awaiter(void 0, [companyId_1, ...args_1], void 0, function* (companyId, page = 1, pageSize = 12, searchText = "") {
        try {
            const skip = (page - 1) * pageSize;
            const clearByReason = yield ms_clear_by_resonRepository_1.clearByRepository.findAll(companyId, skip, pageSize, searchText);
            const totalCount = yield ms_clear_by_resonRepository_1.clearByRepository.count(companyId, searchText);
            return new serviceResponse_1.ServiceResponse(serviceResponse_1.ResponseStatus.Success, "Get all success", {
                data: clearByReason,
                totalCount,
                totalPages: Math.ceil(totalCount / pageSize),
            }, http_status_codes_1.StatusCodes.OK);
        }
        catch (ex) {
            const errorMessage = "Error get all clearby reason: " + ex.message;
            return new serviceResponse_1.ServiceResponse(serviceResponse_1.ResponseStatus.Failed, errorMessage, null, http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR);
        }
    }),
    findAllNoPagination: () => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const res = yield ms_clear_by_resonRepository_1.clearByRepository.findAllNoPagination();
            return new serviceResponse_1.ServiceResponse(serviceResponse_1.ResponseStatus.Success, "Get all success", res, http_status_codes_1.StatusCodes.OK);
        }
        catch (error) {
            return new serviceResponse_1.ServiceResponse(serviceResponse_1.ResponseStatus.Failed, "Error fetching brand", null, http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR);
        }
    }),
    create: (companyId, userId, payload) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const checkName = yield ms_clear_by_resonRepository_1.clearByRepository.findByName(companyId, payload.clear_by_name);
            if (checkName) {
                return new serviceResponse_1.ServiceResponse(serviceResponse_1.ResponseStatus.Failed, "clearby reason already taken", null, http_status_codes_1.StatusCodes.BAD_REQUEST);
            }
            const clearByReason = yield ms_clear_by_resonRepository_1.clearByRepository.create(companyId, userId, payload);
            return new serviceResponse_1.ServiceResponse(serviceResponse_1.ResponseStatus.Success, "Create clearby reason success", { clear_by_id: clearByReason.clear_by_id }, http_status_codes_1.StatusCodes.OK);
        }
        catch (ex) {
            const errorMessage = "Error create clearby reason: " + ex.message;
            return new serviceResponse_1.ServiceResponse(serviceResponse_1.ResponseStatus.Failed, errorMessage, null, http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR);
        }
    }),
    delete: (companyId, clear_by_id) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const checkclearby = yield repairReceiptRepository_1.repairReceiptRepository.checkRepairReceipt(companyId, "clear_by_tool_one_id", clear_by_id);
            if (checkclearby)
                return new serviceResponse_1.ServiceResponse(serviceResponse_1.ResponseStatus.Failed, "Clearby in Repair Receipt", null, http_status_codes_1.StatusCodes.BAD_REQUEST);
            const checkclearby2 = yield repairReceiptRepository_1.repairReceiptRepository.checkRepairReceipt(companyId, "clear_by_tool_two_id", clear_by_id);
            if (checkclearby2)
                return new serviceResponse_1.ServiceResponse(serviceResponse_1.ResponseStatus.Failed, "Clearby in Repair Receipt", null, http_status_codes_1.StatusCodes.BAD_REQUEST);
            const checkclearby3 = yield repairReceiptRepository_1.repairReceiptRepository.checkRepairReceipt(companyId, "clear_by_tool_three_id", clear_by_id);
            if (checkclearby3)
                return new serviceResponse_1.ServiceResponse(serviceResponse_1.ResponseStatus.Failed, "Clearby in Repair Receipt", null, http_status_codes_1.StatusCodes.BAD_REQUEST);
            yield ms_clear_by_resonRepository_1.clearByRepository.delete(companyId, clear_by_id);
            return new serviceResponse_1.ServiceResponse(serviceResponse_1.ResponseStatus.Success, "Delete clearby reason success", "Delete clearby reason success", http_status_codes_1.StatusCodes.OK);
        }
        catch (ex) {
            const errorMessage = "Error delete clearby reason: " + ex.message;
            return new serviceResponse_1.ServiceResponse(serviceResponse_1.ResponseStatus.Failed, errorMessage, null, http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR);
        }
    }),
    update: (companyId, userId, clear_by_id, payload) => __awaiter(void 0, void 0, void 0, function* () {
        var _a;
        try {
            const checkId = yield ms_clear_by_resonRepository_1.clearByRepository.findByIdAsync(companyId, clear_by_id);
            if (!checkId) {
                return new serviceResponse_1.ServiceResponse(serviceResponse_1.ResponseStatus.Failed, "Tooling reason not found", null, http_status_codes_1.StatusCodes.BAD_REQUEST);
            }
            const checkName = yield ms_clear_by_resonRepository_1.clearByRepository.findByName(companyId, payload.clear_by_name);
            if (checkName) {
                return new serviceResponse_1.ServiceResponse(serviceResponse_1.ResponseStatus.Failed, "clearby reason already taken", null, http_status_codes_1.StatusCodes.BAD_REQUEST);
            }
            const updated = yield ms_clear_by_resonRepository_1.clearByRepository.update(companyId, userId, clear_by_id, payload);
            const updatedAt = (_a = updated.updated_at) !== null && _a !== void 0 ? _a : new Date();
            return new serviceResponse_1.ServiceResponse(serviceResponse_1.ResponseStatus.Success, "Update clearby reason success", {
                clear_by_id: updated.clear_by_id,
                clear_by_name: updated.clear_by_name,
                updated_at: updatedAt,
            }, http_status_codes_1.StatusCodes.OK);
        }
        catch (ex) {
            const errorMessage = "Error update clearby reason: " + ex.message;
            return new serviceResponse_1.ServiceResponse(serviceResponse_1.ResponseStatus.Failed, errorMessage, null, http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR);
        }
    }),
    findById: (companyId, clear_by_id) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const clearByReason = yield ms_clear_by_resonRepository_1.clearByRepository.findByIdAsync(companyId, clear_by_id);
            if (!clearByReason) {
                return new serviceResponse_1.ServiceResponse(serviceResponse_1.ResponseStatus.Failed, "Clearby reason not found", null, http_status_codes_1.StatusCodes.BAD_REQUEST);
            }
            return new serviceResponse_1.ServiceResponse(serviceResponse_1.ResponseStatus.Success, "Clearby reason found", clearByReason, http_status_codes_1.StatusCodes.OK);
        }
        catch (ex) {
            const errorMessage = "Error get clearby reason: " + ex.message;
            return new serviceResponse_1.ServiceResponse(serviceResponse_1.ResponseStatus.Failed, errorMessage, null, http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR);
        }
    }),
    select: (companyId_1, ...args_1) => __awaiter(void 0, [companyId_1, ...args_1], void 0, function* (companyId, searchText = "") {
        try {
            const data = yield ms_clear_by_resonRepository_1.clearByRepository.select(companyId, searchText);
            return new serviceResponse_1.ServiceResponse(serviceResponse_1.ResponseStatus.Success, "Select success", { data }, http_status_codes_1.StatusCodes.OK);
        }
        catch (error) {
            return new serviceResponse_1.ServiceResponse(serviceResponse_1.ResponseStatus.Failed, "Error fetching select", null, http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR);
        }
    }),
};
