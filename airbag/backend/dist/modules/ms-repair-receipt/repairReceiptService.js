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
exports.repairReceiptService = void 0;
const http_status_codes_1 = require("http-status-codes");
const serviceResponse_1 = require("@common/models/serviceResponse");
const fileService_1 = require("@modules/file/fileService");
const repairReceiptRepository_1 = require("./repairReceiptRepository");
const repairReceiptModel_1 = require("./repairReceiptModel");
const generateRepairReceipt_1 = require("@common/utils/generateRepairReceipt");
exports.repairReceiptService = {
    findAll: (companyId_1, ...args_1) => __awaiter(void 0, [companyId_1, ...args_1], void 0, function* (companyId, page = 1, pageSize = 12, searchText = "", status = "all") {
        try {
            const skip = (page - 1) * pageSize;
            const receipts = yield repairReceiptRepository_1.repairReceiptRepository.findAll(companyId, skip, pageSize, searchText, status);
            const totalCount = yield repairReceiptRepository_1.repairReceiptRepository.count(companyId, searchText, status);
            return new serviceResponse_1.ServiceResponse(serviceResponse_1.ResponseStatus.Success, "Get all success", {
                data: receipts,
                totalCount,
                totalPages: Math.ceil(totalCount / pageSize),
            }, http_status_codes_1.StatusCodes.OK);
        }
        catch (error) {
            return new serviceResponse_1.ServiceResponse(serviceResponse_1.ResponseStatus.Failed, "Error fetching repair receipts", null, http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR);
        }
    }),
    findAllNoPagination: (company_id) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const customer = yield repairReceiptRepository_1.repairReceiptRepository.findAllNoPagination(company_id);
            return new serviceResponse_1.ServiceResponse(serviceResponse_1.ResponseStatus.Success, "Get all success", customer, http_status_codes_1.StatusCodes.OK);
        }
        catch (error) {
            return new serviceResponse_1.ServiceResponse(serviceResponse_1.ResponseStatus.Failed, "Error fetching repair", null, http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR);
        }
    }),
    findAllNotDeliveryNoPagination: (company_id) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const customer = yield repairReceiptRepository_1.repairReceiptRepository.findAllNotDeliveryNoPagination(company_id);
            return new serviceResponse_1.ServiceResponse(serviceResponse_1.ResponseStatus.Success, "Get all success", customer, http_status_codes_1.StatusCodes.OK);
        }
        catch (error) {
            return new serviceResponse_1.ServiceResponse(serviceResponse_1.ResponseStatus.Failed, "Error fetching repair", null, http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR);
        }
    }),
    create: (payload, userId, company_id) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            payload.repair_receipt_doc = yield (0, generateRepairReceipt_1.generateRepairReceiptDoc)();
            payload.repair_receipt_status = repairReceiptModel_1.REPAIR_RECEIPT_STATUS.PENDING;
            payload.created_by = userId;
            payload.updated_by = userId;
            payload.responsible_by = userId;
            // สร้างข้อมูลใหม่
            const newQuotation = yield repairReceiptRepository_1.repairReceiptRepository.create(payload, company_id);
            return new serviceResponse_1.ServiceResponse(serviceResponse_1.ResponseStatus.Success, "Create repair receipt success", newQuotation, http_status_codes_1.StatusCodes.OK);
        }
        catch (ex) {
            const errorMessage = `Error creating repair receipt: ${ex.message}`;
            return new serviceResponse_1.ServiceResponse(serviceResponse_1.ResponseStatus.Failed, errorMessage, null, http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR);
        }
    }),
    update: (id, payload, userId) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const checkRepairReceipt = yield repairReceiptRepository_1.repairReceiptRepository.findById(id);
            if (!checkRepairReceipt) {
                return new serviceResponse_1.ServiceResponse(serviceResponse_1.ResponseStatus.Failed, "Repair Receipt not found", null, http_status_codes_1.StatusCodes.BAD_REQUEST);
            }
            payload.updated_by = userId;
            // อัปเดตข้อมูล
            const updatedRepairReceipt = yield repairReceiptRepository_1.repairReceiptRepository.updateHome(id, payload);
            return new serviceResponse_1.ServiceResponse(serviceResponse_1.ResponseStatus.Success, "Update Repair Receipt success", updatedRepairReceipt, http_status_codes_1.StatusCodes.OK);
        }
        catch (ex) {
            const errorMessage = `Error updating Repair Receipt: ${ex.message}`;
            return new serviceResponse_1.ServiceResponse(serviceResponse_1.ResponseStatus.Failed, errorMessage, null, http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR);
        }
    }),
    updateBox: (id, payload, userId) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const checkRepairReceipt = yield repairReceiptRepository_1.repairReceiptRepository.findById(id);
            if (!checkRepairReceipt) {
                return new serviceResponse_1.ServiceResponse(serviceResponse_1.ResponseStatus.Failed, "Repair Receipt not found", null, http_status_codes_1.StatusCodes.BAD_REQUEST);
            }
            payload.updated_by = userId;
            // อัปเดตข้อมูล
            const updatedRepairReceipt = yield repairReceiptRepository_1.repairReceiptRepository.updateBox(id, payload);
            return new serviceResponse_1.ServiceResponse(serviceResponse_1.ResponseStatus.Success, "Update Repair Receipt success", updatedRepairReceipt, http_status_codes_1.StatusCodes.OK);
        }
        catch (ex) {
            const errorMessage = `Error updating Repair Receipt: ${ex.message}`;
            return new serviceResponse_1.ServiceResponse(serviceResponse_1.ResponseStatus.Failed, errorMessage, null, http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR);
        }
    }),
    success: (id, payload) => __awaiter(void 0, void 0, void 0, function* () {
        payload.repair_receipt_status = repairReceiptModel_1.REPAIR_RECEIPT_STATUS.SUCCESS;
        try {
            const checkRepairReceipt = yield repairReceiptRepository_1.repairReceiptRepository.findById(id);
            if (!checkRepairReceipt) {
                return new serviceResponse_1.ServiceResponse(serviceResponse_1.ResponseStatus.Failed, "Repair Receipt not found", null, http_status_codes_1.StatusCodes.BAD_REQUEST);
            }
            // อัปเดตข้อมูล
            const updatedRepairReceipt = yield repairReceiptRepository_1.repairReceiptRepository.success(id, payload);
            return new serviceResponse_1.ServiceResponse(serviceResponse_1.ResponseStatus.Success, "update status repair receipt success", updatedRepairReceipt, http_status_codes_1.StatusCodes.OK);
        }
        catch (ex) {
            const errorMessage = `Error approve update status repair receipt: ${ex.message}`;
            return new serviceResponse_1.ServiceResponse(serviceResponse_1.ResponseStatus.Failed, errorMessage, null, http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR);
        }
    }),
    cancel: (id, payload) => __awaiter(void 0, void 0, void 0, function* () {
        payload.repair_receipt_status = repairReceiptModel_1.REPAIR_RECEIPT_STATUS.CANCEL;
        try {
            const checkRepairReceipt = yield repairReceiptRepository_1.repairReceiptRepository.findById(id);
            if (!checkRepairReceipt) {
                return new serviceResponse_1.ServiceResponse(serviceResponse_1.ResponseStatus.Failed, "Repair Receipt not found", null, http_status_codes_1.StatusCodes.BAD_REQUEST);
            }
            // อัปเดตข้อมูล
            const updatedRepairReceipt = yield repairReceiptRepository_1.repairReceiptRepository.cancel(id, payload);
            return new serviceResponse_1.ServiceResponse(serviceResponse_1.ResponseStatus.Success, "update status repair receipt success", updatedRepairReceipt, http_status_codes_1.StatusCodes.OK);
        }
        catch (ex) {
            const errorMessage = `Error approve update status repair receipt: ${ex.message}`;
            return new serviceResponse_1.ServiceResponse(serviceResponse_1.ResponseStatus.Failed, errorMessage, null, http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR);
        }
    }),
    delete: (id) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const checkRepairReceipt = yield repairReceiptRepository_1.repairReceiptRepository.findById(id);
            if (!checkRepairReceipt) {
                return new serviceResponse_1.ServiceResponse(serviceResponse_1.ResponseStatus.Failed, "Repair receipt not found", null, http_status_codes_1.StatusCodes.BAD_REQUEST);
            }
            // ลบข้อมูล
            yield repairReceiptRepository_1.repairReceiptRepository.delete(id);
            if (checkRepairReceipt.repair_receipt_image_url) {
                yield fileService_1.fileService.delete(checkRepairReceipt.repair_receipt_image_url);
            }
            if (checkRepairReceipt.box_before_file_url) {
                yield fileService_1.fileService.delete(checkRepairReceipt.box_before_file_url);
            }
            if (checkRepairReceipt.box_after_file_url) {
                yield fileService_1.fileService.delete(checkRepairReceipt.box_after_file_url);
            }
            return new serviceResponse_1.ServiceResponse(serviceResponse_1.ResponseStatus.Success, "Delete Repair receipt success", "Repair receipt deleted successfully", http_status_codes_1.StatusCodes.OK);
        }
        catch (ex) {
            const errorMessage = `Error deleting Repair receipt: ${ex.message}`;
            return new serviceResponse_1.ServiceResponse(serviceResponse_1.ResponseStatus.Failed, errorMessage, null, http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR);
        }
    }),
    findById: (id) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const quotation = yield repairReceiptRepository_1.repairReceiptRepository.findById(id);
            if (!quotation) {
                return new serviceResponse_1.ServiceResponse(serviceResponse_1.ResponseStatus.Failed, "Repair receipt not found", null, http_status_codes_1.StatusCodes.BAD_REQUEST);
            }
            return new serviceResponse_1.ServiceResponse(serviceResponse_1.ResponseStatus.Success, "Repair receipt found", quotation, http_status_codes_1.StatusCodes.OK);
        }
        catch (ex) {
            const errorMessage = `Error fetching Repair receipt: ${ex.message}`;
            return new serviceResponse_1.ServiceResponse(serviceResponse_1.ResponseStatus.Failed, errorMessage, null, http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR);
        }
    }),
    findAllById: (id) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const quotation = yield repairReceiptRepository_1.repairReceiptRepository.findAllById(id);
            if (!quotation) {
                return new serviceResponse_1.ServiceResponse(serviceResponse_1.ResponseStatus.Failed, "Repair receipt not found", null, http_status_codes_1.StatusCodes.BAD_REQUEST);
            }
            return new serviceResponse_1.ServiceResponse(serviceResponse_1.ResponseStatus.Success, "Repair receipt found", quotation, http_status_codes_1.StatusCodes.OK);
        }
        catch (ex) {
            const errorMessage = `Error fetching Repair receipt: ${ex.message}`;
            return new serviceResponse_1.ServiceResponse(serviceResponse_1.ResponseStatus.Failed, errorMessage, null, http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR);
        }
    }),
    findSelectedFieldsById: (id) => __awaiter(void 0, void 0, void 0, function* () {
        var _a, _b, _c, _d, _e, _f, _g;
        try {
            const data = yield repairReceiptRepository_1.repairReceiptRepository.findSelectedFieldsById(id);
            if (!data) {
                return new serviceResponse_1.ServiceResponse(serviceResponse_1.ResponseStatus.Failed, "Repair receipt not found", null, http_status_codes_1.StatusCodes.BAD_REQUEST);
            }
            // ตรวจสอบ quotation_status
            if (((_a = data.master_quotation) === null || _a === void 0 ? void 0 : _a.quotation_status) !== "close_deal") {
                return new serviceResponse_1.ServiceResponse(serviceResponse_1.ResponseStatus.Failed, "Repair receipt is not in close deal status", null, http_status_codes_1.StatusCodes.BAD_REQUEST);
            }
            const formattedData = {
                repair_receipt_doc: data.repair_receipt_doc,
                register: data.register || null,
                estimated_date_repair_completion: data.estimated_date_repair_completion || null,
                contact_name: ((_c = (_b = data.master_quotation) === null || _b === void 0 ? void 0 : _b.master_customer) === null || _c === void 0 ? void 0 : _c.contact_name) || null,
                brandmodel_name: ((_e = (_d = data.master_quotation) === null || _d === void 0 ? void 0 : _d.master_brandmodel) === null || _e === void 0 ? void 0 : _e.brandmodel_name) || null,
                deal_closed_date: ((_f = data.master_quotation) === null || _f === void 0 ? void 0 : _f.deal_closed_date) || null,
                quotation_status: ((_g = data.master_quotation) === null || _g === void 0 ? void 0 : _g.quotation_status) || null,
            };
            return new serviceResponse_1.ServiceResponse(serviceResponse_1.ResponseStatus.Success, "Repair receipt found", formattedData, http_status_codes_1.StatusCodes.OK);
        }
        catch (ex) {
            const errorMessage = `Error fetching repair receipt: ${ex.message}`;
            return new serviceResponse_1.ServiceResponse(serviceResponse_1.ResponseStatus.Failed, errorMessage, null, http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR);
        }
    }),
    setFinishToTrue: (id) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const repairReceipt = yield repairReceiptRepository_1.repairReceiptRepository.findById(id);
            if (!repairReceipt) {
                return new serviceResponse_1.ServiceResponse(serviceResponse_1.ResponseStatus.Failed, "Repair Receipt not found", null, http_status_codes_1.StatusCodes.NOT_FOUND);
            }
            const updatedRepairReceipt = yield repairReceiptRepository_1.repairReceiptRepository.updateFinishToTrue(id);
            return new serviceResponse_1.ServiceResponse(serviceResponse_1.ResponseStatus.Success, "Repair Receipt marked as finished", updatedRepairReceipt, // คืนค่าเฉพาะฟิลด์ finish
            http_status_codes_1.StatusCodes.OK);
        }
        catch (error) {
            return new serviceResponse_1.ServiceResponse(serviceResponse_1.ResponseStatus.Failed, `Error updating Repair Receipt: ${error.message}`, null, http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR);
        }
    }),
    setFinishToFalse: (id) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const repairReceipt = yield repairReceiptRepository_1.repairReceiptRepository.findById(id);
            if (!repairReceipt) {
                return new serviceResponse_1.ServiceResponse(serviceResponse_1.ResponseStatus.Failed, "Repair Receipt not found", null, http_status_codes_1.StatusCodes.NOT_FOUND);
            }
            const updatedRepairReceipt = yield repairReceiptRepository_1.repairReceiptRepository.updateFinishToFalse(id);
            return new serviceResponse_1.ServiceResponse(serviceResponse_1.ResponseStatus.Success, "Repair Receipt marked as unfinished", updatedRepairReceipt, // คืนค่าเฉพาะฟิลด์ finish
            http_status_codes_1.StatusCodes.OK);
        }
        catch (error) {
            return new serviceResponse_1.ServiceResponse(serviceResponse_1.ResponseStatus.Failed, `Error updating Repair Receipt: ${error.message}`, null, http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR);
        }
    }),
    findByFinishStatusAndId: (id, isFinished) => __awaiter(void 0, void 0, void 0, function* () {
        var _a, _b, _c, _d, _e, _f;
        try {
            const repairReceipt = yield repairReceiptRepository_1.repairReceiptRepository.findByFinishStatusAndId(id, isFinished);
            if (!repairReceipt) {
                return new serviceResponse_1.ServiceResponse(serviceResponse_1.ResponseStatus.Failed, "Repair receipt not found or does not match finish status", null, http_status_codes_1.StatusCodes.OK);
            }
            const formattedData = {
                repair_receipt_doc: repairReceipt.repair_receipt_doc,
                register: repairReceipt.register || null,
                contact_name: ((_b = (_a = repairReceipt.master_quotation) === null || _a === void 0 ? void 0 : _a.master_customer) === null || _b === void 0 ? void 0 : _b.contact_name) || null,
                brandmodel_name: ((_d = (_c = repairReceipt.master_quotation) === null || _c === void 0 ? void 0 : _c.master_brandmodel) === null || _d === void 0 ? void 0 : _d.brandmodel_name) ||
                    null,
                deal_closed_date: ((_e = repairReceipt.master_quotation) === null || _e === void 0 ? void 0 : _e.deal_closed_date) || null,
                appointment_date: ((_f = repairReceipt.master_quotation) === null || _f === void 0 ? void 0 : _f.appointment_date) || null,
            };
            return new serviceResponse_1.ServiceResponse(serviceResponse_1.ResponseStatus.Success, "Repair receipt found", formattedData, http_status_codes_1.StatusCodes.OK);
        }
        catch (error) {
            return new serviceResponse_1.ServiceResponse(serviceResponse_1.ResponseStatus.Failed, `Error fetching repair receipt: ${error.message}`, null, http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR);
        }
    }),
    findSelect: (companyId) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const brands = yield repairReceiptRepository_1.repairReceiptRepository.findSelect(companyId);
            return new serviceResponse_1.ServiceResponse(serviceResponse_1.ResponseStatus.Success, "Get select RR. data success", brands, http_status_codes_1.StatusCodes.OK);
        }
        catch (error) {
            return new serviceResponse_1.ServiceResponse(serviceResponse_1.ResponseStatus.Failed, "Error fetching select RR. data", null, http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR);
        }
    }),
    findCalendarRemoval: (id, companyId) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const data = yield repairReceiptRepository_1.repairReceiptRepository.findCalendarRemoval(id, companyId);
            if (!data) {
                return new serviceResponse_1.ServiceResponse(serviceResponse_1.ResponseStatus.Failed, "Repair receipt not found", null, http_status_codes_1.StatusCodes.BAD_REQUEST);
            }
            return new serviceResponse_1.ServiceResponse(serviceResponse_1.ResponseStatus.Success, "Get calendar removal data success", data, http_status_codes_1.StatusCodes.OK);
        }
        catch (ex) {
            const errorMessage = `Error fetching calendar removal data: ${ex.message}`;
            return new serviceResponse_1.ServiceResponse(serviceResponse_1.ResponseStatus.Failed, errorMessage, null, http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR);
        }
    }),
    findDocAndId: (companyId) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const brands = yield repairReceiptRepository_1.repairReceiptRepository.findDocAndId(companyId);
            return new serviceResponse_1.ServiceResponse(serviceResponse_1.ResponseStatus.Success, "Get select RR. data success", brands, http_status_codes_1.StatusCodes.OK);
        }
        catch (error) {
            return new serviceResponse_1.ServiceResponse(serviceResponse_1.ResponseStatus.Failed, "Error fetching select RR. data", null, http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR);
        }
    }),
    findRepairDocsByCompanyId: (companyId) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const docsResult = yield repairReceiptRepository_1.repairReceiptRepository.findRepairDocsByCompanyId(companyId);
            if (!docsResult || docsResult.length === 0) {
                return new serviceResponse_1.ServiceResponse(serviceResponse_1.ResponseStatus.Success, "No repair receipt documents found for this company.", [], http_status_codes_1.StatusCodes.OK);
            }
            return new serviceResponse_1.ServiceResponse(serviceResponse_1.ResponseStatus.Success, "Successfully fetched repair receipt documents", docsResult, http_status_codes_1.StatusCodes.OK);
        }
        catch (error) {
            const errorMessage = `Error fetching repair receipt documents: ${error.message}`;
            console.error(errorMessage);
            return new serviceResponse_1.ServiceResponse(serviceResponse_1.ResponseStatus.Failed, errorMessage, [], http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR);
        }
    }),
    findResponsibleUserForRepairReceipt: (id) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const repairReceiptData = yield repairReceiptRepository_1.repairReceiptRepository.findOnlyResponsibleUser(id);
            if (!repairReceiptData) {
                return new serviceResponse_1.ServiceResponse(serviceResponse_1.ResponseStatus.Failed, "Repair receipt not found.", null, http_status_codes_1.StatusCodes.NOT_FOUND);
            }
            if (!repairReceiptData.responsible_by_user) {
                return new serviceResponse_1.ServiceResponse(serviceResponse_1.ResponseStatus.Success, "No responsible user assigned to this repair receipt.", null, http_status_codes_1.StatusCodes.OK);
            }
            return new serviceResponse_1.ServiceResponse(serviceResponse_1.ResponseStatus.Success, "Responsible user found.", repairReceiptData.responsible_by_user, http_status_codes_1.StatusCodes.OK);
        }
        catch (ex) {
            const errorMessage = `Error fetching responsible user for repair receipt: ${ex.message}`;
            return new serviceResponse_1.ServiceResponse(serviceResponse_1.ResponseStatus.Failed, errorMessage, null, http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR);
        }
    }),
    updateResponsibleBy: (id, responsibleById, userId) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const checkRepairReceipt = yield repairReceiptRepository_1.repairReceiptRepository.findById(id);
            if (!checkRepairReceipt) {
                return new serviceResponse_1.ServiceResponse(serviceResponse_1.ResponseStatus.Failed, "Repair Receipt not found", null, http_status_codes_1.StatusCodes.NOT_FOUND);
            }
            const updatedRepairReceipt = yield repairReceiptRepository_1.repairReceiptRepository.updateResponsibleBy(id, responsibleById, userId);
            return new serviceResponse_1.ServiceResponse(serviceResponse_1.ResponseStatus.Success, "Successfully updated responsible person for Repair Receipt.", updatedRepairReceipt, http_status_codes_1.StatusCodes.OK);
        }
        catch (ex) {
            const errorMessage = `Error updating responsible person for Repair Receipt: ${ex.message}`;
            return new serviceResponse_1.ServiceResponse(serviceResponse_1.ResponseStatus.Failed, errorMessage, null, http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR);
        }
    }),
    select: (companyId_1, ...args_1) => __awaiter(void 0, [companyId_1, ...args_1], void 0, function* (companyId, searchText = "") {
        try {
            const data = yield repairReceiptRepository_1.repairReceiptRepository.select(companyId, searchText);
            return new serviceResponse_1.ServiceResponse(serviceResponse_1.ResponseStatus.Success, "Select success", { data }, http_status_codes_1.StatusCodes.OK);
        }
        catch (error) {
            return new serviceResponse_1.ServiceResponse(serviceResponse_1.ResponseStatus.Failed, "Error fetching select", null, http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR);
        }
    }),
    findAllJobs: (companyId_1, ...args_1) => __awaiter(void 0, [companyId_1, ...args_1], void 0, function* (companyId, page = 1, pageSize = 25, status = 'all', searchText = "") {
        try {
            const skip = (page - 1) * pageSize;
            // รับค่า data, totalCount, และ summary จาก Repository
            const { data, totalCount, summary } = yield repairReceiptRepository_1.repairReceiptRepository.findJobs(companyId, skip, pageSize, status, searchText);
            // แปลงข้อมูลที่ได้จาก Raw Query (อาจจะเป็น BigInt) ให้เป็น Number
            const formattedData = data.map(job => (Object.assign(Object.assign({}, job), { total_repairs: Number(job.total_repairs), completed_repairs: Number(job.completed_repairs) })));
            return new serviceResponse_1.ServiceResponse(serviceResponse_1.ResponseStatus.Success, "Get all jobs success", {
                data: formattedData,
                totalCount,
                totalPages: Math.ceil(totalCount / pageSize),
                summary, // ส่ง summary ไปยัง Frontend
            }, http_status_codes_1.StatusCodes.OK);
        }
        catch (error) {
            const errorMessage = `Error fetching jobs: ${error.message}`;
            console.error(errorMessage);
            return new serviceResponse_1.ServiceResponse(serviceResponse_1.ResponseStatus.Failed, errorMessage, null, http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR);
        }
    }),
};
