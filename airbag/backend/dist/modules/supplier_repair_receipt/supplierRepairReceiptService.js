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
exports.supplierRepairReceiptService = void 0;
const http_status_codes_1 = require("http-status-codes");
const serviceResponse_1 = require("@common/models/serviceResponse");
const supplierRepairReceiptRepository_1 = require("./supplierRepairReceiptRepository");
const db_1 = __importDefault(require("@src/db"));
exports.supplierRepairReceiptService = {
    findAll: (companyId_1, ...args_1) => __awaiter(void 0, [companyId_1, ...args_1], void 0, function* (companyId, page = 1, pageSize = 12, searchText = "") {
        try {
            const skip = (page - 1) * pageSize;
            const receipts = yield supplierRepairReceiptRepository_1.supplierRepairReceiptRepository.findAll(companyId, skip, pageSize, searchText);
            if (!receipts) {
                return new serviceResponse_1.ServiceResponse(serviceResponse_1.ResponseStatus.Failed, "No repair receipts found", null, http_status_codes_1.StatusCodes.NOT_FOUND);
            }
            const totalCount = yield supplierRepairReceiptRepository_1.supplierRepairReceiptRepository.count(companyId, searchText);
            return new serviceResponse_1.ServiceResponse(serviceResponse_1.ResponseStatus.Success, "Get all success", {
                data: receipts,
                totalCount,
                totalPages: Math.ceil(totalCount / pageSize),
            }, http_status_codes_1.StatusCodes.OK);
        }
        catch (ex) {
            return new serviceResponse_1.ServiceResponse(serviceResponse_1.ResponseStatus.Failed, "Error fetching repair receipts", ex.message, http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR);
        }
    }),
    create: (companyId, userId, supplierDeliveryNoteId) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            // 1. Find the related supplier_delivery_note to get supplier_id (if needed)
            const existingNote = yield supplierRepairReceiptRepository_1.supplierRepairReceiptRepository.findSupplierDeliveryNoteById(supplierDeliveryNoteId);
            if (!existingNote) {
                return new serviceResponse_1.ServiceResponse(serviceResponse_1.ResponseStatus.Failed, "Supplier delivery note not found", null, http_status_codes_1.StatusCodes.NOT_FOUND);
            }
            // 2. Call repository's create function, passing necessary IDs
            // The repository will now handle the creation and inclusion of related data
            const newReceiptWithIncludes = yield supplierRepairReceiptRepository_1.supplierRepairReceiptRepository.create(companyId, userId, supplierDeliveryNoteId, existingNote.supplier_id // Pass the supplier_id
            );
            // No need to manually check if newReceipt exists if repo throws on failure
            // Repository's create now returns the object with included relations
            return new serviceResponse_1.ServiceResponse(serviceResponse_1.ResponseStatus.Success, "Repair receipt header created successfully with related data", // Updated message
            newReceiptWithIncludes, // Return the enriched object
            http_status_codes_1.StatusCodes.CREATED);
        }
        catch (ex) {
            console.error("Error creating repair receipt header:", ex);
            // Handle potential Prisma errors (like unique constraint violation if receipt_doc generation is flawed)
            // if (ex instanceof Prisma.PrismaClientKnownRequestError && ex.code === 'P2002') { ... }
            return new serviceResponse_1.ServiceResponse(serviceResponse_1.ResponseStatus.Failed, "Error creating repair receipt header", ex.message, http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR);
        }
    }),
    update: (companyId, userId, id, payload) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            // ตรวจสอบว่ามีค่า repair_date_supplier_repair_receipt หรือไม่ แล้วแปลงเป็น Date
            const updatedPayload = Object.assign(Object.assign({}, payload), { repair_date_supplier_repair_receipt: payload.repair_date_supplier_repair_receipt
                    ? new Date(payload.repair_date_supplier_repair_receipt)
                    : undefined, updated_by: userId, updated_at: new Date() });
            const updatedReceipt = yield db_1.default.supplier_repair_receipt.update({
                where: {
                    company_id: companyId,
                    id: id,
                },
                data: updatedPayload,
            });
            return new serviceResponse_1.ServiceResponse(serviceResponse_1.ResponseStatus.Success, "Update repair receipt success", updatedReceipt, http_status_codes_1.StatusCodes.OK);
        }
        catch (ex) {
            return new serviceResponse_1.ServiceResponse(serviceResponse_1.ResponseStatus.Failed, "Error updating repair receipt", ex.message, http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR);
        }
    }),
    delete: (companyId, userId, id) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const result = yield db_1.default.$transaction((tx) => __awaiter(void 0, void 0, void 0, function* () {
                const receiptExists = yield tx.supplier_repair_receipt.findUnique({
                    where: { id: id, company_id: companyId },
                    select: { id: true } // Just need to know if it exists
                });
                if (!receiptExists) {
                    throw new serviceResponse_1.ServiceResponse(serviceResponse_1.ResponseStatus.Failed, "Repair receipt not found", null, http_status_codes_1.StatusCodes.NOT_FOUND);
                }
                const claimListReference = yield tx.send_for_a_claim_list.findFirst({
                    where: {
                        supplier_repair_receipt_list: {
                            supplier_repair_receipt_id: id
                        },
                        company_id: companyId
                    },
                    select: { send_for_a_claim_list_id: true }
                });
                if (claimListReference) {
                    throw new serviceResponse_1.ServiceResponse(serviceResponse_1.ResponseStatus.Failed, "Cannot delete: Associated list items are referenced in 'Send For Claim List'.", null, http_status_codes_1.StatusCodes.BAD_REQUEST);
                }
                const claimReference = yield tx.send_for_a_claim.findFirst({
                    where: { supplier_repair_receipt_id: id, company_id: companyId },
                    select: { send_for_a_claim_id: true }
                });
                if (claimReference) {
                    throw new serviceResponse_1.ServiceResponse(serviceResponse_1.ResponseStatus.Failed, "Cannot delete: This repair receipt is referenced in 'Send For Claim'.", null, http_status_codes_1.StatusCodes.BAD_REQUEST);
                }
                yield tx.supplier_repair_receipt_list.deleteMany({
                    where: {
                        supplier_repair_receipt_id: id, // Target all children of the receipt being deleted
                        company_id: companyId // Ensure company scope
                    }
                });
                yield tx.supplier_repair_receipt.delete({
                    where: { id: id, company_id: companyId },
                });
                // Update success message
                return new serviceResponse_1.ServiceResponse(serviceResponse_1.ResponseStatus.Success, "Repair receipt and related list items deleted successfully.", null, http_status_codes_1.StatusCodes.OK);
            }));
            return result;
        }
        catch (ex) {
            console.error("Error processing repair receipt deletion:", ex); // Updated log message
            if (ex instanceof serviceResponse_1.ServiceResponse) {
                return ex;
            }
            return new serviceResponse_1.ServiceResponse(serviceResponse_1.ResponseStatus.Failed, "Error processing repair receipt deletion", (ex instanceof Error) ? ex.message : "An unexpected error occurred", http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR);
        }
    }),
    findOne: (companyId, id) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const receipt = yield supplierRepairReceiptRepository_1.supplierRepairReceiptRepository.findByIdAsync(companyId, id);
            if (!receipt) {
                return new serviceResponse_1.ServiceResponse(serviceResponse_1.ResponseStatus.Failed, "Repair receipt not found", null, http_status_codes_1.StatusCodes.BAD_REQUEST);
            }
            return new serviceResponse_1.ServiceResponse(serviceResponse_1.ResponseStatus.Success, "Get repair receipt success", receipt, http_status_codes_1.StatusCodes.OK);
        }
        catch (ex) {
            return new serviceResponse_1.ServiceResponse(serviceResponse_1.ResponseStatus.Failed, "Error getting repair receipt", ex.message, http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR);
        }
    }),
    findPayload: (companyId, id) => __awaiter(void 0, void 0, void 0, function* () {
        var _a, _b, _c, _d;
        try {
            const receipt = yield supplierRepairReceiptRepository_1.supplierRepairReceiptRepository.findPayloadById(companyId, id);
            if (!receipt) {
                return new serviceResponse_1.ServiceResponse(serviceResponse_1.ResponseStatus.Failed, "Repair receipt not found", null, http_status_codes_1.StatusCodes.NOT_FOUND);
            }
            const payload = {
                receipt_doc: receipt.receipt_doc,
                supplier_delivery_note_doc: (_a = receipt.supplier_delivery_note) === null || _a === void 0 ? void 0 : _a.supplier_delivery_note_doc,
                date_of_submission: (_b = receipt.supplier_delivery_note) === null || _b === void 0 ? void 0 : _b.date_of_submission,
                repair_date_supplier_repair_receipt: receipt.repair_date_supplier_repair_receipt,
                supplier_name: (_c = receipt.master_supplier) === null || _c === void 0 ? void 0 : _c.supplier_name,
                amount: (_d = receipt.supplier_delivery_note) === null || _d === void 0 ? void 0 : _d.amount,
            };
            return new serviceResponse_1.ServiceResponse(serviceResponse_1.ResponseStatus.Success, "Get repair receipt payload success", payload, http_status_codes_1.StatusCodes.OK);
        }
        catch (ex) {
            return new serviceResponse_1.ServiceResponse(serviceResponse_1.ResponseStatus.Failed, "Error getting repair receipt payload", ex.message, http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR);
        }
    }),
    findReceiptDocsByCompanyId: (companyId) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const docsResult = yield supplierRepairReceiptRepository_1.supplierRepairReceiptRepository.findReceiptDocsByCompanyId(companyId);
            if (!docsResult || docsResult.length === 0) {
                return new serviceResponse_1.ServiceResponse(serviceResponse_1.ResponseStatus.Success, // หรือ Failed + NOT_FOUND
                "No supplier repair receipt documents found for this company.", [], // คืนค่า Array ว่างที่ตรงกับ SupplierReceiptDocItem[]
                http_status_codes_1.StatusCodes.OK // หรือ NOT_FOUND
                );
            }
            return new serviceResponse_1.ServiceResponse(serviceResponse_1.ResponseStatus.Success, "Successfully fetched supplier repair receipt documents.", docsResult, // <-- คืนค่า docsResult โดยตรง ซึ่งเป็น SupplierReceiptDocItem[]
            http_status_codes_1.StatusCodes.OK);
        }
        catch (error) {
            const errorMessage = `Error fetching supplier repair receipt documents: ${error.message}`;
            console.error(errorMessage);
            return new serviceResponse_1.ServiceResponse(serviceResponse_1.ResponseStatus.Failed, errorMessage, [], http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR);
        }
    }),
    findResponsibleUserForSupplierRepairReceipt: (companyId, id) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const repairReceiptData = yield supplierRepairReceiptRepository_1.supplierRepairReceiptRepository.findOnlyResponsibleUserForSupplierRepairReceipt(companyId, id);
            if (!repairReceiptData) { // ตรวจสอบว่า supplier repair receipt มีอยู่จริง
                return new serviceResponse_1.ServiceResponse(serviceResponse_1.ResponseStatus.Failed, "Supplier repair receipt not found.", null, http_status_codes_1.StatusCodes.NOT_FOUND);
            }
            if (!repairReceiptData.responsible_by_user) { // ตรวจสอบว่ามีข้อมูลผู้รับผิดชอบหรือไม่
                return new serviceResponse_1.ServiceResponse(serviceResponse_1.ResponseStatus.Success, "No responsible user assigned to this supplier repair receipt.", null, http_status_codes_1.StatusCodes.OK // หรือ NOT_FOUND ถ้าต้องการ
                );
            }
            // คืนเฉพาะส่วน responsible_by_user
            return new serviceResponse_1.ServiceResponse(serviceResponse_1.ResponseStatus.Success, "Responsible user found for supplier repair receipt.", repairReceiptData.responsible_by_user, // ส่งเฉพาะ object นี้กลับไป
            http_status_codes_1.StatusCodes.OK);
        }
        catch (ex) {
            const errorMessage = `Error fetching responsible user for supplier repair receipt: ${ex.message}`;
            return new serviceResponse_1.ServiceResponse(serviceResponse_1.ResponseStatus.Failed, errorMessage, null, http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR);
        }
    }),
    select: (companyId_1, ...args_1) => __awaiter(void 0, [companyId_1, ...args_1], void 0, function* (companyId, searchText = "") {
        try {
            const data = yield supplierRepairReceiptRepository_1.supplierRepairReceiptRepository.select(companyId, searchText);
            return new serviceResponse_1.ServiceResponse(serviceResponse_1.ResponseStatus.Success, "Select success", { data }, http_status_codes_1.StatusCodes.OK);
        }
        catch (error) {
            return new serviceResponse_1.ServiceResponse(serviceResponse_1.ResponseStatus.Failed, "Error fetching select", null, http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR);
        }
    }),
};
