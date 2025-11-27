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
exports.repairReceiptListRepairLogStatusService = void 0;
const http_status_codes_1 = require("http-status-codes");
const serviceResponse_1 = require("@common/models/serviceResponse");
const repairReceiptListRepairLogStatusRepository_1 = require("./repairReceiptListRepairLogStatusRepository");
exports.repairReceiptListRepairLogStatusService = {
    // ดึงข้อมูลทั้งหมดพร้อม Pagination
    findAll: (company_id) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const quotations = yield repairReceiptListRepairLogStatusRepository_1.repairReceiptListRepairLogRepository.findAll(company_id); // ดึงข้อมูล
            const totalCount = yield repairReceiptListRepairLogStatusRepository_1.repairReceiptListRepairLogRepository.count(company_id); // นับจำนวนทั้งหมด
            return new serviceResponse_1.ServiceResponse(serviceResponse_1.ResponseStatus.Success, "Get all success", {
                data: quotations,
                totalCount, // จำนวนข้อมูลทั้งหมด
            }, http_status_codes_1.StatusCodes.OK);
        }
        catch (error) {
            return new serviceResponse_1.ServiceResponse(serviceResponse_1.ResponseStatus.Failed, "Error fetching quotations", null, http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR);
        }
    }),
    findByRepairReceiptId: (id, company_id) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const reponse = yield repairReceiptListRepairLogStatusRepository_1.repairReceiptListRepairLogRepository.findByRepairReceiptId(id, company_id);
            return new serviceResponse_1.ServiceResponse(serviceResponse_1.ResponseStatus.Success, "Repair Receipt List Repair Log Status found", reponse, http_status_codes_1.StatusCodes.OK);
        }
        catch (ex) {
            const errorMessage = `Error fetching Repair Receipt List Repair: ${ex.message}`;
            return new serviceResponse_1.ServiceResponse(serviceResponse_1.ResponseStatus.Failed, errorMessage, null, http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR);
        }
    }),
    create: (payload, userId, company_id) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const checkRepairReceiptListRepair = yield repairReceiptListRepairLogStatusRepository_1.repairReceiptListRepairLogRepository.findById(payload.repair_receipt_list_repair_id);
            if (!checkRepairReceiptListRepair) {
                return new serviceResponse_1.ServiceResponse(serviceResponse_1.ResponseStatus.Failed, "not found", null, http_status_codes_1.StatusCodes.BAD_REQUEST);
            }
            const payloadLog = {
                repair_receipt_list_repair_id: payload.repair_receipt_list_repair_id,
                list_repair_status: payload.list_repair_status,
                created_by: userId,
                company_id: company_id,
            };
            const update = yield repairReceiptListRepairLogStatusRepository_1.repairReceiptListRepairLogRepository.create(payloadLog);
            return new serviceResponse_1.ServiceResponse(serviceResponse_1.ResponseStatus.Success, "create log success", update, http_status_codes_1.StatusCodes.OK);
        }
        catch (ex) {
            const errorMessage = `Error create log: ${ex.message}`;
            return new serviceResponse_1.ServiceResponse(serviceResponse_1.ResponseStatus.Failed, errorMessage, null, http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR);
        }
    }),
};
