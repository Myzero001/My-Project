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
exports.ms_positionService = void 0;
// ms_positionService.ts
const http_status_codes_1 = require("http-status-codes");
const serviceResponse_1 = require("@common/models/serviceResponse");
const ms_positionRepository_1 = require("@modules/ms_position/ms_positionRepository");
exports.ms_positionService = {
    findAll: (companyId_1, page_1, ...args_1) => __awaiter(void 0, [companyId_1, page_1, ...args_1], void 0, function* (companyId, page, pageSize = 12, searchText = "") {
        try {
            const skip = (page - 1) * pageSize;
            const position = yield ms_positionRepository_1.ms_positionRepository.findAll(companyId, skip, pageSize, searchText);
            if (!position) {
                return new serviceResponse_1.ServiceResponse(serviceResponse_1.ResponseStatus.Failed, "No positions found", null, http_status_codes_1.StatusCodes.NOT_FOUND);
            }
            const totalCount = yield ms_positionRepository_1.ms_positionRepository.count(companyId, searchText);
            return new serviceResponse_1.ServiceResponse(serviceResponse_1.ResponseStatus.Success, "Get all success", {
                data: position,
                totalCount,
                totalPages: Math.ceil(totalCount / pageSize),
            }, http_status_codes_1.StatusCodes.OK);
        }
        catch (error) {
            return new serviceResponse_1.ServiceResponse(serviceResponse_1.ResponseStatus.Failed, "Get all failed", null, http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR);
        }
    }),
    create: (companyId, userId, payload) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const checkPosition = yield ms_positionRepository_1.ms_positionRepository.findByName(companyId, payload.position_name);
            if (checkPosition) {
                return new serviceResponse_1.ServiceResponse(serviceResponse_1.ResponseStatus.Failed, "Position already taken", null, http_status_codes_1.StatusCodes.BAD_REQUEST);
            }
            const newPosition = yield ms_positionRepository_1.ms_positionRepository.create(companyId, userId, payload);
            return new serviceResponse_1.ServiceResponse(serviceResponse_1.ResponseStatus.Success, "Create position success", "Create position success", http_status_codes_1.StatusCodes.OK);
        }
        catch (ex) {
            const errorMessage = "Error create position: " + ex.message;
            return new serviceResponse_1.ServiceResponse(serviceResponse_1.ResponseStatus.Failed, "Create position failed", null, http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR);
        }
    }),
    update: (companyId, userId, position_id, payload) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const checkPositionId = yield ms_positionRepository_1.ms_positionRepository.findByIdAsync(companyId, position_id);
            if (!checkPositionId) {
                return new serviceResponse_1.ServiceResponse(serviceResponse_1.ResponseStatus.Failed, "Position not found", null, http_status_codes_1.StatusCodes.BAD_REQUEST);
            }
            const checkPosition = yield ms_positionRepository_1.ms_positionRepository.findByName(companyId, payload.position_name);
            if (checkPosition) {
                return new serviceResponse_1.ServiceResponse(serviceResponse_1.ResponseStatus.Failed, "Position already taken", null, http_status_codes_1.StatusCodes.BAD_REQUEST);
            }
            const updatePosition = yield ms_positionRepository_1.ms_positionRepository.update(companyId, userId, position_id, payload);
            return new serviceResponse_1.ServiceResponse(serviceResponse_1.ResponseStatus.Success, "Update position success", "Update position success", http_status_codes_1.StatusCodes.OK);
        }
        catch (ex) {
            const errorMessage = "Error update position: " + ex.message;
            return new serviceResponse_1.ServiceResponse(serviceResponse_1.ResponseStatus.Failed, errorMessage, null, http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR);
        }
    }),
    delete: (companyId, position_id) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const checkPositionId = yield ms_positionRepository_1.ms_positionRepository.findByIdAsync(companyId, position_id);
            if (!checkPositionId) {
                return new serviceResponse_1.ServiceResponse(serviceResponse_1.ResponseStatus.Failed, "Position not found", null, http_status_codes_1.StatusCodes.BAD_REQUEST);
            }
            yield ms_positionRepository_1.ms_positionRepository.delete(companyId, position_id);
            return new serviceResponse_1.ServiceResponse(serviceResponse_1.ResponseStatus.Success, "Delete position success", "Delete position success", http_status_codes_1.StatusCodes.OK);
        }
        catch (ex) {
            const errorMessage = "Error delete position: " + ex.message;
            return new serviceResponse_1.ServiceResponse(serviceResponse_1.ResponseStatus.Failed, errorMessage, null, http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR);
        }
    }),
    findById: (companyId, position_id) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const checkPositionId = yield ms_positionRepository_1.ms_positionRepository.findByIdAsync(companyId, position_id);
            if (!checkPositionId) {
                return new serviceResponse_1.ServiceResponse(serviceResponse_1.ResponseStatus.Failed, "Position not found", null, http_status_codes_1.StatusCodes.BAD_REQUEST);
            }
            return new serviceResponse_1.ServiceResponse(serviceResponse_1.ResponseStatus.Success, "Position found", checkPositionId, http_status_codes_1.StatusCodes.OK);
        }
        catch (ex) {
            const errorMessage = "Error get position request: " + ex.message;
            return new serviceResponse_1.ServiceResponse(serviceResponse_1.ResponseStatus.Failed, errorMessage, null, http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR);
        }
    }),
    select: (companyId_1, ...args_1) => __awaiter(void 0, [companyId_1, ...args_1], void 0, function* (companyId, searchText = "") {
        try {
            const data = yield ms_positionRepository_1.ms_positionRepository.select(companyId, searchText);
            return new serviceResponse_1.ServiceResponse(serviceResponse_1.ResponseStatus.Success, "Select success", { data }, http_status_codes_1.StatusCodes.OK);
        }
        catch (error) {
            return new serviceResponse_1.ServiceResponse(serviceResponse_1.ResponseStatus.Failed, "Error fetching select", null, http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR);
        }
    }),
};
