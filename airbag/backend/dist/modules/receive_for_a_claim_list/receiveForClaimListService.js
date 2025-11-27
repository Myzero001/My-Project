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
exports.receiveForAClaimListService = void 0;
const http_status_codes_1 = require("http-status-codes");
const serviceResponse_1 = require("@common/models/serviceResponse");
const receiveForClaimListRepository_1 = require("./receiveForClaimListRepository");
exports.receiveForAClaimListService = {
    findAll: (companyId_1, ...args_1) => __awaiter(void 0, [companyId_1, ...args_1], void 0, function* (companyId, page = 1, pageSize = 12, searchText = "") {
        try {
            const skip = (page - 1) * pageSize;
            const claimLists = yield receiveForClaimListRepository_1.receiveForAClaimListRepository.findAll(companyId, skip, pageSize, searchText);
            if (!claimLists || claimLists.length === 0) {
                return new serviceResponse_1.ServiceResponse(serviceResponse_1.ResponseStatus.Success, "No receive for claim lists found", {
                    data: [],
                    totalCount: 0,
                    totalPages: 0,
                }, http_status_codes_1.StatusCodes.OK);
            }
            const totalCount = yield receiveForClaimListRepository_1.receiveForAClaimListRepository.count(companyId, searchText);
            return new serviceResponse_1.ServiceResponse(serviceResponse_1.ResponseStatus.Success, "Get all success", {
                data: claimLists,
                totalCount,
                totalPages: Math.ceil(totalCount / pageSize),
            }, http_status_codes_1.StatusCodes.OK);
        }
        catch (ex) {
            return new serviceResponse_1.ServiceResponse(serviceResponse_1.ResponseStatus.Failed, "Error fetching receive for claim lists", ex.message, http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR);
        }
    }),
    findByReceiveForAClaimId: (receiveForAClaimId) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const claimLists = yield receiveForClaimListRepository_1.receiveForAClaimListRepository.findByReceiveForAClaimId(receiveForAClaimId);
            if (!claimLists || claimLists.length === 0) {
                return new serviceResponse_1.ServiceResponse(serviceResponse_1.ResponseStatus.Success, "No receive for claim lists found for this claim", [], http_status_codes_1.StatusCodes.OK);
            }
            return new serviceResponse_1.ServiceResponse(serviceResponse_1.ResponseStatus.Success, "Get by receive_for_a_claim_id success", claimLists, http_status_codes_1.StatusCodes.OK);
        }
        catch (ex) {
            return new serviceResponse_1.ServiceResponse(serviceResponse_1.ResponseStatus.Failed, "Error fetching receive for claim lists", ex.message, http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR);
        }
    }),
    create: (userId, payload, company_id) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            if (payload.send_for_a_claim_list_id) {
                const existingItem = yield receiveForClaimListRepository_1.receiveForAClaimListRepository.findByClaimListId(payload.send_for_a_claim_list_id);
                if (existingItem) {
                    return new serviceResponse_1.ServiceResponse(serviceResponse_1.ResponseStatus.Failed, "Item already exists for this send_for_a_claim_list_id", null, http_status_codes_1.StatusCodes.CONFLICT);
                }
            }
            const newClaimList = yield receiveForClaimListRepository_1.receiveForAClaimListRepository.create(userId, payload, company_id);
            return new serviceResponse_1.ServiceResponse(serviceResponse_1.ResponseStatus.Success, "Create receive for claim list success", newClaimList, http_status_codes_1.StatusCodes.CREATED);
        }
        catch (ex) {
            return new serviceResponse_1.ServiceResponse(serviceResponse_1.ResponseStatus.Failed, "Error creating receive for claim list", ex.message, http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR);
        }
    }),
    createMany: (userId, payloads, company_id) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            // Filter out payloads with send_for_a_claim_list_id that already exist
            const itemsToCheck = payloads.filter(item => item.send_for_a_claim_list_id);
            const existingItemPromises = itemsToCheck.map((item) => __awaiter(void 0, void 0, void 0, function* () {
                if (item.send_for_a_claim_list_id) {
                    const exists = yield receiveForClaimListRepository_1.receiveForAClaimListRepository.findByClaimListId(item.send_for_a_claim_list_id);
                    return { id: item.send_for_a_claim_list_id, exists: Boolean(exists) };
                }
                return { id: null, exists: false };
            }));
            const existingResults = yield Promise.all(existingItemPromises);
            const existingMap = new Map();
            existingResults.forEach(item => {
                if (item.id)
                    existingMap.set(item.id, item.exists);
            });
            const filteredPayloads = payloads.filter(item => !item.send_for_a_claim_list_id || !existingMap.get(item.send_for_a_claim_list_id));
            if (filteredPayloads.length === 0) {
                return new serviceResponse_1.ServiceResponse(serviceResponse_1.ResponseStatus.Success, "No new items to create, all already exist", { count: 0 }, http_status_codes_1.StatusCodes.OK);
            }
            const result = yield receiveForClaimListRepository_1.receiveForAClaimListRepository.createMany(userId, filteredPayloads, company_id);
            return new serviceResponse_1.ServiceResponse(serviceResponse_1.ResponseStatus.Success, "Create multiple receive for claim list items success", { count: result.count }, http_status_codes_1.StatusCodes.CREATED);
        }
        catch (ex) {
            return new serviceResponse_1.ServiceResponse(serviceResponse_1.ResponseStatus.Failed, "Error creating receive for claim list items", ex.message, http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR);
        }
    }),
    update: (userId, id, payload) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const claimList = yield receiveForClaimListRepository_1.receiveForAClaimListRepository.findByIdAsync(id);
            if (!claimList) {
                return new serviceResponse_1.ServiceResponse(serviceResponse_1.ResponseStatus.Failed, "Receive for claim list not found", null, http_status_codes_1.StatusCodes.NOT_FOUND);
            }
            // Check if there's already an entry for this send_for_a_claim_list_id (if it's changing)
            if (payload.send_for_a_claim_list_id &&
                payload.send_for_a_claim_list_id !== claimList.send_for_a_claim_list_id) {
                const existingItem = yield receiveForClaimListRepository_1.receiveForAClaimListRepository.findByClaimListId(payload.send_for_a_claim_list_id);
                if (existingItem && existingItem.receive_for_a_claim_list_id !== id) {
                    return new serviceResponse_1.ServiceResponse(serviceResponse_1.ResponseStatus.Failed, "Item already exists for this send_for_a_claim_list_id", null, http_status_codes_1.StatusCodes.CONFLICT);
                }
            }
            const updatedClaimList = yield receiveForClaimListRepository_1.receiveForAClaimListRepository.update(userId, id, payload);
            return new serviceResponse_1.ServiceResponse(serviceResponse_1.ResponseStatus.Success, "Update receive for claim list success", updatedClaimList, http_status_codes_1.StatusCodes.OK);
        }
        catch (ex) {
            return new serviceResponse_1.ServiceResponse(serviceResponse_1.ResponseStatus.Failed, "Error updating receive for claim list", ex.message, http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR);
        }
    }),
    delete: (id) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const claimList = yield receiveForClaimListRepository_1.receiveForAClaimListRepository.findByIdAsync(id);
            if (!claimList) {
                return new serviceResponse_1.ServiceResponse(serviceResponse_1.ResponseStatus.Failed, "Receive for claim list not found", null, http_status_codes_1.StatusCodes.NOT_FOUND);
            }
            yield receiveForClaimListRepository_1.receiveForAClaimListRepository.delete(id);
            return new serviceResponse_1.ServiceResponse(serviceResponse_1.ResponseStatus.Success, "Delete receive for claim list success", null, http_status_codes_1.StatusCodes.OK);
        }
        catch (ex) {
            return new serviceResponse_1.ServiceResponse(serviceResponse_1.ResponseStatus.Failed, "Error deleting receive for claim list", ex.message, http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR);
        }
    }),
    findOne: (id) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const claimList = yield receiveForClaimListRepository_1.receiveForAClaimListRepository.findByIdAsync(id);
            if (!claimList) {
                return new serviceResponse_1.ServiceResponse(serviceResponse_1.ResponseStatus.Failed, "Receive for claim list not found", null, http_status_codes_1.StatusCodes.NOT_FOUND);
            }
            return new serviceResponse_1.ServiceResponse(serviceResponse_1.ResponseStatus.Success, "Get receive for claim list success", claimList, http_status_codes_1.StatusCodes.OK);
        }
        catch (ex) {
            return new serviceResponse_1.ServiceResponse(serviceResponse_1.ResponseStatus.Failed, "Error getting receive for claim list", ex.message, http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR);
        }
    }),
    findPayloadList: (companyId, receive_for_a_claim_id, send_for_a_claim_id) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const claims = yield receiveForClaimListRepository_1.receiveForAClaimListRepository.findPayloadListById(companyId, receive_for_a_claim_id, send_for_a_claim_id);
            if (!claims || claims.length === 0) {
                return new serviceResponse_1.ServiceResponse(serviceResponse_1.ResponseStatus.Failed, "No receive for claim data found for the specified IDs", null, http_status_codes_1.StatusCodes.NOT_FOUND);
            }
            const formattedClaims = claims.map(claim => {
                var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k;
                // Get data from send_for_a_claim_list first
                const sendForClaimItems = ((_a = claim.send_for_a_claim) === null || _a === void 0 ? void 0 : _a.send_for_a_claim_list.map(item => {
                    var _a, _b, _c, _d;
                    // Check if receive_for_a_claim_list exists and has data
                    const relatedReceiveForClaimList = item.receive_for_a_claim_list &&
                        Array.isArray(item.receive_for_a_claim_list) &&
                        item.receive_for_a_claim_list.length > 0
                        ? item.receive_for_a_claim_list[0] : null;
                    return {
                        send_for_a_claim_list_id: item.send_for_a_claim_list_id,
                        repair_receipt_doc: ((_a = item.repair_receipt) === null || _a === void 0 ? void 0 : _a.repair_receipt_doc) || null,
                        master_repair_name: ((_b = item.master_repair) === null || _b === void 0 ? void 0 : _b.master_repair_name) || "",
                        master_repair_id: ((_c = item.master_repair) === null || _c === void 0 ? void 0 : _c.master_repair_id) || "",
                        repair_receipt_id: ((_d = item.repair_receipt) === null || _d === void 0 ? void 0 : _d.id) || "",
                        price: item.price || 0,
                        remark: item.remark || "",
                        receive_for_a_claim_list: relatedReceiveForClaimList ? {
                            receive_for_a_claim_list_id: relatedReceiveForClaimList.receive_for_a_claim_list_id,
                            price: relatedReceiveForClaimList.price,
                            remark: relatedReceiveForClaimList.remark,
                            finish: relatedReceiveForClaimList.finish,
                            finish_by_receipt_doc: relatedReceiveForClaimList.finish_by_receipt_doc,
                            claim_Date: relatedReceiveForClaimList.claim_Date,
                            receive_for_a_claim_id: relatedReceiveForClaimList.receive_for_a_claim_id
                        } : null
                    };
                })) || [];
                // Use Map to manage data from both sources
                const claimItemsMap = new Map();
                // Add data from receive_for_a_claim_list first
                claim.receive_for_a_claim_list.forEach(item => {
                    var _a, _b, _c, _d, _e, _f;
                    const key = `${((_a = item.master_repair) === null || _a === void 0 ? void 0 : _a.master_repair_id) || ""}_${((_b = item.repair_receipt) === null || _b === void 0 ? void 0 : _b.id) || ""}`;
                    claimItemsMap.set(key, {
                        receive_for_a_claim_list_id: item.receive_for_a_claim_list_id,
                        receive_for_a_claim_doc: claim.receive_for_a_claim_doc,
                        repair_receipt_doc: ((_c = item.repair_receipt) === null || _c === void 0 ? void 0 : _c.repair_receipt_doc) || null,
                        master_repair_name: ((_d = item.master_repair) === null || _d === void 0 ? void 0 : _d.master_repair_name) || "",
                        master_repair_id: ((_e = item.master_repair) === null || _e === void 0 ? void 0 : _e.master_repair_id) || "",
                        repair_receipt_id: ((_f = item.repair_receipt) === null || _f === void 0 ? void 0 : _f.id) || "",
                        price: item.price || 0,
                        remark: item.remark || "",
                        finish: item.finish || false,
                        finish_by_receipt_doc: item.finish_by_receipt_doc || null,
                        claim_Date: item.claim_Date || null,
                    });
                });
                // Add or update from send_for_claim_items
                sendForClaimItems.forEach(item => {
                    var _a, _b, _c;
                    const key = `${item.master_repair_id}_${item.repair_receipt_id}`;
                    // If item doesn't exist in map, add it
                    if (!claimItemsMap.has(key) && item.receive_for_a_claim_list) {
                        claimItemsMap.set(key, {
                            receive_for_a_claim_list_id: item.receive_for_a_claim_list.receive_for_a_claim_list_id,
                            receive_for_a_claim_doc: claim.receive_for_a_claim_doc || null,
                            repair_receipt_doc: item.repair_receipt_doc,
                            master_repair_name: item.master_repair_name,
                            master_repair_id: item.master_repair_id,
                            repair_receipt_id: item.repair_receipt_id,
                            price: item.price,
                            remark: item.remark,
                            finish: ((_a = item.receive_for_a_claim_list) === null || _a === void 0 ? void 0 : _a.finish) || false,
                            finish_by_receipt_doc: ((_b = item.receive_for_a_claim_list) === null || _b === void 0 ? void 0 : _b.finish_by_receipt_doc) || null,
                            claim_Date: ((_c = item.receive_for_a_claim_list) === null || _c === void 0 ? void 0 : _c.claim_Date) || null,
                        });
                    }
                });
                // Convert map back to array
                const allClaimItems = Array.from(claimItemsMap.values());
                return {
                    receive_for_a_claim_id: claim.receive_for_a_claim_id,
                    receive_for_a_claim_doc: claim.receive_for_a_claim_doc,
                    send_for_a_claim_id: claim.send_for_a_claim_id,
                    send_for_a_claim_doc: (_b = claim.send_for_a_claim) === null || _b === void 0 ? void 0 : _b.send_for_a_claim_doc,
                    supplier_delivery_note_doc: ((_e = (_d = (_c = claim.send_for_a_claim) === null || _c === void 0 ? void 0 : _c.supplier_repair_receipt) === null || _d === void 0 ? void 0 : _d.supplier_delivery_note) === null || _e === void 0 ? void 0 : _e.supplier_delivery_note_doc) || null,
                    receipt_doc: ((_g = (_f = claim.send_for_a_claim) === null || _f === void 0 ? void 0 : _f.supplier_repair_receipt) === null || _g === void 0 ? void 0 : _g.receipt_doc) || null,
                    claim_date: claim.claim_date,
                    due_date: (_h = claim.send_for_a_claim) === null || _h === void 0 ? void 0 : _h.due_date,
                    receive_date: claim.receive_date,
                    contact_name: claim.contact_name,
                    contact_number: claim.contact_number,
                    supplier_name: (_j = claim.master_supplier) === null || _j === void 0 ? void 0 : _j.supplier_name,
                    supplier_code: (_k = claim.master_supplier) === null || _k === void 0 ? void 0 : _k.supplier_code,
                    status: claim.status,
                    claim_items: allClaimItems,
                    send_for_claim_items: sendForClaimItems
                };
            });
            return new serviceResponse_1.ServiceResponse(serviceResponse_1.ResponseStatus.Success, "Get receive for claim list payload success", formattedClaims, http_status_codes_1.StatusCodes.OK);
        }
        catch (ex) {
            console.error('Error in findPayloadList:', ex);
            return new serviceResponse_1.ServiceResponse(serviceResponse_1.ResponseStatus.Failed, "Error getting receive for claim list payload", ex.message, http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR);
        }
    }),
};
