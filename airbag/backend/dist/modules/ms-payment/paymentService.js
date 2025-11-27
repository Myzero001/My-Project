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
exports.paymentService = void 0;
const http_status_codes_1 = require("http-status-codes");
const serviceResponse_1 = require("@common/models/serviceResponse");
const fileService_1 = require("@modules/file/fileService");
const paymentRepository_1 = require("./paymentRepository");
const paymentModel_1 = require("./paymentModel");
const deliveryScheduleRepository_1 = require("@modules/ms-delivery-shedule/deliveryScheduleRepository");
const generatePayment_1 = require("@common/utils/generatePayment");
exports.paymentService = {
    findAll: (companyId_1, ...args_1) => __awaiter(void 0, [companyId_1, ...args_1], void 0, function* (companyId, page = 1, pageSize = 12, searchText = "", status = "all") {
        try {
            const skip = (page - 1) * pageSize;
            const receipts = yield paymentRepository_1.paymentRepository.findAll(companyId, skip, pageSize, searchText, status);
            const totalCount = yield paymentRepository_1.paymentRepository.count(companyId, searchText, status);
            return new serviceResponse_1.ServiceResponse(serviceResponse_1.ResponseStatus.Success, "Get all success", {
                data: receipts,
                totalCount,
                totalPages: Math.ceil(totalCount / pageSize),
            }, http_status_codes_1.StatusCodes.OK);
        }
        catch (error) {
            return new serviceResponse_1.ServiceResponse(serviceResponse_1.ResponseStatus.Failed, "Error fetching payment ", null, http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR);
        }
    }),
    findAllNoPagination: (company_id) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const customer = yield paymentRepository_1.paymentRepository.findAllNoPagination(company_id);
            return new serviceResponse_1.ServiceResponse(serviceResponse_1.ResponseStatus.Success, "Get all success", customer, http_status_codes_1.StatusCodes.OK);
        }
        catch (error) {
            return new serviceResponse_1.ServiceResponse(serviceResponse_1.ResponseStatus.Failed, "Error fetching payment", null, http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR);
        }
    }),
    create: (payload, userId, company_id) => __awaiter(void 0, void 0, void 0, function* () {
        var _a;
        try {
            const responseDeliveryScheduleById = yield deliveryScheduleRepository_1.deliveryScheduleRepository.findAllById(payload.delivery_schedule_id);
            if (responseDeliveryScheduleById === null || responseDeliveryScheduleById === void 0 ? void 0 : responseDeliveryScheduleById.master_repair_receipt.id) {
                const responsePaymentRepository = yield paymentRepository_1.paymentRepository.findAllByRepairReceiptId(responseDeliveryScheduleById.master_repair_receipt.id);
                const totalPriceReceipt = responsePaymentRepository.reduce((sum, item) => sum + item.price, 0);
                const totalPriceAll = (_a = responseDeliveryScheduleById.master_repair_receipt.total_price) !== null && _a !== void 0 ? _a : 0;
                if (payload.price > totalPriceAll - totalPriceReceipt ||
                    totalPriceAll - totalPriceReceipt === 0) {
                    return new serviceResponse_1.ServiceResponse(serviceResponse_1.ResponseStatus.Failed, `ยอดคงเหลือที่ต้องชำระคือ ${(totalPriceAll - totalPriceReceipt).toLocaleString()} บาท ไม่สามารถรับชำระเกินจำนวนนี้ได้`, null, http_status_codes_1.StatusCodes.BAD_REQUEST);
                }
            }
            // payload.payment_doc = "PM20240507001";
            payload.payment_doc = yield (0, generatePayment_1.generatePaymentDoc)();
            payload.company_id = company_id;
            payload.created_by = userId;
            payload.updated_by = userId;
            payload.status = paymentModel_1.PAYMENT_STATUS.OVERDUE;
            // สร้างข้อมูลใหม่
            const response = yield paymentRepository_1.paymentRepository.create(payload);
            return new serviceResponse_1.ServiceResponse(serviceResponse_1.ResponseStatus.Success, "Create payment success", response, http_status_codes_1.StatusCodes.OK);
        }
        catch (ex) {
            const errorMessage = `Error creating payment: ${ex.message}`;
            return new serviceResponse_1.ServiceResponse(serviceResponse_1.ResponseStatus.Failed, errorMessage, null, http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR);
        }
    }),
    update: (id, payload, userId) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const response = yield paymentRepository_1.paymentRepository.findById(id);
            if (!response) {
                return new serviceResponse_1.ServiceResponse(serviceResponse_1.ResponseStatus.Failed, "payment not found", null, http_status_codes_1.StatusCodes.BAD_REQUEST);
            }
            payload.updated_by = userId;
            // อัปเดตข้อมูล
            const updatedPayment = yield paymentRepository_1.paymentRepository.update(id, payload);
            return new serviceResponse_1.ServiceResponse(serviceResponse_1.ResponseStatus.Success, "Update payment success", updatedPayment, http_status_codes_1.StatusCodes.OK);
        }
        catch (ex) {
            const errorMessage = `Error updating payment: ${ex.message}`;
            return new serviceResponse_1.ServiceResponse(serviceResponse_1.ResponseStatus.Failed, errorMessage, null, http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR);
        }
    }),
    delete: (id) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const response = yield paymentRepository_1.paymentRepository.findById(id);
            if (!response) {
                return new serviceResponse_1.ServiceResponse(serviceResponse_1.ResponseStatus.Failed, "payment not found", null, http_status_codes_1.StatusCodes.BAD_REQUEST);
            }
            // ลบข้อมูล
            yield paymentRepository_1.paymentRepository.delete(id);
            if (response.payment_image_url) {
                yield fileService_1.fileService.delete(response.payment_image_url);
            }
            return new serviceResponse_1.ServiceResponse(serviceResponse_1.ResponseStatus.Success, "Delete payment success", "payment deleted successfully", http_status_codes_1.StatusCodes.OK);
        }
        catch (ex) {
            const errorMessage = `Error deleting payment: ${ex.message}`;
            return new serviceResponse_1.ServiceResponse(serviceResponse_1.ResponseStatus.Failed, errorMessage, null, http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR);
        }
    }),
    findById: (id) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const response = yield deliveryScheduleRepository_1.deliveryScheduleRepository.findById(id);
            if (!response) {
                return new serviceResponse_1.ServiceResponse(serviceResponse_1.ResponseStatus.Failed, "payment not found", null, http_status_codes_1.StatusCodes.BAD_REQUEST);
            }
            return new serviceResponse_1.ServiceResponse(serviceResponse_1.ResponseStatus.Success, "payment found", response, http_status_codes_1.StatusCodes.OK);
        }
        catch (ex) {
            const errorMessage = `Error fetching payment: ${ex.message}`;
            return new serviceResponse_1.ServiceResponse(serviceResponse_1.ResponseStatus.Failed, errorMessage, null, http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR);
        }
    }),
    findAllById: (id) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const response = yield paymentRepository_1.paymentRepository.findAllById(id);
            if (!response) {
                return new serviceResponse_1.ServiceResponse(serviceResponse_1.ResponseStatus.Failed, "payment not found", null, http_status_codes_1.StatusCodes.BAD_REQUEST);
            }
            return new serviceResponse_1.ServiceResponse(serviceResponse_1.ResponseStatus.Success, "payment found", response, http_status_codes_1.StatusCodes.OK);
        }
        catch (ex) {
            const errorMessage = `Error fetching payment: ${ex.message}`;
            return new serviceResponse_1.ServiceResponse(serviceResponse_1.ResponseStatus.Failed, errorMessage, null, http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR);
        }
    }),
    findAllByRepairReceiptId: (repairReceiptId) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const response = yield paymentRepository_1.paymentRepository.findAllByRepairReceiptId(repairReceiptId);
            if (!response) {
                return new serviceResponse_1.ServiceResponse(serviceResponse_1.ResponseStatus.Failed, "payment not found", null, http_status_codes_1.StatusCodes.BAD_REQUEST);
            }
            return new serviceResponse_1.ServiceResponse(serviceResponse_1.ResponseStatus.Success, "payment found", response, http_status_codes_1.StatusCodes.OK);
        }
        catch (ex) {
            const errorMessage = `Error fetching payment: ${ex.message}`;
            return new serviceResponse_1.ServiceResponse(serviceResponse_1.ResponseStatus.Failed, errorMessage, null, http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR);
        }
    }),
};
