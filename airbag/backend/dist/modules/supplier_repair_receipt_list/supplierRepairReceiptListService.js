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
exports.supplierRepairReceiptListService = void 0;
const http_status_codes_1 = require("http-status-codes");
const serviceResponse_1 = require("@common/models/serviceResponse");
const supplierRepairReceiptListRepository_1 = require("./supplierRepairReceiptListRepository");
const client_1 = require("@prisma/client");
exports.supplierRepairReceiptListService = {
    findAll: (companyId_1, ...args_1) => __awaiter(void 0, [companyId_1, ...args_1], void 0, function* (companyId, page = 1, pageSize = 12, searchText = "") {
        try {
            const skip = (page - 1) * pageSize;
            const receiptLists = yield supplierRepairReceiptListRepository_1.supplierRepairReceiptListRepository.findAll(companyId, skip, pageSize, searchText);
            if (!receiptLists) {
                return new serviceResponse_1.ServiceResponse(serviceResponse_1.ResponseStatus.Failed, "No repair receipt lists found", null, http_status_codes_1.StatusCodes.NOT_FOUND);
            }
            const totalCount = yield supplierRepairReceiptListRepository_1.supplierRepairReceiptListRepository.count(companyId, searchText);
            return new serviceResponse_1.ServiceResponse(serviceResponse_1.ResponseStatus.Success, "Get all success", {
                data: receiptLists,
                totalCount,
                totalPages: Math.ceil(totalCount / pageSize),
            }, http_status_codes_1.StatusCodes.OK);
        }
        catch (ex) {
            return new serviceResponse_1.ServiceResponse(serviceResponse_1.ResponseStatus.Failed, "Error fetching repair receipt lists", ex.message, http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR);
        }
    }),
    create: (companyId, userId, payload) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            // 1. ตรวจสอบ Input ที่จำเป็น
            if (!payload.supplier_repair_receipt_id) {
                return new serviceResponse_1.ServiceResponse(serviceResponse_1.ResponseStatus.Failed, "supplier_repair_receipt_id is required to create a list item", null, http_status_codes_1.StatusCodes.BAD_REQUEST);
            }
            // อาจจะตรวจสอบ field อื่นๆ ที่จำเป็น เช่น master_repair_id, repair_receipt_id
            // 2. เรียก Repository เพื่อสร้างรายการใหม่ *เท่านั้น*
            // *** ไม่ควรมีการตรวจสอบ findFirst แบบเดิมที่อาจคืนค่าเก่า ***
            const newReceiptList = yield supplierRepairReceiptListRepository_1.supplierRepairReceiptListRepository.create(companyId, userId, payload);
            return new serviceResponse_1.ServiceResponse(serviceResponse_1.ResponseStatus.Success, "Create repair receipt list item success", // แก้ไขข้อความ
            newReceiptList, http_status_codes_1.StatusCodes.CREATED // ใช้ CREATED สำหรับการสร้างใหม่
            );
        }
        catch (ex) {
            // ตรวจสอบว่าเป็น Error จาก Unique Constraint หรือไม่ (ถ้ามี)
            if (ex instanceof client_1.Prisma.PrismaClientKnownRequestError && ex.code === 'P2002') {
                return new serviceResponse_1.ServiceResponse(serviceResponse_1.ResponseStatus.Failed, "Duplicate entry: This repair item might already exist for this receipt.", // ข้อความแจ้งเตือนผู้ใช้
                null, // ไม่ส่ง error message เต็มๆ กลับไป
                http_status_codes_1.StatusCodes.CONFLICT // ใช้ CONFLICT สำหรับ duplicate
                );
            }
            console.error("Error creating repair receipt list item:", ex); // แก้ไขข้อความ
            return new serviceResponse_1.ServiceResponse(serviceResponse_1.ResponseStatus.Failed, "Error creating repair receipt list item", // แก้ไขข้อความ
            ex.message, http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR);
        }
    }),
    update: (companyId, userId, id, payload) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const receiptList = yield supplierRepairReceiptListRepository_1.supplierRepairReceiptListRepository.findByIdAsync(companyId, id);
            if (!receiptList) {
                return new serviceResponse_1.ServiceResponse(serviceResponse_1.ResponseStatus.Failed, "Repair receipt list not found", null, http_status_codes_1.StatusCodes.BAD_REQUEST);
            }
            const updatedReceiptList = yield supplierRepairReceiptListRepository_1.supplierRepairReceiptListRepository.update(companyId, userId, id, payload);
            return new serviceResponse_1.ServiceResponse(serviceResponse_1.ResponseStatus.Success, "Update repair receipt list success", updatedReceiptList, http_status_codes_1.StatusCodes.OK);
        }
        catch (ex) {
            return new serviceResponse_1.ServiceResponse(serviceResponse_1.ResponseStatus.Failed, "Error updating repair receipt list", ex.message, http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR);
        }
    }),
    delete: (companyId, id) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            // 1. Find the record first
            const receiptList = yield supplierRepairReceiptListRepository_1.supplierRepairReceiptListRepository.findByIdAsync(companyId, id);
            if (!receiptList) {
                return new serviceResponse_1.ServiceResponse(serviceResponse_1.ResponseStatus.Failed, "Repair receipt list not found", null, http_status_codes_1.StatusCodes.NOT_FOUND // Changed to NOT_FOUND as it's more appropriate
                );
            }
            // 2. NEW CHECK: Check if referenced in send_for_a_claim_list
            const isReferenced = yield supplierRepairReceiptListRepository_1.supplierRepairReceiptListRepository.checkIfReferencedInSendForClaim(companyId, id);
            if (isReferenced) {
                return new serviceResponse_1.ServiceResponse(serviceResponse_1.ResponseStatus.Failed, "Cannot delete: Record is referenced in 'Send For Claim List'.", // Specific error message
                null, http_status_codes_1.StatusCodes.BAD_REQUEST // Use BAD_REQUEST as the request is invalid due to dependencies
                );
            }
            // 4. If all checks pass, perform deletion
            yield supplierRepairReceiptListRepository_1.supplierRepairReceiptListRepository.delete(companyId, id);
            return new serviceResponse_1.ServiceResponse(serviceResponse_1.ResponseStatus.Success, "Delete repair receipt list success", null, http_status_codes_1.StatusCodes.OK);
        }
        catch (ex) {
            // Log the actual error for debugging
            console.error("Error deleting repair receipt list:", ex);
            return new serviceResponse_1.ServiceResponse(serviceResponse_1.ResponseStatus.Failed, "Error deleting repair receipt list", (ex instanceof Error) ? ex.message : "An unexpected error occurred", // More robust error handling
            http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR);
        }
    }),
    findOne: (companyId, id) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const receiptList = yield supplierRepairReceiptListRepository_1.supplierRepairReceiptListRepository.findByIdAsync(companyId, id);
            if (!receiptList) {
                return new serviceResponse_1.ServiceResponse(serviceResponse_1.ResponseStatus.Failed, "Repair receipt list not found", null, http_status_codes_1.StatusCodes.BAD_REQUEST);
            }
            return new serviceResponse_1.ServiceResponse(serviceResponse_1.ResponseStatus.Success, "Get repair receipt list success", receiptList, http_status_codes_1.StatusCodes.OK);
        }
        catch (ex) {
            return new serviceResponse_1.ServiceResponse(serviceResponse_1.ResponseStatus.Failed, "Error getting repair receipt list", ex.message, http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR);
        }
    }),
    updateFinishStatus: (companyId, userId, supplierDeliveryNoteRepairReceiptListId, finish, finishByReceiptDoc, supplier_repair_receipt_id // เพิ่มพารามิเตอร์นี้
    ) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const updatedList = yield supplierRepairReceiptListRepository_1.supplierRepairReceiptListRepository.updateFinishStatus(companyId, userId, supplierDeliveryNoteRepairReceiptListId, finish, finishByReceiptDoc, supplier_repair_receipt_id // ส่งค่าไป Repository
            );
            if (!updatedList || updatedList.length === 0) {
                return {
                    success: false,
                    message: "Repair receipt list not found",
                    responseObject: null,
                    statusCode: 404
                };
            }
            return {
                success: true,
                message: "Update finish status success",
                responseObject: updatedList,
                statusCode: 200
            };
        }
        catch (ex) {
            return {
                success: false,
                message: "Error updating finish status",
                responseObject: ex.message,
                statusCode: 500
            };
        }
    }),
    findPayloadList: (companyId, supplier_repair_receipt_id, supplier_delivery_note_id) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const receipts = yield supplierRepairReceiptListRepository_1.supplierRepairReceiptListRepository.findPayloadListById(companyId, supplier_repair_receipt_id, supplier_delivery_note_id);
            if (!receipts) {
                return new serviceResponse_1.ServiceResponse(serviceResponse_1.ResponseStatus.Failed, `No repair receipts found for the specified IDs`, null, http_status_codes_1.StatusCodes.NOT_FOUND);
            }
            const formattedReceipts = receipts.map(receipt => {
                var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o;
                // นำข้อมูลจาก supplier_delivery_note_repair_receipt_list มาก่อน
                const deliveryNoteRepairItems = ((_a = receipt.supplier_delivery_note) === null || _a === void 0 ? void 0 : _a.supplier_delivery_note_repair_receipt_list.map(item => {
                    var _a, _b, _c, _d;
                    // แก้ไขตรงนี้ - ตรวจสอบว่า supplier_repair_receipt_list เป็น array และมีข้อมูล
                    const relatedSupplierRepairReceiptList = item.supplier_repair_receipt_list &&
                        Array.isArray(item.supplier_repair_receipt_list) &&
                        item.supplier_repair_receipt_list.length > 0
                        ? item.supplier_repair_receipt_list[0] : null;
                    return {
                        supplier_delivery_note_repair_receipt_list_id: item.supplier_delivery_note_repair_receipt_list_id,
                        repair_receipt_doc: ((_a = item.master_repair_receipt) === null || _a === void 0 ? void 0 : _a.repair_receipt_doc) || null,
                        master_repair_name: ((_b = item.master_repair) === null || _b === void 0 ? void 0 : _b.master_repair_name) || "",
                        master_repair_receipt_id: ((_c = item.master_repair_receipt) === null || _c === void 0 ? void 0 : _c.id) || "",
                        master_repair_id: ((_d = item.master_repair) === null || _d === void 0 ? void 0 : _d.master_repair_id) || "",
                        price: item.price || 0,
                        quantity: item.quantity || 1,
                        total_price: item.total_price || 0,
                        status: item.status || "pending",
                        supplier_repair_receipt_list: relatedSupplierRepairReceiptList ? {
                            id: relatedSupplierRepairReceiptList.id,
                            price: relatedSupplierRepairReceiptList.price,
                            quantity: relatedSupplierRepairReceiptList.quantity,
                            total_price: relatedSupplierRepairReceiptList.total_price,
                            finish: relatedSupplierRepairReceiptList.finish,
                            finish_by_receipt_doc: relatedSupplierRepairReceiptList.finish_by_receipt_doc,
                            supplier_repair_receipt_id: relatedSupplierRepairReceiptList.supplier_repair_receipt_id
                        } : null
                    };
                })) || [];
                // ใช้ Map เพื่อจัดการข้อมูลจากทั้งสองแหล่ง
                const repairItemsMap = new Map();
                // เพิ่มข้อมูลจาก supplier_repair_receipt_lists ก่อน
                receipt.supplier_repair_receipt_lists.forEach(item => {
                    var _a, _b, _c, _d, _e, _f;
                    const key = `${((_a = item.master_repair) === null || _a === void 0 ? void 0 : _a.master_repair_id) || ""}_${((_b = item.master_repair_receipt) === null || _b === void 0 ? void 0 : _b.id) || ""}`;
                    repairItemsMap.set(key, {
                        supplier_repair_receipt_lists_id: item.id,
                        receipt_doc: receipt.receipt_doc,
                        repair_receipt_doc: ((_c = item.master_repair_receipt) === null || _c === void 0 ? void 0 : _c.repair_receipt_doc) || null,
                        master_repair_name: ((_d = item.master_repair) === null || _d === void 0 ? void 0 : _d.master_repair_name) || "",
                        master_repair_receipt_id: ((_e = item.master_repair_receipt) === null || _e === void 0 ? void 0 : _e.id) || "",
                        master_repair_id: ((_f = item.master_repair) === null || _f === void 0 ? void 0 : _f.master_repair_id) || "",
                        price: item.price || 0,
                        quantity: item.quantity || 1,
                        total_price: item.total_price || 0,
                        finish: item.finish,
                        finish_by_receipt_doc: item.finish_by_receipt_doc || null,
                    });
                });
                // เพิ่มหรืออัปเดตจาก delivery_note_repair_items
                deliveryNoteRepairItems.forEach(item => {
                    var _a, _b;
                    const key = `${item.master_repair_id}_${item.master_repair_receipt_id}`;
                    // ถ้าไม่มีข้อมูลในแมป ให้เพิ่มเข้าไป
                    if (!repairItemsMap.has(key) && item.supplier_repair_receipt_list) {
                        repairItemsMap.set(key, {
                            supplier_repair_receipt_lists_id: item.supplier_repair_receipt_list.id,
                            receipt_doc: receipt.receipt_doc || null,
                            repair_receipt_doc: item.repair_receipt_doc,
                            master_repair_name: item.master_repair_name,
                            master_repair_receipt_id: item.master_repair_receipt_id,
                            master_repair_id: item.master_repair_id,
                            price: item.price,
                            quantity: item.quantity,
                            total_price: item.total_price,
                            finish: ((_a = item.supplier_repair_receipt_list) === null || _a === void 0 ? void 0 : _a.finish) || false,
                            finish_by_receipt_doc: ((_b = item.supplier_repair_receipt_list) === null || _b === void 0 ? void 0 : _b.finish_by_receipt_doc) || null,
                        });
                    }
                });
                // แปลงแมปกลับเป็นอาร์เรย์
                const allRepairItems = Array.from(repairItemsMap.values());
                return {
                    supplier_repair_receipt_id: receipt.id,
                    receipt_doc: receipt.receipt_doc,
                    supplier_delivery_note_id: receipt.supplier_delivery_note_id,
                    supplier_delivery_note_doc: (_b = receipt.supplier_delivery_note) === null || _b === void 0 ? void 0 : _b.supplier_delivery_note_doc,
                    date_of_submission: (_c = receipt.supplier_delivery_note) === null || _c === void 0 ? void 0 : _c.date_of_submission,
                    due_date: (_d = receipt.supplier_delivery_note) === null || _d === void 0 ? void 0 : _d.due_date,
                    amount: (_e = receipt.supplier_delivery_note) === null || _e === void 0 ? void 0 : _e.amount,
                    delivery_note_status: (_f = receipt.supplier_delivery_note) === null || _f === void 0 ? void 0 : _f.status,
                    contact_name: (_g = receipt.supplier_delivery_note) === null || _g === void 0 ? void 0 : _g.contact_name,
                    contact_number: (_h = receipt.supplier_delivery_note) === null || _h === void 0 ? void 0 : _h.contact_number,
                    payment_terms: (_j = receipt.supplier_delivery_note) === null || _j === void 0 ? void 0 : _j.payment_terms,
                    payment_terms_day: (_k = receipt.supplier_delivery_note) === null || _k === void 0 ? void 0 : _k.payment_terms_day,
                    remark: (_l = receipt.supplier_delivery_note) === null || _l === void 0 ? void 0 : _l.remark,
                    repair_date_supplier_repair_receipt: receipt.repair_date_supplier_repair_receipt,
                    supplier_name: (_m = receipt.master_supplier) === null || _m === void 0 ? void 0 : _m.supplier_name,
                    supplier_code: (_o = receipt.master_supplier) === null || _o === void 0 ? void 0 : _o.supplier_code,
                    status: receipt.status,
                    repair_items: allRepairItems,
                    delivery_note_repair_items: deliveryNoteRepairItems
                };
            });
            return new serviceResponse_1.ServiceResponse(serviceResponse_1.ResponseStatus.Success, "Get repair receipt list payload success", formattedReceipts, http_status_codes_1.StatusCodes.OK);
        }
        catch (ex) {
            console.error('Error in findPayloadList:', ex);
            return new serviceResponse_1.ServiceResponse(serviceResponse_1.ResponseStatus.Failed, "Error getting repair receipt list payload", ex.message, http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR);
        }
    }),
    updateSupplierRepairReceiptId: (companyId, userId, id, supplier_repair_receipt_id) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const receiptList = yield supplierRepairReceiptListRepository_1.supplierRepairReceiptListRepository.findByIdAsync(companyId, id);
            if (!receiptList) {
                return new serviceResponse_1.ServiceResponse(serviceResponse_1.ResponseStatus.Failed, "Repair receipt list not found", null, http_status_codes_1.StatusCodes.BAD_REQUEST);
            }
            const updatedReceiptList = yield supplierRepairReceiptListRepository_1.supplierRepairReceiptListRepository.updateSupplierRepairReceiptId(companyId, userId, id, supplier_repair_receipt_id);
            return new serviceResponse_1.ServiceResponse(serviceResponse_1.ResponseStatus.Success, "Update supplier repair receipt ID success", updatedReceiptList, http_status_codes_1.StatusCodes.OK);
        }
        catch (ex) {
            return new serviceResponse_1.ServiceResponse(serviceResponse_1.ResponseStatus.Failed, "Error updating supplier repair receipt ID", ex.message, http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR);
        }
    }),
};
