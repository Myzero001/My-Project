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
exports.sendForAClaimListRouter = void 0;
const express_1 = __importDefault(require("express"));
const httpHandlers_1 = require("@common/utils/httpHandlers");
const authenticateToken_1 = __importDefault(require("@common/middleware/authenticateToken"));
const sendForAClaimListService_1 = require("@modules/send-for-a-claim-list/sendForAClaimListService");
const sendForAClaimListModel_1 = require("@modules/send-for-a-claim-list/sendForAClaimListModel");
const permissions_1 = require("@common/middleware/permissions");
exports.sendForAClaimListRouter = (() => {
    const router = express_1.default.Router();
    router.get("/get", authenticateToken_1.default, (0, permissions_1.authorizeByName)("ใบส่งเคลม", ["A"]), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const companyId = req.token.company_id;
            const { send_for_a_claim_id } = req.params;
            const serviceResponse = yield sendForAClaimListService_1.sendForAClaimListService.findAll(companyId);
            (0, httpHandlers_1.handleServiceResponse)(serviceResponse, res);
        }
        catch (error) {
            console.error("Error in GET request:", error);
            res.status(500).json({ status: "error", message: "Internal Server Error" });
        }
    }));
    router.post("/create", authenticateToken_1.default, (0, permissions_1.authorizeByName)("ใบส่งเคลม", ["A"]), (0, httpHandlers_1.validateRequest)(sendForAClaimListModel_1.CreateSendForAClaimListSchema), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const { company_id, uuid } = req.token.payload;
            const companyId = company_id;
            const userId = uuid;
            const payload = req.body;
            const serviceResponse = yield sendForAClaimListService_1.sendForAClaimListService.create(companyId, userId, payload);
            (0, httpHandlers_1.handleServiceResponse)(serviceResponse, res);
        }
        catch (error) {
            console.error("Error in POST request:", error);
            res.status(500).json({ status: "error", message: "Internal Server Error" });
        }
    }));
    router.patch("/update", authenticateToken_1.default, (0, permissions_1.authorizeByName)("ใบส่งเคลม", ["A"]), (0, httpHandlers_1.validateRequest)(sendForAClaimListModel_1.UpdateSendForAClaimListSchema), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const { company_id, uuid } = req.token.payload;
            const companyId = company_id;
            const userId = uuid;
            const { send_for_a_claim_list_id } = req.body;
            const payload = req.body;
            const serviceResponse = yield sendForAClaimListService_1.sendForAClaimListService.update(companyId, userId, send_for_a_claim_list_id, payload);
            (0, httpHandlers_1.handleServiceResponse)(serviceResponse, res);
        }
        catch (error) {
            console.error("Error in PATCH request:", error);
            res.status(500).json({ status: "error", message: "Internal Server Error" });
        }
    }));
    router.delete("/delete/:send_for_a_claim_list_id", authenticateToken_1.default, (0, permissions_1.authorizeByName)("ใบส่งเคลม", ["A"]), (0, httpHandlers_1.validateRequest)(sendForAClaimListModel_1.GetParamSendForAClaimListSchema), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const { company_id } = req.token.payload;
            const companyId = company_id;
            const { send_for_a_claim_list_id } = req.params;
            const ServiceResponse = yield sendForAClaimListService_1.sendForAClaimListService.delete(companyId, send_for_a_claim_list_id);
            (0, httpHandlers_1.handleServiceResponse)(ServiceResponse, res);
        }
        catch (error) {
            console.error("Error in DELETE request:", error);
            res.status(500).json({ status: "error", message: "Internal Server Error" });
        }
    }));
    router.get("/getByID/:send_for_a_claim_list_id", authenticateToken_1.default, (0, permissions_1.authorizeByName)("ใบส่งเคลม", ["A"]), (0, httpHandlers_1.validateRequest)(sendForAClaimListModel_1.GetParamSendForAClaimListSchema), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const { company_id } = req.token.payload;
            const companyId = company_id;
            const { send_for_a_claim_list_id } = req.params;
            const serviceResponse = yield sendForAClaimListService_1.sendForAClaimListService.findById(companyId, send_for_a_claim_list_id);
            (0, httpHandlers_1.handleServiceResponse)(serviceResponse, res);
        }
        catch (error) {
            console.error("Error in GET request:", error);
            res.status(500).json({ status: "error", message: "Internal Server Error" });
        }
    }));
    router.post("/update-data", authenticateToken_1.default, (0, permissions_1.authorizeByName)("ใบส่งเคลม", ["A"]), (0, httpHandlers_1.validateRequest)(sendForAClaimListModel_1.SubmitSendForAClaimListSchema), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const { company_id, uuid } = req.token.payload;
            const companyId = company_id;
            const userId = uuid;
            const payload = req.body;
            const serviceResponse = yield sendForAClaimListService_1.sendForAClaimListService.updateData(companyId, userId, payload);
            (0, httpHandlers_1.handleServiceResponse)(serviceResponse, res);
        }
        catch (error) {
            console.error("Error in POST request:", error);
            res.status(500).json({ status: "error", message: "Internal Server Error" });
        }
    }));
    return router;
})();
