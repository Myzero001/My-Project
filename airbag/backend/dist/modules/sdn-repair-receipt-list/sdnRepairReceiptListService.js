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
exports.supplierDeliveryRRListNoteService = void 0;
const http_status_codes_1 = require("http-status-codes");
const serviceResponse_1 = require("@common/models/serviceResponse");
const sdnRepairReceiptListRepository_1 = require("@modules/sdn-repair-receipt-list/sdnRepairReceiptListRepository");
exports.supplierDeliveryRRListNoteService = {
    findAll: (companyId_1, ...args_1) => __awaiter(void 0, [companyId_1, ...args_1], void 0, function* (companyId, page = 1, pageSize = 12, searchText = "", supplier_delivery_note_id) {
        try {
            const skip = (page - 1) * pageSize;
            const SupplierDeliveryNoteRepairReceiptList = yield sdnRepairReceiptListRepository_1.supplierDeliveryNoteRRListRepository.findAll(companyId, skip, pageSize, searchText, supplier_delivery_note_id);
            if (!SupplierDeliveryNoteRepairReceiptList) {
                return new serviceResponse_1.ServiceResponse(serviceResponse_1.ResponseStatus.Failed, "No Supplier Delivery Note Repair Receipt List found", null, http_status_codes_1.StatusCodes.NOT_FOUND);
            }
            const totalCount = yield sdnRepairReceiptListRepository_1.supplierDeliveryNoteRRListRepository.count(companyId, searchText, supplier_delivery_note_id);
            return new serviceResponse_1.ServiceResponse(serviceResponse_1.ResponseStatus.Success, "Get all success", {
                data: SupplierDeliveryNoteRepairReceiptList,
                totalCount,
                totalPages: Math.ceil(totalCount / pageSize),
            }, http_status_codes_1.StatusCodes.OK);
        }
        catch (ex) {
            const errorMessage = "Error fetching Supplier Delivery Note Repair Receipt List : " + ex.message;
            return new serviceResponse_1.ServiceResponse(serviceResponse_1.ResponseStatus.Failed, "Error fetching Supplier Delivery Note Repair Receipt List ", errorMessage, http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR);
        }
    }),
    create: (companyId, userId, payload) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const newSupplierDeliveryNoteRepairReceiptList = yield sdnRepairReceiptListRepository_1.supplierDeliveryNoteRRListRepository.create(companyId, userId, payload);
            return new serviceResponse_1.ServiceResponse(serviceResponse_1.ResponseStatus.Success, "Create Supplier Delivery Note Repair Receipt List  success", "Create Supplier Delivery Note Repair Receipt List  success", http_status_codes_1.StatusCodes.OK);
        }
        catch (ex) {
            const errorMessage = "Error create Supplier Delivery Note Repair Receipt List : " + ex.message;
            return new serviceResponse_1.ServiceResponse(serviceResponse_1.ResponseStatus.Failed, errorMessage, null, http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR);
        }
    }),
    update: (companyId, userId, supplier_delivery_note_repair_receipt_list_id, payload) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const SupplierDeliveryNoteRepairReceiptList = yield sdnRepairReceiptListRepository_1.supplierDeliveryNoteRRListRepository.findByIdAsync(companyId, supplier_delivery_note_repair_receipt_list_id);
            if (!SupplierDeliveryNoteRepairReceiptList) {
                return new serviceResponse_1.ServiceResponse(serviceResponse_1.ResponseStatus.Failed, "Supplier Delivery Note  Repair Receipt List not found", null, http_status_codes_1.StatusCodes.BAD_REQUEST);
            }
            const updatedSupplierDeliveryNoteRepairReceiptList = yield sdnRepairReceiptListRepository_1.supplierDeliveryNoteRRListRepository.update(companyId, userId, supplier_delivery_note_repair_receipt_list_id, payload);
            return new serviceResponse_1.ServiceResponse(serviceResponse_1.ResponseStatus.Success, "Update supplier delivery note  Repair Receipt List success", "Update supplier delivery note  Repair Receipt List success", http_status_codes_1.StatusCodes.OK);
        }
        catch (ex) {
            const errorMessage = "Error update supplier delivery note Repair Receipt List : " + ex.message;
            return new serviceResponse_1.ServiceResponse(serviceResponse_1.ResponseStatus.Failed, errorMessage, null, http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR);
        }
    }),
    delete: (companyId, supplier_delivery_note_repair_receipt_list_id) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const SupplierDeliveryNoteRepairReceiptList = yield sdnRepairReceiptListRepository_1.supplierDeliveryNoteRRListRepository.findByIdAsync(companyId, supplier_delivery_note_repair_receipt_list_id);
            if (!SupplierDeliveryNoteRepairReceiptList) {
                return new serviceResponse_1.ServiceResponse(serviceResponse_1.ResponseStatus.Failed, "supplier delivery note  Repair Receipt List not found", null, http_status_codes_1.StatusCodes.BAD_REQUEST);
            }
            yield sdnRepairReceiptListRepository_1.supplierDeliveryNoteRRListRepository.delete(companyId, supplier_delivery_note_repair_receipt_list_id);
            return new serviceResponse_1.ServiceResponse(serviceResponse_1.ResponseStatus.Success, "delete supplier delivery note  Repair Receipt List success", "delete supplier delivery note  Repair Receipt List success", http_status_codes_1.StatusCodes.OK);
        }
        catch (ex) {
            const errorMessage = "Error delete supplier delivery note Repair Receipt List : " + ex.message;
            return new serviceResponse_1.ServiceResponse(serviceResponse_1.ResponseStatus.Failed, errorMessage, null, http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR);
        }
    }),
    findOne: (companyId, supplier_delivery_note_repair_receipt_list_id) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const supplierDeliveryNote = yield sdnRepairReceiptListRepository_1.supplierDeliveryNoteRRListRepository.findByIdAsync(companyId, supplier_delivery_note_repair_receipt_list_id);
            if (!supplierDeliveryNote) {
                return new serviceResponse_1.ServiceResponse(serviceResponse_1.ResponseStatus.Failed, "supplier delivery note not found", null, http_status_codes_1.StatusCodes.BAD_REQUEST);
            }
            return new serviceResponse_1.ServiceResponse(serviceResponse_1.ResponseStatus.Success, "Get supplier delivery note success", supplierDeliveryNote, http_status_codes_1.StatusCodes.OK);
        }
        catch (ex) {
            const errorMessage = "Error get supplier delivery note: " + ex.message;
            return new serviceResponse_1.ServiceResponse(serviceResponse_1.ResponseStatus.Failed, errorMessage, null, http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR);
        }
    }),
    findByRRId: (companyId, repair_receipt_id) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const SupplierDeliveryNoteRepairReceiptList = yield sdnRepairReceiptListRepository_1.supplierDeliveryNoteRRListRepository.findByRRIdAsync2(companyId, repair_receipt_id);
            if (!SupplierDeliveryNoteRepairReceiptList) {
                return new serviceResponse_1.ServiceResponse(serviceResponse_1.ResponseStatus.Failed, "Supplier Delivery Note Repair Receipt List not found", null, http_status_codes_1.StatusCodes.BAD_REQUEST);
            }
            return new serviceResponse_1.ServiceResponse(serviceResponse_1.ResponseStatus.Success, "Get Supplier Delivery Note Repair Receipt List success", SupplierDeliveryNoteRepairReceiptList, http_status_codes_1.StatusCodes.OK);
        }
        catch (ex) {
            const errorMessage = "Error get Supplier Delivery Note Repair Receipt List: " + ex.message;
            return new serviceResponse_1.ServiceResponse(serviceResponse_1.ResponseStatus.Failed, errorMessage, null, http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR);
        }
    }),
    updateData: (companyId, userId, payload) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const supplier_delivery_note_id = payload.supplier_delivery_note_id;
            const repair_receipt_id = payload.repair_receipt_id;
            let unableToDeleteCount = undefined;
            // ดึงข้อมูลก่อนหน้าจากฐานข้อมูล
            const dataBefore = yield sdnRepairReceiptListRepository_1.supplierDeliveryNoteRRListRepository.findByRRIdAsync(companyId, supplier_delivery_note_id, repair_receipt_id);
            // แปลงข้อมูลก่อนหน้าให้อยู่ในรูปของ Map เพื่อให้ค้นหาได้ง่ายขึ้น
            const previousDataMap = new Map(dataBefore.map((prev) => [prev.master_repair_id, prev]));
            // ใช้ Promise.all เพื่อรอผลลัพธ์จากการสร้างแต่ละ item ใน repairList
            yield Promise.all(payload.repairList.map((item) => __awaiter(void 0, void 0, void 0, function* () {
                const existingData = previousDataMap.get(item.id_repair_list);
                // สร้าง data สำหรับแต่ละ item
                if (existingData) {
                    // ถ้ามีข้อมูลเดิม
                    if (item.status === false) {
                        // ถ้าสถานะเป็น false → ลบข้อมูล
                        const results = yield sdnRepairReceiptListRepository_1.supplierDeliveryNoteRRListRepository.checkSDNListinSupplierRepairReceipt(companyId, existingData.supplier_delivery_note_repair_receipt_list_id);
                        if (results.length > 0) {
                            if (unableToDeleteCount === undefined) {
                                unableToDeleteCount = 0;
                            }
                            unableToDeleteCount += results.length;
                        }
                        else {
                            yield sdnRepairReceiptListRepository_1.supplierDeliveryNoteRRListRepository.delete(companyId, existingData.supplier_delivery_note_repair_receipt_list_id);
                        }
                    }
                    else {
                        yield sdnRepairReceiptListRepository_1.supplierDeliveryNoteRRListRepository.update(companyId, userId, existingData.supplier_delivery_note_repair_receipt_list_id, {
                            supplier_delivery_note_id: existingData.supplier_delivery_note_id,
                            repair_receipt_id: existingData.repair_receipt_id,
                            master_repair_id: existingData.master_repair_id,
                            price: item.price,
                            quantity: item.qty,
                            total_price: item.total,
                            updated_at: new Date(),
                            updated_by: userId,
                        });
                    }
                }
                else {
                    if (item.status === true) {
                        // ถ้าไม่มีข้อมูลเดิม → สร้างใหม่
                        yield sdnRepairReceiptListRepository_1.supplierDeliveryNoteRRListRepository.create(companyId, userId, {
                            supplier_delivery_note_id: supplier_delivery_note_id,
                            repair_receipt_id: repair_receipt_id,
                            master_repair_id: item.id_repair_list,
                            price: item.price,
                            quantity: item.qty,
                            total_price: item.total,
                            status: "pending",
                            created_at: new Date(),
                            created_by: userId,
                            updated_at: new Date(),
                            updated_by: userId,
                        });
                    }
                }
            })));
            // เมื่อทุกอย่างเสร็จสิ้นแล้ว ส่ง response สำเร็จ
            return new serviceResponse_1.ServiceResponse(serviceResponse_1.ResponseStatus.Success, "Create Supplier Delivery Note Repair Receipt List success", unableToDeleteCount, http_status_codes_1.StatusCodes.OK);
        }
        catch (ex) {
            const errorMessage = "Error create Supplier Delivery Note: " + ex.message;
            return new serviceResponse_1.ServiceResponse(serviceResponse_1.ResponseStatus.Failed, errorMessage, null, http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR);
        }
    }),
};
