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
exports.groupRouterRepair = void 0;
const express_1 = __importDefault(require("express"));
const httpHandlers_1 = require("@common/utils/httpHandlers");
const ms_group_repairService_1 = require("@modules/ms-group-repair/ms-group-repairService");
const ms_group_repairModel_1 = require("@modules/ms-group-repair/ms-group-repairModel");
const authenticateToken_1 = __importDefault(require("@common/middleware/authenticateToken"));
const permissions_1 = require("@common/middleware/permissions");
exports.groupRouterRepair = (() => {
    const router = express_1.default.Router();
    router.get("/get", authenticateToken_1.default, (0, permissions_1.authorizeByName)("กลุ่มซ่อม", ["A"]), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const { company_id } = req.token.payload;
        const page = parseInt(req.query.page) || 1;
        const pageSize = parseInt(req.query.pageSize) || 12;
        const searchText = req.query.searchText || "";
        const ServiceResponse = yield ms_group_repairService_1.groupRepairService.findAll(company_id, page, pageSize, searchText);
        (0, httpHandlers_1.handleServiceResponse)(ServiceResponse, res);
    }));
    router.post("/create", authenticateToken_1.default, (0, permissions_1.authorizeByName)("กลุ่มซ่อม", ["A"]), (0, httpHandlers_1.validateRequest)(ms_group_repairModel_1.CreateGroupRepairSchema), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const { company_id, uuid } = req.token.payload;
        const payload = req.body;
        const ServiceResponse = yield ms_group_repairService_1.groupRepairService.create(company_id, uuid, payload);
        (0, httpHandlers_1.handleServiceResponse)(ServiceResponse, res);
    }));
    router.patch("/update", authenticateToken_1.default, (0, permissions_1.authorizeByName)("กลุ่มซ่อม", ["A"]), (0, httpHandlers_1.validateRequest)(ms_group_repairModel_1.UpdateGroupRepairSchema), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const { company_id, uuid } = req.token.payload;
        const { master_group_repair_id } = req.body;
        const payload = req.body;
        const ServiceResponse = yield ms_group_repairService_1.groupRepairService.update(company_id, uuid, master_group_repair_id, payload);
        (0, httpHandlers_1.handleServiceResponse)(ServiceResponse, res);
    }));
    router.delete("/delete/:master_group_repair_id", authenticateToken_1.default, (0, permissions_1.authorizeByName)("กลุ่มซ่อม", ["A"]), (0, httpHandlers_1.validateRequest)(ms_group_repairModel_1.GetParamGroupRepairSchema), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const { company_id } = req.token.payload;
        const { master_group_repair_id } = req.params;
        const ServiceResponse = yield ms_group_repairService_1.groupRepairService.delete(company_id, master_group_repair_id);
        (0, httpHandlers_1.handleServiceResponse)(ServiceResponse, res);
    }));
    router.get("/get/:master_group_repair_id", authenticateToken_1.default, (0, permissions_1.authorizeByName)("กลุ่มซ่อม", ["A"]), (0, httpHandlers_1.validateRequest)(ms_group_repairModel_1.GetParamGroupRepairSchema), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const { company_id } = req.token.payload;
        const { master_group_repair_id } = req.params;
        const ServiceResponse = yield ms_group_repairService_1.groupRepairService.findById(company_id, master_group_repair_id);
        (0, httpHandlers_1.handleServiceResponse)(ServiceResponse, res);
    }));
    router.get("/get-minimal", authenticateToken_1.default, (0, permissions_1.authorizeByName)("กลุ่มซ่อม", ["A"]), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const companyId = req.token.company_id;
        const ServiceResponse = yield ms_group_repairService_1.groupRepairService.findMinimal(companyId);
        (0, httpHandlers_1.handleServiceResponse)(ServiceResponse, res);
    }));
    return router;
})();
