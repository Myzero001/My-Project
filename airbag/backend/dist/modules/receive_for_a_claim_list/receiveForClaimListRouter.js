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
exports.receiveForAClaimListRouter = void 0;
const express_1 = __importDefault(require("express"));
const httpHandlers_1 = require("@common/utils/httpHandlers");
const receiveForClaimListService_1 = require("./receiveForClaimListService");
const receiveForClaimListModel_1 = require("./receiveForClaimListModel");
const authenticateToken_1 = __importDefault(require("@common/middleware/authenticateToken"));
const permissions_1 = require("@common/middleware/permissions");
exports.receiveForAClaimListRouter = (() => {
    const router = express_1.default.Router();
    router.get("/get", authenticateToken_1.default, (0, permissions_1.authorizeByName)("ใบรับเคลม", ["A"]), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const companyId = req.token.company_id;
            const page = parseInt(req.query.page) || 1;
            const pageSize = parseInt(req.query.pageSize) || 12;
            const searchText = req.query.searchText || "";
            const serviceResponse = yield receiveForClaimListService_1.receiveForAClaimListService.findAll(companyId, page, pageSize, searchText);
            (0, httpHandlers_1.handleServiceResponse)(serviceResponse, res);
        }
        catch (error) {
            console.error("Error in GET request:", error);
            res.status(500).json({ status: "error", message: "Internal Server Error" });
        }
    }));
    router.get("/getByReceiveForAClaimId/:receive_for_a_claim_id", authenticateToken_1.default, (0, permissions_1.authorizeByName)("ใบรับเคลม", ["A"]), (0, httpHandlers_1.validateRequest)(receiveForClaimListModel_1.GetByReceiveForAClaimIdSchema), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const { receive_for_a_claim_id } = req.params;
            const serviceResponse = yield receiveForClaimListService_1.receiveForAClaimListService.findByReceiveForAClaimId(receive_for_a_claim_id);
            (0, httpHandlers_1.handleServiceResponse)(serviceResponse, res);
        }
        catch (error) {
            console.error("Error in GET request:", error);
            res.status(500).json({ status: "error", message: "Internal Server Error" });
        }
    }));
    router.post("/create", authenticateToken_1.default, (0, permissions_1.authorizeByName)("ใบรับเคลม", ["A"]), (0, httpHandlers_1.validateRequest)(receiveForClaimListModel_1.CreateReceiveForAClaimListSchema), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const { uuid, company_id } = req.token.payload;
            const payload = req.body;
            const serviceResponse = yield receiveForClaimListService_1.receiveForAClaimListService.create(uuid, payload, company_id);
            (0, httpHandlers_1.handleServiceResponse)(serviceResponse, res);
        }
        catch (error) {
            console.error("Error in POST request:", error);
            res.status(500).json({ status: "error", message: "Internal Server Error" });
        }
    }));
    router.post("/createMany", authenticateToken_1.default, (0, permissions_1.authorizeByName)("ใบรับเคลม", ["A"]), (0, httpHandlers_1.validateRequest)(receiveForClaimListModel_1.CreateMultipleReceiveForAClaimListSchema), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const { uuid, company_id } = req.token.payload;
            const { items } = req.body;
            const serviceResponse = yield receiveForClaimListService_1.receiveForAClaimListService.createMany(uuid, items, company_id);
            (0, httpHandlers_1.handleServiceResponse)(serviceResponse, res);
        }
        catch (error) {
            console.error("Error in POST request:", error);
            res.status(500).json({ status: "error", message: "Internal Server Error" });
        }
    }));
    router.patch("/update/:id", authenticateToken_1.default, (0, permissions_1.authorizeByName)("ใบรับเคลม", ["A"]), (0, httpHandlers_1.validateRequest)(receiveForClaimListModel_1.UpdateReceiveForAClaimListSchema), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const { uuid } = req.token.payload;
            const { id } = req.params;
            const payload = req.body;
            const serviceResponse = yield receiveForClaimListService_1.receiveForAClaimListService.update(uuid, id, payload);
            (0, httpHandlers_1.handleServiceResponse)(serviceResponse, res);
        }
        catch (error) {
            console.error("Error in PATCH request:", error);
            res.status(500).json({ status: "error", message: "Internal Server Error" });
        }
    }));
    router.delete("/delete/:id", authenticateToken_1.default, (0, permissions_1.authorizeByName)("ใบรับเคลม", ["A"]), (0, httpHandlers_1.validateRequest)(receiveForClaimListModel_1.GetParamReceiveForAClaimListSchema), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const { id } = req.params;
            const serviceResponse = yield receiveForClaimListService_1.receiveForAClaimListService.delete(id);
            (0, httpHandlers_1.handleServiceResponse)(serviceResponse, res);
        }
        catch (error) {
            console.error("Error in DELETE request:", error);
            res.status(500).json({ status: "error", message: "Internal Server Error" });
        }
    }));
    router.get("/getById/:id", authenticateToken_1.default, (0, permissions_1.authorizeByName)("ใบรับเคลม", ["A"]), (0, httpHandlers_1.validateRequest)(receiveForClaimListModel_1.GetParamReceiveForAClaimListSchema), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const { id } = req.params;
            const serviceResponse = yield receiveForClaimListService_1.receiveForAClaimListService.findOne(id);
            (0, httpHandlers_1.handleServiceResponse)(serviceResponse, res);
        }
        catch (error) {
            console.error("Error in GET request:", error);
            res.status(500).json({ status: "error", message: "Internal Server Error" });
        }
    }));
    router.get("/payLoadForReceiveForAClaimList/:receive_for_a_claim_id/:send_for_a_claim_id", authenticateToken_1.default, (0, permissions_1.authorizeByName)("ใบรับเคลม", ["A"]), (0, httpHandlers_1.validateRequest)(receiveForClaimListModel_1.GetParamPayloadListSchema), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const companyId = req.token.company_id;
            const { receive_for_a_claim_id, send_for_a_claim_id } = req.params;
            const serviceResponse = yield receiveForClaimListService_1.receiveForAClaimListService.findPayloadList(companyId, receive_for_a_claim_id, send_for_a_claim_id);
            (0, httpHandlers_1.handleServiceResponse)(serviceResponse, res);
        }
        catch (error) {
            console.error("Error in GET payload list request:", error);
            res.status(500).json({ status: "error", message: "Internal Server Error" });
        }
    }));
    return router;
})();
