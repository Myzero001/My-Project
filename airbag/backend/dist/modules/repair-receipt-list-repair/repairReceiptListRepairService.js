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
exports.repairReceiptListRepairService = void 0;
const http_status_codes_1 = require("http-status-codes");
const serviceResponse_1 = require("@common/models/serviceResponse");
const repairReceiptListRepairRepository_1 = require("./repairReceiptListRepairRepository");
const ms_companiesRepository_1 = require("@modules/ms-companies/ms_companiesRepository");
const generateRepairReceiptListRepairBarcodeNumner_1 = require("@common/utils/generateRepairReceiptListRepairBarcodeNumner");
const repairReceiptListRepairLogStatusRepository_1 = require("@modules/repair_receipt_list_repair_log_status/repairReceiptListRepairLogStatusRepository");
exports.repairReceiptListRepairService = {
    // ดึงข้อมูลทั้งหมดพร้อม Pagination
    findAll: (...args_1) => __awaiter(void 0, [...args_1], void 0, function* (page = 1, pageSize = 12) {
        try {
            const skip = (page - 1) * pageSize; // คำนวณ offset
            const quotations = yield repairReceiptListRepairRepository_1.repairReceiptListRepairRepository.findAll(skip, pageSize); // ดึงข้อมูล
            const totalCount = yield repairReceiptListRepairRepository_1.repairReceiptListRepairRepository.count(); // นับจำนวนทั้งหมด
            return new serviceResponse_1.ServiceResponse(serviceResponse_1.ResponseStatus.Success, "Get all success", {
                data: quotations,
                totalCount, // จำนวนข้อมูลทั้งหมด
                totalPages: Math.ceil(totalCount / pageSize), // จำนวนหน้าทั้งหมด
            }, http_status_codes_1.StatusCodes.OK);
        }
        catch (error) {
            return new serviceResponse_1.ServiceResponse(serviceResponse_1.ResponseStatus.Failed, "Error fetching quotations", null, http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR);
        }
    }),
    findAllNoPagination: (company_id) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const customer = yield repairReceiptListRepairRepository_1.repairReceiptListRepairRepository.findAllNoPagination(company_id);
            return new serviceResponse_1.ServiceResponse(serviceResponse_1.ResponseStatus.Success, "Get all success", customer, http_status_codes_1.StatusCodes.OK);
        }
        catch (error) {
            return new serviceResponse_1.ServiceResponse(serviceResponse_1.ResponseStatus.Failed, "Error fetching brand", null, http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR);
        }
    }),
    create: (payload, company_id, userId) => __awaiter(void 0, void 0, void 0, function* () {
        var _a;
        try {
            const companyData = yield ms_companiesRepository_1.companiesRepository.findByIdCompany(payload.quotation_id);
            const barcode = yield (0, generateRepairReceiptListRepairBarcodeNumner_1.generateRepairReceiptListRepairBarcodeNumner)((_a = companyData === null || companyData === void 0 ? void 0 : companyData.company_code) !== null && _a !== void 0 ? _a : "C0001");
            payload.barcode = barcode;
            // สร้างข้อมูลใหม่
            const newData = yield repairReceiptListRepairRepository_1.repairReceiptListRepairRepository.create(payload, company_id);
            const payloadLog = {
                repair_receipt_list_repair_id: newData.id,
                list_repair_status: "active",
                created_by: userId,
                company_id: company_id,
            };
            yield repairReceiptListRepairLogStatusRepository_1.repairReceiptListRepairLogRepository.create(payloadLog);
            return new serviceResponse_1.ServiceResponse(serviceResponse_1.ResponseStatus.Success, "Create repair receipt list repair success", newData, http_status_codes_1.StatusCodes.OK);
        }
        catch (ex) {
            const errorMessage = `Error creating repair receipt list repair: ${ex.message}`;
            return new serviceResponse_1.ServiceResponse(serviceResponse_1.ResponseStatus.Failed, errorMessage, null, http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR);
        }
    }),
    update: (id, payload) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            // ตรวจสอบว่า quotation_doc มีอยู่หรือไม่
            const checkQuotation = yield repairReceiptListRepairRepository_1.repairReceiptListRepairRepository.findById(id);
            if (!checkQuotation) {
                return new serviceResponse_1.ServiceResponse(serviceResponse_1.ResponseStatus.Failed, "Quotation repair not found", null, http_status_codes_1.StatusCodes.BAD_REQUEST);
            }
            // อัปเดตข้อมูล
            const updatedQuotation = yield repairReceiptListRepairRepository_1.repairReceiptListRepairRepository.update(id, payload);
            return new serviceResponse_1.ServiceResponse(serviceResponse_1.ResponseStatus.Success, "Update quotation success", updatedQuotation, http_status_codes_1.StatusCodes.OK);
        }
        catch (ex) {
            const errorMessage = `Error updating quotation: ${ex.message}`;
            return new serviceResponse_1.ServiceResponse(serviceResponse_1.ResponseStatus.Failed, errorMessage, null, http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR);
        }
    }),
    updateStatusIsActive: (id, payload, company_id, userId) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const checkRepairReceiptListRepair = yield repairReceiptListRepairRepository_1.repairReceiptListRepairRepository.findById(id);
            if (!checkRepairReceiptListRepair) {
                return new serviceResponse_1.ServiceResponse(serviceResponse_1.ResponseStatus.Failed, "Repair Receipt List Repair not found", null, http_status_codes_1.StatusCodes.BAD_REQUEST);
            }
            // อัปเดตข้อมูล
            const updatedQuotation = yield repairReceiptListRepairRepository_1.repairReceiptListRepairRepository.updateStatusIsActive(id, payload, company_id);
            const payloadLog = {
                repair_receipt_list_repair_id: id,
                list_repair_status: payload.is_active ? "active" : "not_active",
                created_by: userId,
                company_id: company_id,
            };
            yield repairReceiptListRepairLogStatusRepository_1.repairReceiptListRepairLogRepository.create(payloadLog);
            return new serviceResponse_1.ServiceResponse(serviceResponse_1.ResponseStatus.Success, "Update quotation success", updatedQuotation, http_status_codes_1.StatusCodes.OK);
        }
        catch (ex) {
            const errorMessage = `Error updating quotation: ${ex.message}`;
            return new serviceResponse_1.ServiceResponse(serviceResponse_1.ResponseStatus.Failed, errorMessage, null, http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR);
        }
    }),
    delete: (id) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const checkQuotation = yield repairReceiptListRepairRepository_1.repairReceiptListRepairRepository.findById(id);
            if (!checkQuotation) {
                return new serviceResponse_1.ServiceResponse(serviceResponse_1.ResponseStatus.Failed, "Quotation not found", null, http_status_codes_1.StatusCodes.BAD_REQUEST);
            }
            // ลบข้อมูล
            yield repairReceiptListRepairRepository_1.repairReceiptListRepairRepository.delete(id);
            return new serviceResponse_1.ServiceResponse(serviceResponse_1.ResponseStatus.Success, "Delete quotation success", "Quotation deleted successfully", http_status_codes_1.StatusCodes.OK);
        }
        catch (ex) {
            const errorMessage = `Error deleting quotation: ${ex.message}`;
            return new serviceResponse_1.ServiceResponse(serviceResponse_1.ResponseStatus.Failed, errorMessage, null, http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR);
        }
    }),
    deleteByMultiId: (ids) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const allId = ids;
            for (const id of allId.split(",")) {
                yield repairReceiptListRepairRepository_1.repairReceiptListRepairRepository.delete(id);
            }
            return new serviceResponse_1.ServiceResponse(serviceResponse_1.ResponseStatus.Success, "Delete quotation repair success", "Quotation repair deleted successfully", http_status_codes_1.StatusCodes.OK);
        }
        catch (ex) {
            const errorMessage = `Error deleting quotation repair: ${ex.message}`;
            return new serviceResponse_1.ServiceResponse(serviceResponse_1.ResponseStatus.Failed, errorMessage, null, http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR);
        }
    }),
    findById: (id) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const quotation = yield repairReceiptListRepairRepository_1.repairReceiptListRepairRepository.findById(id);
            if (!quotation) {
                return new serviceResponse_1.ServiceResponse(serviceResponse_1.ResponseStatus.Failed, "Repair receip list repair not found", null, http_status_codes_1.StatusCodes.BAD_REQUEST);
            }
            return new serviceResponse_1.ServiceResponse(serviceResponse_1.ResponseStatus.Success, "Repair receip list repair found", quotation, http_status_codes_1.StatusCodes.OK);
        }
        catch (ex) {
            const errorMessage = `Error fetching Repair receip list repair: ${ex.message}`;
            return new serviceResponse_1.ServiceResponse(serviceResponse_1.ResponseStatus.Failed, errorMessage, null, http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR);
        }
    }),
    findByRepairReceiptId: (id, company_id) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const repairList = yield repairReceiptListRepairRepository_1.repairReceiptListRepairRepository.findByRepairReceiptId(id, company_id);
            return new serviceResponse_1.ServiceResponse(serviceResponse_1.ResponseStatus.Success, "Repair receipt list repair by repair receipt Id", repairList, http_status_codes_1.StatusCodes.OK);
        }
        catch (ex) {
            const errorMessage = `Error fetching repair receipt list repair by repair receipt Id: ${ex.message}`;
            return new serviceResponse_1.ServiceResponse(serviceResponse_1.ResponseStatus.Failed, errorMessage, null, http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR);
        }
    }),
    findByRepairReceiptIdActive: (id, company_id) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const repairList = yield repairReceiptListRepairRepository_1.repairReceiptListRepairRepository.findByRepairReceiptIdActive(id, company_id);
            return new serviceResponse_1.ServiceResponse(serviceResponse_1.ResponseStatus.Success, "Repair receipt list repair by repair receipt Id", repairList, http_status_codes_1.StatusCodes.OK);
        }
        catch (ex) {
            const errorMessage = `Error fetching repair receipt list repair by repair receipt Id: ${ex.message}`;
            return new serviceResponse_1.ServiceResponse(serviceResponse_1.ResponseStatus.Failed, errorMessage, null, http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR);
        }
    }),
    updateStatusCheckedBox: (id, statusDate, userId) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const record = yield repairReceiptListRepairRepository_1.repairReceiptListRepairRepository.findById(id);
            if (!record) {
                return new serviceResponse_1.ServiceResponse(serviceResponse_1.ResponseStatus.Failed, "Repair receipt list repair not found", null, http_status_codes_1.StatusCodes.BAD_REQUEST);
            }
            const updatedRecord = yield repairReceiptListRepairRepository_1.repairReceiptListRepairRepository.updateStatusCheckedBox(id, statusDate, userId // ส่ง userId จาก token ไปยัง repository
            );
            return new serviceResponse_1.ServiceResponse(serviceResponse_1.ResponseStatus.Success, "Update status_date and status_by success", updatedRecord, http_status_codes_1.StatusCodes.OK);
        }
        catch (ex) {
            const errorMessage = `Error updating status_date and status_by: ${ex.message}`;
            return new serviceResponse_1.ServiceResponse(serviceResponse_1.ResponseStatus.Failed, errorMessage, null, http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR);
        }
    }),
    updateStatusUnCheckedBox: (id, userId) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const record = yield repairReceiptListRepairRepository_1.repairReceiptListRepairRepository.findById(id);
            if (!record) {
                return new serviceResponse_1.ServiceResponse(serviceResponse_1.ResponseStatus.Failed, "Repair receipt list repair not found", null, http_status_codes_1.StatusCodes.BAD_REQUEST);
            }
            const updatedRecord = yield repairReceiptListRepairRepository_1.repairReceiptListRepairRepository.updateStatusUnCheckedBox(id, userId // ส่ง userId จาก token ไปยัง repository
            );
            return new serviceResponse_1.ServiceResponse(serviceResponse_1.ResponseStatus.Success, "Update status to pending success", updatedRecord, http_status_codes_1.StatusCodes.OK);
        }
        catch (ex) {
            const errorMessage = `Error updating status to pending: ${ex.message}`;
            return new serviceResponse_1.ServiceResponse(serviceResponse_1.ResponseStatus.Failed, errorMessage, null, http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR);
        }
    }),
};
