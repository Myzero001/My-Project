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
exports.mspositionRouter = void 0;
// ms_positionRouter.ts
const express_1 = __importDefault(require("express"));
const httpHandlers_1 = require("@common/utils/httpHandlers");
const ms_positionService_1 = require("@modules/ms_position/ms_positionService");
const ms_positionModel_1 = require("@modules/ms_position/ms_positionModel");
const authenticateToken_1 = __importDefault(require("@common/middleware/authenticateToken"));
const permissions_1 = require("@common/middleware/permissions");
exports.mspositionRouter = (() => {
    const router = express_1.default.Router();
    router.get("/get", authenticateToken_1.default, (0, permissions_1.authorizeByName)("ตำแหน่ง", ["A"]), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const companyId = req.token.company_id;
            const page = parseInt(req.query.page) || 1;
            const pageSize = parseInt(req.query.pageSize) || 12;
            const searchText = req.query.searchText || "";
            const ServiceResponse = yield ms_positionService_1.ms_positionService.findAll(companyId, page, pageSize, searchText);
            (0, httpHandlers_1.handleServiceResponse)(ServiceResponse, res);
        }
        catch (error) {
            console.error("Error in GET request:", error);
            res.status(500).json({ status: "error", message: "Internal Server Error" });
        }
    }));
    router.post("/create", authenticateToken_1.default, (0, permissions_1.authorizeByName)("ตำแหน่ง", ["A"]), (0, httpHandlers_1.validateRequest)(ms_positionModel_1.CreateMsPositionSchema), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const { company_id, uuid } = req.token.payload;
            const companyId = company_id;
            const userId = uuid;
            const payload = req.body;
            const ServiceResponse = yield ms_positionService_1.ms_positionService.create(companyId, userId, payload);
            (0, httpHandlers_1.handleServiceResponse)(ServiceResponse, res);
        }
        catch (error) {
            console.error("Error in POST request:", error);
            res.status(500).json({ status: "error", message: "Internal Server Error" });
        }
    }));
    router.patch("/update", authenticateToken_1.default, (0, permissions_1.authorizeByName)("ตำแหน่ง", ["A"]), (0, httpHandlers_1.validateRequest)(ms_positionModel_1.UpdateMsPositionSchema), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const { company_id, uuid } = req.token.payload;
            const companyId = company_id;
            const userId = uuid;
            const { position_id } = req.body;
            const payload = req.body;
            const ServiceResponse = yield ms_positionService_1.ms_positionService.update(companyId, userId, position_id, payload);
            (0, httpHandlers_1.handleServiceResponse)(ServiceResponse, res);
        }
        catch (error) {
            console.error("Error in PATCH request:", error);
            res.status(500).json({ status: "error", message: "Internal Server Error" });
        }
    }));
    router.delete("/delete/:position_id", authenticateToken_1.default, (0, permissions_1.authorizeByName)("ตำแหน่ง", ["A"]), (0, httpHandlers_1.validateRequest)(ms_positionModel_1.GetParamMsPositionSchema), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const { company_id } = req.token.payload;
            const companyId = company_id;
            const { position_id } = req.params;
            const ServiceResponse = yield ms_positionService_1.ms_positionService.delete(companyId, position_id);
            (0, httpHandlers_1.handleServiceResponse)(ServiceResponse, res);
        }
        catch (error) {
            console.error("Error in DELETE request:", error);
            res.status(500).json({ status: "error", message: "Internal Server Error" });
        }
    }));
    router.get("/get/:position_id", authenticateToken_1.default, (0, permissions_1.authorizeByName)("ตำแหน่ง", ["A"]), (0, httpHandlers_1.validateRequest)(ms_positionModel_1.GetParamMsPositionSchema), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const companyId = req.token.company_id;
            const { position_id } = req.params;
            const ServiceResponse = yield ms_positionService_1.ms_positionService.findById(companyId, position_id);
            (0, httpHandlers_1.handleServiceResponse)(ServiceResponse, res);
        }
        catch (error) {
            console.error("Error in GET request:", error);
            res.status(500).json({ status: "error", message: "Internal Server Error" });
        }
    }));
    router.get("/select", authenticateToken_1.default, (0, permissions_1.authorizeByName)("ตำแหน่ง", ["A", "R"]), (0, httpHandlers_1.validateRequest)(ms_positionModel_1.SelectSchema), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const { company_id } = req.token.payload;
        const searchText = req.query.searchText || "";
        const companyId = company_id;
        const ServiceResponse = yield ms_positionService_1.ms_positionService.select(companyId, searchText);
        (0, httpHandlers_1.handleServiceResponse)(ServiceResponse, res);
    }));
    return router;
})();
