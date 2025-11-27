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
exports.dashboardCQService = void 0;
// ms_positionService.ts
const http_status_codes_1 = require("http-status-codes");
const serviceResponse_1 = require("@common/models/serviceResponse");
const dashboardCQRepository_1 = require("./dashboardCQRepository");
exports.dashboardCQService = {
    getTopTenCustomer: (companyId) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const customer = yield dashboardCQRepository_1.dashboardCQRepository.findTopTenCustomer(companyId);
            return new serviceResponse_1.ServiceResponse(serviceResponse_1.ResponseStatus.Success, "Get all success", customer, http_status_codes_1.StatusCodes.OK);
        }
        catch (error) {
            return new serviceResponse_1.ServiceResponse(serviceResponse_1.ResponseStatus.Failed, "Error fetching customer", null, http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR);
        }
    }),
    getTotalAmount: (companyId) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const total = yield dashboardCQRepository_1.dashboardCQRepository.findTotalAmount(companyId);
            return new serviceResponse_1.ServiceResponse(serviceResponse_1.ResponseStatus.Success, "Get all success", total, http_status_codes_1.StatusCodes.OK);
        }
        catch (error) {
            return new serviceResponse_1.ServiceResponse(serviceResponse_1.ResponseStatus.Failed, "Error fetching total amount", null, http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR);
        }
    }),
    getQuotationStatus: (companyId, dateRange) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const currentDate = new Date();
            let startDate = new Date(currentDate);
            // Set start date based on range
            if (dateRange) {
                switch (dateRange) {
                    case '15days':
                        startDate.setDate(currentDate.getDate() - 15);
                        break;
                    case '1month':
                        startDate.setMonth(currentDate.getMonth() - 1);
                        break;
                    case '3months':
                        startDate.setMonth(currentDate.getMonth() - 3);
                        break;
                    case '6months':
                        startDate.setMonth(currentDate.getMonth() - 6);
                        break;
                    case '1year':
                        startDate.setFullYear(currentDate.getFullYear() - 1);
                        break;
                    case 'all':
                        startDate = null;
                        break;
                    default:
                        startDate.setMonth(currentDate.getMonth() - 1);
                }
            }
            else {
                startDate.setMonth(currentDate.getMonth() - 1);
            }
            // 🛠 แปลง Date เป็น string หรือ undefined ก่อนส่งเข้า repository
            const formattedStartDate = startDate ? startDate.toISOString() : undefined;
            const status = yield dashboardCQRepository_1.dashboardCQRepository.findQuotationStatus(companyId, formattedStartDate);
            return new serviceResponse_1.ServiceResponse(serviceResponse_1.ResponseStatus.Success, "Get all success", status, http_status_codes_1.StatusCodes.OK);
        }
        catch (error) {
            return new serviceResponse_1.ServiceResponse(serviceResponse_1.ResponseStatus.Failed, "Error fetching status", null, http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR);
        }
    }),
    getTopTenSale: (companyId) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const sale = yield dashboardCQRepository_1.dashboardCQRepository.findTopTenSale(companyId);
            return new serviceResponse_1.ServiceResponse(serviceResponse_1.ResponseStatus.Success, "Get all success", sale, http_status_codes_1.StatusCodes.OK);
        }
        catch (error) {
            return new serviceResponse_1.ServiceResponse(serviceResponse_1.ResponseStatus.Failed, "Error fetching sale", null, http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR);
        }
    }),
    getQuotationSummary: (companyId, dateRange, groupBy) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const currentDate = new Date();
            let startDate = new Date(currentDate);
            let groupBy = 'day';
            if (dateRange) {
                switch (dateRange) {
                    case '7days':
                    case '15days':
                    case '1month':
                        groupBy = 'day';
                        if (dateRange === '7days')
                            startDate.setDate(currentDate.getDate() - 7);
                        if (dateRange === '15days')
                            startDate.setDate(currentDate.getDate() - 15);
                        if (dateRange === '1month')
                            startDate.setMonth(currentDate.getMonth() - 1);
                        break;
                    case '3months':
                    case '6months':
                        groupBy = 'week';
                        if (dateRange === '3months')
                            startDate.setMonth(currentDate.getMonth() - 3);
                        if (dateRange === '6months')
                            startDate.setMonth(currentDate.getMonth() - 6);
                        break;
                    case '1year':
                    case '3years':
                        groupBy = 'month';
                        if (dateRange === '1year')
                            startDate.setFullYear(currentDate.getFullYear() - 1);
                        if (dateRange === '3years')
                            startDate.setFullYear(currentDate.getFullYear() - 3);
                        break;
                    case 'all':
                        groupBy = 'year';
                        // startDate = new Date(currentDate);
                        // startDate.setFullYear(currentDate.getFullYear() - 10);
                        startDate = null;
                        break;
                    default:
                        groupBy = 'day';
                        startDate.setMonth(currentDate.getMonth() - 1);
                }
            }
            else {
                startDate.setMonth(currentDate.getMonth() - 1);
                groupBy = 'day';
            }
            const formattedStartDate = startDate ? startDate.toISOString() : undefined;
            const QuotationSummary = yield dashboardCQRepository_1.dashboardCQRepository.findQuotationSummary(companyId, formattedStartDate, groupBy);
            return new serviceResponse_1.ServiceResponse(serviceResponse_1.ResponseStatus.Success, "Get all success", QuotationSummary, http_status_codes_1.StatusCodes.OK);
        }
        catch (ex) {
            const errorMessage = "Error fetching Quotation Summary: " + ex.message;
            return new serviceResponse_1.ServiceResponse(serviceResponse_1.ResponseStatus.Failed, "Error fetching Quotation Summary", errorMessage, http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR);
        }
    }),
};
