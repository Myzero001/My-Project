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
exports.receiveForAClaimRouter = void 0;
const express_1 = __importDefault(require("express"));
const httpHandlers_1 = require("@common/utils/httpHandlers");
const receiveForClaimService_1 = require("./receiveForClaimService");
const receiveForClaimModel_1 = require("./receiveForClaimModel");
const serviceResponse_1 = require("@common/models/serviceResponse");
const http_status_codes_1 = require("http-status-codes");
const authenticateToken_1 = __importDefault(require("@common/middleware/authenticateToken"));
const permissions_1 = require("@common/middleware/permissions");
exports.receiveForAClaimRouter = (() => {
    const router = express_1.default.Router();
    router.get("/get", authenticateToken_1.default, (0, permissions_1.authorizeByName)("ใบรับเคลม", ["A"]), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const companyId = req.token.company_id;
            const page = parseInt(req.query.page) || 1;
            const pageSize = parseInt(req.query.pageSize) || 12;
            const searchText = req.query.searchText || "";
            const serviceResponse = yield receiveForClaimService_1.receiveForAClaimService.findAll(companyId, page, pageSize, searchText);
            (0, httpHandlers_1.handleServiceResponse)(serviceResponse, res);
        }
        catch (error) {
            console.error("Error in GET request:", error);
            res.status(500).json({ status: "error", message: "Internal Server Error" });
        }
    }));
    router.post("/create", authenticateToken_1.default, (0, permissions_1.authorizeByName)("ใบรับเคลม", ["A"]), (0, httpHandlers_1.validateRequest)(receiveForClaimModel_1.CreateReceiveForAClaimSchema), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const { company_id, uuid } = req.token.payload;
            const payload = req.body;
            const serviceResponse = yield receiveForClaimService_1.receiveForAClaimService.create(uuid, company_id, payload);
            (0, httpHandlers_1.handleServiceResponse)(serviceResponse, res);
        }
        catch (error) {
            console.error("Error in POST request:", error);
            res.status(500).json({ status: "error", message: "Internal Server Error" });
        }
    }));
    router.patch("/update/:id", authenticateToken_1.default, (0, permissions_1.authorizeByName)("ใบรับเคลม", ["A"]), (0, httpHandlers_1.validateRequest)(receiveForClaimModel_1.UpdateReceiveForAClaimSchema), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const { uuid } = req.token.payload;
            const { id } = req.params;
            const payload = req.body;
            const serviceResponse = yield receiveForClaimService_1.receiveForAClaimService.update(uuid, id, payload);
            (0, httpHandlers_1.handleServiceResponse)(serviceResponse, res);
        }
        catch (error) {
            console.error("Error in PATCH request:", error);
            res.status(500).json({ status: "error", message: "Internal Server Error" });
        }
    }));
    router.delete("/delete/:id", authenticateToken_1.default, (0, permissions_1.authorizeByName)("ใบรับเคลม", ["A"]), (0, httpHandlers_1.validateRequest)(receiveForClaimModel_1.GetParamReceiveForAClaimSchema), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const { uuid } = req.token.payload; // Get userId
            const { id } = req.params; // Get record id
            // *** ส่ง userId และ id ให้ Service ***
            const serviceResponse = yield receiveForClaimService_1.receiveForAClaimService.delete(uuid, id);
            (0, httpHandlers_1.handleServiceResponse)(serviceResponse, res);
        }
        catch (error) {
            console.error("Error in DELETE request:", error);
            res.status(500).json({ status: "error", message: "Internal Server Error" });
        }
    }));
    router.get("/getById/:id", authenticateToken_1.default, (0, permissions_1.authorizeByName)("ใบรับเคลม", ["A"]), (0, httpHandlers_1.validateRequest)(receiveForClaimModel_1.GetParamReceiveForAClaimSchema), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const { id } = req.params;
            const serviceResponse = yield receiveForClaimService_1.receiveForAClaimService.findOne(id);
            (0, httpHandlers_1.handleServiceResponse)(serviceResponse, res);
        }
        catch (error) {
            console.error("Error in GET request:", error);
            res.status(500).json({ status: "error", message: "Internal Server Error" });
        }
    }));
    router.get("/payLoadForReceiveForAClaim", authenticateToken_1.default, (0, permissions_1.authorizeByName)("ใบรับเคลม", ["A"]), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const companyId = req.token.company_id;
            const page = parseInt(req.query.page) || 1;
            const pageSize = parseInt(req.query.pageSize) || 12;
            const searchText = req.query.searchText || "";
            const serviceResponse = yield receiveForClaimService_1.receiveForAClaimService.findPayloadData(companyId, page, pageSize, searchText);
            (0, httpHandlers_1.handleServiceResponse)(serviceResponse, res);
        }
        catch (error) {
            console.error("Error in GET request:", error);
            res.status(500).json({ status: "error", message: "Internal Server Error" });
        }
    }));
    router.get("/getSendForClaimDoc", authenticateToken_1.default, (0, permissions_1.authorizeByName)("ใบรับเคลม", ["A"]), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const companyId = req.token.company_id;
            const serviceResponse = yield receiveForClaimService_1.receiveForAClaimService.getSendForClaimDocs(companyId);
            (0, httpHandlers_1.handleServiceResponse)(serviceResponse, res);
        }
        catch (error) {
            console.error("Error in GET request:", error);
            res.status(500).json({ status: "error", message: "Internal Server Error" });
        }
    }));
    router.get("/get-receive-claim-docs-only", // ตั้งชื่อ path ให้สื่อความหมาย
    authenticateToken_1.default, 
    // กำหนด Permission ที่เหมาะสม (อาจจะแค่ Read ก็พอ)
    (0, permissions_1.authorizeByName)("ใบรับเคลม", ["R", "A"]), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        var _a, _b;
        try {
            // ดึง company_id จาก token
            const company_id = (_b = (_a = req.token) === null || _a === void 0 ? void 0 : _a.payload) === null || _b === void 0 ? void 0 : _b.company_id;
            if (!company_id) {
                (0, httpHandlers_1.handleServiceResponse)(new serviceResponse_1.ServiceResponse(serviceResponse_1.ResponseStatus.Failed, "Company ID not found in token.", null, http_status_codes_1.StatusCodes.UNAUTHORIZED), res);
                return; // ออกจากฟังก์ชัน
            }
            // เรียก Service function ใหม่
            const serviceResponse = yield receiveForClaimService_1.receiveForAClaimService.findOnlyReceiveClaimDocsByCompanyId(company_id);
            (0, httpHandlers_1.handleServiceResponse)(serviceResponse, res);
        }
        catch (error) {
            console.error("Error in GET /get-receive-claim-docs-only request:", error);
            (0, httpHandlers_1.handleServiceResponse)(new serviceResponse_1.ServiceResponse(serviceResponse_1.ResponseStatus.Failed, "An unexpected error occurred while fetching receive for claim documents.", null, http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR), res);
        }
    }));
    router.get("/get-with-responsible/:id", authenticateToken_1.default, (0, permissions_1.authorizeByName)("ใบรับเคลม", ["A", "R"]), (0, httpHandlers_1.validateRequest)(receiveForClaimModel_1.GetParamReceiveForAClaimSchema), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const { id } = req.params;
            const serviceResponse = yield receiveForClaimService_1.receiveForAClaimService.findResponsibleUserForReceiveForAClaim(id);
            (0, httpHandlers_1.handleServiceResponse)(serviceResponse, res);
        }
        catch (error) {
            console.error(`Error in /get-with-responsible/${req.params.id}:`, error);
            const errorMessage = (error instanceof Error) ? error.message : "An unexpected error occurred.";
            (0, httpHandlers_1.handleServiceResponse)(new serviceResponse_1.ServiceResponse(serviceResponse_1.ResponseStatus.Failed, `Error processing request: ${errorMessage}`, null, http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR), res);
        }
    }));
    return router;
})();
