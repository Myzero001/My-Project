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
exports.sendForAClaimRouter = void 0;
const express_1 = __importDefault(require("express"));
const httpHandlers_1 = require("@common/utils/httpHandlers");
const authenticateToken_1 = __importDefault(require("@common/middleware/authenticateToken"));
const sendForAClaimService_1 = require("@modules/send-for-a-claim/sendForAClaimService");
const sendForAClaimModel_1 = require("@modules/send-for-a-claim/sendForAClaimModel");
const permissions_1 = require("@common/middleware/permissions");
const serviceResponse_1 = require("@common/models/serviceResponse");
const http_status_codes_1 = require("http-status-codes");
exports.sendForAClaimRouter = (() => {
    const router = express_1.default.Router();
    router.get("/get", authenticateToken_1.default, (0, permissions_1.authorizeByName)("ใบส่งเคลม", ["A"]), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const companyId = req.token.company_id;
            const page = parseInt(req.query.page) || 1;
            const pageSize = parseInt(req.query.pageSize) || 12;
            const searchText = req.query.searchText || "";
            const serviceResponse = yield sendForAClaimService_1.sendForAClaimService.findAll(companyId, page, pageSize, searchText);
            (0, httpHandlers_1.handleServiceResponse)(serviceResponse, res);
        }
        catch (error) {
            console.error("Error in GET request:", error);
            res.status(500).json({ status: "error", message: "Internal Server Error" });
        }
    }));
    router.post("/create", authenticateToken_1.default, (0, permissions_1.authorizeByName)("ใบส่งเคลม", ["A"]), (0, httpHandlers_1.validateRequest)(sendForAClaimModel_1.CreateSendForAClaimSchema), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const { company_id, uuid } = req.token.payload;
            const companyId = company_id;
            const userId = uuid;
            const payload = req.body;
            const serviceResponse = yield sendForAClaimService_1.sendForAClaimService.create(companyId, userId, payload);
            (0, httpHandlers_1.handleServiceResponse)(serviceResponse, res);
        }
        catch (error) {
            console.error("Error in POST request:", error);
            res.status(500).json({ status: "error", message: "Internal Server Error" });
        }
    }));
    router.patch("/update", authenticateToken_1.default, (0, permissions_1.authorizeByName)("ใบส่งเคลม", ["A"]), (0, httpHandlers_1.validateRequest)(sendForAClaimModel_1.UpdateSendForAClaimSchema), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const { company_id, uuid } = req.token.payload;
            const companyId = company_id;
            const userId = uuid;
            const { send_for_a_claim_id } = req.body;
            const payload = req.body;
            const serviceResponse = yield sendForAClaimService_1.sendForAClaimService.update(companyId, userId, send_for_a_claim_id, payload);
            (0, httpHandlers_1.handleServiceResponse)(serviceResponse, res);
        }
        catch (error) {
            console.error("Error in PATCH request:", error);
            res.status(500).json({ status: "error", message: "Internal Server Error" });
        }
    }));
    router.delete("/delete/:send_for_a_claim_id", authenticateToken_1.default, (0, permissions_1.authorizeByName)("ใบส่งเคลม", ["A"]), (0, httpHandlers_1.validateRequest)(sendForAClaimModel_1.GetParamSendForAClaimSchema), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const { company_id } = req.token.payload;
            const companyId = company_id;
            const { send_for_a_claim_id } = req.params;
            const ServiceResponse = yield sendForAClaimService_1.sendForAClaimService.delete(companyId, send_for_a_claim_id);
            (0, httpHandlers_1.handleServiceResponse)(ServiceResponse, res);
        }
        catch (error) {
            console.error("Error in DELETE request:", error);
            res.status(500).json({ status: "error", message: "Internal Server Error" });
        }
    }));
    router.get("/getByID/:send_for_a_claim_id", authenticateToken_1.default, (0, permissions_1.authorizeByName)("ใบส่งเคลม", ["A"]), (0, httpHandlers_1.validateRequest)(sendForAClaimModel_1.GetParamSendForAClaimSchema), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const { company_id } = req.token.payload;
            const companyId = company_id;
            const { send_for_a_claim_id } = req.params;
            const serviceResponse = yield sendForAClaimService_1.sendForAClaimService.findById(companyId, send_for_a_claim_id);
            (0, httpHandlers_1.handleServiceResponse)(serviceResponse, res);
        }
        catch (error) {
            console.error("Error in GET request:", error);
            res.status(500).json({ status: "error", message: "Internal Server Error" });
        }
    }));
    router.get("/getSupplierRepairReceiptDoc", authenticateToken_1.default, (0, permissions_1.authorizeByName)("ใบส่งเคลม", ["A"]), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const { company_id } = req.token.payload;
            const serviceResponse = yield sendForAClaimService_1.sendForAClaimService.findDoc(company_id);
            (0, httpHandlers_1.handleServiceResponse)(serviceResponse, res);
        }
        catch (error) {
            console.error("Error in GET payload request:", error);
            res.status(500).json({ status: "error", message: "Internal Server Error" });
        }
    }));
    router.get("/getBySupplierRepairReceiptId/:id", authenticateToken_1.default, (0, permissions_1.authorizeByName)("ใบส่งเคลม", ["A"]), (0, httpHandlers_1.validateRequest)(sendForAClaimModel_1.GetParamSupplierRepairReceiptSchema), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const { company_id } = req.token.payload;
            const companyId = company_id;
            const { id } = req.params;
            const serviceResponse = yield sendForAClaimService_1.sendForAClaimService.findBySupplierRepairReceiptId(companyId, id);
            (0, httpHandlers_1.handleServiceResponse)(serviceResponse, res);
        }
        catch (error) {
            console.error("Error in GET request:", error);
            res.status(500).json({ status: "error", message: "Internal Server Error" });
        }
    }));
    router.get("/get-send-claim-docs-only", // ตั้งชื่อ path ให้สื่อความหมาย
    authenticateToken_1.default, 
    // กำหนด Permission ที่เหมาะสม (อาจจะแค่ Read ก็พอ)
    (0, permissions_1.authorizeByName)("ใบส่งเคลม", ["R", "A"]), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        var _a, _b;
        try {
            // ดึง company_id จาก token
            const company_id = (_b = (_a = req.token) === null || _a === void 0 ? void 0 : _a.payload) === null || _b === void 0 ? void 0 : _b.company_id;
            if (!company_id) {
                (0, httpHandlers_1.handleServiceResponse)(new serviceResponse_1.ServiceResponse(serviceResponse_1.ResponseStatus.Failed, "Company ID not found in token.", null, http_status_codes_1.StatusCodes.UNAUTHORIZED), res);
                return; // ออกจากฟังก์ชัน
            }
            // เรียก Service function ใหม่
            const serviceResponse = yield sendForAClaimService_1.sendForAClaimService.findOnlySendClaimDocsByCompanyId(company_id);
            (0, httpHandlers_1.handleServiceResponse)(serviceResponse, res);
        }
        catch (error) {
            console.error("Error in GET /get-send-claim-docs-only request:", error);
            (0, httpHandlers_1.handleServiceResponse)(new serviceResponse_1.ServiceResponse(serviceResponse_1.ResponseStatus.Failed, "An unexpected error occurred while fetching send for claim documents.", null, // หรือ []
            http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR), res);
        }
    }));
    router.get("/get-with-responsible/:send_for_a_claim_id", authenticateToken_1.default, (0, permissions_1.authorizeByName)("ใบส่งเคลม", ["A", "R"]), (0, httpHandlers_1.validateRequest)(sendForAClaimModel_1.GetParamSendForAClaimSchema), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const { company_id } = req.token.payload;
            const { send_for_a_claim_id } = req.params;
            const serviceResponse = yield sendForAClaimService_1.sendForAClaimService.findResponsibleUserForSendForAClaim(company_id, send_for_a_claim_id);
            (0, httpHandlers_1.handleServiceResponse)(serviceResponse, res);
            // ไม่มีการ return ที่นี่
        }
        catch (error) {
            console.error(`Error in /get-with-responsible/${req.params.send_for_a_claim_id}:`, error);
            const errorMessage = (error instanceof Error) ? error.message : "An unexpected error occurred.";
            (0, httpHandlers_1.handleServiceResponse)(new serviceResponse_1.ServiceResponse(serviceResponse_1.ResponseStatus.Failed, `Error processing request: ${errorMessage}`, null, http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR), res);
        }
    }));
    router.get("/select", authenticateToken_1.default, (0, permissions_1.authorizeByName)("ใบส่งเคลม", ["A", "R"]), (0, httpHandlers_1.validateRequest)(sendForAClaimModel_1.SelectSchema), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const { company_id } = req.token.payload;
        const searchText = req.query.searchText || "";
        const companyId = company_id;
        const ServiceResponse = yield sendForAClaimService_1.sendForAClaimService.select(companyId, searchText);
        (0, httpHandlers_1.handleServiceResponse)(ServiceResponse, res);
    }));
    return router;
})();
