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
exports.ms_companiesModelRouter = void 0;
const express_1 = __importDefault(require("express"));
const httpHandlers_1 = require("@common/utils/httpHandlers");
const authenticateToken_1 = __importDefault(require("@common/middleware/authenticateToken"));
const ms_companireService_1 = require("./ms_companireService");
const ms_companiesModel_1 = require("./ms_companiesModel");
const permissions_1 = require("@common/middleware/permissions");
exports.ms_companiesModelRouter = (() => {
    const router = express_1.default.Router();
    router.get("/get", authenticateToken_1.default, (0, permissions_1.authorizeByName)("จัดการสาขา", ["A"]), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const page = parseInt(req.query.page) || 1;
        const pageSize = parseInt(req.query.pageSize) || 12;
        const companyId = req.token.company_id; // ดึง companyId จาก token
        const searchText = req.query.searchText || ""; // ใช้ค่า query จาก client
        const ServiceResponse = yield ms_companireService_1.CompaniesService.findAll(companyId, page, pageSize, searchText);
        (0, httpHandlers_1.handleServiceResponse)(ServiceResponse, res);
    }));
    router.post("/create", authenticateToken_1.default, (0, permissions_1.authorizeByName)("จัดการสาขา", ["A"]), (0, httpHandlers_1.validateRequest)(ms_companiesModel_1.CreateCompaniesSchema), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            // ดึงข้อมูล userId จาก token
            const { company_id, uuid } = req.token.payload;
            const companyId = company_id;
            const userId = uuid;
            const payload = req.body;
            // เรียก Service เพื่อสร้าง company โดยไม่ต้องส่ง created_by
            const ServiceResponse = yield ms_companireService_1.CompaniesService.create(companyId, userId, payload);
            (0, httpHandlers_1.handleServiceResponse)(ServiceResponse, res);
        }
        catch (error) {
            console.error(`Error in POST /create: ${error}`);
            res.status(500).json({ status: "error", message: "Internal Server Error" });
        }
    }));
    router.patch("/update/:company_id", authenticateToken_1.default, (0, permissions_1.authorizeByName)("จัดการสาขาแก้ไข", ["A", "R"]), (0, httpHandlers_1.validateRequest)(ms_companiesModel_1.UpdateCompaniesSchema), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const { uuid } = req.token.payload;
            const company_id = req.params.company_id; // แปลงเป็น string
            const userId = uuid;
            const payload = req.body;
            const ServiceResponse = yield ms_companireService_1.CompaniesService.update(company_id, userId, payload);
            (0, httpHandlers_1.handleServiceResponse)(ServiceResponse, res);
        }
        catch (error) {
            console.error(`Error in PATCH request: ${error}`);
            res.status(500).json({ status: "error", message: "Internal Server Error" });
        }
    }));
    router.delete("/delete/:company_id", authenticateToken_1.default, (0, permissions_1.authorizeByName)("จัดการสาขา", ["A"]), (0, httpHandlers_1.validateRequest)(ms_companiesModel_1.GetCompaniesSchema), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const { uuid } = req.token.payload;
            const userId = uuid;
            const company_id = req.params.company_id; // แปลงเป็น string
            const ServiceResponse = yield ms_companireService_1.CompaniesService.delete(userId, company_id);
            (0, httpHandlers_1.handleServiceResponse)(ServiceResponse, res);
        }
        catch (error) {
            console.error(`Error in DELETE request: ${error}`);
            res.status(500).json({ status: "error", message: "Internal Server Error" });
        }
    }));
    router.get("/get/:company_id", authenticateToken_1.default, (0, permissions_1.authorizeByName)("จัดการสาขาแก้ไข", ["A"]), (0, httpHandlers_1.validateRequest)(ms_companiesModel_1.GetCompaniesSchema), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const { company_id } = req.params;
            const companyId = company_id;
            const ServiceResponse = yield ms_companireService_1.CompaniesService.findById(companyId);
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
