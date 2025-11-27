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
exports.dashboardCQRouter = void 0;
// ms_positionRouter.ts
const express_1 = __importDefault(require("express"));
const httpHandlers_1 = require("@common/utils/httpHandlers");
// import { CreateMsPositionSchema, UpdateMsPositionSchema, GetMsPositionSchema, GetParamMsPositionSchema } from "@modules/ms_position/ms_positionModel"
const authenticateToken_1 = __importDefault(require("@common/middleware/authenticateToken"));
const authorizeAll_1 = __importDefault(require("@common/middleware/authorizeAll"));
const dashboardCQService_1 = require("./dashboardCQService");
exports.dashboardCQRouter = (() => {
    const router = express_1.default.Router();
    router.get("/getTopTenCustomer", authenticateToken_1.default, authorizeAll_1.default, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const companyId = req.token.company_id;
            const ServiceResponse = yield dashboardCQService_1.dashboardCQService.getTopTenCustomer(companyId);
            (0, httpHandlers_1.handleServiceResponse)(ServiceResponse, res);
        }
        catch (error) {
            console.error("Error in GET request:", error);
            res
                .status(500)
                .json({ status: "error", message: "Internal Server Error" });
        }
    }));
    router.get("/getTotalAmount", authenticateToken_1.default, authorizeAll_1.default, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const companyId = req.token.company_id;
            const ServiceResponse = yield dashboardCQService_1.dashboardCQService.getTotalAmount(companyId);
            (0, httpHandlers_1.handleServiceResponse)(ServiceResponse, res);
        }
        catch (error) {
            console.error("Error in GET request:", error);
            res
                .status(500)
                .json({ status: "error", message: "Internal Server Error" });
        }
    }));
    router.get("/getQuotationStatus", authenticateToken_1.default, authorizeAll_1.default, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const companyId = req.token.company_id;
            const dateRange = req.query.dateRange; // '15days', '30days', '1month', '3months', '6months', '1year'
            const ServiceResponse = yield dashboardCQService_1.dashboardCQService.getQuotationStatus(companyId, dateRange);
            (0, httpHandlers_1.handleServiceResponse)(ServiceResponse, res);
        }
        catch (error) {
            console.error("Error in GET request:", error);
            res
                .status(500)
                .json({ status: "error", message: "Internal Server Error" });
        }
    }));
    router.get("/getTopTenSale", authenticateToken_1.default, authorizeAll_1.default, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const companyId = req.token.company_id;
            const ServiceResponse = yield dashboardCQService_1.dashboardCQService.getTopTenSale(companyId);
            (0, httpHandlers_1.handleServiceResponse)(ServiceResponse, res);
        }
        catch (error) {
            console.error("Error in GET request:", error);
            res
                .status(500)
                .json({ status: "error", message: "Internal Server Error" });
        }
    }));
    router.get("/getQuotationSummary", authenticateToken_1.default, authorizeAll_1.default, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const companyId = req.token.company_id;
            const dateRange = req.query.dateRange; // '7days','15days', '1month', '3months', '6months', '1year', '3years','all'
            const ServiceResponse = yield dashboardCQService_1.dashboardCQService.getQuotationSummary(companyId, dateRange);
            (0, httpHandlers_1.handleServiceResponse)(ServiceResponse, res);
        }
        catch (error) {
            console.error("Error in GET request:", error);
            res
                .status(500)
                .json({ status: "error", message: "Internal Server Error" });
        }
    }));
    return router;
})();
