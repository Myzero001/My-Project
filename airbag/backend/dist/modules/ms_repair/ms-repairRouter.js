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
exports.ms_repairRouter = void 0;
const express_1 = __importDefault(require("express"));
const httpHandlers_1 = require("@common/utils/httpHandlers");
const ms_repairService_1 = require("@modules/ms_repair/ms-repairService");
const ms_repairModel_1 = require("@modules/ms_repair/ms-repairModel");
const authenticateToken_1 = __importDefault(require("@common/middleware/authenticateToken"));
const permissions_1 = require("@common/middleware/permissions");
exports.ms_repairRouter = (() => {
    const router = express_1.default.Router();
    router.get("/get", authenticateToken_1.default, (0, permissions_1.authorizeByName)("รายการซ่อม", ["A"]), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const companyId = req.token.company_id;
            const page = parseInt(req.query.page) || 1;
            const pageSize = parseInt(req.query.pageSize) || 12;
            const searchText = req.query.searchText || "";
            const ServiceResponse = yield ms_repairService_1.repairService.findAll(companyId, page, pageSize, searchText);
            (0, httpHandlers_1.handleServiceResponse)(ServiceResponse, res);
        }
        catch (error) {
            console.error("Error in GET request:", error);
            res.status(500).json({ status: "error", message: "Internal Server Error" });
        }
    }));
    router.get("/get_all", authenticateToken_1.default, (0, permissions_1.authorizeByName)("รายการซ่อมเพิ่มเติม", ["A", "R"]), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const { company_id } = req.token.payload;
        const companyId = company_id;
        const ServiceResponse = yield ms_repairService_1.repairService.findAllNoPagination(companyId);
        (0, httpHandlers_1.handleServiceResponse)(ServiceResponse, res);
    }));
    router.post("/create", authenticateToken_1.default, (0, permissions_1.authorizeByName)("รายการซ่อม", ["A"]), (0, httpHandlers_1.validateRequest)(ms_repairModel_1.CreateRepairSchema), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const { company_id, uuid } = req.token.payload;
            const companyId = company_id;
            const userId = uuid;
            const payload = req.body;
            const serviceResponse = yield ms_repairService_1.repairService.create(companyId, userId, payload);
            (0, httpHandlers_1.handleServiceResponse)(serviceResponse, res);
        }
        catch (error) {
            console.error("Error in POST request:", error);
            res
                .status(500)
                .json({ status: "error", message: "Internal Server Error" });
        }
    }));
    router.patch("/update", authenticateToken_1.default, (0, permissions_1.authorizeByName)("รายการซ่อม", ["A"]), (0, httpHandlers_1.validateRequest)(ms_repairModel_1.UpdateRepairSchema), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const { company_id, uuid } = req.token.payload;
            const companyId = company_id;
            const userId = uuid;
            const { master_repair_id } = req.body;
            const payload = req.body;
            const serviceResponse = yield ms_repairService_1.repairService.update(companyId, userId, master_repair_id, payload);
            (0, httpHandlers_1.handleServiceResponse)(serviceResponse, res);
        }
        catch (error) {
            console.error("Error in PATCH request:", error);
            res
                .status(500)
                .json({ status: "error", message: "Internal Server Error" });
        }
    }));
    router.delete("/delete/:master_repair_id", authenticateToken_1.default, (0, permissions_1.authorizeByName)("รายการซ่อม", ["A"]), (0, httpHandlers_1.validateRequest)(ms_repairModel_1.GetParamRepairSchema), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const { company_id } = req.token.payload;
            const companyId = company_id;
            const { master_repair_id } = req.params;
            const serviceResponse = yield ms_repairService_1.repairService.delete(companyId, master_repair_id);
            (0, httpHandlers_1.handleServiceResponse)(serviceResponse, res);
        }
        catch (error) {
            console.error("Error in DELETE request:", error);
            res
                .status(500)
                .json({ status: "error", message: "Internal Server Error" });
        }
    }));
    router.get("/getByID/:master_repair_id", authenticateToken_1.default, (0, permissions_1.authorizeByName)("รายการซ่อม", ["A"]), (0, httpHandlers_1.validateRequest)(ms_repairModel_1.GetParamRepairSchema), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const companyId = req.token.company_id;
            const { master_repair_id } = req.params;
            const ServiceResponse = yield ms_repairService_1.repairService.findById(companyId, master_repair_id);
            (0, httpHandlers_1.handleServiceResponse)(ServiceResponse, res);
        }
        catch (error) {
            console.error("Error in GET request:", error);
            res
                .status(500)
                .json({ status: "error", message: "Internal Server Error" });
        }
    }));
    // ไม่มีจุด frontend ที่เรียกใช้งาน
    router.get("/get_repair_names", authenticateToken_1.default, (0, permissions_1.authorizeByName)("รายการซ่อม", ["A"]), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const companyId = req.token.company_id;
            // ดึงข้อมูลจาก Service
            const serviceResponse = yield ms_repairService_1.repairService.findRepairNames(companyId);
            (0, httpHandlers_1.handleServiceResponse)(serviceResponse, res);
        }
        catch (error) {
            console.error("Error in GET request:", error);
            res.status(500).json({ status: "error", message: "Internal Server Error" });
        }
    }));
    return router;
})();
