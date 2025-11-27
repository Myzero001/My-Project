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
exports.supplierDeliveryNoteService = void 0;
const http_status_codes_1 = require("http-status-codes");
const serviceResponse_1 = require("@common/models/serviceResponse");
const supplierDeliveryNoteRepository_1 = require("@modules/supplier-delivery-note/supplierDeliveryNoteRepository");
const generateSupplierDeliveryNoteDoc_1 = require("@common/utils/generateSupplierDeliveryNoteDoc");
exports.supplierDeliveryNoteService = {
    findAll: (companyId_1, ...args_1) => __awaiter(void 0, [companyId_1, ...args_1], void 0, function* (companyId, page = 1, pageSize = 12, searchText = "") {
        try {
            const skip = (page - 1) * pageSize;
            const SupplierDeliveryNote = yield supplierDeliveryNoteRepository_1.supplierDeliveryNoteRepository.findAll(companyId, skip, pageSize, searchText);
            if (!SupplierDeliveryNote) {
                return new serviceResponse_1.ServiceResponse(serviceResponse_1.ResponseStatus.Failed, "No Supplier Delivery Note found", null, http_status_codes_1.StatusCodes.NOT_FOUND);
            }
            const totalCount = yield supplierDeliveryNoteRepository_1.supplierDeliveryNoteRepository.count(companyId, searchText);
            return new serviceResponse_1.ServiceResponse(serviceResponse_1.ResponseStatus.Success, "Get all success", {
                data: SupplierDeliveryNote,
                totalCount,
                totalPages: Math.ceil(totalCount / pageSize),
            }, http_status_codes_1.StatusCodes.OK);
        }
        catch (ex) {
            const errorMessage = "Error fetching Supplier Delivery Note: " + ex.message;
            return new serviceResponse_1.ServiceResponse(serviceResponse_1.ResponseStatus.Failed, "Error fetching Supplier Delivery Note", errorMessage, http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR);
        }
    }),
    create: (companyId, userId, payload) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            payload.supplier_delivery_note_doc = yield (0, generateSupplierDeliveryNoteDoc_1.generateSupplierDeliveryNoteDoc)(companyId);
            const newSupplierDeliveryNote = yield supplierDeliveryNoteRepository_1.supplierDeliveryNoteRepository.create(companyId, userId, payload);
            return new serviceResponse_1.ServiceResponse(serviceResponse_1.ResponseStatus.Success, "Create Supplier Delivery Note success", newSupplierDeliveryNote, http_status_codes_1.StatusCodes.OK);
        }
        catch (ex) {
            const errorMessage = "Error create Supplier Delivery Note: " + ex.message;
            return new serviceResponse_1.ServiceResponse(serviceResponse_1.ResponseStatus.Failed, errorMessage, null, http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR);
        }
    }),
    update: (companyId, userId, supplier_delivery_note_id, payload) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const supplierDeliveryNote = yield supplierDeliveryNoteRepository_1.supplierDeliveryNoteRepository.findByIdAsync(companyId, supplier_delivery_note_id);
            if (!supplierDeliveryNote) {
                return new serviceResponse_1.ServiceResponse(serviceResponse_1.ResponseStatus.Failed, "Supplier Delivery Note not found", null, http_status_codes_1.StatusCodes.BAD_REQUEST);
            }
            const updatedSupplierDeliveryNote = yield supplierDeliveryNoteRepository_1.supplierDeliveryNoteRepository.update(companyId, userId, supplier_delivery_note_id, payload);
            return new serviceResponse_1.ServiceResponse(serviceResponse_1.ResponseStatus.Success, "Update supplier delivery note success", "Update supplier delivery note success", http_status_codes_1.StatusCodes.OK);
        }
        catch (ex) {
            const errorMessage = "Error update supplier delivery note: " + ex.message;
            return new serviceResponse_1.ServiceResponse(serviceResponse_1.ResponseStatus.Failed, errorMessage, null, http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR);
        }
    }),
    delete: (companyId, supplier_delivery_note_id) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            //ใบที่จะลบมี รายการซ่อมอยู่ในใบไหม
            // const checkSDNListinSDN = await supplierDeliveryNoteRepository.checkSDNListinSDN(companyId, supplier_delivery_note_id);
            // if (checkSDNListinSDN != null) {
            //     return new ServiceResponse(
            //         ResponseStatus.Failed,
            //         "supplier delevery note list have in supplier delevery note",
            //         null,
            //         StatusCodes.BAD_REQUEST
            //     );
            // }
            //ใบที่จะลบมีอยู่ในใบรับซ่อมซับพลายเออร์ไหม
            const checkSDNinSRR = yield supplierDeliveryNoteRepository_1.supplierDeliveryNoteRepository.checkSDNinSRR(companyId, supplier_delivery_note_id);
            if (checkSDNinSRR != null) {
                return new serviceResponse_1.ServiceResponse(serviceResponse_1.ResponseStatus.Failed, "supplier delevery note  have in supplier repair receipt", null, http_status_codes_1.StatusCodes.BAD_REQUEST);
            }
            const visitcustomer = yield supplierDeliveryNoteRepository_1.supplierDeliveryNoteRepository.findByIdAsync(companyId, supplier_delivery_note_id);
            if (!visitcustomer) {
                return new serviceResponse_1.ServiceResponse(serviceResponse_1.ResponseStatus.Failed, "supplier delivery note not found", null, http_status_codes_1.StatusCodes.BAD_REQUEST);
            }
            yield supplierDeliveryNoteRepository_1.supplierDeliveryNoteRepository.deleteSupplierDeliveryNoteList(companyId, supplier_delivery_note_id);
            yield supplierDeliveryNoteRepository_1.supplierDeliveryNoteRepository.delete(companyId, supplier_delivery_note_id);
            return new serviceResponse_1.ServiceResponse(serviceResponse_1.ResponseStatus.Success, "delete supplier delivery note success", "delete supplier delivery note success", http_status_codes_1.StatusCodes.OK);
        }
        catch (ex) {
            const errorMessage = "Error delete supplier delivery note: " + ex.message;
            return new serviceResponse_1.ServiceResponse(serviceResponse_1.ResponseStatus.Failed, errorMessage, null, http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR);
        }
    }),
    findOne: (companyId, supplier_delivery_note_id) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const supplierDeliveryNote = yield supplierDeliveryNoteRepository_1.supplierDeliveryNoteRepository.findByIdAsync(companyId, supplier_delivery_note_id);
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
    getSupplierDeliveryNoteDoc: (companyId) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const result = yield supplierDeliveryNoteRepository_1.supplierDeliveryNoteRepository.getAllSupplierDeliveryNoteDoc(companyId);
            if (!result.docs || result.docs.length === 0) {
                return new serviceResponse_1.ServiceResponse(serviceResponse_1.ResponseStatus.Failed, "No supplier delivery note docs found", null, http_status_codes_1.StatusCodes.NOT_FOUND);
            }
            const formattedDocs = result.docs.map(doc => ({
                supplier_delivery_note_id: doc.supplier_delivery_note_id,
                supplier_delivery_note_doc: doc.supplier_delivery_note_doc
            }));
            return new serviceResponse_1.ServiceResponse(serviceResponse_1.ResponseStatus.Success, "Get supplier delivery note docs success", {
                docs: formattedDocs,
                totalCount: result.totalCount
            }, http_status_codes_1.StatusCodes.OK);
        }
        catch (ex) {
            const errorMessage = "Error getting supplier delivery note docs: " + ex.message;
            return new serviceResponse_1.ServiceResponse(serviceResponse_1.ResponseStatus.Failed, errorMessage, null, http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR);
        }
    }),
    findOnlyDeliveryNoteDocsByCompanyId: (companyId) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            // เรียก Repository function ที่ตอนนี้จะคืนค่า { id: string, supplier_delivery_note_doc: string | null }[]
            const docsResult = yield supplierDeliveryNoteRepository_1.supplierDeliveryNoteRepository.findOnlyDeliveryNoteDocsByCompanyId(companyId);
            if (!docsResult) {
                console.error("[Service.findOnlyDeliveryNoteDocs] Repository returned unexpected value:", docsResult);
                return new serviceResponse_1.ServiceResponse(serviceResponse_1.ResponseStatus.Failed, "Failed to retrieve delivery note documents due to an internal repository error.", [], // คืนค่า Array ว่างที่ตรงกับ DeliveryNoteDocItem[]
                http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR);
            }
            if (docsResult.length === 0) {
                return new serviceResponse_1.ServiceResponse(serviceResponse_1.ResponseStatus.Success, "No supplier delivery note documents found for this company.", [], // คืนค่า Array ว่างที่ตรงกับ DeliveryNoteDocItem[]
                http_status_codes_1.StatusCodes.OK);
            }
            // docsResult เป็น DeliveryNoteDocItem[] อยู่แล้ว ไม่ต้อง map อีก
            return new serviceResponse_1.ServiceResponse(serviceResponse_1.ResponseStatus.Success, "Successfully fetched supplier delivery note documents.", docsResult, // <-- คืนค่า docsResult โดยตรง
            http_status_codes_1.StatusCodes.OK);
        }
        catch (error) {
            const errorMessage = `Error fetching supplier delivery note documents: ${error.message}`;
            console.error(errorMessage);
            return new serviceResponse_1.ServiceResponse(serviceResponse_1.ResponseStatus.Failed, errorMessage, [], // <-- คืนค่า Array ว่างที่ตรงกับ DeliveryNoteDocItem[]
            http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR);
        }
    }),
    findResponsibleUserForDeliveryNote: (companyId, supplier_delivery_note_id) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const deliveryNoteData = yield supplierDeliveryNoteRepository_1.supplierDeliveryNoteRepository.findOnlyResponsibleUserForDeliveryNote(companyId, supplier_delivery_note_id);
            if (!deliveryNoteData) {
                return new serviceResponse_1.ServiceResponse(serviceResponse_1.ResponseStatus.Failed, "Supplier delivery note not found.", null, http_status_codes_1.StatusCodes.NOT_FOUND);
            }
            if (!deliveryNoteData.responsible_by_user) {
                return new serviceResponse_1.ServiceResponse(serviceResponse_1.ResponseStatus.Success, "No responsible user assigned to this supplier delivery note.", null, http_status_codes_1.StatusCodes.OK);
            }
            return new serviceResponse_1.ServiceResponse(serviceResponse_1.ResponseStatus.Success, "Responsible user found for supplier delivery note.", deliveryNoteData.responsible_by_user, http_status_codes_1.StatusCodes.OK);
        }
        catch (ex) {
            const errorMessage = `Error fetching responsible user for supplier delivery note: ${ex.message}`;
            return new serviceResponse_1.ServiceResponse(serviceResponse_1.ResponseStatus.Failed, errorMessage, null, http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR);
        }
    }),
    select: (companyId_1, ...args_1) => __awaiter(void 0, [companyId_1, ...args_1], void 0, function* (companyId, searchText = "") {
        try {
            const data = yield supplierDeliveryNoteRepository_1.supplierDeliveryNoteRepository.select(companyId, searchText);
            return new serviceResponse_1.ServiceResponse(serviceResponse_1.ResponseStatus.Success, "Select success", { data }, http_status_codes_1.StatusCodes.OK);
        }
        catch (error) {
            return new serviceResponse_1.ServiceResponse(serviceResponse_1.ResponseStatus.Failed, "Error fetching select", null, http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR);
        }
    }),
};
