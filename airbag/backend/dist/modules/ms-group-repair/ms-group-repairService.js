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
exports.groupRepairService = void 0;
const http_status_codes_1 = require("http-status-codes");
const serviceResponse_1 = require("@common/models/serviceResponse");
const ms_group_repairRepository_1 = require("@modules/ms-group-repair/ms-group-repairRepository");
exports.groupRepairService = {
    findAll: (companyId_1, ...args_1) => __awaiter(void 0, [companyId_1, ...args_1], void 0, function* (companyId, page = 1, pageSize = 12, searchText = "") {
        try {
            const skip = (page - 1) * pageSize;
            const groupRepairs = yield ms_group_repairRepository_1.groupRepairRepository.findAll(companyId, skip, pageSize, searchText);
            const totalCount = yield ms_group_repairRepository_1.groupRepairRepository.count(companyId, searchText);
            return new serviceResponse_1.ServiceResponse(serviceResponse_1.ResponseStatus.Success, "Get all success", {
                data: groupRepairs,
                totalCount,
                totalPages: Math.ceil(totalCount / pageSize),
            }, http_status_codes_1.StatusCodes.OK);
        }
        catch (error) {
            return new serviceResponse_1.ServiceResponse(serviceResponse_1.ResponseStatus.Failed, "Error fetching group repairs", null, http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR);
        }
    }),
    create: (companyId, userId, payload) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const checkGroupName = yield ms_group_repairRepository_1.groupRepairRepository.findByName(companyId, payload.group_repair_name);
            if (checkGroupName) {
                return new serviceResponse_1.ServiceResponse(serviceResponse_1.ResponseStatus.Failed, "Group repair already taken", null, http_status_codes_1.StatusCodes.BAD_REQUEST);
            }
            const group = yield ms_group_repairRepository_1.groupRepairRepository.create(companyId, userId, payload);
            return new serviceResponse_1.ServiceResponse(serviceResponse_1.ResponseStatus.Success, "Create group repair success", { master_group_repair_id: group.master_group_repair_id }, http_status_codes_1.StatusCodes.OK);
        }
        catch (ex) {
            const errorMessage = "Error create group repair: " + ex.message;
            return new serviceResponse_1.ServiceResponse(serviceResponse_1.ResponseStatus.Failed, errorMessage, null, http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR);
        }
    }),
    update: (companyId, userId, master_group_repair_id, payload) => __awaiter(void 0, void 0, void 0, function* () {
        var _a;
        try {
            const checkGroupId = yield ms_group_repairRepository_1.groupRepairRepository.findByIdAsync(companyId, master_group_repair_id);
            if (!checkGroupId) {
                return new serviceResponse_1.ServiceResponse(serviceResponse_1.ResponseStatus.Failed, "Group repair not found", null, http_status_codes_1.StatusCodes.BAD_REQUEST);
            }
            const checkGroup = yield ms_group_repairRepository_1.groupRepairRepository.findByName(companyId, payload.group_repair_name);
            if (checkGroup) {
                return new serviceResponse_1.ServiceResponse(serviceResponse_1.ResponseStatus.Failed, "Group repair already taken", null, http_status_codes_1.StatusCodes.BAD_REQUEST);
            }
            const updatedGroup = yield ms_group_repairRepository_1.groupRepairRepository.update(companyId, userId, master_group_repair_id, payload);
            // ตรวจสอบ updated_at ให้เป็น Date เสมอ
            const updatedAt = (_a = updatedGroup.updated_at) !== null && _a !== void 0 ? _a : new Date();
            return new serviceResponse_1.ServiceResponse(serviceResponse_1.ResponseStatus.Success, "Update group repair success", {
                group_repair_name: updatedGroup.group_repair_name,
                updated_at: updatedAt,
                updated_by: updatedGroup.updated_by,
            }, http_status_codes_1.StatusCodes.OK);
        }
        catch (ex) {
            const errorMessage = "Error update group repair: " + ex.message;
            return new serviceResponse_1.ServiceResponse(serviceResponse_1.ResponseStatus.Failed, errorMessage, null, http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR);
        }
    }),
    delete: (companyId, master_group_repair_id) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const checkGroup = yield ms_group_repairRepository_1.groupRepairRepository.findByIdAsync(companyId, master_group_repair_id);
            if (!checkGroup) {
                return new serviceResponse_1.ServiceResponse(serviceResponse_1.ResponseStatus.Failed, "Group repair not found", null, http_status_codes_1.StatusCodes.BAD_REQUEST);
            }
            const checkGroupRepairHaveRepair = yield ms_group_repairRepository_1.groupRepairRepository.checkGroupRepairHaveRepair(companyId, master_group_repair_id);
            if (checkGroupRepairHaveRepair) {
                return new serviceResponse_1.ServiceResponse(serviceResponse_1.ResponseStatus.Failed, "Group repair have repair ", null, http_status_codes_1.StatusCodes.BAD_REQUEST);
            }
            yield ms_group_repairRepository_1.groupRepairRepository.delete(companyId, master_group_repair_id);
            return new serviceResponse_1.ServiceResponse(serviceResponse_1.ResponseStatus.Success, "Delete group repair success", "Delete group repair success", http_status_codes_1.StatusCodes.OK);
        }
        catch (ex) {
            const errorMessage = "Error delete group repair: " + ex.message;
            return new serviceResponse_1.ServiceResponse(serviceResponse_1.ResponseStatus.Failed, errorMessage, null, http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR);
        }
    }),
    findById: (companyId, master_group_repair_id) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const groupRepair = yield ms_group_repairRepository_1.groupRepairRepository.findByIdAsync(companyId, master_group_repair_id);
            if (!groupRepair) {
                return new serviceResponse_1.ServiceResponse(serviceResponse_1.ResponseStatus.Failed, "Group repair not found", null, http_status_codes_1.StatusCodes.BAD_REQUEST);
            }
            return new serviceResponse_1.ServiceResponse(serviceResponse_1.ResponseStatus.Success, "Group repair found", groupRepair, http_status_codes_1.StatusCodes.OK);
        }
        catch (ex) {
            const errorMessage = "Error get group repair request: " + ex.message;
            return new serviceResponse_1.ServiceResponse(serviceResponse_1.ResponseStatus.Failed, errorMessage, null, http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR);
        }
    }),
    findMinimal: (companyId) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const brands = yield ms_group_repairRepository_1.groupRepairRepository.findMinimal(companyId);
            return new serviceResponse_1.ServiceResponse(serviceResponse_1.ResponseStatus.Success, "Get minimal grouprepair data success", brands, http_status_codes_1.StatusCodes.OK);
        }
        catch (error) {
            return new serviceResponse_1.ServiceResponse(serviceResponse_1.ResponseStatus.Failed, "Error fetching minimal grouprepair data", null, http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR);
        }
    }),
};
