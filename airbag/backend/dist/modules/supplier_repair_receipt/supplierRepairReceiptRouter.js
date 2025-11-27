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
exports.supplierRepairReceiptRouter = void 0;
const express_1 = __importDefault(require("express"));
const httpHandlers_1 = require("@common/utils/httpHandlers");
const supplierRepairReceiptService_1 = require("./supplierRepairReceiptService");
const sdnRepairReceiptListService_1 = require("@modules/sdn-repair-receipt-list/sdnRepairReceiptListService");
const supplierRepairReceiptModel_1 = require("./supplierRepairReceiptModel");
const authenticateToken_1 = __importDefault(require("@common/middleware/authenticateToken"));
const permissions_1 = require("@common/middleware/permissions");
const serviceResponse_1 = require("@common/models/serviceResponse");
const http_status_codes_1 = require("http-status-codes");
exports.supplierRepairReceiptRouter = (() => {
    const router = express_1.default.Router();
    router.get("/get", authenticateToken_1.default, (0, permissions_1.authorizeByName)("ใบรับซ่อมซัพพลายเออร์", ["A"]), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const companyId = req.token.company_id;
            const page = parseInt(req.query.page) || 1;
            const pageSize = parseInt(req.query.pageSize) || 12;
            const searchText = req.query.searchText || "";
            const serviceResponse = yield supplierRepairReceiptService_1.supplierRepairReceiptService.findAll(companyId, page, pageSize, searchText);
            (0, httpHandlers_1.handleServiceResponse)(serviceResponse, res);
        }
        catch (error) {
            console.error("Error in GET request:", error);
            res.status(500).json({ status: "error", message: "Internal Server Error" });
        }
    }));
    router.post("/create", authenticateToken_1.default, (0, permissions_1.authorizeByName)("ใบรับซ่อมซัพพลายเออร์", ["A"]), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const { company_id, uuid } = req.token.payload;
            const { supplier_delivery_note_id } = req.body;
            const serviceResponse = yield supplierRepairReceiptService_1.supplierRepairReceiptService.create(company_id, uuid, supplier_delivery_note_id);
            res.status(serviceResponse.statusCode).json(serviceResponse);
        }
        catch (error) {
            console.error("Error in POST request:", error);
            res.status(500).json({ status: "error", message: "Internal Server Error" });
        }
    }));
    router.patch("/update", authenticateToken_1.default, (0, permissions_1.authorizeByName)("ใบรับซ่อมซัพพลายเออร์", ["A"]), (0, httpHandlers_1.validateRequest)(supplierRepairReceiptModel_1.UpdateSupplierRepairReceiptSchema), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const { company_id, uuid } = req.token.payload;
            const { id } = req.body;
            const payload = req.body;
            const serviceResponse = yield supplierRepairReceiptService_1.supplierRepairReceiptService.update(company_id, uuid, id, payload);
            (0, httpHandlers_1.handleServiceResponse)(serviceResponse, res);
        }
        catch (error) {
            console.error("Error in PATCH request:", error);
            res.status(500).json({ status: "error", message: "Internal Server Error" });
        }
    }));
    router.delete("/delete/:id", authenticateToken_1.default, (0, permissions_1.authorizeByName)("ใบรับซ่อมซัพพลายเออร์", ["A"]), (0, httpHandlers_1.validateRequest)(supplierRepairReceiptModel_1.GetParamSupplierRepairReceiptSchema), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const { company_id, uuid } = req.token.payload;
            const { id } = req.params;
            const serviceResponse = yield supplierRepairReceiptService_1.supplierRepairReceiptService.delete(company_id, uuid, id);
            (0, httpHandlers_1.handleServiceResponse)(serviceResponse, res);
        }
        catch (error) {
            console.error("Error in DELETE request:", error);
            res.status(500).json({ status: "error", message: "Internal Server Error" });
        }
    }));
    router.get("/getById/:id", authenticateToken_1.default, (0, permissions_1.authorizeByName)("ใบรับซ่อมซัพพลายเออร์", ["A"]), (0, httpHandlers_1.validateRequest)(supplierRepairReceiptModel_1.GetParamSupplierRepairReceiptSchema), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const { company_id } = req.token.payload;
            const { id } = req.params;
            const serviceResponse = yield supplierRepairReceiptService_1.supplierRepairReceiptService.findOne(company_id, id);
            (0, httpHandlers_1.handleServiceResponse)(serviceResponse, res);
        }
        catch (error) {
            console.error("Error in GET request:", error);
            res.status(500).json({ status: "error", message: "Internal Server Error" });
        }
    }));
    router.get("/payLoadForSupplierRepairReceipt/:id", authenticateToken_1.default, (0, permissions_1.authorizeByName)("ใบรับซ่อมซัพพลายเออร์", ["A"]), (0, httpHandlers_1.validateRequest)(supplierRepairReceiptModel_1.GetParamSupplierRepairReceiptSchema), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const { company_id } = req.token.payload;
            const { id } = req.params;
            const serviceResponse = yield supplierRepairReceiptService_1.supplierRepairReceiptService.findPayload(company_id, id);
            (0, httpHandlers_1.handleServiceResponse)(serviceResponse, res);
        }
        catch (error) {
            console.error("Error in GET payload request:", error);
            res.status(500).json({ status: "error", message: "Internal Server Error" });
        }
    }));
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
    router.get("/get-receipt-docs", authenticateToken_1.default, (0, permissions_1.authorizeByName)("ใบรับซ่อมซัพพลายเออร์", ["A"]), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        var _a, _b;
        try {
            const company_id = (_b = (_a = req.token) === null || _a === void 0 ? void 0 : _a.payload) === null || _b === void 0 ? void 0 : _b.company_id;
            if (!company_id) {
                (0, httpHandlers_1.handleServiceResponse)(new serviceResponse_1.ServiceResponse(serviceResponse_1.ResponseStatus.Failed, "Company ID not found in token.", null, http_status_codes_1.StatusCodes.UNAUTHORIZED), res);
                return;
            }
            const serviceResponse = yield supplierRepairReceiptService_1.supplierRepairReceiptService.findReceiptDocsByCompanyId(company_id);
            (0, httpHandlers_1.handleServiceResponse)(serviceResponse, res);
        }
        catch (error) {
            console.error("Error in GET /get-receipt-docs request:", error);
            (0, httpHandlers_1.handleServiceResponse)(new serviceResponse_1.ServiceResponse(serviceResponse_1.ResponseStatus.Failed, "An unexpected error occurred while fetching receipt documents.", null, http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR), res);
        }
    }));
    router.get("/get-with-responsible/:id", authenticateToken_1.default, (0, permissions_1.authorizeByName)("ใบรับซ่อมซัพพลายเออร์", ["A"]), (0, httpHandlers_1.validateRequest)(supplierRepairReceiptModel_1.GetParamSupplierRepairReceiptSchema), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const { company_id } = req.token.payload;
            const { id } = req.params;
            const serviceResponse = yield supplierRepairReceiptService_1.supplierRepairReceiptService.findResponsibleUserForSupplierRepairReceipt(company_id, id);
            (0, httpHandlers_1.handleServiceResponse)(serviceResponse, res);
        }
        catch (error) {
            console.error(`Error in /get-with-responsible/${req.params.id}:`, error);
            const errorMessage = (error instanceof Error) ? error.message : "An unexpected error occurred.";
            (0, httpHandlers_1.handleServiceResponse)(new serviceResponse_1.ServiceResponse(serviceResponse_1.ResponseStatus.Failed, `Error processing request: ${errorMessage}`, null, http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR), res);
        }
    }));
    router.get("/select", authenticateToken_1.default, (0, permissions_1.authorizeByName)("ใบรับซ่อมซัพพลายเออร์", ["A", "R"]), (0, httpHandlers_1.validateRequest)(supplierRepairReceiptModel_1.SelectSchema), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const { company_id } = req.token.payload;
        const searchText = req.query.searchText || "";
        const companyId = company_id;
        const ServiceResponse = yield supplierRepairReceiptService_1.supplierRepairReceiptService.select(companyId, searchText);
        (0, httpHandlers_1.handleServiceResponse)(ServiceResponse, res);
    }));
    return router;
})();
