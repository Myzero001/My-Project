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
exports.sendForAClaimListService = void 0;
const http_status_codes_1 = require("http-status-codes");
const serviceResponse_1 = require("@common/models/serviceResponse");
const sendForAClaimListRepository_1 = require("@modules/send-for-a-claim-list/sendForAClaimListRepository");
exports.sendForAClaimListService = {
    findAll: (companyId) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const claim = yield sendForAClaimListRepository_1.sendForAClaimListRepository.findAll(companyId);
            if (!claim) {
                return new serviceResponse_1.ServiceResponse(serviceResponse_1.ResponseStatus.Failed, "Send for a claim list not found", null, http_status_codes_1.StatusCodes.BAD_REQUEST);
            }
            return new serviceResponse_1.ServiceResponse(serviceResponse_1.ResponseStatus.Success, "Send for a claim list success", claim, http_status_codes_1.StatusCodes.OK);
        }
        catch (ex) {
            const errorMessage = "Error get send for a claim list : " + ex.message;
            return new serviceResponse_1.ServiceResponse(serviceResponse_1.ResponseStatus.Failed, errorMessage, null, http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR);
        }
    }),
    create: (companyId, userId, payload) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const claim = yield sendForAClaimListRepository_1.sendForAClaimListRepository.create(companyId, userId, payload);
            if (!claim) {
                return new serviceResponse_1.ServiceResponse(serviceResponse_1.ResponseStatus.Failed, "Error creating send for a claim list", null, http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR);
            }
            return new serviceResponse_1.ServiceResponse(serviceResponse_1.ResponseStatus.Success, "Send for a claim list created successfully", claim, http_status_codes_1.StatusCodes.CREATED);
        }
        catch (ex) {
            return new serviceResponse_1.ServiceResponse(serviceResponse_1.ResponseStatus.Failed, "Error creating send for a claim list", ex.message, http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR);
        }
    }),
    update: (companyId, userId, send_for_a_claim_list_id, payload) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const claim = yield sendForAClaimListRepository_1.sendForAClaimListRepository.findByIdAsync(companyId, send_for_a_claim_list_id);
            if (!claim) {
                return new serviceResponse_1.ServiceResponse(serviceResponse_1.ResponseStatus.Failed, "Send for a claim list not found", null, http_status_codes_1.StatusCodes.NOT_FOUND);
            }
            const claimUpdated = yield sendForAClaimListRepository_1.sendForAClaimListRepository.update(companyId, userId, send_for_a_claim_list_id, payload);
            if (!claim) {
                return new serviceResponse_1.ServiceResponse(serviceResponse_1.ResponseStatus.Failed, "Error updating send for a claim list", null, http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR);
            }
            return new serviceResponse_1.ServiceResponse(serviceResponse_1.ResponseStatus.Success, "Send for a claim list updated successfully", "Send for a claim list updated successfully", http_status_codes_1.StatusCodes.OK);
        }
        catch (ex) {
            return new serviceResponse_1.ServiceResponse(serviceResponse_1.ResponseStatus.Failed, "Error updating send for a claim list", ex.message, http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR);
        }
    }),
    delete: (companyId, send_for_a_claim_list_id) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const claim = yield sendForAClaimListRepository_1.sendForAClaimListRepository.findByIdAsync(companyId, send_for_a_claim_list_id);
            if (!claim) {
                return new serviceResponse_1.ServiceResponse(serviceResponse_1.ResponseStatus.Failed, "Send for a claim list not found", null, http_status_codes_1.StatusCodes.NOT_FOUND);
            }
            yield sendForAClaimListRepository_1.sendForAClaimListRepository.delete(companyId, send_for_a_claim_list_id);
            return new serviceResponse_1.ServiceResponse(serviceResponse_1.ResponseStatus.Success, "Send for a claim list deleted successfully", "Send for a claim list deleted successfully", http_status_codes_1.StatusCodes.OK);
        }
        catch (ex) {
            return new serviceResponse_1.ServiceResponse(serviceResponse_1.ResponseStatus.Failed, "Error deleting send for a claim list", ex.message, http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR);
        }
    }),
    findById: (companyId, send_for_a_claim_list_id) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const claim = yield sendForAClaimListRepository_1.sendForAClaimListRepository.findByIdAsync(companyId, send_for_a_claim_list_id);
            if (!claim) {
                return new serviceResponse_1.ServiceResponse(serviceResponse_1.ResponseStatus.Failed, "Send for a claim list not found", null, http_status_codes_1.StatusCodes.BAD_REQUEST);
            }
            return new serviceResponse_1.ServiceResponse(serviceResponse_1.ResponseStatus.Success, "Send for a claim list success", claim, http_status_codes_1.StatusCodes.OK);
        }
        catch (ex) {
            const errorMessage = "Error get send for a claim list : " + ex.message;
            return new serviceResponse_1.ServiceResponse(serviceResponse_1.ResponseStatus.Failed, errorMessage, null, http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR);
        }
    }),
    updateData: (companyId, userId, payload) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const send_for_a_claim_id = payload.send_for_a_claim_id;
            const supplier_delivery_note_id = payload.supplier_delivery_note_id;
            let unableToDeleteCount = undefined;
            // ดึงข้อมูลก่อนหน้าจากฐานข้อมูลโดยใช้ supplier_delivery_note_id และ repair_receipt_id
            const dataBefore = yield sendForAClaimListRepository_1.sendForAClaimListRepository.dataBefore(companyId, send_for_a_claim_id, supplier_delivery_note_id);
            // แปลงข้อมูลก่อนหน้าให้อยู่ในรูปของ Map เพื่อให้ค้นหาได้ง่ายขึ้น โดยใช้ key เป็น send_for_a_claim_id-supplier_delivery_note_id-repair_receipt_id-master_repair_id
            const previousDataMap = new Map(dataBefore.map((prev) => [
                `${prev.send_for_a_claim_id}-${prev.supplier_delivery_note_id}-${prev.repair_receipt_id}-${prev.master_repair_id}`,
                prev
            ])
            // dataBefore.map((prev) => [prev.supplier_repair_receipt_list_id, prev])
            );
            yield Promise.all(payload.repairReceiptIDAndRepairIDList.map((Item) => __awaiter(void 0, void 0, void 0, function* () {
                var _a, _b, _c, _d;
                const key = `${send_for_a_claim_id}-${supplier_delivery_note_id}-${Item.repair_receipt_id}-${Item.master_repair_id}`;
                const existingData = previousDataMap.get(key);
                if (existingData) {
                    // ถ้ามีข้อมูลเดิม
                    if (Item.checked === false) {
                        // ถ้าสถานะเป็น false → ลบข้อมูล
                        const results = yield sendForAClaimListRepository_1.sendForAClaimListRepository.checkClaimListinReceiveForAClaim(companyId, existingData.send_for_a_claim_list_id);
                        if (results.length > 0) {
                            if (unableToDeleteCount === undefined) {
                                unableToDeleteCount = 0;
                            }
                            unableToDeleteCount += results.length;
                        }
                        else {
                            yield sendForAClaimListRepository_1.sendForAClaimListRepository.delete(companyId, existingData.send_for_a_claim_list_id);
                        }
                    }
                    else {
                        // ถ้ามี remark และ price และสถานะเป็น true → อัปเดตข้อมูล
                        yield sendForAClaimListRepository_1.sendForAClaimListRepository.update(companyId, userId, existingData.send_for_a_claim_list_id, {
                            send_for_a_claim_id: send_for_a_claim_id,
                            supplier_delivery_note_id: supplier_delivery_note_id,
                            supplier_repair_receipt_list_id: Item.supplier_repair_receipt_list_id,
                            repair_receipt_id: Item.repair_receipt_id,
                            master_repair_id: Item.master_repair_id,
                            price: (_a = Item.price) !== null && _a !== void 0 ? _a : undefined,
                            remark: (_b = Item.remark) !== null && _b !== void 0 ? _b : undefined,
                            updated_at: new Date(),
                            updated_by: userId,
                        });
                    }
                }
                else {
                    if (Item.checked === true) {
                        // ถ้าไม่มีข้อมูลเดิม → สร้างใหม่
                        yield sendForAClaimListRepository_1.sendForAClaimListRepository.create(companyId, userId, {
                            send_for_a_claim_id: send_for_a_claim_id,
                            supplier_repair_receipt_list_id: Item.supplier_repair_receipt_list_id,
                            supplier_delivery_note_id: supplier_delivery_note_id,
                            repair_receipt_id: Item.repair_receipt_id,
                            master_repair_id: Item.master_repair_id,
                            remark: (_c = Item.remark) !== null && _c !== void 0 ? _c : undefined,
                            price: (_d = Item.price) !== null && _d !== void 0 ? _d : undefined,
                            created_at: new Date(),
                            created_by: userId,
                            updated_at: new Date(),
                            updated_by: userId,
                        });
                    }
                }
            })));
            // เมื่อทุกอย่างเสร็จสิ้นแล้ว ส่ง response สำเร็จ
            return new serviceResponse_1.ServiceResponse(serviceResponse_1.ResponseStatus.Success, "Update Send for a claim list success", unableToDeleteCount, http_status_codes_1.StatusCodes.OK);
        }
        catch (ex) {
            const errorMessage = "Error update Send for a claim list: " + ex.message;
            return new serviceResponse_1.ServiceResponse(serviceResponse_1.ResponseStatus.Failed, errorMessage, null, http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR);
        }
    }),
};
