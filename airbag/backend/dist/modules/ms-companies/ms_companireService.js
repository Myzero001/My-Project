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
exports.CompaniesService = void 0;
const http_status_codes_1 = require("http-status-codes");
const serviceResponse_1 = require("@common/models/serviceResponse");
const ms_companiesRepository_1 = require("@modules/ms-companies/ms_companiesRepository");
exports.CompaniesService = {
    findAll: (companyId_1, ...args_1) => __awaiter(void 0, [companyId_1, ...args_1], void 0, function* (companyId, page = 1, pageSize = 12, searchText = "") {
        try {
            const skip = (page - 1) * pageSize;
            const companies = yield ms_companiesRepository_1.companiesRepository.findAll(companyId, skip, pageSize, searchText);
            const totalCount = yield ms_companiesRepository_1.companiesRepository.count(companyId, searchText);
            return new serviceResponse_1.ServiceResponse(serviceResponse_1.ResponseStatus.Success, "Get all success", {
                data: companies,
                totalCount,
                totalPages: Math.ceil(totalCount / pageSize),
            }, http_status_codes_1.StatusCodes.OK);
        }
        catch (error) {
            return new serviceResponse_1.ServiceResponse(serviceResponse_1.ResponseStatus.Failed, "Error fetching companies", null, http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR);
        }
    }),
    //payload, uuid, companyId
    create: (companyId, userId, payload) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const createCompany = yield ms_companiesRepository_1.companiesRepository.create(companyId, userId, payload);
            return new serviceResponse_1.ServiceResponse(serviceResponse_1.ResponseStatus.Success, "Create company success", createCompany, http_status_codes_1.StatusCodes.OK);
        }
        catch (ex) {
            const errorMessage = "Error create company: " + ex.message;
            return new serviceResponse_1.ServiceResponse(serviceResponse_1.ResponseStatus.Failed, errorMessage, null, http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR);
        }
    }),
    update: (company_id, userId, payload) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const checkCompany = yield ms_companiesRepository_1.companiesRepository.findById(company_id);
            if (!checkCompany) {
                return new serviceResponse_1.ServiceResponse(serviceResponse_1.ResponseStatus.Failed, "Company not found", null, http_status_codes_1.StatusCodes.BAD_REQUEST);
            }
            const updateCompany = yield ms_companiesRepository_1.companiesRepository.update(company_id, userId, payload);
            return new serviceResponse_1.ServiceResponse(serviceResponse_1.ResponseStatus.Success, "Update company success", updateCompany, http_status_codes_1.StatusCodes.OK);
        }
        catch (ex) {
            const errorMessage = "Error update company: " + ex.message;
            return new serviceResponse_1.ServiceResponse(serviceResponse_1.ResponseStatus.Failed, errorMessage, null, http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR);
        }
    }),
    delete: (userId, company_id) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const companies = yield ms_companiesRepository_1.companiesRepository.findById(company_id);
            if (!companies) {
                return new serviceResponse_1.ServiceResponse(serviceResponse_1.ResponseStatus.Failed, "Company not found", null, http_status_codes_1.StatusCodes.NOT_FOUND);
            }
            yield ms_companiesRepository_1.companiesRepository.delete(company_id);
            return new serviceResponse_1.ServiceResponse(serviceResponse_1.ResponseStatus.Success, "Delete company success", "Delete company success", http_status_codes_1.StatusCodes.OK);
        }
        catch (ex) {
            const errorMessage = "Error delete company: " + ex.message;
            return new serviceResponse_1.ServiceResponse(serviceResponse_1.ResponseStatus.Failed, errorMessage, null, http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR);
        }
    }),
    findById: (companyId) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const customer = yield ms_companiesRepository_1.companiesRepository.findById(companyId);
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
};
