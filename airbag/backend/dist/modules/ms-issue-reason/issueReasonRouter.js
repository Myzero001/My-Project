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
exports.issueReasonRouter = void 0;
// issueReasonRouter
const express_1 = __importDefault(require("express"));
const httpHandlers_1 = require("@common/utils/httpHandlers");
const issueReasonService_1 = require("@modules/ms-issue-reason/issueReasonService");
const issueReasonModel_1 = require("@modules/ms-issue-reason/issueReasonModel");
const authenticateToken_1 = __importDefault(require("@common/middleware/authenticateToken"));
const permissions_1 = require("@common/middleware/permissions");
exports.issueReasonRouter = (() => {
    const router = express_1.default.Router();
    router.get("/get", authenticateToken_1.default, (0, permissions_1.authorizeByName)("สาเหตุ", ["A"]), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const companyId = req.token.company_id;
        const page = parseInt(req.query.page) || 1;
        const pageSize = parseInt(req.query.pageSize) || 12;
        const searchText = req.query.searchText || "";
        const ServiceResponse = yield issueReasonService_1.issueReasonService.findAll(companyId, page, pageSize, searchText);
        (0, httpHandlers_1.handleServiceResponse)(ServiceResponse, res);
    }));
    router.get("/get_all", authenticateToken_1.default, (0, permissions_1.authorizeByName)("สาเหตุ", ["A"]), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const { company_id } = req.token.payload;
        const companyId = company_id;
        const ServiceResponse = yield issueReasonService_1.issueReasonService.findAllNoPagination(companyId);
        (0, httpHandlers_1.handleServiceResponse)(ServiceResponse, res);
    }));
    router.post("/create", authenticateToken_1.default, (0, permissions_1.authorizeByName)("สาเหตุ", ["A"]), (0, httpHandlers_1.validateRequest)(issueReasonModel_1.CreateIssueReasonSchema), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const { company_id, uuid } = req.token.payload;
        const companyId = company_id;
        const userId = uuid;
        const payload = req.body;
        const ServiceResponse = yield issueReasonService_1.issueReasonService.create(companyId, userId, payload);
        (0, httpHandlers_1.handleServiceResponse)(ServiceResponse, res);
    }));
    router.patch("/update", authenticateToken_1.default, (0, permissions_1.authorizeByName)("สาเหตุ", ["A"]), (0, httpHandlers_1.validateRequest)(issueReasonModel_1.UpdateIssueReasonSchema), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const { company_id, uuid } = req.token.payload;
        const companyId = company_id;
        const userId = uuid;
        const { issue_reason_id } = req.body;
        const payload = req.body;
        const ServiceResponse = yield issueReasonService_1.issueReasonService.update(companyId, userId, issue_reason_id, payload);
        (0, httpHandlers_1.handleServiceResponse)(ServiceResponse, res);
    }));
    router.delete("/delete/:issue_reason_id", authenticateToken_1.default, (0, permissions_1.authorizeByName)("สาเหตุ", ["A"]), (0, httpHandlers_1.validateRequest)(issueReasonModel_1.DeleteIssueReasonSchema), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const { company_id } = req.token.payload;
        const companyId = company_id;
        const { issue_reason_id } = req.params;
        const ServiceResponse = yield issueReasonService_1.issueReasonService.delete(companyId, issue_reason_id);
        (0, httpHandlers_1.handleServiceResponse)(ServiceResponse, res);
    }));
    router.get("/get/:issue_reason_id", authenticateToken_1.default, (0, permissions_1.authorizeByName)("สาเหตุ", ["A"]), (0, httpHandlers_1.validateRequest)(issueReasonModel_1.GetIssueReasonSchema), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const { company_id } = req.token.payload;
        const companyId = company_id;
        const { issue_reason_id } = req.params;
        const ServiceResponse = yield issueReasonService_1.issueReasonService.findById(companyId, issue_reason_id);
        (0, httpHandlers_1.handleServiceResponse)(ServiceResponse, res);
    }));
    router.get("/select", authenticateToken_1.default, (0, permissions_1.authorizeByName)("สาเหตุ", ["A", "R"]), (0, httpHandlers_1.validateRequest)(issueReasonModel_1.SelectSchema), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const { company_id } = req.token.payload;
        const searchText = req.query.searchText || "";
        const companyId = company_id;
        const ServiceResponse = yield issueReasonService_1.issueReasonService.select(companyId, searchText);
        (0, httpHandlers_1.handleServiceResponse)(ServiceResponse, res);
    }));
    return router;
})();
