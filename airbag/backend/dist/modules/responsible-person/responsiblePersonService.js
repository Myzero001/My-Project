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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.responsiblePersonService = void 0;
const http_status_codes_1 = require("http-status-codes");
const serviceResponse_1 = require("@common/models/serviceResponse");
const responsiblePersonRepository_1 = require("./responsiblePersonRepository");
const responsiblePersonModel_1 = require("./responsiblePersonModel");
const db_1 = __importDefault(require("@src/db"));
exports.responsiblePersonService = {
    findAll: (companyId_1, ...args_1) => __awaiter(void 0, [companyId_1, ...args_1], void 0, function* (companyId, page = 1, pageSize = 12) {
        const skip = (page - 1) * pageSize;
        const data = yield responsiblePersonRepository_1.responsiblePersonRepository.findAll(companyId, skip, pageSize);
        const totalCount = yield responsiblePersonRepository_1.responsiblePersonRepository.count(companyId);
        return new serviceResponse_1.ServiceResponse(serviceResponse_1.ResponseStatus.Success, "Fetched all logs successfully", { data, totalCount, totalPages: Math.ceil(totalCount / pageSize) }, http_status_codes_1.StatusCodes.OK);
    }),
    findById: (companyId, logId) => __awaiter(void 0, void 0, void 0, function* () {
        const log = yield responsiblePersonRepository_1.responsiblePersonRepository.findById(companyId, logId);
        if (!log) {
            return new serviceResponse_1.ServiceResponse(serviceResponse_1.ResponseStatus.Failed, "Log not found", null, http_status_codes_1.StatusCodes.NOT_FOUND);
        }
        return new serviceResponse_1.ServiceResponse(serviceResponse_1.ResponseStatus.Success, "Log fetched successfully", log, http_status_codes_1.StatusCodes.OK);
    }),
    create: (companyId, userId, payload) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            // Check if before_by_id exists
            const beforeUser = yield db_1.default.users.findUnique({
                where: { company_id: companyId, employee_id: payload.before_by_id }, // ควรเช็ค company_id ด้วย
            });
            if (!beforeUser) {
                return new serviceResponse_1.ServiceResponse(serviceResponse_1.ResponseStatus.Failed, "Before user not found in this company", null, http_status_codes_1.StatusCodes.BAD_REQUEST);
            }
            // Check if after_by_id exists
            const afterUser = yield db_1.default.users.findUnique({
                where: { company_id: companyId, employee_id: payload.after_by_id }, // ควรเช็ค company_id ด้วย
            });
            if (!afterUser) {
                return new serviceResponse_1.ServiceResponse(serviceResponse_1.ResponseStatus.Failed, "After user not found in this company", null, http_status_codes_1.StatusCodes.BAD_REQUEST);
            }
            // Validate existence of the source document based on type
            let documentFound = false;
            let documentNotFoundMessage = "Associated document not found.";
            switch (payload.type) {
                case responsiblePersonModel_1.ResponsiblePersonType.QUOTATION:
                    if (payload.quotation_id) {
                        const doc = yield db_1.default.master_quotation.findUnique({ where: { company_id: companyId, quotation_id: payload.quotation_id } });
                        if (doc)
                            documentFound = true;
                        else
                            documentNotFoundMessage = "Quotation not found.";
                    }
                    break;
                case responsiblePersonModel_1.ResponsiblePersonType.REPAIR:
                    if (payload.master_repair_receipt_id) {
                        const doc = yield db_1.default.master_repair_receipt.findUnique({ where: { company_id: companyId, id: payload.master_repair_receipt_id } });
                        if (doc)
                            documentFound = true;
                        else
                            documentNotFoundMessage = "Master Repair Receipt not found.";
                    }
                    break;
                case responsiblePersonModel_1.ResponsiblePersonType.SUBMIT_SUB:
                    if (payload.supplier_delivery_note_id) {
                        const doc = yield db_1.default.supplier_delivery_note.findUnique({ where: { company_id: companyId, supplier_delivery_note_id: payload.supplier_delivery_note_id } });
                        if (doc)
                            documentFound = true;
                        else
                            documentNotFoundMessage = "Supplier Delivery Note (Submit Sub) not found.";
                    }
                    break;
                case responsiblePersonModel_1.ResponsiblePersonType.RECEIVE_SUB:
                    if (payload.supplier_repair_receipt_id) {
                        const doc = yield db_1.default.supplier_repair_receipt.findUnique({ where: { company_id: companyId, id: payload.supplier_repair_receipt_id } });
                        if (doc)
                            documentFound = true;
                        else
                            documentNotFoundMessage = "Supplier Repair Receipt (Receive Sub) not found.";
                    }
                    break;
                case responsiblePersonModel_1.ResponsiblePersonType.SUBMIT_CLAIM:
                    if (payload.send_for_a_claim_id) {
                        const doc = yield db_1.default.send_for_a_claim.findUnique({ where: { company_id: companyId, send_for_a_claim_id: payload.send_for_a_claim_id } });
                        if (doc)
                            documentFound = true;
                        else
                            documentNotFoundMessage = "Send For a Claim document not found.";
                    }
                    break;
                case responsiblePersonModel_1.ResponsiblePersonType.RECEIVE_CLAIM:
                    if (payload.receive_for_a_claim_id) {
                        const doc = yield db_1.default.receive_for_a_claim.findUnique({ where: { company_id: companyId, receive_for_a_claim_id: payload.receive_for_a_claim_id } }); // Assuming company_id is on this model
                        if (doc)
                            documentFound = true;
                        else
                            documentNotFoundMessage = "Receive For a Claim document not found.";
                    }
                    break;
                default:
                    // Should not happen if Zod validation is correct
                    return new serviceResponse_1.ServiceResponse(serviceResponse_1.ResponseStatus.Failed, "Invalid document type.", null, http_status_codes_1.StatusCodes.BAD_REQUEST);
            }
            if (!documentFound) {
                return new serviceResponse_1.ServiceResponse(serviceResponse_1.ResponseStatus.Failed, documentNotFoundMessage, null, http_status_codes_1.StatusCodes.BAD_REQUEST);
            }
            const log = yield responsiblePersonRepository_1.responsiblePersonRepository.create(companyId, userId, payload);
            // ส่งคืน ID ที่เกี่ยวข้องกับ type นั้นๆ ไปด้วย
            const responseData = {
                log_id: log.log_id,
                type: log.type,
                docno: log.docno,
                change_date: log.change_date
            };
            if (log.quotation_id)
                responseData.quotation_id = log.quotation_id;
            if (log.master_repair_receipt_id)
                responseData.master_repair_receipt_id = log.master_repair_receipt_id;
            if (log.supplier_delivery_note_id)
                responseData.supplier_delivery_note_id = log.supplier_delivery_note_id;
            if (log.supplier_repair_receipt_id)
                responseData.supplier_repair_receipt_id = log.supplier_repair_receipt_id;
            if (log.send_for_a_claim_id)
                responseData.send_for_a_claim_id = log.send_for_a_claim_id;
            if (log.receive_for_a_claim_id)
                responseData.receive_for_a_claim_id = log.receive_for_a_claim_id;
            return new serviceResponse_1.ServiceResponse(serviceResponse_1.ResponseStatus.Success, "Log created successfully", responseData, http_status_codes_1.StatusCodes.CREATED);
        }
        catch (error) {
            console.error('Create log error:', error);
            // Check for Prisma specific errors if needed, e.g., unique constraint violation
            return new serviceResponse_1.ServiceResponse(serviceResponse_1.ResponseStatus.Failed, error.message || "Failed to create log", null, http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR);
        }
    }),
    update: (companyId, logId, payload // ใช้ Type ใหม่
    ) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            // ตรวจสอบว่า log ที่จะ update มีอยู่จริง (repository ทำแล้ว แต่ service อาจจะ check อีกทีก่อน)
            const existingLog = yield db_1.default.log_responsible_person.findUnique({
                where: { log_id: logId, company_id: companyId }
            });
            if (!existingLog) {
                return new serviceResponse_1.ServiceResponse(serviceResponse_1.ResponseStatus.Failed, "Log not found for update.", null, http_status_codes_1.StatusCodes.NOT_FOUND);
            }
            // Check if before_by_id exists if provided
            if (payload.before_by_id) {
                const beforeUser = yield db_1.default.users.findUnique({
                    where: { company_id: companyId, employee_id: payload.before_by_id },
                });
                if (!beforeUser) {
                    return new serviceResponse_1.ServiceResponse(serviceResponse_1.ResponseStatus.Failed, "Updated 'before by' user not found in this company.", null, http_status_codes_1.StatusCodes.BAD_REQUEST);
                }
            }
            // Check if after_by_id exists if provided
            if (payload.after_by_id) {
                const afterUser = yield db_1.default.users.findUnique({
                    where: { company_id: companyId, employee_id: payload.after_by_id },
                });
                if (!afterUser) {
                    return new serviceResponse_1.ServiceResponse(serviceResponse_1.ResponseStatus.Failed, "Updated 'after by' user not found in this company.", null, http_status_codes_1.StatusCodes.BAD_REQUEST);
                }
            }
            const updatedLog = yield responsiblePersonRepository_1.responsiblePersonRepository.update(companyId, logId, payload);
            return new serviceResponse_1.ServiceResponse(serviceResponse_1.ResponseStatus.Success, "Log updated successfully", updatedLog, // ส่งข้อมูล log ที่ update แล้วกลับไปทั้งหมด
            http_status_codes_1.StatusCodes.OK);
        }
        catch (error) {
            console.error('Update log error:', error);
            if (error.message === "Log not found") { // Error จาก repository
                return new serviceResponse_1.ServiceResponse(serviceResponse_1.ResponseStatus.Failed, "Log not found.", null, http_status_codes_1.StatusCodes.NOT_FOUND);
            }
            return new serviceResponse_1.ServiceResponse(serviceResponse_1.ResponseStatus.Failed, error.message || "Failed to update log", null, http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR);
        }
    }),
    delete: (companyId, logId) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            yield responsiblePersonRepository_1.responsiblePersonRepository.delete(companyId, logId);
            return new serviceResponse_1.ServiceResponse(serviceResponse_1.ResponseStatus.Success, "Log deleted successfully", null, http_status_codes_1.StatusCodes.OK);
        }
        catch (error) {
            console.error('Delete log error:', error);
            // Prisma's delete throws an error if record not found (P2025)
            if (error.code === 'P2025') {
                return new serviceResponse_1.ServiceResponse(serviceResponse_1.ResponseStatus.Failed, "Log not found for deletion.", null, http_status_codes_1.StatusCodes.NOT_FOUND);
            }
            return new serviceResponse_1.ServiceResponse(serviceResponse_1.ResponseStatus.Failed, "Failed to delete log", null, http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR);
        }
    }),
    getResponsiblePersonsTypes: () => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const types = Object.values(responsiblePersonModel_1.ResponsiblePersonType); // ใช้ enum ที่เรา define
            return new serviceResponse_1.ServiceResponse(serviceResponse_1.ResponseStatus.Success, "Fetched ResponsiblePersonType successfully", types, http_status_codes_1.StatusCodes.OK);
        }
        catch (error) {
            return new serviceResponse_1.ServiceResponse(serviceResponse_1.ResponseStatus.Failed, "Failed to fetch ResponsiblePersonType", null, http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR);
        }
    }),
};
