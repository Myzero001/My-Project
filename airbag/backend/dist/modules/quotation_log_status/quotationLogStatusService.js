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
exports.quotationLogStatusService = void 0;
const http_status_codes_1 = require("http-status-codes");
const serviceResponse_1 = require("@common/models/serviceResponse");
const quotationLogStatusRepository_1 = require("./quotationLogStatusRepository");
exports.quotationLogStatusService = {
    // ดึงข้อมูลทั้งหมดพร้อม Pagination
    findAll: (company_id) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const quotations = yield quotationLogStatusRepository_1.quotationLogStatusRepository.findAll(company_id); // ดึงข้อมูล
            const totalCount = yield quotationLogStatusRepository_1.quotationLogStatusRepository.count(company_id); // นับจำนวนทั้งหมด
            return new serviceResponse_1.ServiceResponse(serviceResponse_1.ResponseStatus.Success, "Get all success", {
                data: quotations,
                totalCount, // จำนวนข้อมูลทั้งหมด
            }, http_status_codes_1.StatusCodes.OK);
        }
        catch (error) {
            return new serviceResponse_1.ServiceResponse(serviceResponse_1.ResponseStatus.Failed, "Error fetching quotations", null, http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR);
        }
    }),
    findByQuotationId: (id, company_id) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const quotationLogStatus = yield quotationLogStatusRepository_1.quotationLogStatusRepository.findByQuotationId(id, company_id);
            return new serviceResponse_1.ServiceResponse(serviceResponse_1.ResponseStatus.Success, "Quotation Log Status found", quotationLogStatus, http_status_codes_1.StatusCodes.OK);
        }
        catch (ex) {
            const errorMessage = `Error fetching quotation: ${ex.message}`;
            return new serviceResponse_1.ServiceResponse(serviceResponse_1.ResponseStatus.Failed, errorMessage, null, http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR);
        }
    }),
};
