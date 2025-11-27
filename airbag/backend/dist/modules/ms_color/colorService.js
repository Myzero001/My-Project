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
exports.colorService = void 0;
const http_status_codes_1 = require("http-status-codes");
const serviceResponse_1 = require("@common/models/serviceResponse");
const colorRepository_1 = require("@modules/ms_color/colorRepository");
const quotationRepository_1 = require("@modules/quotation/quotationRepository");
exports.colorService = {
    findAll: (companyId_1, ...args_1) => __awaiter(void 0, [companyId_1, ...args_1], void 0, function* (companyId, page = 1, pageSize = 12, searchText = "") {
        try {
            const skip = (page - 1) * pageSize;
            const color = yield colorRepository_1.colorRepository.findAll(companyId, skip, pageSize, searchText);
            const totalCount = yield colorRepository_1.colorRepository.count(companyId, searchText);
            return new serviceResponse_1.ServiceResponse(serviceResponse_1.ResponseStatus.Success, "Get all success", {
                data: color,
                totalCount,
                totalPages: Math.ceil(totalCount / pageSize),
            }, http_status_codes_1.StatusCodes.OK);
        }
        catch (error) {
            return new serviceResponse_1.ServiceResponse(serviceResponse_1.ResponseStatus.Failed, "Error fetching color", null, http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR);
        }
    }),
    create: (companyId, userId, payload) => __awaiter(void 0, void 0, void 0, function* () {
        const color_name = payload.color_name.trim();
        if (!color_name) {
            return new serviceResponse_1.ServiceResponse(serviceResponse_1.ResponseStatus.Failed, "Color name is required", null, http_status_codes_1.StatusCodes.BAD_REQUEST);
        }
        // ตรวจสอบว่า companyId มีค่า ถ้าไม่มีก็จะบังคับให้ต้องมีค่า
        if (!companyId) {
            return new serviceResponse_1.ServiceResponse(serviceResponse_1.ResponseStatus.Failed, "Company ID is required", null, http_status_codes_1.StatusCodes.BAD_REQUEST);
        }
        const checkColor = yield colorRepository_1.colorRepository.findByName(companyId, color_name);
        if (checkColor) {
            return new serviceResponse_1.ServiceResponse(serviceResponse_1.ResponseStatus.Failed, "Color already exists", null, http_status_codes_1.StatusCodes.BAD_REQUEST);
        }
        const newColor = yield colorRepository_1.colorRepository.create(companyId, userId, payload);
        return new serviceResponse_1.ServiceResponse(serviceResponse_1.ResponseStatus.Success, "Success", newColor, http_status_codes_1.StatusCodes.OK);
    }),
    findAllNoPagination: (companyId) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const customer = yield colorRepository_1.colorRepository.findAllNoPagination(companyId);
            return new serviceResponse_1.ServiceResponse(serviceResponse_1.ResponseStatus.Success, "Get all success", customer, http_status_codes_1.StatusCodes.OK);
        }
        catch (error) {
            return new serviceResponse_1.ServiceResponse(serviceResponse_1.ResponseStatus.Failed, "Error fetching brand", null, http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR);
        }
    }),
    update: (color_id, payload, companyId, userId) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const checkColor = yield colorRepository_1.colorRepository.findById(companyId, color_id);
            if (!checkColor) {
                return new serviceResponse_1.ServiceResponse(serviceResponse_1.ResponseStatus.Failed, "not found color", null, http_status_codes_1.StatusCodes.BAD_REQUEST);
            }
            const checkGroup = yield colorRepository_1.colorRepository.findByName(companyId, payload.color_name);
            if (checkGroup) {
                return new serviceResponse_1.ServiceResponse(serviceResponse_1.ResponseStatus.Failed, "Group repair already taken", null, http_status_codes_1.StatusCodes.BAD_REQUEST);
            }
            const group = yield colorRepository_1.colorRepository.update(companyId, userId, color_id, payload);
            return new serviceResponse_1.ServiceResponse(serviceResponse_1.ResponseStatus.Success, "Success", group, http_status_codes_1.StatusCodes.OK);
        }
        catch (ex) {
            const errorMessage = "Error update color : " + ex.message;
            return new serviceResponse_1.ServiceResponse(serviceResponse_1.ResponseStatus.Failed, errorMessage, null, http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR);
        }
    }),
    delete: (companyId, color_id) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            // ตรวจสอบว่า color_id กับ company_id ถูกส่งมาหรือไม่
            if (!companyId || !color_id) {
                return new serviceResponse_1.ServiceResponse(serviceResponse_1.ResponseStatus.Failed, "company_id and color_id are required", null, http_status_codes_1.StatusCodes.BAD_REQUEST);
            }
            // ตรวจสอบว่ามีสีที่ตรงกับ company_id และ color_id หรือไม่
            const colorToDelete = yield colorRepository_1.colorRepository.findById(companyId, color_id);
            if (!colorToDelete) {
                return new serviceResponse_1.ServiceResponse(serviceResponse_1.ResponseStatus.Failed, "Color not found", null, http_status_codes_1.StatusCodes.NOT_FOUND);
            }
            const checkColorinQuotation = yield quotationRepository_1.quotationRepository.checkQuotation(companyId, "car_color_id", color_id);
            if (checkColorinQuotation)
                return new serviceResponse_1.ServiceResponse(serviceResponse_1.ResponseStatus.Failed, "Color in quotation", null, http_status_codes_1.StatusCodes.BAD_REQUEST);
            // ดำเนินการลบสี
            yield colorRepository_1.colorRepository.delete(companyId, color_id);
            return new serviceResponse_1.ServiceResponse(serviceResponse_1.ResponseStatus.Success, "Delete color success", "Delete color success", http_status_codes_1.StatusCodes.OK);
        }
        catch (ex) {
            const errorMessage = "Error delete color: " + ex.message;
            return new serviceResponse_1.ServiceResponse(serviceResponse_1.ResponseStatus.Failed, errorMessage, null, http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR);
        }
    }),
    search: (query, companyId) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const color = yield colorRepository_1.colorRepository.search(query, companyId);
            return new serviceResponse_1.ServiceResponse(serviceResponse_1.ResponseStatus.Success, "Search successful", color, http_status_codes_1.StatusCodes.OK);
        }
        catch (ex) {
            const errorMessage = "Error searching color: " + ex.message;
            return new serviceResponse_1.ServiceResponse(serviceResponse_1.ResponseStatus.Failed, errorMessage, null, http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR);
        }
    }),
    select: (companyId_1, ...args_1) => __awaiter(void 0, [companyId_1, ...args_1], void 0, function* (companyId, searchText = "") {
        try {
            const data = yield colorRepository_1.colorRepository.select(companyId, searchText);
            return new serviceResponse_1.ServiceResponse(serviceResponse_1.ResponseStatus.Success, "Select success", { data }, http_status_codes_1.StatusCodes.OK);
        }
        catch (error) {
            return new serviceResponse_1.ServiceResponse(serviceResponse_1.ResponseStatus.Failed, "Error fetching select", null, http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR);
        }
    }),
};
