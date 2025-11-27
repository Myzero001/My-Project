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
exports.paymentEditsService = void 0;
const http_status_codes_1 = require("http-status-codes");
const serviceResponse_1 = require("@common/models/serviceResponse");
const paymentEditsRepository_1 = require("./paymentEditsRepository");
const paymentEditsModel_1 = require("./paymentEditsModel");
const paymentEditsLogRepository_1 = require("@modules/payment-edits-log/paymentEditsLogRepository");
const paymentRepository_1 = require("@modules/ms-payment/paymentRepository");
exports.paymentEditsService = {
    findAll: (companyId_1, ...args_1) => __awaiter(void 0, [companyId_1, ...args_1], void 0, function* (companyId, page = 1, pageSize = 12, searchText = "", status = "all") {
        try {
            const skip = (page - 1) * pageSize;
            const receipts = yield paymentEditsRepository_1.paymentEditsRepository.findAll(companyId, skip, pageSize, searchText, status);
            const totalCount = yield paymentEditsRepository_1.paymentEditsRepository.count(companyId, searchText, status);
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
    findAllNoPagination: () => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const customer = yield paymentEditsRepository_1.paymentEditsRepository.findAllNoPagination();
            return new serviceResponse_1.ServiceResponse(serviceResponse_1.ResponseStatus.Success, "Get all success", customer, http_status_codes_1.StatusCodes.OK);
        }
        catch (error) {
            return new serviceResponse_1.ServiceResponse(serviceResponse_1.ResponseStatus.Failed, "Error fetching payment", null, http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR);
        }
    }),
    create: (payload, userId, company_id) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            payload.company_id = company_id;
            payload.created_by = userId;
            payload.updated_by = userId;
            payload.edit_status = paymentEditsModel_1.PAYMENT_EDITS_STATUS.PENDING;
            // สร้างข้อมูลใหม่
            const response = yield paymentEditsRepository_1.paymentEditsRepository.create(payload);
            const payloadLog = {
                payment_edit_id: response.id,
                payment_id: response.payment_id,
                edit_status: paymentEditsModel_1.PAYMENT_EDITS_STATUS.PENDING,
                old_data: response.old_data,
                new_data: response.new_data,
                created_by: userId,
                updated_by: userId,
                company_id: company_id,
                remark: payload.remark,
            };
            yield paymentEditsLogRepository_1.paymentEditsLogRepository.create(payloadLog);
            return new serviceResponse_1.ServiceResponse(serviceResponse_1.ResponseStatus.Success, "Create payment edits success", response, http_status_codes_1.StatusCodes.OK);
        }
        catch (ex) {
            const errorMessage = `Error creating payment edits: ${ex.message}`;
            return new serviceResponse_1.ServiceResponse(serviceResponse_1.ResponseStatus.Failed, errorMessage, null, http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR);
        }
    }),
    update: (id, payload, userId) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const response = yield paymentEditsRepository_1.paymentEditsRepository.findByPaymentId(id);
            if (!response) {
                return new serviceResponse_1.ServiceResponse(serviceResponse_1.ResponseStatus.Failed, "payment edits not found", null, http_status_codes_1.StatusCodes.BAD_REQUEST);
            }
            payload.edit_status = paymentEditsModel_1.PAYMENT_EDITS_STATUS.PENDING;
            payload.updated_by = userId;
            // อัปเดตข้อมูล
            const updatedPayment = yield paymentEditsRepository_1.paymentEditsRepository.update(response[0].id, payload);
            const payloadLog = {
                payment_edit_id: response[0].id,
                payment_id: response[0].payment_id,
                edit_status: paymentEditsModel_1.PAYMENT_EDITS_STATUS.PENDING,
                old_data: response[0].old_data,
                new_data: response[0].new_data,
                created_by: userId,
                updated_by: userId,
                remark: payload.remark,
            };
            yield paymentEditsLogRepository_1.paymentEditsLogRepository.create(payloadLog);
            return new serviceResponse_1.ServiceResponse(serviceResponse_1.ResponseStatus.Success, "Update payment edits success", updatedPayment, http_status_codes_1.StatusCodes.OK);
        }
        catch (ex) {
            const errorMessage = `Error updating payment edits: ${ex.message}`;
            return new serviceResponse_1.ServiceResponse(serviceResponse_1.ResponseStatus.Failed, errorMessage, null, http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR);
        }
    }),
    approve: (id, payload, userId, company_id) => __awaiter(void 0, void 0, void 0, function* () {
        var _a, _b;
        payload.edit_status = paymentEditsModel_1.PAYMENT_EDITS_STATUS.APPROVED;
        payload.updated_by = userId;
        try {
            const checkPaymentEdits = yield paymentEditsRepository_1.paymentEditsRepository.findByPaymentId(id);
            if (!checkPaymentEdits) {
                return new serviceResponse_1.ServiceResponse(serviceResponse_1.ResponseStatus.Failed, "Payment Edits id not found", null, http_status_codes_1.StatusCodes.BAD_REQUEST);
            }
            // อัปเดตข้อมูล
            const updatedPaymentEdits = yield paymentEditsRepository_1.paymentEditsRepository.approve(checkPaymentEdits[0].id, payload);
            if (checkPaymentEdits[0].master_payment) {
                const payloadPayment = Object.assign(Object.assign({}, checkPaymentEdits[0].master_payment), { remark: (_a = checkPaymentEdits[0].remark) !== null && _a !== void 0 ? _a : "", company_id: (_b = checkPaymentEdits[0].company_id) !== null && _b !== void 0 ? _b : "" });
                // if (!checkPaymentEdits[0].master_payment.check_number) {
                //   payloadPayment.check_number = "";
                // }
                // if (!checkPaymentEdits[0].master_payment.bank_name) {
                //   payloadPayment.bank_name = "";
                // }
                const newData = JSON.parse(checkPaymentEdits[0].new_data);
                if (newData === null || newData === void 0 ? void 0 : newData.remark) {
                    payloadPayment.remark = newData.remark;
                }
                if (newData === null || newData === void 0 ? void 0 : newData.option_payment) {
                    payloadPayment.option_payment = newData.option_payment;
                }
                if (newData === null || newData === void 0 ? void 0 : newData.type_money) {
                    payloadPayment.type_money = newData.type_money;
                }
                if (newData === null || newData === void 0 ? void 0 : newData.price) {
                    payloadPayment.price = newData.price;
                }
                if (newData === null || newData === void 0 ? void 0 : newData.tax) {
                    payloadPayment.tax = newData.tax;
                }
                if (newData === null || newData === void 0 ? void 0 : newData.tax) {
                    payloadPayment.total_price = newData.total_price;
                }
                if (newData === null || newData === void 0 ? void 0 : newData.check_number) {
                    payloadPayment.check_number = newData.check_number;
                }
                if (newData === null || newData === void 0 ? void 0 : newData.check_date) {
                    payloadPayment.check_date = newData.check_date;
                }
                if (newData === null || newData === void 0 ? void 0 : newData.bank_name) {
                    payloadPayment.bank_name = newData.bank_name;
                }
                payload.updated_by = userId;
                // อัปเดตข้อมูล
                yield paymentRepository_1.paymentRepository.update(checkPaymentEdits[0].payment_id, payloadPayment);
            }
            const payloadLog = {
                payment_edit_id: checkPaymentEdits[0].id,
                payment_id: updatedPaymentEdits.payment_id,
                edit_status: paymentEditsModel_1.PAYMENT_EDITS_STATUS.APPROVED,
                old_data: updatedPaymentEdits.old_data,
                new_data: updatedPaymentEdits.new_data,
                created_by: userId,
                updated_by: userId,
                company_id: company_id,
                remark: payload.remark,
            };
            yield paymentEditsLogRepository_1.paymentEditsLogRepository.create(payloadLog);
            return new serviceResponse_1.ServiceResponse(serviceResponse_1.ResponseStatus.Success, "Approve payment edits success", updatedPaymentEdits, http_status_codes_1.StatusCodes.OK);
        }
        catch (ex) {
            const errorMessage = `Error approve payment edits: ${ex.message}`;
            return new serviceResponse_1.ServiceResponse(serviceResponse_1.ResponseStatus.Failed, errorMessage, null, http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR);
        }
    }),
    cancel: (id, payload, userId, company_id) => __awaiter(void 0, void 0, void 0, function* () {
        payload.edit_status = paymentEditsModel_1.PAYMENT_EDITS_STATUS.CANCELED;
        payload.updated_by = userId;
        try {
            const checkpaymentEdits = yield paymentEditsRepository_1.paymentEditsRepository.findByPaymentId(id);
            if (!checkpaymentEdits) {
                return new serviceResponse_1.ServiceResponse(serviceResponse_1.ResponseStatus.Failed, "Payment Edits id not found", null, http_status_codes_1.StatusCodes.BAD_REQUEST);
            }
            // อัปเดตข้อมูล
            const updatedPaymentEdits = yield paymentEditsRepository_1.paymentEditsRepository.cancel(checkpaymentEdits[0].id, payload);
            const payloadLog = {
                payment_edit_id: checkpaymentEdits[0].id,
                payment_id: updatedPaymentEdits.payment_id,
                edit_status: paymentEditsModel_1.PAYMENT_EDITS_STATUS.CANCELED,
                old_data: updatedPaymentEdits.old_data,
                new_data: updatedPaymentEdits.new_data,
                created_by: userId,
                updated_by: userId,
                company_id: company_id,
                remark: payload.remark,
            };
            yield paymentEditsLogRepository_1.paymentEditsLogRepository.create(payloadLog);
            return new serviceResponse_1.ServiceResponse(serviceResponse_1.ResponseStatus.Success, "Cancel payment edits success", updatedPaymentEdits, http_status_codes_1.StatusCodes.OK);
        }
        catch (ex) {
            const errorMessage = `Error cancel payment edits: ${ex.message}`;
            return new serviceResponse_1.ServiceResponse(serviceResponse_1.ResponseStatus.Failed, errorMessage, null, http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR);
        }
    }),
    reject: (id, payload, userId, company_id) => __awaiter(void 0, void 0, void 0, function* () {
        payload.edit_status = paymentEditsModel_1.PAYMENT_EDITS_STATUS.REJECTED;
        payload.updated_by = userId;
        try {
            const checkpaymentEdits = yield paymentEditsRepository_1.paymentEditsRepository.findByPaymentId(id);
            if (!checkpaymentEdits) {
                return new serviceResponse_1.ServiceResponse(serviceResponse_1.ResponseStatus.Failed, "Payment Edits id not found", null, http_status_codes_1.StatusCodes.BAD_REQUEST);
            }
            // อัปเดตข้อมูล
            const updatedPaymentEdits = yield paymentEditsRepository_1.paymentEditsRepository.reject(checkpaymentEdits[0].id, payload);
            const payloadLog = {
                payment_edit_id: checkpaymentEdits[0].id,
                payment_id: updatedPaymentEdits.payment_id,
                edit_status: paymentEditsModel_1.PAYMENT_EDITS_STATUS.REJECTED,
                old_data: updatedPaymentEdits.old_data,
                new_data: updatedPaymentEdits.new_data,
                created_by: userId,
                updated_by: userId,
                company_id: company_id,
                remark: payload.remark,
            };
            yield paymentEditsLogRepository_1.paymentEditsLogRepository.create(payloadLog);
            return new serviceResponse_1.ServiceResponse(serviceResponse_1.ResponseStatus.Success, "Reject payment edits success", updatedPaymentEdits, http_status_codes_1.StatusCodes.OK);
        }
        catch (ex) {
            const errorMessage = `Error reject payment edits: ${ex.message}`;
            return new serviceResponse_1.ServiceResponse(serviceResponse_1.ResponseStatus.Failed, errorMessage, null, http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR);
        }
    }),
    // delete: async (id: string) => {
    //   try {
    //     const response = await paymentEditsRepository.findById(id);
    //     if (!response) {
    //       return new ServiceResponse(
    //         ResponseStatus.Failed,
    //         "payment not found",
    //         null,
    //         StatusCodes.BAD_REQUEST
    //       );
    //     }
    //     // ลบข้อมูล
    //     await paymentEditsRepository.delete(id);
    //     if (response.payment_image_url) {
    //       await fileService.delete(response.payment_image_url);
    //     }
    //     return new ServiceResponse<string>(
    //       ResponseStatus.Success,
    //       "Delete payment success",
    //       "payment deleted successfully",
    //       StatusCodes.OK
    //     );
    //   } catch (ex) {
    //     const errorMessage = `Error deleting payment: ${(ex as Error).message}`;
    //     return new ServiceResponse(
    //       ResponseStatus.Failed,
    //       errorMessage,
    //       null,
    //       StatusCodes.INTERNAL_SERVER_ERROR
    //     );
    //   }
    // },
    findById: (id) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const response = yield paymentEditsRepository_1.paymentEditsRepository.findById(id);
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
            const response = yield paymentEditsRepository_1.paymentEditsRepository.findAllById(id);
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
    findByPaymentId: (id) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const response = yield paymentEditsRepository_1.paymentEditsRepository.findByPaymentId(id);
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
    findLogByPaymentId: (id) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const response = yield paymentEditsRepository_1.paymentEditsRepository.findLogByPaymentId(id);
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
