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
exports.colorRouter = void 0;
const express_1 = __importDefault(require("express"));
const httpHandlers_1 = require("@common/utils/httpHandlers");
const permissions_1 = require("@common/middleware/permissions");
const colorService_1 = require("./colorService");
const colorModel_1 = require("./colorModel");
const authenticateToken_1 = __importDefault(require("@common/middleware/authenticateToken"));
exports.colorRouter = (() => {
    const router = express_1.default.Router();
    router.get("/get", authenticateToken_1.default, (0, permissions_1.authorizeByName)("สี", ["A"]), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const page = parseInt(req.query.page) || 1;
            const pageSize = parseInt(req.query.pageSize) || 12;
            const companyId = req.token.company_id;
            const searchText = req.query.searchText || "";
            const ServiceResponse = yield colorService_1.colorService.findAll(companyId, page, pageSize, searchText);
            (0, httpHandlers_1.handleServiceResponse)(ServiceResponse, res);
        }
        catch (error) {
            console.error("Error in GET request:", error);
            res
                .status(500)
                .json({ status: "error", message: "Internal Server Error" });
        }
    }));
    router.get("/get_all", authenticateToken_1.default, (0, permissions_1.authorizeByName)("สีเพิ่มเติม", ["A", "R"]), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const { company_id, } = req.token.payload;
        const companyId = company_id;
        const ServiceResponse = yield colorService_1.colorService.findAllNoPagination(companyId);
        (0, httpHandlers_1.handleServiceResponse)(ServiceResponse, res);
    }));
    router.post("/create", authenticateToken_1.default, (0, permissions_1.authorizeByName)("สี", ["A"]), (0, httpHandlers_1.validateRequest)(colorModel_1.CreateColorSchema), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const { company_id, uuid } = req.token.payload;
            const companyId = company_id;
            const userId = uuid;
            const payload = req.body;
            const ServiceResponse = yield colorService_1.colorService.create(companyId, userId, payload);
            (0, httpHandlers_1.handleServiceResponse)(ServiceResponse, res);
        }
        catch (error) {
            console.error("Error in POST request:", error);
            res
                .status(500)
                .json({ status: "error", message: "Internal Server Error" });
        }
    }));
    router.patch("/update/:color_id", authenticateToken_1.default, (0, permissions_1.authorizeByName)("สี", ["A"]), (0, httpHandlers_1.validateRequest)(colorModel_1.UpdateColorSchema), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const { company_id, uuid } = req.token.payload;
            const companyId = company_id;
            const userId = uuid;
            const { color_id } = req.params;
            const payload = req.body;
            const ServiceResponse = yield colorService_1.colorService.update(color_id, payload, companyId, userId);
            (0, httpHandlers_1.handleServiceResponse)(ServiceResponse, res);
        }
        catch (error) {
            console.error("Error in PATCH request:", error);
            res
                .status(500)
                .json({ status: "error", message: "Internal Server Error" });
        }
    }));
    //
    router.delete("/delete/:color_id", authenticateToken_1.default, (0, permissions_1.authorizeByName)("สี", ["A"]), (0, httpHandlers_1.validateRequest)(colorModel_1.deleteColorSchema), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const { company_id } = req.token.payload; // ดึง company_id จาก token
            const { color_id } = req.params;
            const ServiceResponse = yield colorService_1.colorService.delete(company_id, color_id); // ส่ง company_id และ color_id
            (0, httpHandlers_1.handleServiceResponse)(ServiceResponse, res);
        }
        catch (error) {
            console.error("Error in DELETE request:", error);
            res
                .status(500)
                .json({ status: "error", message: "Internal Server Error" });
        }
    }));
    router.get("/get/:color_name", authenticateToken_1.default, (0, permissions_1.authorizeByName)("สี", ["A"]), (0, httpHandlers_1.validateRequest)(colorModel_1.GetColorSchema), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const { company_id, } = req.token.payload;
            const companyId = company_id;
            const { color_id } = req.params; // รับ query จาก params
            const ServiceResponse = yield colorService_1.colorService.search(color_id, companyId);
            (0, httpHandlers_1.handleServiceResponse)(ServiceResponse, res);
        }
        catch (error) {
            console.error("Error in GET request:", error);
            res
                .status(500)
                .json({ status: "error", message: "Internal Server Error" });
        }
    }));
    router.get("/select", authenticateToken_1.default, (0, permissions_1.authorizeByName)("สี", ["A", "R"]), (0, httpHandlers_1.validateRequest)(colorModel_1.SelectSchema), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const { company_id } = req.token.payload;
        const searchText = req.query.searchText || "";
        const companyId = company_id;
        const ServiceResponse = yield colorService_1.colorService.select(companyId, searchText);
        (0, httpHandlers_1.handleServiceResponse)(ServiceResponse, res);
    }));
    return router;
})();
