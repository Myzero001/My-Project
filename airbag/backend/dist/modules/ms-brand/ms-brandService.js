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
exports.brandService = void 0;
const http_status_codes_1 = require("http-status-codes");
const serviceResponse_1 = require("@common/models/serviceResponse");
const ms_brandRepository_1 = require("@modules/ms-brand/ms-brandRepository");
exports.brandService = {
    findAll: (companyId_1, ...args_1) => __awaiter(void 0, [companyId_1, ...args_1], void 0, function* (companyId, page = 1, pageSize = 12, searchText = "") {
        try {
            const skip = (page - 1) * pageSize;
            const group = yield ms_brandRepository_1.brandRepository.findAll(companyId, skip, pageSize, searchText);
            const totalCount = yield ms_brandRepository_1.brandRepository.count(companyId, searchText);
            return new serviceResponse_1.ServiceResponse(serviceResponse_1.ResponseStatus.Success, "Get all success", {
                data: group,
                totalCount,
                totalPages: Math.ceil(totalCount / pageSize),
            }, http_status_codes_1.StatusCodes.OK);
        }
        catch (error) {
            return new serviceResponse_1.ServiceResponse(serviceResponse_1.ResponseStatus.Failed, "Error fetching brands", null, http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR);
        }
    }),
    findAllNoPagination: (companyId) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const customer = yield ms_brandRepository_1.brandRepository.findAllNoPagination(companyId);
            return new serviceResponse_1.ServiceResponse(serviceResponse_1.ResponseStatus.Success, "Get all success", customer, http_status_codes_1.StatusCodes.OK);
        }
        catch (error) {
            return new serviceResponse_1.ServiceResponse(serviceResponse_1.ResponseStatus.Failed, "Error fetching brand", null, http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR);
        }
    }),
    create: (companyId, userId, payload) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const checkBrand = yield ms_brandRepository_1.brandRepository.findByName(companyId, payload.brand_name);
            if (checkBrand) {
                return new serviceResponse_1.ServiceResponse(serviceResponse_1.ResponseStatus.Failed, "Brand already taken", null, http_status_codes_1.StatusCodes.BAD_REQUEST);
            }
            const brand = yield ms_brandRepository_1.brandRepository.create(companyId, userId, payload);
            return new serviceResponse_1.ServiceResponse(serviceResponse_1.ResponseStatus.Success, "Create brand success", brand, // ส่งเฉพาะ brand_name, updated_at, updated_by
            http_status_codes_1.StatusCodes.OK);
        }
        catch (ex) {
            const errorMessage = "Error create brand: " + ex.message;
            return new serviceResponse_1.ServiceResponse(serviceResponse_1.ResponseStatus.Failed, errorMessage, null, http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR);
        }
    }),
    update: (companyId, userId, master_brand_id, payload) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const checkBrandId = yield ms_brandRepository_1.brandRepository.findByIdAsync(companyId, master_brand_id);
            if (!checkBrandId) {
                return new serviceResponse_1.ServiceResponse(serviceResponse_1.ResponseStatus.Failed, "Brand not found", null, http_status_codes_1.StatusCodes.BAD_REQUEST);
            }
            const checkBrand = yield ms_brandRepository_1.brandRepository.findByName(companyId, payload.brand_name);
            if (checkBrand) {
                return new serviceResponse_1.ServiceResponse(serviceResponse_1.ResponseStatus.Failed, "Brand already taken", null, http_status_codes_1.StatusCodes.BAD_REQUEST);
            }
            const brand = yield ms_brandRepository_1.brandRepository.update(companyId, userId, master_brand_id, payload);
            return new serviceResponse_1.ServiceResponse(serviceResponse_1.ResponseStatus.Success, "Brand updated successfully", brand, // ส่งเฉพาะ brand_name, updated_at, updated_by
            http_status_codes_1.StatusCodes.OK);
        }
        catch (ex) {
            const errorMessage = "Error update brand: " + ex.message;
            return new serviceResponse_1.ServiceResponse(serviceResponse_1.ResponseStatus.Failed, errorMessage, null, http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR);
        }
    }),
    delete: (companyId, master_brand_id) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const checkBrand = yield ms_brandRepository_1.brandRepository.findByIdAsync(companyId, master_brand_id);
            if (!checkBrand) {
                return new serviceResponse_1.ServiceResponse(serviceResponse_1.ResponseStatus.Failed, "Brand not found", null, http_status_codes_1.StatusCodes.BAD_REQUEST);
            }
            const checkBarndModelInBrand = yield ms_brandRepository_1.brandRepository.checkBarndModelInBrand(companyId, master_brand_id);
            if (checkBarndModelInBrand) {
                return new serviceResponse_1.ServiceResponse(serviceResponse_1.ResponseStatus.Failed, "Brand model in brand", null, http_status_codes_1.StatusCodes.BAD_REQUEST);
            }
            yield ms_brandRepository_1.brandRepository.delete(companyId, master_brand_id);
            return new serviceResponse_1.ServiceResponse(serviceResponse_1.ResponseStatus.Success, "Delete brand success", "Delete brand success", http_status_codes_1.StatusCodes.OK);
        }
        catch (ex) {
            const errorMessage = "Error delete brand: " + ex.message;
            return new serviceResponse_1.ServiceResponse(serviceResponse_1.ResponseStatus.Failed, errorMessage, null, http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR);
        }
    }),
    findById: (companyId, master_brand_id) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const brand = yield ms_brandRepository_1.brandRepository.findByIdAsync(companyId, master_brand_id);
            if (!brand) {
                return new serviceResponse_1.ServiceResponse(serviceResponse_1.ResponseStatus.Failed, "Brand not found", null, http_status_codes_1.StatusCodes.BAD_REQUEST);
            }
            return new serviceResponse_1.ServiceResponse(serviceResponse_1.ResponseStatus.Success, "Brand found", brand, http_status_codes_1.StatusCodes.OK);
        }
        catch (ex) {
            const errorMessage = "Error get brand request: " + ex.message;
            return new serviceResponse_1.ServiceResponse(serviceResponse_1.ResponseStatus.Failed, errorMessage, null, http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR);
        }
    }),
    findMinimal: (companyId) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const brands = yield ms_brandRepository_1.brandRepository.findMinimal(companyId);
            return new serviceResponse_1.ServiceResponse(serviceResponse_1.ResponseStatus.Success, "Get minimal brand data success", brands, http_status_codes_1.StatusCodes.OK);
        }
        catch (error) {
            return new serviceResponse_1.ServiceResponse(serviceResponse_1.ResponseStatus.Failed, "Error fetching minimal brand data", null, http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR);
        }
    }),
    select: (companyId_1, ...args_1) => __awaiter(void 0, [companyId_1, ...args_1], void 0, function* (companyId, searchText = "") {
        try {
            const data = yield ms_brandRepository_1.brandRepository.select(companyId, searchText);
            return new serviceResponse_1.ServiceResponse(serviceResponse_1.ResponseStatus.Success, "Select success", { data }, http_status_codes_1.StatusCodes.OK);
        }
        catch (error) {
            return new serviceResponse_1.ServiceResponse(serviceResponse_1.ResponseStatus.Failed, "Error fetching select", null, http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR);
        }
    }),
};
