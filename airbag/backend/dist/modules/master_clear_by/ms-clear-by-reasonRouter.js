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
exports.clearByReasonRouter = void 0;
const express_1 = __importDefault(require("express"));
const httpHandlers_1 = require("@common/utils/httpHandlers");
const authenticateToken_1 = __importDefault(require("@common/middleware/authenticateToken"));
const ms_clear_by_reasonModel_1 = require("@modules/master_clear_by/ms-clear-by-reasonModel");
const ms_clear_by_resonService_1 = require("@modules/master_clear_by/ms-clear-by-resonService");
const permissions_1 = require("@common/middleware/permissions");
exports.clearByReasonRouter = (() => {
    const router = express_1.default.Router();
    //test
    router.get("/test", (req, res) => {
        res.json({ message: "Hello World!" });
    });
    router.get("/get", authenticateToken_1.default, (0, permissions_1.authorizeByName)("clearby", ["A"]), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const page = parseInt(req.query.page) || 1;
            const pageSize = parseInt(req.query.pageSize) || 12;
            const companyId = req.token.company_id;
            const searchText = req.query.searchText || "";
            const ServiceResponse = yield ms_clear_by_resonService_1.clearByReasonService.findAll(companyId, page, pageSize, searchText);
            (0, httpHandlers_1.handleServiceResponse)(ServiceResponse, res);
        }
        catch (error) {
            console.error(error);
            res.status(500).json({ message: "Internal server error" });
        }
    }));
    router.get("/get_all", (_req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const ServiceResponse = yield ms_clear_by_resonService_1.clearByReasonService.findAllNoPagination();
        (0, httpHandlers_1.handleServiceResponse)(ServiceResponse, res);
    }));
    router.post("/create", authenticateToken_1.default, (0, permissions_1.authorizeByName)("clearby", ["A"]), (0, httpHandlers_1.validateRequest)(ms_clear_by_reasonModel_1.CreateCelarBySchema), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const { company_id, uuid } = req.token.payload;
            const payload = req.body;
            const ServiceResponse = yield ms_clear_by_resonService_1.clearByReasonService.create(company_id, uuid, payload);
            (0, httpHandlers_1.handleServiceResponse)(ServiceResponse, res);
        }
        catch (error) {
            console.error(error);
            res.status(500).json({ message: "Internal server error" });
        }
    }));
    router.patch("/update", authenticateToken_1.default, (0, permissions_1.authorizeByName)("clearby", ["A"]), (0, httpHandlers_1.validateRequest)(ms_clear_by_reasonModel_1.UpdateCelarBySchema), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const { company_id, uuid } = req.token.payload;
            const { clear_by_id } = req.body;
            const payload = req.body;
            const ServiceResponse = yield ms_clear_by_resonService_1.clearByReasonService.update(company_id, uuid, clear_by_id, payload);
            (0, httpHandlers_1.handleServiceResponse)(ServiceResponse, res);
        }
        catch (error) {
            console.error(error);
            res.status(500).json({ message: "Internal server error" });
        }
    }));
    router.delete("/delete/:clear_by_id", authenticateToken_1.default, (0, permissions_1.authorizeByName)("clearby", ["A"]), (0, httpHandlers_1.validateRequest)(ms_clear_by_reasonModel_1.GetParamClearBySchema), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const { company_id } = req.token.payload;
            const { clear_by_id } = req.params;
            const ServiceResponse = yield ms_clear_by_resonService_1.clearByReasonService.delete(company_id, clear_by_id);
            (0, httpHandlers_1.handleServiceResponse)(ServiceResponse, res);
        }
        catch (error) {
            console.error(error);
            res.status(500).json({ message: "Internal server error" });
        }
    }));
    router.get("/get/:clear_by_id", authenticateToken_1.default, (0, permissions_1.authorizeByName)("clearby", ["A"]), (0, httpHandlers_1.validateRequest)(ms_clear_by_reasonModel_1.GetParamClearBySchema), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const { company_id } = req.token.payload;
            const { clear_by_id } = req.params;
            const ServiceResponse = yield ms_clear_by_resonService_1.clearByReasonService.findById(company_id, clear_by_id);
            (0, httpHandlers_1.handleServiceResponse)(ServiceResponse, res);
        }
        catch (error) {
            console.error(error);
            res.status(500).json({ message: "Internal server error" });
        }
    }));
    router.get("/select", authenticateToken_1.default, (0, permissions_1.authorizeByName)("clearby", ["A", "R"]), (0, httpHandlers_1.validateRequest)(ms_clear_by_reasonModel_1.SelectSchema), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const { company_id } = req.token.payload;
        const searchText = req.query.searchText || "";
        const companyId = company_id;
        const ServiceResponse = yield ms_clear_by_resonService_1.clearByReasonService.select(companyId, searchText);
        (0, httpHandlers_1.handleServiceResponse)(ServiceResponse, res);
    }));
    return router;
})();
