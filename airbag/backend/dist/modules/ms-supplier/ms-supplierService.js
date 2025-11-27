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
exports.supplierService = void 0;
const http_status_codes_1 = require("http-status-codes");
const serviceResponse_1 = require("@common/models/serviceResponse");
const ms_supplierRepository_1 = require("@modules/ms-supplier/ms-supplierRepository");
exports.supplierService = {
    findAll: (companyId_1, ...args_1) => __awaiter(void 0, [companyId_1, ...args_1], void 0, function* (companyId, page = 1, pageSize = 12, searchText = "") {
        try {
            const skip = (page - 1) * pageSize;
            const supplier = yield ms_supplierRepository_1.msSupplierRepository.findAll(companyId, skip, pageSize, searchText);
            if (!supplier) {
                return new serviceResponse_1.ServiceResponse(serviceResponse_1.ResponseStatus.Failed, "No suppliers found", null, http_status_codes_1.StatusCodes.NOT_FOUND);
            }
            const totalCount = yield ms_supplierRepository_1.msSupplierRepository.count(companyId, searchText);
            return new serviceResponse_1.ServiceResponse(serviceResponse_1.ResponseStatus.Success, "Get all success", {
                data: supplier,
                totalCount,
                totalPages: Math.ceil(totalCount / pageSize),
            }, http_status_codes_1.StatusCodes.OK);
        }
        catch (_a) {
            return new serviceResponse_1.ServiceResponse(serviceResponse_1.ResponseStatus.Failed, "Error fetching suppliers", null, http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR);
        }
    }),
    create: (companyId, userId, payload) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const supplier = yield ms_supplierRepository_1.msSupplierRepository.findByName(companyId, payload.supplier_code);
            if (supplier) {
                return new serviceResponse_1.ServiceResponse(serviceResponse_1.ResponseStatus.Failed, "Supplier already exists", null, http_status_codes_1.StatusCodes.BAD_REQUEST);
            }
            const newSupplier = yield ms_supplierRepository_1.msSupplierRepository.create(companyId, userId, payload);
            return new serviceResponse_1.ServiceResponse(serviceResponse_1.ResponseStatus.Success, "Create supplier success", newSupplier, http_status_codes_1.StatusCodes.OK);
        }
        catch (ex) {
            const errorMessage = "Error create supplier: " + ex.message;
            return new serviceResponse_1.ServiceResponse(serviceResponse_1.ResponseStatus.Failed, errorMessage, null, http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR);
        }
    }),
    update: (companyId, userId, supplier_id, payload) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const supplier = yield ms_supplierRepository_1.msSupplierRepository.findByIdAsync(companyId, supplier_id);
            if (!supplier) {
                return new serviceResponse_1.ServiceResponse(serviceResponse_1.ResponseStatus.Failed, "Supplier not found", null, http_status_codes_1.StatusCodes.BAD_REQUEST);
            }
            const updatedSupplier = yield ms_supplierRepository_1.msSupplierRepository.update(companyId, userId, supplier_id, payload);
            return new serviceResponse_1.ServiceResponse(serviceResponse_1.ResponseStatus.Success, "Update supplier success", "Update supplier success", http_status_codes_1.StatusCodes.OK);
        }
        catch (ex) {
            const errorMessage = "Error update supplier: " + ex.message;
            return new serviceResponse_1.ServiceResponse(serviceResponse_1.ResponseStatus.Failed, errorMessage, null, http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR);
        }
    }),
    delete: (companyId, supplier_id) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const supplier = yield ms_supplierRepository_1.msSupplierRepository.findByIdAsync(companyId, supplier_id);
            if (!supplier) {
                return new serviceResponse_1.ServiceResponse(serviceResponse_1.ResponseStatus.Failed, "Supplier not found", null, http_status_codes_1.StatusCodes.BAD_REQUEST);
            }
            yield ms_supplierRepository_1.msSupplierRepository.delete(companyId, supplier_id);
            return new serviceResponse_1.ServiceResponse(serviceResponse_1.ResponseStatus.Success, "Delete supplier success", "Delete supplier success", http_status_codes_1.StatusCodes.OK);
        }
        catch (ex) {
            const errorMessage = "Error delete supplier: " + ex.message;
            return new serviceResponse_1.ServiceResponse(serviceResponse_1.ResponseStatus.Failed, errorMessage, null, http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR);
        }
    }),
    findOne: (companyId, supplier_id) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const supplier = yield ms_supplierRepository_1.msSupplierRepository.findByIdAsync(companyId, supplier_id);
            if (!supplier) {
                return new serviceResponse_1.ServiceResponse(serviceResponse_1.ResponseStatus.Failed, "Supplier not found", null, http_status_codes_1.StatusCodes.BAD_REQUEST);
            }
            return new serviceResponse_1.ServiceResponse(serviceResponse_1.ResponseStatus.Success, "Get supplier success", supplier, http_status_codes_1.StatusCodes.OK);
        }
        catch (ex) {
            const errorMessage = "Error get supplier: " + ex.message;
            return new serviceResponse_1.ServiceResponse(serviceResponse_1.ResponseStatus.Failed, errorMessage, null, http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR);
        }
    }),
    findAllNoPagination: (companyId) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const res = yield ms_supplierRepository_1.msSupplierRepository.findAllNoPagination(companyId);
            return new serviceResponse_1.ServiceResponse(serviceResponse_1.ResponseStatus.Success, "Get all success", res, http_status_codes_1.StatusCodes.OK);
        }
        catch (error) {
            return new serviceResponse_1.ServiceResponse(serviceResponse_1.ResponseStatus.Failed, "Error fetching suppliers", null, http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR);
        }
    }),
    select: (companyId_1, ...args_1) => __awaiter(void 0, [companyId_1, ...args_1], void 0, function* (companyId, searchText = "") {
        try {
            const data = yield ms_supplierRepository_1.msSupplierRepository.select(companyId, searchText);
            return new serviceResponse_1.ServiceResponse(serviceResponse_1.ResponseStatus.Success, "Select success", { data }, http_status_codes_1.StatusCodes.OK);
        }
        catch (error) {
            return new serviceResponse_1.ServiceResponse(serviceResponse_1.ResponseStatus.Failed, "Error fetching select", null, http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR);
        }
    }),
};
