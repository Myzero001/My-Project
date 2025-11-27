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
exports.repairService = void 0;
// backend/src/modules/ms_repair/ms-repairService.ts
const http_status_codes_1 = require("http-status-codes");
const serviceResponse_1 = require("@common/models/serviceResponse");
const ms_repairRepository_1 = require("@modules/ms_repair/ms-repairRepository");
const ms_group_repairRepository_1 = require("@modules/ms-group-repair/ms-group-repairRepository");
exports.repairService = {
    findAllNoPagination: (companyId) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const res = yield ms_repairRepository_1.repairRepository.findAllNoPagination(companyId);
            return new serviceResponse_1.ServiceResponse(serviceResponse_1.ResponseStatus.Success, "Get all success", res, http_status_codes_1.StatusCodes.OK);
        }
        catch (error) {
            return new serviceResponse_1.ServiceResponse(serviceResponse_1.ResponseStatus.Failed, "Error fetching repairs", null, http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR);
        }
    }),
    findAll: (companyId_1, ...args_1) => __awaiter(void 0, [companyId_1, ...args_1], void 0, function* (companyId, page = 1, pageSize = 12, searchText = "") {
        try {
            const skip = (page - 1) * pageSize;
            const repair = yield ms_repairRepository_1.repairRepository.findAll(companyId, skip, pageSize, searchText);
            const totalCount = yield ms_repairRepository_1.repairRepository.count(companyId, searchText);
            return new serviceResponse_1.ServiceResponse(serviceResponse_1.ResponseStatus.Success, "Get all success", {
                data: repair,
                totalCount,
                totalPages: Math.ceil(totalCount / pageSize),
            }, http_status_codes_1.StatusCodes.OK);
        }
        catch (ex) {
            const errorMessage = "Error fetching repairs: " + ex.message;
            return new serviceResponse_1.ServiceResponse(serviceResponse_1.ResponseStatus.Failed, "Error fetching repairs", errorMessage, http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR);
        }
    }),
    create: (companyId, userId, payload) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const checkId = yield ms_group_repairRepository_1.groupRepairRepository.findById(companyId, payload.master_group_repair_id);
            if (!checkId) {
                return new serviceResponse_1.ServiceResponse(serviceResponse_1.ResponseStatus.Failed, "Group repair not found", null, http_status_codes_1.StatusCodes.BAD_REQUEST);
            }
            const CheckRepair = yield ms_repairRepository_1.repairRepository.findByName(companyId, payload);
            if (CheckRepair) {
                return new serviceResponse_1.ServiceResponse(serviceResponse_1.ResponseStatus.Failed, "Repair already exists", null, http_status_codes_1.StatusCodes.BAD_REQUEST);
            }
            const repair = yield ms_repairRepository_1.repairRepository.create(companyId, userId, payload);
            return new serviceResponse_1.ServiceResponse(serviceResponse_1.ResponseStatus.Success, "Create repair success", "Create repair success", http_status_codes_1.StatusCodes.OK);
        }
        catch (ex) {
            const errorMessage = "Error create  repair: " + ex.message;
            return new serviceResponse_1.ServiceResponse(serviceResponse_1.ResponseStatus.Failed, errorMessage, null, http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR);
        }
    }),
    update: (companyId, userId, master_repair_id, payload) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const checkRepairId = yield ms_repairRepository_1.repairRepository.findByIdAsync(companyId, master_repair_id);
            if (!checkRepairId) {
                return new serviceResponse_1.ServiceResponse(serviceResponse_1.ResponseStatus.Failed, "Group repair not found", null, http_status_codes_1.StatusCodes.BAD_REQUEST);
            }
            const checkRepair = yield ms_repairRepository_1.repairRepository.findByName(companyId, payload);
            if (checkRepair) {
                return new serviceResponse_1.ServiceResponse(serviceResponse_1.ResponseStatus.Failed, "Repair already exists", null, http_status_codes_1.StatusCodes.BAD_REQUEST);
            }
            const repair = yield ms_repairRepository_1.repairRepository.update(companyId, userId, master_repair_id, payload);
            return new serviceResponse_1.ServiceResponse(serviceResponse_1.ResponseStatus.Success, "Success", "Update repair success", http_status_codes_1.StatusCodes.OK);
        }
        catch (ex) {
            const errorMessage = "Error update repair: " + ex.message;
            return new serviceResponse_1.ServiceResponse(serviceResponse_1.ResponseStatus.Failed, errorMessage, null, http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR);
        }
    }),
    delete: (companyId, master_repair_id) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const checkRepair = yield ms_repairRepository_1.repairRepository.findByIdAsync(companyId, master_repair_id);
            if (!checkRepair) {
                return new serviceResponse_1.ServiceResponse(serviceResponse_1.ResponseStatus.Failed, "repair not found", null, http_status_codes_1.StatusCodes.BAD_REQUEST);
            }
            const checkRepairinQuotation = yield ms_repairRepository_1.repairRepository.checkRepairinQuotation(companyId, master_repair_id);
            if (checkRepairinQuotation != null) { // ใช้ != null เพื่อป้องกันปัญหาเช็คค่าเป็น false
                return new serviceResponse_1.ServiceResponse(serviceResponse_1.ResponseStatus.Failed, "repair in quotation", null, http_status_codes_1.StatusCodes.BAD_REQUEST);
            }
            else {
                yield ms_repairRepository_1.repairRepository.delete(companyId, master_repair_id);
                return new serviceResponse_1.ServiceResponse(serviceResponse_1.ResponseStatus.Success, "repair found", "Delete repair success", http_status_codes_1.StatusCodes.OK);
            }
        }
        catch (ex) {
            const errorMessage = "Error delete repair: " + ex.message;
            return new serviceResponse_1.ServiceResponse(serviceResponse_1.ResponseStatus.Failed, errorMessage, null, http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR);
        }
    }),
    findById: (companyId, master_repair_id) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const repair = yield ms_repairRepository_1.repairRepository.findByIdAsync(companyId, master_repair_id);
            if (!repair) {
                return new serviceResponse_1.ServiceResponse(serviceResponse_1.ResponseStatus.Failed, "repair not found", null, http_status_codes_1.StatusCodes.BAD_REQUEST);
            }
            return new serviceResponse_1.ServiceResponse(serviceResponse_1.ResponseStatus.Success, "repair found", repair, http_status_codes_1.StatusCodes.OK);
        }
        catch (ex) {
            const errorMessage = "Error get repair request: " + ex.message;
            return new serviceResponse_1.ServiceResponse(serviceResponse_1.ResponseStatus.Failed, errorMessage, null, http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR);
        }
    }),
    findRepairNames: (companyId) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const repairNames = yield ms_repairRepository_1.repairRepository.findRepairNames(companyId);
            return new serviceResponse_1.ServiceResponse(serviceResponse_1.ResponseStatus.Success, "Get repair names success", repairNames, http_status_codes_1.StatusCodes.OK);
        }
        catch (error) {
            return new serviceResponse_1.ServiceResponse(serviceResponse_1.ResponseStatus.Failed, "Error fetching repair names", null, http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR);
        }
    }),
};
