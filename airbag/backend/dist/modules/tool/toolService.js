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
exports.toolService = void 0;
const http_status_codes_1 = require("http-status-codes");
const toolRepository_1 = require("@modules/tool/toolRepository");
const serviceResponse_1 = require("@common/models/serviceResponse");
const repairReceiptRepository_1 = require("@modules/ms-repair-receipt/repairReceiptRepository");
exports.toolService = {
    findAll: (companyId_1, ...args_1) => __awaiter(void 0, [companyId_1, ...args_1], void 0, function* (companyId, page = 1, pageSize = 12, searchText = "") {
        try {
            const skip = (page - 1) * pageSize;
            const tool = yield toolRepository_1.toolRepository.findAll(companyId, skip, pageSize, searchText);
            const totalCount = yield toolRepository_1.toolRepository.count(companyId, searchText);
            return new serviceResponse_1.ServiceResponse(serviceResponse_1.ResponseStatus.Success, "Get all success", {
                data: tool,
                totalCount,
                totalPages: Math.ceil(totalCount / pageSize),
            }, http_status_codes_1.StatusCodes.OK);
        }
        catch (ex) {
            const errorMessage = "Error Find All Tool :" + ex.message;
            return new serviceResponse_1.ServiceResponse(serviceResponse_1.ResponseStatus.Failed, errorMessage, null, http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR);
        }
    }),
    findAllNoPagination: (company_id) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const res = yield toolRepository_1.toolRepository.findAllNoPagination(company_id);
            return new serviceResponse_1.ServiceResponse(serviceResponse_1.ResponseStatus.Success, "Get all success", res, http_status_codes_1.StatusCodes.OK);
        }
        catch (error) {
            return new serviceResponse_1.ServiceResponse(serviceResponse_1.ResponseStatus.Failed, "Error fetching brand", null, http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR);
        }
    }),
    create: (companyId, userId, payload) => __awaiter(void 0, void 0, void 0, function* () {
        var _a;
        try {
            const tool = (_a = payload.tool) === null || _a === void 0 ? void 0 : _a.trim();
            if (!tool) {
                return new serviceResponse_1.ServiceResponse(serviceResponse_1.ResponseStatus.Failed, "Tool name is required", null, http_status_codes_1.StatusCodes.BAD_REQUEST);
            }
            const checktool = yield toolRepository_1.toolRepository.findByName(companyId, tool);
            if (checktool) {
                return new serviceResponse_1.ServiceResponse(serviceResponse_1.ResponseStatus.Failed, "Tool name already exists", null, http_status_codes_1.StatusCodes.BAD_REQUEST);
            }
            const newTool = yield toolRepository_1.toolRepository.create(companyId, userId, payload);
            return new serviceResponse_1.ServiceResponse(serviceResponse_1.ResponseStatus.Success, "Success", newTool, http_status_codes_1.StatusCodes.OK);
        }
        catch (ex) {
            const errorMessage = "Error Create Tool :" + ex.message;
            return new serviceResponse_1.ServiceResponse(serviceResponse_1.ResponseStatus.Failed, errorMessage, null, http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR);
        }
    }),
    delete: (companyId, tool_id) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const checkTool = yield toolRepository_1.toolRepository.findById(companyId, tool_id);
            if (!checkTool) {
                return new serviceResponse_1.ServiceResponse(serviceResponse_1.ResponseStatus.Failed, "tool not found", null, http_status_codes_1.StatusCodes.BAD_REQUEST);
            }
            const checktool1 = yield repairReceiptRepository_1.repairReceiptRepository.checkRepairReceipt(companyId, "tool_one_id", tool_id);
            if (checktool1)
                return new serviceResponse_1.ServiceResponse(serviceResponse_1.ResponseStatus.Failed, "tool in Repair Receipt", null, http_status_codes_1.StatusCodes.BAD_REQUEST);
            const checktool2 = yield repairReceiptRepository_1.repairReceiptRepository.checkRepairReceipt(companyId, "tool_two_id", tool_id);
            if (checktool2)
                return new serviceResponse_1.ServiceResponse(serviceResponse_1.ResponseStatus.Failed, "tool in Repair Receipt", null, http_status_codes_1.StatusCodes.BAD_REQUEST);
            const checktool3 = yield repairReceiptRepository_1.repairReceiptRepository.checkRepairReceipt(companyId, "tool_three_id", tool_id);
            if (checktool3)
                return new serviceResponse_1.ServiceResponse(serviceResponse_1.ResponseStatus.Failed, "tool in Repair Receipt", null, http_status_codes_1.StatusCodes.BAD_REQUEST);
            yield toolRepository_1.toolRepository.delete(companyId, tool_id);
            return new serviceResponse_1.ServiceResponse(serviceResponse_1.ResponseStatus.Success, "Tool found", "Delete Tool success", http_status_codes_1.StatusCodes.OK);
        }
        catch (ex) {
            const errorMessage = "Error delete Tool :" + ex.message;
            return new serviceResponse_1.ServiceResponse(serviceResponse_1.ResponseStatus.Failed, errorMessage, null, http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR);
        }
    }),
    update: (tool_id, payload, companyId, userId) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const checkTool_Id = yield toolRepository_1.toolRepository.findById(companyId, tool_id);
            if (!checkTool_Id) {
                return new serviceResponse_1.ServiceResponse(serviceResponse_1.ResponseStatus.Failed, "tool not found", null, http_status_codes_1.StatusCodes.BAD_REQUEST);
            }
            const checkTool = yield toolRepository_1.toolRepository.findByName(companyId, payload.tool);
            if (checkTool) {
                return new serviceResponse_1.ServiceResponse(serviceResponse_1.ResponseStatus.Failed, "Tool name already exists", null, http_status_codes_1.StatusCodes.BAD_REQUEST);
            }
            //อัพเดท
            const tool = yield toolRepository_1.toolRepository.update(companyId, userId, tool_id, payload);
            // ไม่จำเป็นต้องเปลี่ยนลำดับในฐานข้อมูล
            return new serviceResponse_1.ServiceResponse(serviceResponse_1.ResponseStatus.Success, "Success", tool, http_status_codes_1.StatusCodes.OK);
        }
        catch (ex) {
            const errorMessage = "Error Update Tool :" + ex.message;
            return new serviceResponse_1.ServiceResponse(serviceResponse_1.ResponseStatus.Failed, errorMessage, null, http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR);
        }
    }),
    search: (query) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const tools = yield toolRepository_1.toolRepository.search(query);
            return new serviceResponse_1.ServiceResponse(serviceResponse_1.ResponseStatus.Success, "Search successful", tools, http_status_codes_1.StatusCodes.OK);
        }
        catch (ex) {
            const errorMessage = "Error searching tools: " + ex.message;
            return new serviceResponse_1.ServiceResponse(serviceResponse_1.ResponseStatus.Failed, errorMessage, null, http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR);
        }
    }),
    select: (companyId_1, ...args_1) => __awaiter(void 0, [companyId_1, ...args_1], void 0, function* (companyId, searchText = "") {
        try {
            const data = yield toolRepository_1.toolRepository.select(companyId, searchText);
            return new serviceResponse_1.ServiceResponse(serviceResponse_1.ResponseStatus.Success, "Select success", { data }, http_status_codes_1.StatusCodes.OK);
        }
        catch (error) {
            return new serviceResponse_1.ServiceResponse(serviceResponse_1.ResponseStatus.Failed, "Error fetching select", null, http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR);
        }
    }),
};
