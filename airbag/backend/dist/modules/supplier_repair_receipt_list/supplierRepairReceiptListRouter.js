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
exports.supplierRepairReceiptListRouter = void 0;
const express_1 = __importDefault(require("express"));
const httpHandlers_1 = require("@common/utils/httpHandlers");
const supplierRepairReceiptListService_1 = require("./supplierRepairReceiptListService");
const supplierRepairReceiptListModel_1 = require("./supplierRepairReceiptListModel");
const authenticateToken_1 = __importDefault(require("@common/middleware/authenticateToken"));
const permissions_1 = require("@common/middleware/permissions");
exports.supplierRepairReceiptListRouter = (() => {
    const router = express_1.default.Router();
    router.get("/get", authenticateToken_1.default, (0, permissions_1.authorizeByName)("ใบรับซ่อมซัพพลายเออร์", ["A"]), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const companyId = req.token.company_id;
            const page = parseInt(req.query.page) || 1;
            const pageSize = parseInt(req.query.pageSize) || 12;
            const searchText = req.query.searchText || "";
            const serviceResponse = yield supplierRepairReceiptListService_1.supplierRepairReceiptListService.findAll(companyId, page, pageSize, searchText);
            (0, httpHandlers_1.handleServiceResponse)(serviceResponse, res);
        }
        catch (error) {
            console.error("Error in GET request:", error);
            res.status(500).json({ status: "error", message: "Internal Server Error" });
        }
    }));
    router.post("/create", authenticateToken_1.default, (0, permissions_1.authorizeByName)("ใบรับซ่อมซัพพลายเออร์", ["A"]), (0, httpHandlers_1.validateRequest)(supplierRepairReceiptListModel_1.CreateSupplierRepairReceiptListSchema), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const { company_id, uuid } = req.token.payload;
            const payload = req.body;
            const serviceResponse = yield supplierRepairReceiptListService_1.supplierRepairReceiptListService.create(company_id, uuid, payload);
            (0, httpHandlers_1.handleServiceResponse)(serviceResponse, res);
        }
        catch (error) {
            console.error("Error in POST request:", error);
            res.status(500).json({ status: "error", message: "Internal Server Error" });
        }
    }));
    router.patch("/update", authenticateToken_1.default, (0, permissions_1.authorizeByName)("ใบรับซ่อมซัพพลายเออร์", ["A"]), (0, httpHandlers_1.validateRequest)(supplierRepairReceiptListModel_1.UpdateSupplierRepairReceiptListSchema), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const { company_id, uuid } = req.token.payload;
            const { supplier_delivery_note_repair_receipt_list_id } = req.body;
            const payload = req.body;
            const serviceResponse = yield supplierRepairReceiptListService_1.supplierRepairReceiptListService.update(company_id, uuid, supplier_delivery_note_repair_receipt_list_id, payload);
            (0, httpHandlers_1.handleServiceResponse)(serviceResponse, res);
        }
        catch (error) {
            console.error("Error in PATCH request:", error);
            res.status(500).json({ status: "error", message: "Internal Server Error" });
        }
    }));
    router.delete("/delete/:supplier_repair_receipt_list_id", authenticateToken_1.default, (0, permissions_1.authorizeByName)("ใบรับซ่อมซัพพลายเออร์", ["A"]), (0, httpHandlers_1.validateRequest)(supplierRepairReceiptListModel_1.GetParamSupplierRepairReceiptListSchema), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const { company_id } = req.token.payload;
            const { supplier_repair_receipt_list_id } = req.params;
            const serviceResponse = yield supplierRepairReceiptListService_1.supplierRepairReceiptListService.delete(company_id, supplier_repair_receipt_list_id);
            (0, httpHandlers_1.handleServiceResponse)(serviceResponse, res);
        }
        catch (error) {
            console.error("Error in DELETE request:", error);
            res.status(500).json({ status: "error", message: "Internal Server Error" });
        }
    }));
    router.get("/getById/:supplier_repair_receipt_list_id", authenticateToken_1.default, (0, permissions_1.authorizeByName)("ใบรับซ่อมซัพพลายเออร์", ["A"]), (0, httpHandlers_1.validateRequest)(supplierRepairReceiptListModel_1.GetParamSupplierRepairReceiptListSchema), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const { company_id } = req.token.payload;
            const { supplier_delivery_note_repair_receipt_list_id } = req.params;
            const serviceResponse = yield supplierRepairReceiptListService_1.supplierRepairReceiptListService.findOne(company_id, supplier_delivery_note_repair_receipt_list_id);
            (0, httpHandlers_1.handleServiceResponse)(serviceResponse, res);
        }
        catch (error) {
            console.error("Error in GET request:", error);
            res.status(500).json({ status: "error", message: "Internal Server Error" });
        }
    }));
    router.patch("/updateFinishStatus/:supplier_delivery_note_repair_receipt_list_id", authenticateToken_1.default, (0, permissions_1.authorizeByName)("ใบรับซ่อมซัพพลายเออร์", ["A"]), (0, httpHandlers_1.validateRequest)(supplierRepairReceiptListModel_1.UpdateFinishStatusSchema), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const { company_id, uuid } = req.token.payload;
            const { supplier_delivery_note_repair_receipt_list_id } = req.params;
            const { finish, finish_by_receipt_doc, supplier_repair_receipt_id } = req.body; // ดึงค่าใหม่จาก body
            const response = yield supplierRepairReceiptListService_1.supplierRepairReceiptListService.updateFinishStatus(company_id, uuid, supplier_delivery_note_repair_receipt_list_id, finish, finish_by_receipt_doc, supplier_repair_receipt_id // ส่งค่าไป Service
            );
            res.status(response.statusCode).json(response);
        }
        catch (error) {
            console.error("Error in PATCH request:", error);
            res.status(500).json({
                success: false,
                message: "Internal Server Error",
                responseObject: null,
                statusCode: 500
            });
        }
    }));
    router.get("/payLoadForSupplierRepairReceiptList/:supplier_repair_receipt_id/:supplier_delivery_note_id", authenticateToken_1.default, (0, permissions_1.authorizeByName)("ใบรับซ่อมซัพพลายเออร์", ["A"]), (0, httpHandlers_1.validateRequest)(supplierRepairReceiptListModel_1.GetParamPayloadListSchema), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const { company_id } = req.token.payload;
            const { supplier_repair_receipt_id, supplier_delivery_note_id } = req.params;
            const serviceResponse = yield supplierRepairReceiptListService_1.supplierRepairReceiptListService.findPayloadList(company_id, supplier_repair_receipt_id, supplier_delivery_note_id);
            (0, httpHandlers_1.handleServiceResponse)(serviceResponse, res);
        }
        catch (error) {
            console.error("Error in GET payload list request:", error);
            res.status(500).json({ status: "error", message: "Internal Server Error" });
        }
    }));
    router.patch("/updateSupplierRepairReceiptId/:supplier_delivery_note_repair_receipt_list_id", authenticateToken_1.default, (0, permissions_1.authorizeByName)("ใบรับซ่อมซัพพลายเออร์", ["A"]), (0, httpHandlers_1.validateRequest)(supplierRepairReceiptListModel_1.UpdateSupplierRepairReceiptIdSchema), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const { company_id, uuid } = req.token.payload;
            const { supplier_delivery_note_repair_receipt_list_id } = req.params;
            const { supplier_repair_receipt_id } = req.body;
            const serviceResponse = yield supplierRepairReceiptListService_1.supplierRepairReceiptListService.updateSupplierRepairReceiptId(company_id, uuid, supplier_delivery_note_repair_receipt_list_id, supplier_repair_receipt_id);
            (0, httpHandlers_1.handleServiceResponse)(serviceResponse, res);
        }
        catch (error) {
            console.error("Error in PATCH request:", error);
            res.status(500).json({ status: "error", message: "Internal Server Error" });
        }
    }));
    return router;
})();
