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
exports.toolingReasonRouter = void 0;
const express_1 = __importDefault(require("express"));
const httpHandlers_1 = require("@common/utils/httpHandlers");
const ms_tooling_reasonService_1 = require("@modules/ms-tooling-reason/ms-tooling-reasonService");
const ms_tooling_reasonModel_1 = require("@modules/ms-tooling-reason/ms-tooling-reasonModel");
const authenticateToken_1 = __importDefault(require("@common/middleware/authenticateToken"));
const permissions_1 = require("@common/middleware/permissions");
exports.toolingReasonRouter = (() => {
    const router = express_1.default.Router();
    router.get("/get", authenticateToken_1.default, (0, permissions_1.authorizeByName)("เหตุผลการใช้เครื่องมือ", ["A"]), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const { company_id } = req.token.payload;
        const page = parseInt(req.query.page) || 1;
        const pageSize = parseInt(req.query.pageSize) || 12;
        const searchText = req.query.searchText || "";
        const ServiceResponse = yield ms_tooling_reasonService_1.toolingReasonService.findAll(company_id, page, pageSize, searchText);
        (0, httpHandlers_1.handleServiceResponse)(ServiceResponse, res);
    }));
    router.get("/get_all", authenticateToken_1.default, (0, permissions_1.authorizeByName)("เหตุผลการใช้เครื่องมือเพิ่มเติม", ["A", "R"]), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const { company_id } = req.token.payload;
        const ServiceResponse = yield ms_tooling_reasonService_1.toolingReasonService.findAllNoPagination(company_id);
        (0, httpHandlers_1.handleServiceResponse)(ServiceResponse, res);
    }));
    router.post("/create", authenticateToken_1.default, (0, permissions_1.authorizeByName)("เหตุผลการใช้เครื่องมือ", ["A"]), (0, httpHandlers_1.validateRequest)(ms_tooling_reasonModel_1.CreateToolingReasonSchema), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const { company_id, uuid } = req.token.payload;
        const payload = req.body;
        const ServiceResponse = yield ms_tooling_reasonService_1.toolingReasonService.create(company_id, uuid, payload);
        (0, httpHandlers_1.handleServiceResponse)(ServiceResponse, res);
    }));
    router.patch("/update", authenticateToken_1.default, (0, permissions_1.authorizeByName)("เหตุผลการใช้เครื่องมือ", ["A"]), (0, httpHandlers_1.validateRequest)(ms_tooling_reasonModel_1.UpdateToolingReasonSchema), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const { company_id, uuid } = req.token.payload;
        const { master_tooling_reason_id } = req.body;
        const payload = req.body;
        const ServiceResponse = yield ms_tooling_reasonService_1.toolingReasonService.update(company_id, uuid, master_tooling_reason_id, payload);
        (0, httpHandlers_1.handleServiceResponse)(ServiceResponse, res);
    }));
    router.delete("/delete/:master_tooling_reason_id", authenticateToken_1.default, (0, permissions_1.authorizeByName)("เหตุผลการใช้เครื่องมือ", ["A"]), (0, httpHandlers_1.validateRequest)(ms_tooling_reasonModel_1.GetParamToolingReasonSchema), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const { company_id } = req.token.payload;
        const { master_tooling_reason_id } = req.params;
        const ServiceResponse = yield ms_tooling_reasonService_1.toolingReasonService.delete(company_id, master_tooling_reason_id);
        (0, httpHandlers_1.handleServiceResponse)(ServiceResponse, res);
    }));
    router.get("/get/:master_tooling_reason_id", authenticateToken_1.default, (0, permissions_1.authorizeByName)("เหตุผลการใช้เครื่องมือ", ["A"]), (0, httpHandlers_1.validateRequest)(ms_tooling_reasonModel_1.GetParamToolingReasonSchema), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const { company_id } = req.token.payload;
        const { master_tooling_reason_id } = req.params;
        const ServiceResponse = yield ms_tooling_reasonService_1.toolingReasonService.findById(company_id, master_tooling_reason_id);
        (0, httpHandlers_1.handleServiceResponse)(ServiceResponse, res);
    }));
    router.get("/get-minimal", authenticateToken_1.default, (0, permissions_1.authorizeByName)("เหตุผลการใช้เครื่องมือ", ["A"]), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const companyId = req.token.company_id;
        const ServiceResponse = yield ms_tooling_reasonService_1.toolingReasonService.findMinimal(companyId);
        (0, httpHandlers_1.handleServiceResponse)(ServiceResponse, res);
    }));
    router.get("/select", authenticateToken_1.default, (0, permissions_1.authorizeByName)("เหตุผลการใช้เครื่องมือ", ["A", "R"]), (0, httpHandlers_1.validateRequest)(ms_tooling_reasonModel_1.SelectSchema), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const { company_id } = req.token.payload;
        const searchText = req.query.searchText || "";
        const companyId = company_id;
        const ServiceResponse = yield ms_tooling_reasonService_1.toolingReasonService.select(companyId, searchText);
        (0, httpHandlers_1.handleServiceResponse)(ServiceResponse, res);
    }));
    return router;
})();
