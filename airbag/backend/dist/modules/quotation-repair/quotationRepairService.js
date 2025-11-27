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
exports.quotationRepairService = void 0;
const http_status_codes_1 = require("http-status-codes");
const serviceResponse_1 = require("@common/models/serviceResponse");
const quotationRepairRepository_1 = require("./quotationRepairRepository");
exports.quotationRepairService = {
    // ดึงข้อมูลทั้งหมดพร้อม Pagination
    findAll: (...args_1) => __awaiter(void 0, [...args_1], void 0, function* (page = 1, pageSize = 12) {
        try {
            const skip = (page - 1) * pageSize; // คำนวณ offset
            const quotations = yield quotationRepairRepository_1.quotationRepairRepository.findAll(skip, pageSize); // ดึงข้อมูล
            const totalCount = yield quotationRepairRepository_1.quotationRepairRepository.count(); // นับจำนวนทั้งหมด
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
    findAllNoPagination: () => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const customer = yield quotationRepairRepository_1.quotationRepairRepository.findAllNoPagination();
            return new serviceResponse_1.ServiceResponse(serviceResponse_1.ResponseStatus.Success, "Get all success", customer, http_status_codes_1.StatusCodes.OK);
        }
        catch (error) {
            return new serviceResponse_1.ServiceResponse(serviceResponse_1.ResponseStatus.Failed, "Error fetching brand", null, http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR);
        }
    }),
    create: (payload) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            // สร้างข้อมูลใหม่
            const newQuotationRepair = yield quotationRepairRepository_1.quotationRepairRepository.create(payload);
            return new serviceResponse_1.ServiceResponse(serviceResponse_1.ResponseStatus.Success, "Create quotation repair success", newQuotationRepair, http_status_codes_1.StatusCodes.OK);
        }
        catch (ex) {
            const errorMessage = `Error creating quotation: ${ex.message}`;
            return new serviceResponse_1.ServiceResponse(serviceResponse_1.ResponseStatus.Failed, errorMessage, null, http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR);
        }
    }),
    update: (id, payload) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            // ตรวจสอบว่า quotation_doc มีอยู่หรือไม่
            const checkQuotation = yield quotationRepairRepository_1.quotationRepairRepository.findById(id);
            if (!checkQuotation) {
                return new serviceResponse_1.ServiceResponse(serviceResponse_1.ResponseStatus.Failed, "Quotation repair not found", null, http_status_codes_1.StatusCodes.BAD_REQUEST);
            }
            // อัปเดตข้อมูล
            const updatedQuotation = yield quotationRepairRepository_1.quotationRepairRepository.update(id, payload);
            return new serviceResponse_1.ServiceResponse(serviceResponse_1.ResponseStatus.Success, "Update quotation success", updatedQuotation, http_status_codes_1.StatusCodes.OK);
        }
        catch (ex) {
            const errorMessage = `Error updating quotation: ${ex.message}`;
            return new serviceResponse_1.ServiceResponse(serviceResponse_1.ResponseStatus.Failed, errorMessage, null, http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR);
        }
    }),
    delete: (id) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const checkQuotation = yield quotationRepairRepository_1.quotationRepairRepository.findById(id);
            if (!checkQuotation) {
                return new serviceResponse_1.ServiceResponse(serviceResponse_1.ResponseStatus.Failed, "Quotation not found", null, http_status_codes_1.StatusCodes.BAD_REQUEST);
            }
            // ลบข้อมูล
            yield quotationRepairRepository_1.quotationRepairRepository.delete(id);
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
                yield quotationRepairRepository_1.quotationRepairRepository.delete(id);
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
            const quotation = yield quotationRepairRepository_1.quotationRepairRepository.findById(id);
            if (!quotation) {
                return new serviceResponse_1.ServiceResponse(serviceResponse_1.ResponseStatus.Failed, "Quotation repair not found", null, http_status_codes_1.StatusCodes.BAD_REQUEST);
            }
            return new serviceResponse_1.ServiceResponse(serviceResponse_1.ResponseStatus.Success, "Quotation repair found", quotation, http_status_codes_1.StatusCodes.OK);
        }
        catch (ex) {
            const errorMessage = `Error fetching quotation: ${ex.message}`;
            return new serviceResponse_1.ServiceResponse(serviceResponse_1.ResponseStatus.Failed, errorMessage, null, http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR);
        }
    }),
    findByQuotationId: (id) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const quotations = yield quotationRepairRepository_1.quotationRepairRepository.findByQuotationId(id);
            if (!quotations) {
                return new serviceResponse_1.ServiceResponse(serviceResponse_1.ResponseStatus.Failed, "Quotation repair by quotation Id not found", null, http_status_codes_1.StatusCodes.BAD_REQUEST);
            }
            return new serviceResponse_1.ServiceResponse(serviceResponse_1.ResponseStatus.Success, "Quotation repair by quotation Id found", quotations, http_status_codes_1.StatusCodes.OK);
        }
        catch (ex) {
            const errorMessage = `Error fetching quotation by quotation Id: ${ex.message}`;
            return new serviceResponse_1.ServiceResponse(serviceResponse_1.ResponseStatus.Failed, errorMessage, null, http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR);
        }
    }),
};
