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
exports.CustomerService = void 0;
const http_status_codes_1 = require("http-status-codes");
const serviceResponse_1 = require("@common/models/serviceResponse");
const ms_customer_Repository_1 = require("@modules/master_customer/ms_customer-Repository");
exports.CustomerService = {
    findAll: (companyId_1, ...args_1) => __awaiter(void 0, [companyId_1, ...args_1], void 0, function* (companyId, page = 1, pageSize = 12, searchText = "") {
        try {
            const skip = (page - 1) * pageSize;
            const customer = yield ms_customer_Repository_1.customerRepository.findAll(companyId, skip, pageSize, searchText);
            const totalCount = yield ms_customer_Repository_1.customerRepository.count(companyId, searchText);
            return new serviceResponse_1.ServiceResponse(serviceResponse_1.ResponseStatus.Success, "Get all success", {
                data: customer,
                totalCount,
                totalPages: Math.ceil(totalCount / pageSize),
            }, http_status_codes_1.StatusCodes.OK);
        }
        catch (error) {
            return new serviceResponse_1.ServiceResponse(serviceResponse_1.ResponseStatus.Failed, "Error fetching customer", null, http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR);
        }
    }),
    findAllNoPagination: (companyId) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const customer = yield ms_customer_Repository_1.customerRepository.findAllNoPagination(companyId);
            return new serviceResponse_1.ServiceResponse(serviceResponse_1.ResponseStatus.Success, "Get all success", customer, http_status_codes_1.StatusCodes.OK);
        }
        catch (error) {
            return new serviceResponse_1.ServiceResponse(serviceResponse_1.ResponseStatus.Failed, "Error fetching customer", null, http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR);
        }
    }),
    select: (companyId_1, ...args_1) => __awaiter(void 0, [companyId_1, ...args_1], void 0, function* (companyId, searchText = "") {
        try {
            const data = yield ms_customer_Repository_1.customerRepository.select(companyId, searchText);
            return new serviceResponse_1.ServiceResponse(serviceResponse_1.ResponseStatus.Success, "Select success", { data }, http_status_codes_1.StatusCodes.OK);
        }
        catch (error) {
            return new serviceResponse_1.ServiceResponse(serviceResponse_1.ResponseStatus.Failed, "Error fetching select", null, http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR);
        }
    }),
    findById: (companyId, customer_id) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const customer = yield ms_customer_Repository_1.customerRepository.findById(companyId, customer_id);
            if (!customer) {
                return new serviceResponse_1.ServiceResponse(serviceResponse_1.ResponseStatus.Failed, "Customer not found", null, http_status_codes_1.StatusCodes.NOT_FOUND);
            }
            return new serviceResponse_1.ServiceResponse(serviceResponse_1.ResponseStatus.Success, "Get customer success", customer, http_status_codes_1.StatusCodes.OK);
        }
        catch (ex) {
            const errorMessage = "Error get customer: " + ex.message;
            return new serviceResponse_1.ServiceResponse(serviceResponse_1.ResponseStatus.Failed, errorMessage, null, http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR);
        }
    }),
    create: (conpanyId, userId, payload) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const checkCustomer = yield ms_customer_Repository_1.customerRepository.findByName(conpanyId, payload.customer_code);
            if (checkCustomer) {
                return new serviceResponse_1.ServiceResponse(serviceResponse_1.ResponseStatus.Failed, "Customer name already taken", null, http_status_codes_1.StatusCodes.BAD_REQUEST);
            }
            // ใช้ `customerRepository.create` เพื่อสร้างลูกค้าใหม่
            const customer = yield ms_customer_Repository_1.customerRepository.create(conpanyId, userId, payload);
            return new serviceResponse_1.ServiceResponse(serviceResponse_1.ResponseStatus.Success, "Create customer success", customer, http_status_codes_1.StatusCodes.OK);
        }
        catch (ex) {
            const errorMessage = "Error create customer: " + ex.message;
            return new serviceResponse_1.ServiceResponse(serviceResponse_1.ResponseStatus.Failed, errorMessage, null, http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR);
        }
    }),
    update: (customer_id, payload, companyId, userId) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            // ตรวจสอบว่ามี customer_code ในระบบหรือไม่
            const existingCustomer = yield ms_customer_Repository_1.customerRepository.findById(companyId, customer_id);
            if (!existingCustomer) {
                return new serviceResponse_1.ServiceResponse(serviceResponse_1.ResponseStatus.Failed, "Customer not found", null, http_status_codes_1.StatusCodes.NOT_FOUND);
            }
            const updatedCustomer = yield ms_customer_Repository_1.customerRepository.update(companyId, userId, customer_id, payload);
            return new serviceResponse_1.ServiceResponse(serviceResponse_1.ResponseStatus.Success, "Update customer success", updatedCustomer, http_status_codes_1.StatusCodes.OK);
        }
        catch (error) {
            const errorMessage = "Error updating customer: " + error.message;
            return new serviceResponse_1.ServiceResponse(serviceResponse_1.ResponseStatus.Failed, errorMessage, null, http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR);
        }
    }),
    delete: (companyId, customer_id) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            if (!customer_id) {
                return new serviceResponse_1.ServiceResponse(serviceResponse_1.ResponseStatus.Failed, "Customer ID is required", null, http_status_codes_1.StatusCodes.BAD_REQUEST);
            }
            const checkCustomer = yield ms_customer_Repository_1.customerRepository.findById(companyId, customer_id);
            if (!checkCustomer) {
                return new serviceResponse_1.ServiceResponse(serviceResponse_1.ResponseStatus.Failed, "Customer not found", null, http_status_codes_1.StatusCodes.NOT_FOUND);
            }
            const deletedCustomer = yield ms_customer_Repository_1.customerRepository.delete(companyId, customer_id);
            return new serviceResponse_1.ServiceResponse(serviceResponse_1.ResponseStatus.Success, "Delete customer success", "Delete customer success", http_status_codes_1.StatusCodes.OK);
        }
        catch (error) {
            const errorMessage = "Error deleting customer: " + error.message;
            console.error(errorMessage);
            return new serviceResponse_1.ServiceResponse(serviceResponse_1.ResponseStatus.Failed, errorMessage, null, http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR);
        }
    }),
};
