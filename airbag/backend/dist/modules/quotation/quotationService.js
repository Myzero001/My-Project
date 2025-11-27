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
exports.quotationService = void 0;
const http_status_codes_1 = require("http-status-codes");
const serviceResponse_1 = require("@common/models/serviceResponse");
const quotationRepository_1 = require("./quotationRepository");
const quotationModel_1 = require("./quotationModel");
const dayjs_1 = __importDefault(require("dayjs"));
const generateQuotationDoc_1 = require("@common/utils/generateQuotationDoc");
const quotationRepairRepository_1 = require("@modules/quotation-repair/quotationRepairRepository");
const quotationLogStatusRepository_1 = require("@modules/quotation_log_status/quotationLogStatusRepository");
const fileService_1 = require("@modules/file/fileService");
const quotationRepairService_1 = require("@modules/quotation-repair/quotationRepairService");
const repairReceiptService_1 = require("@modules/ms-repair-receipt/repairReceiptService");
const repairReceiptListRepairModel_1 = require("@modules/repair-receipt-list-repair/repairReceiptListRepairModel");
const repairReceiptListRepairRepository_1 = require("@modules/repair-receipt-list-repair/repairReceiptListRepairRepository");
const generateRepairReceiptListRepairBarcodeNumner_1 = require("@common/utils/generateRepairReceiptListRepairBarcodeNumner");
const ms_companiesRepository_1 = require("@modules/ms-companies/ms_companiesRepository");
exports.quotationService = {
    // ดึงข้อมูลทั้งหมดพร้อม Pagination
    findAll: (...args_1) => __awaiter(void 0, [...args_1], void 0, function* (page = 1, pageSize = 12, searchText = "", status = "all", company_id) {
        try {
            const skip = (page - 1) * pageSize; // คำนวณ offset
            const quotations = yield quotationRepository_1.quotationRepository.findAll(skip, pageSize, searchText, status, company_id); // ดึงข้อมูล
            const totalCount = yield quotationRepository_1.quotationRepository.count(searchText, status, company_id); // นับจำนวนทั้งหมด
            return new serviceResponse_1.ServiceResponse(serviceResponse_1.ResponseStatus.Success, "Get all success", {
                data: quotations,
                totalCount, // จำนวนข้อมูลทั้งหมด
                totalPages: Math.ceil(totalCount / pageSize), // จำนวนหน้าทั้งหมด
                status: status,
            }, http_status_codes_1.StatusCodes.OK);
        }
        catch (error) {
            return new serviceResponse_1.ServiceResponse(serviceResponse_1.ResponseStatus.Failed, "Error fetching quotations", null, http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR);
        }
    }),
    findAllApprove: (...args_1) => __awaiter(void 0, [...args_1], void 0, function* (page = 1, pageSize = 12, searchText = "", status = "all", company_id) {
        try {
            const skip = (page - 1) * pageSize; // คำนวณ offset
            const quotations = yield quotationRepository_1.quotationRepository.findAllApprove(skip, pageSize, searchText, status, company_id); // ดึงข้อมูล
            const totalCount = yield quotationRepository_1.quotationRepository.countApprove(searchText, status, company_id); // นับจำนวนทั้งหมด
            return new serviceResponse_1.ServiceResponse(serviceResponse_1.ResponseStatus.Success, "Get all success", {
                data: quotations,
                totalCount, // จำนวนข้อมูลทั้งหมด
                totalPages: Math.ceil(totalCount / pageSize), // จำนวนหน้าทั้งหมด
                status: status,
            }, http_status_codes_1.StatusCodes.OK);
        }
        catch (error) {
            return new serviceResponse_1.ServiceResponse(serviceResponse_1.ResponseStatus.Failed, "Error fetching quotations", null, http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR);
        }
    }),
    // สร้าง Quotation
    create: (payload, userId, company_id) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            payload.quotation_doc = yield (0, generateQuotationDoc_1.generateQuotationDoc)();
            payload.company_id = company_id;
            payload.created_by = userId;
            payload.updated_by = userId;
            payload.quotation_status = quotationModel_1.QUOTATION_STATUS.PENDING;
            payload.responsible_by = userId;
            payload.responsible_date = (0, dayjs_1.default)().format("YYYY-MM-DD HH:mm:ss");
            // สร้างข้อมูลใหม่
            const newQuotation = yield quotationRepository_1.quotationRepository.create(payload);
            const payloadLog = {
                quotation_id: newQuotation.quotation_id,
                quotation_status: quotationModel_1.QUOTATION_STATUS.PENDING,
                created_by: userId,
                company_id: company_id,
            };
            yield quotationLogStatusRepository_1.quotationLogStatusRepository.create(payloadLog);
            return new serviceResponse_1.ServiceResponse(serviceResponse_1.ResponseStatus.Success, "Create quotation success", newQuotation, http_status_codes_1.StatusCodes.OK);
        }
        catch (ex) {
            const errorMessage = `Error creating quotation: ${ex.message}`;
            return new serviceResponse_1.ServiceResponse(serviceResponse_1.ResponseStatus.Failed, errorMessage, null, http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR);
        }
    }),
    // อัปเดต Quotation
    update: (quotation_id, payload) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            // ตรวจสอบว่า quotation_doc มีอยู่หรือไม่
            const checkQuotation = yield quotationRepository_1.quotationRepository.findById(quotation_id);
            if (!checkQuotation) {
                return new serviceResponse_1.ServiceResponse(serviceResponse_1.ResponseStatus.Failed, "Quotation not found", null, http_status_codes_1.StatusCodes.BAD_REQUEST);
            }
            const quotationRepairs = checkQuotation.quotationRepair;
            const quotationIds = quotationRepairs
                .map((quotationRepair) => quotationRepair.id)
                .join(",");
            yield quotationRepairService_1.quotationRepairService.deleteByMultiId(quotationIds);
            if (payload.repair_summary) {
                const repairSummary = JSON.parse(payload.repair_summary);
                for (const rs of repairSummary) {
                    const payloadCreate = {
                        quotation_id: quotation_id,
                        master_repair_id: rs.master_repair_id,
                        price: parseInt(rs.price),
                    };
                    yield quotationRepairRepository_1.quotationRepairRepository.create(payloadCreate);
                }
            }
            // อัปเดตข้อมูล
            const updatedQuotation = yield quotationRepository_1.quotationRepository.update(quotation_id, payload);
            return new serviceResponse_1.ServiceResponse(serviceResponse_1.ResponseStatus.Success, "Update quotation success", updatedQuotation, http_status_codes_1.StatusCodes.OK);
        }
        catch (ex) {
            const errorMessage = `Error updating quotation: ${ex.message}`;
            return new serviceResponse_1.ServiceResponse(serviceResponse_1.ResponseStatus.Failed, errorMessage, null, http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR);
        }
    }),
    approve: (quotation_id, payload, userId, company_id) => __awaiter(void 0, void 0, void 0, function* () {
        payload.quotation_status = quotationModel_1.QUOTATION_STATUS.APPROVED;
        payload.approval_date = (0, dayjs_1.default)().format("YYYY-MM-DD HH:mm:ss");
        payload.approval_by = userId;
        payload.approval_notes = payload.approval_notes;
        try {
            // ตรวจสอบว่า quotation_doc มีอยู่หรือไม่
            const checkQuotation = yield quotationRepository_1.quotationRepository.findById(quotation_id);
            if (!checkQuotation) {
                return new serviceResponse_1.ServiceResponse(serviceResponse_1.ResponseStatus.Failed, "Quotation not found", null, http_status_codes_1.StatusCodes.BAD_REQUEST);
            }
            // อัปเดตข้อมูล
            const updatedQuotation = yield quotationRepository_1.quotationRepository.approve(quotation_id, payload);
            const payloadLog = {
                quotation_id,
                quotation_status: quotationModel_1.QUOTATION_STATUS.APPROVED,
                created_by: userId,
                remark: payload.approval_notes,
                company_id: company_id,
            };
            yield quotationLogStatusRepository_1.quotationLogStatusRepository.create(payloadLog);
            return new serviceResponse_1.ServiceResponse(serviceResponse_1.ResponseStatus.Success, "Approve quotation success", updatedQuotation, http_status_codes_1.StatusCodes.OK);
        }
        catch (ex) {
            const errorMessage = `Error approve quotation: ${ex.message}`;
            return new serviceResponse_1.ServiceResponse(serviceResponse_1.ResponseStatus.Failed, errorMessage, null, http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR);
        }
    }),
    reject: (quotation_id, payload, userId, company_id) => __awaiter(void 0, void 0, void 0, function* () {
        payload.quotation_status = quotationModel_1.QUOTATION_STATUS.REJECT_APPROVED;
        // payload.approval_date = dayjs().format("YYYY-MM-DD HH:mm:ss");
        // payload.approval_by = userId;
        // payload.approval_notes = payload.approval_notes;
        try {
            // ตรวจสอบว่า quotation_doc มีอยู่หรือไม่
            const checkQuotation = yield quotationRepository_1.quotationRepository.findById(quotation_id);
            if (!checkQuotation) {
                return new serviceResponse_1.ServiceResponse(serviceResponse_1.ResponseStatus.Failed, "Quotation not found", null, http_status_codes_1.StatusCodes.BAD_REQUEST);
            }
            // อัปเดตข้อมูล
            const updatedQuotation = yield quotationRepository_1.quotationRepository.reject(quotation_id, payload);
            const payloadLog = {
                quotation_id,
                quotation_status: quotationModel_1.QUOTATION_STATUS.REJECT_APPROVED,
                created_by: userId,
                remark: payload.approval_notes,
                company_id: company_id,
            };
            yield quotationLogStatusRepository_1.quotationLogStatusRepository.create(payloadLog);
            return new serviceResponse_1.ServiceResponse(serviceResponse_1.ResponseStatus.Success, "Approve quotation success", updatedQuotation, http_status_codes_1.StatusCodes.OK);
        }
        catch (ex) {
            const errorMessage = `Error approve quotation: ${ex.message}`;
            return new serviceResponse_1.ServiceResponse(serviceResponse_1.ResponseStatus.Failed, errorMessage, null, http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR);
        }
    }),
    requestApprove: (quotation_id, userId, company_id) => __awaiter(void 0, void 0, void 0, function* () {
        const payload = {
            quotation_status: quotationModel_1.QUOTATION_STATUS.WAITING_FOR_APPROVE,
        };
        try {
            // ตรวจสอบว่า quotation_doc มีอยู่หรือไม่
            const checkQuotation = yield quotationRepository_1.quotationRepository.findById(quotation_id);
            if (!checkQuotation) {
                return new serviceResponse_1.ServiceResponse(serviceResponse_1.ResponseStatus.Failed, "Quotation not found", null, http_status_codes_1.StatusCodes.BAD_REQUEST);
            }
            // อัปเดตข้อมูล
            const updatedQuotation = yield quotationRepository_1.quotationRepository.requestApprove(quotation_id, payload);
            const payloadLog = {
                quotation_id,
                quotation_status: quotationModel_1.QUOTATION_STATUS.WAITING_FOR_APPROVE,
                created_by: userId,
                company_id: company_id,
            };
            yield quotationLogStatusRepository_1.quotationLogStatusRepository.create(payloadLog);
            return new serviceResponse_1.ServiceResponse(serviceResponse_1.ResponseStatus.Success, "Request approve quotation success", updatedQuotation, http_status_codes_1.StatusCodes.OK);
        }
        catch (ex) {
            const errorMessage = `Error request approve quotation: ${ex.message}`;
            return new serviceResponse_1.ServiceResponse(serviceResponse_1.ResponseStatus.Failed, errorMessage, null, http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR);
        }
    }),
    requestEdit: (quotation_id, remark, userId, company_id) => __awaiter(void 0, void 0, void 0, function* () {
        const payload = {
            quotation_status: quotationModel_1.QUOTATION_STATUS.PENDING,
        };
        try {
            // ตรวจสอบว่า quotation_doc มีอยู่หรือไม่
            const checkQuotation = yield quotationRepository_1.quotationRepository.findById(quotation_id);
            if (!checkQuotation) {
                return new serviceResponse_1.ServiceResponse(serviceResponse_1.ResponseStatus.Failed, "Quotation not found", null, http_status_codes_1.StatusCodes.BAD_REQUEST);
            }
            // อัปเดตข้อมูล
            const updatedQuotation = yield quotationRepository_1.quotationRepository.requestEdit(quotation_id, payload);
            const payloadLog = {
                quotation_id,
                quotation_status: quotationModel_1.QUOTATION_STATUS.PENDING,
                created_by: userId,
                remark: remark,
                company_id: company_id,
            };
            yield quotationLogStatusRepository_1.quotationLogStatusRepository.create(payloadLog);
            return new serviceResponse_1.ServiceResponse(serviceResponse_1.ResponseStatus.Success, "Request edit quotation success", updatedQuotation, http_status_codes_1.StatusCodes.OK);
        }
        catch (ex) {
            const errorMessage = `Error request edit quotation: ${ex.message}`;
            return new serviceResponse_1.ServiceResponse(serviceResponse_1.ResponseStatus.Failed, errorMessage, null, http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR);
        }
    }),
    closeDeal: (quotation_id, payload, userId, company_id) => __awaiter(void 0, void 0, void 0, function* () {
        var _a, _b, _c, _d, _e;
        payload.quotation_status = quotationModel_1.QUOTATION_STATUS.CLOSE_DEAL;
        payload.deal_closed_date = (0, dayjs_1.default)().format("YYYY-MM-DD HH:mm:ss");
        payload.deal_closed_by = userId;
        try {
            // ตรวจสอบว่า quotation_doc มีอยู่หรือไม่
            const checkQuotation = yield quotationRepository_1.quotationRepository.findById(quotation_id);
            if (!checkQuotation) {
                return new serviceResponse_1.ServiceResponse(serviceResponse_1.ResponseStatus.Failed, "Quotation not found", null, http_status_codes_1.StatusCodes.BAD_REQUEST);
            }
            const companyData = yield ms_companiesRepository_1.companiesRepository.findByIdCompany(quotation_id);
            // อัปเดตข้อมูล
            const updatedQuotation = yield quotationRepository_1.quotationRepository.closeDeal(quotation_id, payload);
            const payloadLog = {
                quotation_id,
                quotation_status: quotationModel_1.QUOTATION_STATUS.CLOSE_DEAL,
                created_by: userId,
                company_id: company_id,
            };
            yield quotationLogStatusRepository_1.quotationLogStatusRepository.create(payloadLog);
            const payloadRepairReceipt = {
                quotation_id: quotation_id,
                repair_receipt_doc: "",
                repair_receipt_status: "",
                repair_receipt_at: "",
                estimated_date_repair_completion: "",
                expected_delivery_date: "",
                total_price: (_a = checkQuotation.total_price) !== null && _a !== void 0 ? _a : 0,
                tax: (_b = checkQuotation.tax) !== null && _b !== void 0 ? _b : 0,
                company_id: company_id,
            };
            const repairReceipt = yield repairReceiptService_1.repairReceiptService.create(payloadRepairReceipt, userId, company_id);
            if (payload.repair_summary && ((_c = repairReceipt.responseObject) === null || _c === void 0 ? void 0 : _c.id)) {
                const repairSummary = JSON.parse(payload.repair_summary);
                for (const rs of repairSummary) {
                    const payloadCreate = {
                        quotation_id: quotation_id,
                        master_repair_id: rs.master_repair_id,
                        master_repair_receipt_id: (_d = repairReceipt.responseObject) === null || _d === void 0 ? void 0 : _d.id,
                        price: parseInt(rs.price),
                        status: repairReceiptListRepairModel_1.REPAIR_RECEIPT_LIST_REPAIR_STATUS.PENDING,
                        barcode: yield (0, generateRepairReceiptListRepairBarcodeNumner_1.generateRepairReceiptListRepairBarcodeNumner)((_e = companyData === null || companyData === void 0 ? void 0 : companyData.company_code) !== null && _e !== void 0 ? _e : "C0001"),
                    };
                    yield repairReceiptListRepairRepository_1.repairReceiptListRepairRepository.create(payloadCreate, company_id);
                }
            }
            return new serviceResponse_1.ServiceResponse(serviceResponse_1.ResponseStatus.Success, "Approve quotation success", updatedQuotation, http_status_codes_1.StatusCodes.OK);
        }
        catch (ex) {
            const errorMessage = `Error approve quotation: ${ex.message}`;
            return new serviceResponse_1.ServiceResponse(serviceResponse_1.ResponseStatus.Failed, errorMessage, null, http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR);
        }
    }),
    cancel: (quotation_id, remark, userId, company_id) => __awaiter(void 0, void 0, void 0, function* () {
        const payload = {
            quotation_status: quotationModel_1.QUOTATION_STATUS.CANCEL,
        };
        try {
            // ตรวจสอบว่า quotation_doc มีอยู่หรือไม่
            const checkQuotation = yield quotationRepository_1.quotationRepository.findById(quotation_id);
            if (!checkQuotation) {
                return new serviceResponse_1.ServiceResponse(serviceResponse_1.ResponseStatus.Failed, "Quotation not found", null, http_status_codes_1.StatusCodes.BAD_REQUEST);
            }
            // อัปเดตข้อมูล
            const updatedQuotation = yield quotationRepository_1.quotationRepository.cancel(quotation_id, payload);
            const payloadLog = {
                quotation_id,
                quotation_status: quotationModel_1.QUOTATION_STATUS.CANCEL,
                created_by: userId,
                remark: remark,
                company_id: company_id,
            };
            yield quotationLogStatusRepository_1.quotationLogStatusRepository.create(payloadLog);
            return new serviceResponse_1.ServiceResponse(serviceResponse_1.ResponseStatus.Success, "cancel quotation success", updatedQuotation, http_status_codes_1.StatusCodes.OK);
        }
        catch (ex) {
            const errorMessage = `Error cancel quotation: ${ex.message}`;
            return new serviceResponse_1.ServiceResponse(serviceResponse_1.ResponseStatus.Failed, errorMessage, null, http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR);
        }
    }),
    // ลบ Quotation
    delete: (id) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const checkQuotation = yield quotationRepository_1.quotationRepository.findById(id);
            if (!checkQuotation) {
                return new serviceResponse_1.ServiceResponse(serviceResponse_1.ResponseStatus.Failed, "Quotation not found", null, http_status_codes_1.StatusCodes.BAD_REQUEST);
            }
            // ลบข้อมูล
            yield quotationRepository_1.quotationRepository.delete(id);
            if (checkQuotation.image_url) {
                yield fileService_1.fileService.delete(checkQuotation.image_url);
            }
            return new serviceResponse_1.ServiceResponse(serviceResponse_1.ResponseStatus.Success, "Delete quotation success", "Quotation deleted successfully", http_status_codes_1.StatusCodes.OK);
        }
        catch (ex) {
            const errorMessage = `Error deleting quotation: ${ex.message}`;
            return new serviceResponse_1.ServiceResponse(serviceResponse_1.ResponseStatus.Failed, errorMessage, null, http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR);
        }
    }),
    // ค้นหาตาม Doc
    findByDoc: (quotation_doc) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const quotation = yield quotationRepository_1.quotationRepository.findByQuotationDoc(quotation_doc);
            if (!quotation) {
                return new serviceResponse_1.ServiceResponse(serviceResponse_1.ResponseStatus.Failed, "Quotation not found", null, http_status_codes_1.StatusCodes.BAD_REQUEST);
            }
            return new serviceResponse_1.ServiceResponse(serviceResponse_1.ResponseStatus.Success, "Quotation found", quotation, http_status_codes_1.StatusCodes.OK);
        }
        catch (ex) {
            const errorMessage = `Error fetching quotation: ${ex.message}`;
            return new serviceResponse_1.ServiceResponse(serviceResponse_1.ResponseStatus.Failed, errorMessage, null, http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR);
        }
    }),
    findById: (id) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const quotation = yield quotationRepository_1.quotationRepository.findByQuotationId(id);
            if (!quotation) {
                return new serviceResponse_1.ServiceResponse(serviceResponse_1.ResponseStatus.Failed, "Quotation not found", null, http_status_codes_1.StatusCodes.BAD_REQUEST);
            }
            return new serviceResponse_1.ServiceResponse(serviceResponse_1.ResponseStatus.Success, "Quotation found", quotation, http_status_codes_1.StatusCodes.OK);
        }
        catch (ex) {
            const errorMessage = `Error fetching quotation: ${ex.message}`;
            return new serviceResponse_1.ServiceResponse(serviceResponse_1.ResponseStatus.Failed, errorMessage, null, http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR);
        }
    }),
    // ดึงเฉพาะ Quotation_doc
    findQuotationDocs: (companyId) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const quotationDocs = yield quotationRepository_1.quotationRepository.findQuotationDocs(companyId);
            return new serviceResponse_1.ServiceResponse(serviceResponse_1.ResponseStatus.Success, "Get quotation docs success", quotationDocs, http_status_codes_1.StatusCodes.OK);
        }
        catch (error) {
            return new serviceResponse_1.ServiceResponse(serviceResponse_1.ResponseStatus.Failed, "Error fetching quotation docs", null, http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR);
        }
    }),
    // ดึงเฉพาะ ResponsibleBy
    findResponsibleBy: (quotationDoc, companyId) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const data = yield quotationRepository_1.quotationRepository.findResponsibleBy(quotationDoc);
            if (!data.length) {
                return new serviceResponse_1.ServiceResponse(serviceResponse_1.ResponseStatus.Failed, `No responsible_by found for quotation_doc: ${quotationDoc}`, null, http_status_codes_1.StatusCodes.NOT_FOUND);
            }
            return new serviceResponse_1.ServiceResponse(serviceResponse_1.ResponseStatus.Success, "Get responsible_by success", data, http_status_codes_1.StatusCodes.OK);
        }
        catch (error) {
            return new serviceResponse_1.ServiceResponse(serviceResponse_1.ResponseStatus.Failed, "Error fetching responsible_by", null, http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR);
        }
    }),
    // findCalendarRemoval: async (id: string, companyId: string) => {
    //   try {
    //     const quotation = await prisma.master_quotation.findUnique({
    //       where: {
    //         quotation_id: id,
    //         company_id: companyId,
    //       },
    //       select: {
    //         quotation_doc: true,
    //         appointment_date: true,
    //         addr_number: true,
    //         addr_alley: true,
    //         addr_street: true,
    //         addr_subdistrict: true,
    //         addr_district: true,
    //         addr_province: true,
    //         customer_name: true,
    //         contact_number: true,
    //         master_repair_receipt: {
    //           select: {
    //             id: true,
    //             repair_receipt_doc: true,
    //             expected_delivery_date: true,
    //             register: true,
    //             master_delivery_schedule: {
    //               select: {
    //                 status: true,
    //               }
    //             }
    //           },
    //         },
    //         master_customer: {
    //           select: {
    //             customer_name: true,
    //           },
    //         },
    //         master_brand: {
    //           select: {
    //             brand_name: true,
    //           },
    //         },
    //         master_brandmodel: {
    //           select: {
    //             brandmodel_name: true,
    //           },
    //         },
    //         master_color: {
    //           select: {
    //             color_name: true,
    //           },
    //         },
    //       },
    //     });
    //     if (!quotation) {
    //       return new ServiceResponse(
    //         ResponseStatus.Failed,
    //         "Quotation not found",
    //         null,
    //         StatusCodes.BAD_REQUEST
    //       );
    //     }
    //     return new ServiceResponse(
    //       ResponseStatus.Success,
    //       "Calendar removal details found",
    //       quotation,
    //       StatusCodes.OK
    //     );
    //   } catch (ex) {
    //     const errorMessage = `Error fetching calendar removal details: ${(ex as Error).message}`;
    //     return new ServiceResponse(
    //       ResponseStatus.Failed,
    //       errorMessage,
    //       null,
    //       StatusCodes.INTERNAL_SERVER_ERROR
    //     );
    //   }
    // },
    findCalendarRemoval: (companyId, startDateFilter, endDateFilter) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const data = yield quotationRepository_1.quotationRepository.showCalendarRemoval(companyId, startDateFilter, endDateFilter);
            if (!data) {
                return new serviceResponse_1.ServiceResponse(serviceResponse_1.ResponseStatus.Failed, "Quotation not found", null, http_status_codes_1.StatusCodes.BAD_REQUEST);
            }
            return new serviceResponse_1.ServiceResponse(serviceResponse_1.ResponseStatus.Success, "Calendar removal details found", data, http_status_codes_1.StatusCodes.OK);
        }
        catch (ex) {
            const errorMessage = `Error fetching calendar removal details: ${ex.message}`;
            return new serviceResponse_1.ServiceResponse(serviceResponse_1.ResponseStatus.Failed, errorMessage, null, http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR);
        }
    })
};
