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
exports.sdnRepairReceiptListRouter = void 0;
const express_1 = __importDefault(require("express"));
const httpHandlers_1 = require("@common/utils/httpHandlers");
const sdnRepairReceiptListService_1 = require("@modules/sdn-repair-receipt-list/sdnRepairReceiptListService");
const sdnRepairReceiptListModel_1 = require("@modules/sdn-repair-receipt-list/sdnRepairReceiptListModel");
const authenticateToken_1 = __importDefault(require("@common/middleware/authenticateToken"));
const permissions_1 = require("@common/middleware/permissions");
exports.sdnRepairReceiptListRouter = (() => {
    const router = express_1.default.Router();
    router.get("/get/:supplier_delivery_note_id", authenticateToken_1.default, (0, permissions_1.authorizeByName)("ใบส่งซัพพลายเออร์", ["A"]), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const companyId = req.token.company_id;
            const page = parseInt(req.query.page) || 1;
            const pageSize = parseInt(req.query.pageSize) || 12;
            const searchText = req.query.searchText || "";
            const { supplier_delivery_note_id } = req.params;
            const ServiceResponse = yield sdnRepairReceiptListService_1.supplierDeliveryRRListNoteService.findAll(companyId, page, pageSize, searchText, supplier_delivery_note_id);
            (0, httpHandlers_1.handleServiceResponse)(ServiceResponse, res);
        }
        catch (error) {
            console.error("Error in GET request:", error);
            res.status(500).json({ status: "error", message: "Internal Server Error" });
        }
    }));
    router.post("/create", authenticateToken_1.default, (0, permissions_1.authorizeByName)("ใบส่งซัพพลายเออร์", ["A"]), (0, httpHandlers_1.validateRequest)(sdnRepairReceiptListModel_1.CreateSupplierDeliveryNoteRRListSchema), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const { company_id, uuid } = req.token.payload;
            const companyId = company_id;
            const userId = uuid;
            const payload = req.body;
            const ServiceResponse = yield sdnRepairReceiptListService_1.supplierDeliveryRRListNoteService.create(companyId, userId, payload);
            (0, httpHandlers_1.handleServiceResponse)(ServiceResponse, res);
        }
        catch (error) {
            console.error("Error in POST request:", error);
            res.status(500).json({ status: "error", message: "Internal Server Error" });
        }
    }));
    router.patch("/update", authenticateToken_1.default, (0, permissions_1.authorizeByName)("ใบส่งซัพพลายเออร์", ["A"]), (0, httpHandlers_1.validateRequest)(sdnRepairReceiptListModel_1.UpdateSupplierDeliveryNoteRRListSchema), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const { company_id, uuid } = req.token.payload;
            const companyId = company_id;
            const userId = uuid;
            const { supplier_delivery_note_repair_receipt_list_id } = req.body;
            const payload = req.body;
            const ServiceResponse = yield sdnRepairReceiptListService_1.supplierDeliveryRRListNoteService.update(companyId, userId, supplier_delivery_note_repair_receipt_list_id, payload);
            (0, httpHandlers_1.handleServiceResponse)(ServiceResponse, res);
        }
        catch (error) {
            console.error("Error in PATCH request:", error);
            res.status(500).json({ status: "error", message: "Internal Server Error" });
        }
    }));
    router.delete("/delete/:supplier_delivery_note_repair_receipt_list_id", authenticateToken_1.default, (0, permissions_1.authorizeByName)("ใบส่งซัพพลายเออร์", ["A"]), (0, httpHandlers_1.validateRequest)(sdnRepairReceiptListModel_1.GetParamSupplierDeliveryNoteRRListSchema), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const { company_id } = req.token.payload;
            const companyId = company_id;
            const { supplier_delivery_note_repair_receipt_list_id } = req.params;
            const ServiceResponse = yield sdnRepairReceiptListService_1.supplierDeliveryRRListNoteService.delete(companyId, supplier_delivery_note_repair_receipt_list_id);
            (0, httpHandlers_1.handleServiceResponse)(ServiceResponse, res);
        }
        catch (error) {
            console.error("Error in DELETE request:", error);
            res.status(500).json({ status: "error", message: "Internal Server Error" });
        }
    }));
    router.get("/getByID/:supplier_delivery_note_repair_receipt_list_id", authenticateToken_1.default, (0, permissions_1.authorizeByName)("ใบส่งซัพพลายเออร์", ["A"]), (0, httpHandlers_1.validateRequest)(sdnRepairReceiptListModel_1.GetParamSupplierDeliveryNoteRRListSchema), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const { company_id } = req.token.payload;
            const companyId = company_id;
            const { supplier_delivery_note_repair_receipt_list_id } = req.params;
            const ServiceResponse = yield sdnRepairReceiptListService_1.supplierDeliveryRRListNoteService.findOne(companyId, supplier_delivery_note_repair_receipt_list_id);
            (0, httpHandlers_1.handleServiceResponse)(ServiceResponse, res);
        }
        catch (error) {
            console.error("Error in GET request:", error);
            res.status(500).json({ status: "error", message: "Internal Server Error" });
        }
    }));
    router.get("/getByRRID/:repair_receipt_id", authenticateToken_1.default, (0, permissions_1.authorizeByName)("ใบส่งซัพพลายเออร์", ["A"]), 
    // validateRequest(GetParamSupplierDeliveryNoteRRListSchema),
    (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const { company_id } = req.token.payload;
            const companyId = company_id;
            const { supplier_delivery_note_id, repair_receipt_id } = req.params;
            const ServiceResponse = yield sdnRepairReceiptListService_1.supplierDeliveryRRListNoteService.findByRRId(companyId, repair_receipt_id);
            (0, httpHandlers_1.handleServiceResponse)(ServiceResponse, res);
        }
        catch (error) {
            console.error("Error in GET request:", error);
            res.status(500).json({ status: "error", message: "Internal Server Error" });
        }
    }));
    router.post("/update-data", authenticateToken_1.default, (0, permissions_1.authorizeByName)("ใบส่งซัพพลายเออร์", ["A"]), (0, httpHandlers_1.validateRequest)(sdnRepairReceiptListModel_1.SubmitSupplierDeliveryNoteRRListSchema), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const { company_id, uuid } = req.token.payload;
            const companyId = company_id;
            const userId = uuid;
            const payload = req.body;
            const ServiceResponse = yield sdnRepairReceiptListService_1.supplierDeliveryRRListNoteService.updateData(companyId, userId, payload);
            (0, httpHandlers_1.handleServiceResponse)(ServiceResponse, res);
        }
        catch (error) {
            console.error("Error in POST request:", error);
            res.status(500).json({ status: "error", message: "Internal Server Error" });
        }
    }));
    return router;
})();
