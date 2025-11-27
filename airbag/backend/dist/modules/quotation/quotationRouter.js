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
exports.quotationRouter = void 0;
const express_1 = __importDefault(require("express"));
const httpHandlers_1 = require("@common/utils/httpHandlers");
const quotationService_1 = require("./quotationService");
const quotationModel_1 = require("@modules/quotation/quotationModel");
const authenticateToken_1 = __importDefault(require("@common/middleware/authenticateToken"));
const permissions_1 = require("@common/middleware/permissions");
exports.quotationRouter = (() => {
    const router = express_1.default.Router();
    router.get("/get", authenticateToken_1.default, (0, permissions_1.authorizeByName)("ใบเสนอราคา", ["A", "R"]), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const { company_id } = req.token.payload;
        const page = parseInt(req.query.page) || 1;
        const pageSize = parseInt(req.query.pageSize) || 12;
        const searchText = req.query.searchText || "";
        const status = req.query.status || "";
        const ServiceResponse = yield quotationService_1.quotationService.findAll(page, pageSize, searchText, status, company_id);
        (0, httpHandlers_1.handleServiceResponse)(ServiceResponse, res);
    }));
    router.get("/get/approve", authenticateToken_1.default, (0, permissions_1.authorizeByName)("ใบเสนอราคา", ["A", "R"]), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const { company_id } = req.token.payload;
        const page = parseInt(req.query.page) || 1;
        const pageSize = parseInt(req.query.pageSize) || 12;
        const searchText = req.query.searchText || "";
        const status = req.query.status || "";
        const ServiceResponse = yield quotationService_1.quotationService.findAllApprove(page, pageSize, searchText, status, company_id);
        (0, httpHandlers_1.handleServiceResponse)(ServiceResponse, res);
    }));
    router.get("/get/:id", authenticateToken_1.default, (0, permissions_1.authorizeByName)("ใบเสนอราคา", ["A", "R"]), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const id = req.params.id;
        const ServiceResponse = yield quotationService_1.quotationService.findById(id);
        (0, httpHandlers_1.handleServiceResponse)(ServiceResponse, res);
    }));
    router.post("/create", authenticateToken_1.default, (0, permissions_1.authorizeByName)("ใบเสนอราคา", ["A"]), (0, httpHandlers_1.validateRequest)(quotationModel_1.CreateQuotationSchema), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const { company_id } = req.token.payload;
        const payload = req.body;
        const userId = req.token.payload.uuid;
        const ServiceResponse = yield quotationService_1.quotationService.create(payload, userId, company_id);
        (0, httpHandlers_1.handleServiceResponse)(ServiceResponse, res);
    }));
    router.patch("/update/:quotation_id", authenticateToken_1.default, (0, permissions_1.authorizeByName)("ใบเสนอราคา", ["A"]), (0, httpHandlers_1.validateRequest)(quotationModel_1.UpdateQuotationSchema), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const { quotation_id } = req.params;
        const payload = req.body;
        const ServiceResponse = yield quotationService_1.quotationService.update(quotation_id, payload);
        (0, httpHandlers_1.handleServiceResponse)(ServiceResponse, res);
    }));
    router.patch("/approve", authenticateToken_1.default, (0, permissions_1.authorizeByName)("การอนุมัติใบเสนอราคา", ["A"]), (0, httpHandlers_1.validateRequest)(quotationModel_1.UpdateQuotationSchema), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const { quotation_id } = req.body;
        const { company_id } = req.token.payload;
        const payload = req.body;
        const userId = req.token.payload.uuid;
        const ServiceResponse = yield quotationService_1.quotationService.approve(quotation_id, payload, userId, company_id);
        (0, httpHandlers_1.handleServiceResponse)(ServiceResponse, res);
    }));
    router.patch("/reject", authenticateToken_1.default, (0, permissions_1.authorizeByName)("การอนุมัติใบเสนอราคา", ["A"]), (0, httpHandlers_1.validateRequest)(quotationModel_1.UpdateQuotationSchema), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const { quotation_id } = req.body;
        const { company_id } = req.token.payload;
        const payload = req.body;
        const userId = req.token.payload.uuid;
        const ServiceResponse = yield quotationService_1.quotationService.reject(quotation_id, payload, userId, company_id);
        (0, httpHandlers_1.handleServiceResponse)(ServiceResponse, res);
    }));
    router.patch("/request_approve", authenticateToken_1.default, (0, permissions_1.authorizeByName)("ใบเสนอราคา", ["A"]), (0, httpHandlers_1.validateRequest)(quotationModel_1.UpdateStatusQuotationSchema), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const { company_id } = req.token.payload;
        const { quotation_id } = req.body;
        const userId = req.token.payload.uuid;
        const ServiceResponse = yield quotationService_1.quotationService.requestApprove(quotation_id, userId, company_id);
        (0, httpHandlers_1.handleServiceResponse)(ServiceResponse, res);
    }));
    router.patch("/request_edit", authenticateToken_1.default, (0, permissions_1.authorizeByName)("ใบเสนอราคา", ["A"]), (0, httpHandlers_1.validateRequest)(quotationModel_1.RequestEditQuotationSchema), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const { company_id } = req.token.payload;
        const { quotation_id, remark } = req.body;
        const userId = req.token.payload.uuid;
        const ServiceResponse = yield quotationService_1.quotationService.requestEdit(quotation_id, remark, userId, company_id);
        (0, httpHandlers_1.handleServiceResponse)(ServiceResponse, res);
    }));
    router.patch("/close_deal", authenticateToken_1.default, (0, permissions_1.authorizeByName)("ใบเสนอราคา", ["A"]), (0, httpHandlers_1.validateRequest)(quotationModel_1.UpdateStatusQuotationSchema), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const { quotation_id } = req.body;
        const { company_id } = req.token.payload;
        const payload = req.body;
        const userId = req.token.payload.uuid;
        const ServiceResponse = yield quotationService_1.quotationService.closeDeal(quotation_id, payload, userId, company_id);
        (0, httpHandlers_1.handleServiceResponse)(ServiceResponse, res);
    }));
    router.patch("/cancel", authenticateToken_1.default, (0, permissions_1.authorizeByName)("ใบเสนอราคา", ["A"]), (0, httpHandlers_1.validateRequest)(quotationModel_1.UpdateStatusQuotationSchema), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const { company_id } = req.token.payload;
        const { quotation_id, remark } = req.body;
        const userId = req.token.payload.uuid;
        const ServiceResponse = yield quotationService_1.quotationService.cancel(quotation_id, remark, userId, company_id);
        (0, httpHandlers_1.handleServiceResponse)(ServiceResponse, res);
    }));
    router.delete("/delete/:id", authenticateToken_1.default, (0, permissions_1.authorizeByName)("ใบเสนอราคา", ["A"]), (0, httpHandlers_1.validateRequest)(quotationModel_1.DeleteQuotationSchema), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const { id } = req.params;
        const ServiceResponse = yield quotationService_1.quotationService.delete(id);
        (0, httpHandlers_1.handleServiceResponse)(ServiceResponse, res);
    }));
    // ดึงเฉพาะ quotation_doc
    router.get("/get-docs", authenticateToken_1.default, (0, permissions_1.authorizeByName)("ใบเสนอราคา", ["A", "R"]), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const companyId = req.token.company_id;
        const ServiceResponse = yield quotationService_1.quotationService.findQuotationDocs(companyId);
        (0, httpHandlers_1.handleServiceResponse)(ServiceResponse, res);
    }));
    // ดึงเฉพาะ responsible-by
    router.get("/responsible-by/:quotation_doc", authenticateToken_1.default, (0, permissions_1.authorizeByName)("เปลี่ยนผู้รับผิดชอบ", ["A"]), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const { quotation_doc } = req.params;
        const companyId = req.token.company_id;
        const ServiceResponse = yield quotationService_1.quotationService.findResponsibleBy(quotation_doc, companyId);
        (0, httpHandlers_1.handleServiceResponse)(ServiceResponse, res);
    }));
    router.post("/get/calendar-removal", authenticateToken_1.default, (0, httpHandlers_1.validateRequest)(quotationModel_1.ShowCalendarRemovalSchema), (0, permissions_1.authorizeByName)("ปฏิทินนัดหมายถอด", ["A"]), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const companyId = req.token.company_id;
        const startDateFilter = req.body.startDate;
        const endDateFilter = req.body.endDate;
        const ServiceResponse = yield quotationService_1.quotationService.findCalendarRemoval(companyId, startDateFilter, endDateFilter);
        (0, httpHandlers_1.handleServiceResponse)(ServiceResponse, res);
    }));
    return router;
})();
