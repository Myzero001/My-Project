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
exports.visitCustomerService = void 0;
const http_status_codes_1 = require("http-status-codes");
const serviceResponse_1 = require("@common/models/serviceResponse");
const visitCustomerRepository_1 = require("@modules/visit-customer/visitCustomerRepository");
const generateCustomerVisitDoc_1 = require("@common/utils/generateCustomerVisitDoc");
exports.visitCustomerService = {
    findAll: (companyId_1, ...args_1) => __awaiter(void 0, [companyId_1, ...args_1], void 0, function* (companyId, page = 1, pageSize = 12, searchText = "") {
        try {
            const skip = (page - 1) * pageSize;
            const CustomerVisit = yield visitCustomerRepository_1.visitCustomerRepository.findAll(companyId, skip, pageSize, searchText);
            if (!CustomerVisit) {
                return new serviceResponse_1.ServiceResponse(serviceResponse_1.ResponseStatus.Failed, "No CustomerVisit found", null, http_status_codes_1.StatusCodes.NOT_FOUND);
            }
            const totalCount = yield visitCustomerRepository_1.visitCustomerRepository.count(companyId, searchText);
            return new serviceResponse_1.ServiceResponse(serviceResponse_1.ResponseStatus.Success, "Get all success", {
                data: CustomerVisit,
                totalCount,
                totalPages: Math.ceil(totalCount / pageSize),
            }, http_status_codes_1.StatusCodes.OK);
        }
        catch (ex) {
            const errorMessage = "Error fetching CustomerVisit: " + ex.message;
            return new serviceResponse_1.ServiceResponse(serviceResponse_1.ResponseStatus.Failed, "Error fetching CustomerVisit", errorMessage, http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR);
        }
    }),
    create: (companyId, userId, payload) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            // const CustomerVisit = await visitCustomerRepository.findByName(companyId, payload.customer_code);
            // if (CustomerVisit) {
            //     return new ServiceResponse(
            //         ResponseStatus.Failed,
            //         "Customer already exists",
            //         null,
            //         StatusCodes.BAD_REQUEST
            //     )
            // }
            payload.customer_visit_doc = yield (0, generateCustomerVisitDoc_1.generateCustomerVisitDoc)(companyId);
            const newCustomerVisit = yield visitCustomerRepository_1.visitCustomerRepository.create(companyId, userId, payload);
            return new serviceResponse_1.ServiceResponse(serviceResponse_1.ResponseStatus.Success, "Create CustomerVisit success", newCustomerVisit, http_status_codes_1.StatusCodes.OK);
        }
        catch (ex) {
            const errorMessage = "Error create CustomerVisit: " + ex.message;
            return new serviceResponse_1.ServiceResponse(serviceResponse_1.ResponseStatus.Failed, errorMessage, null, http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR);
        }
    }),
    update: (companyId, userId, customer_visit_id, payload) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const visitcustomer = yield visitCustomerRepository_1.visitCustomerRepository.findByIdAsync(companyId, customer_visit_id);
            if (!visitcustomer) {
                return new serviceResponse_1.ServiceResponse(serviceResponse_1.ResponseStatus.Failed, "CustomerVisit not found", null, http_status_codes_1.StatusCodes.BAD_REQUEST);
            }
            // const checkSupplier = await msSupplierRepository.findByName(companyId, payload.supplier_code);
            // if (checkSupplier) {
            //     return new ServiceResponse(
            //         ResponseStatus.Failed,
            //         "Supplier already exists",
            //         null,
            //         StatusCodes.BAD_REQUEST
            //     )
            // }
            const updatedVisitcustomer = yield visitCustomerRepository_1.visitCustomerRepository.update(companyId, userId, customer_visit_id, payload);
            return new serviceResponse_1.ServiceResponse(serviceResponse_1.ResponseStatus.Success, "Update customer visit success", "Update customer visit success", http_status_codes_1.StatusCodes.OK);
        }
        catch (ex) {
            const errorMessage = "Error update visit customer: " + ex.message;
            return new serviceResponse_1.ServiceResponse(serviceResponse_1.ResponseStatus.Failed, errorMessage, null, http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR);
        }
    }),
    delete: (companyId, customer_visit_id) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const visitcustomer = yield visitCustomerRepository_1.visitCustomerRepository.findByIdAsync(companyId, customer_visit_id);
            if (!visitcustomer) {
                return new serviceResponse_1.ServiceResponse(serviceResponse_1.ResponseStatus.Failed, " visit customer not found", null, http_status_codes_1.StatusCodes.BAD_REQUEST);
            }
            yield visitCustomerRepository_1.visitCustomerRepository.delete(companyId, customer_visit_id);
            return new serviceResponse_1.ServiceResponse(serviceResponse_1.ResponseStatus.Success, "delete visit customer success", "delete visit customer success", http_status_codes_1.StatusCodes.OK);
        }
        catch (ex) {
            const errorMessage = "Error delete  visit customer: " + ex.message;
            return new serviceResponse_1.ServiceResponse(serviceResponse_1.ResponseStatus.Failed, errorMessage, null, http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR);
        }
    }),
    findOne: (companyId, customer_visit_id) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const visitcustomer = yield visitCustomerRepository_1.visitCustomerRepository.findByIdAsync(companyId, customer_visit_id);
            if (!visitcustomer) {
                return new serviceResponse_1.ServiceResponse(serviceResponse_1.ResponseStatus.Failed, "visit customer not found", null, http_status_codes_1.StatusCodes.BAD_REQUEST);
            }
            return new serviceResponse_1.ServiceResponse(serviceResponse_1.ResponseStatus.Success, "Get visit customer success", visitcustomer, http_status_codes_1.StatusCodes.OK);
        }
        catch (ex) {
            const errorMessage = "Error get visit customer: " + ex.message;
            return new serviceResponse_1.ServiceResponse(serviceResponse_1.ResponseStatus.Failed, errorMessage, null, http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR);
        }
    }),
};
