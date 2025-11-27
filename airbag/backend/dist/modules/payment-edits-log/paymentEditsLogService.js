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
exports.paymentEditsLogService = void 0;
const http_status_codes_1 = require("http-status-codes");
const serviceResponse_1 = require("@common/models/serviceResponse");
const paymentEditsLogRepository_1 = require("./paymentEditsLogRepository");
exports.paymentEditsLogService = {
    // ดึงข้อมูลทั้งหมดพร้อม Pagination
    findAll: () => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const quotations = yield paymentEditsLogRepository_1.paymentEditsLogRepository.findAll(); // ดึงข้อมูล
            const totalCount = yield paymentEditsLogRepository_1.paymentEditsLogRepository.count(); // นับจำนวนทั้งหมด
            return new serviceResponse_1.ServiceResponse(serviceResponse_1.ResponseStatus.Success, "Get all success", {
                data: quotations,
                totalCount, // จำนวนข้อมูลทั้งหมด
            }, http_status_codes_1.StatusCodes.OK);
        }
        catch (error) {
            return new serviceResponse_1.ServiceResponse(serviceResponse_1.ResponseStatus.Failed, "Error fetching ", null, http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR);
        }
    }),
    findByPaymentId: (id) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const reponse = yield paymentEditsLogRepository_1.paymentEditsLogRepository.findByPaymentId(id);
            return new serviceResponse_1.ServiceResponse(serviceResponse_1.ResponseStatus.Success, "Payment Edits Log Status found", reponse, http_status_codes_1.StatusCodes.OK);
        }
        catch (ex) {
            const errorMessage = `Error fetching Payment Edits Log: ${ex.message}`;
            return new serviceResponse_1.ServiceResponse(serviceResponse_1.ResponseStatus.Failed, errorMessage, null, http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR);
        }
    }),
};
