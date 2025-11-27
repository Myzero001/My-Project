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
exports.paymentEditsRouter = void 0;
const express_1 = __importDefault(require("express"));
const httpHandlers_1 = require("@common/utils/httpHandlers");
const authenticateToken_1 = __importDefault(require("@common/middleware/authenticateToken"));
const paymentEditsService_1 = require("./paymentEditsService");
const paymentEditsModel_1 = require("./paymentEditsModel");
const permissions_1 = require("@common/middleware/permissions");
exports.paymentEditsRouter = (() => {
    const router = express_1.default.Router();
    router.get("/get", authenticateToken_1.default, (0, permissions_1.authorizeByName)("การอนุมัติขอแก้ไขใบชำระเงิน", ["A", "R"]), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const { company_id } = req.token.payload;
        const page = parseInt(req.query.page) || 1;
        const pageSize = parseInt(req.query.pageSize) || 12;
        const searchText = req.query.searchText || "";
        const status = req.query.status || "";
        const ServiceResponse = yield paymentEditsService_1.paymentEditsService.findAll(company_id, page, pageSize, searchText, status);
        (0, httpHandlers_1.handleServiceResponse)(ServiceResponse, res);
    }));
    router.get("/get_all", authenticateToken_1.default, (0, permissions_1.authorizeByName)("การอนุมัติขอแก้ไขใบชำระเงิน", ["A", "R"]), (_req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const ServiceResponse = yield paymentEditsService_1.paymentEditsService.findAllNoPagination();
        (0, httpHandlers_1.handleServiceResponse)(ServiceResponse, res);
    }));
    router.get("/get/:id", authenticateToken_1.default, (0, permissions_1.authorizeByName)("การอนุมัติขอแก้ไขใบชำระเงิน", ["A", "R"]), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const id = req.params.id;
        const ServiceResponse = yield paymentEditsService_1.paymentEditsService.findAllById(id);
        (0, httpHandlers_1.handleServiceResponse)(ServiceResponse, res);
    }));
    router.get("/get_by_payment_id/:id", authenticateToken_1.default, (0, permissions_1.authorizeByName)("การอนุมัติขอแก้ไขใบชำระเงิน", ["A", "R"]), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const id = req.params.id;
        const ServiceResponse = yield paymentEditsService_1.paymentEditsService.findByPaymentId(id);
        (0, httpHandlers_1.handleServiceResponse)(ServiceResponse, res);
    }));
    router.get("/get_log_by_payment_id/:id", authenticateToken_1.default, (0, permissions_1.authorizeByName)("การอนุมัติขอแก้ไขใบชำระเงิน", ["A", "R"]), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const id = req.params.id;
        const ServiceResponse = yield paymentEditsService_1.paymentEditsService.findLogByPaymentId(id);
        (0, httpHandlers_1.handleServiceResponse)(ServiceResponse, res);
    }));
    router.post("/create", authenticateToken_1.default, (0, permissions_1.authorizeByName)("การอนุมัติขอแก้ไขใบชำระเงิน", ["A", "R"]), (0, httpHandlers_1.validateRequest)(paymentEditsModel_1.CreatePaymentEditsSchema), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const payload = req.body;
        const userId = req.token.payload.uuid;
        const { company_id } = req.token.payload;
        const ServiceResponse = yield paymentEditsService_1.paymentEditsService.create(payload, userId, company_id);
        (0, httpHandlers_1.handleServiceResponse)(ServiceResponse, res);
    }));
    router.patch("/update", authenticateToken_1.default, (0, permissions_1.authorizeByName)("การอนุมัติขอแก้ไขใบชำระเงิน", ["A"]), (0, httpHandlers_1.validateRequest)(paymentEditsModel_1.UpdatePaymentEditsSchema), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const payload = req.body;
        const { id } = req.body;
        const userId = req.token.payload.uuid;
        const ServiceResponse = yield paymentEditsService_1.paymentEditsService.update(id, payload, userId);
        (0, httpHandlers_1.handleServiceResponse)(ServiceResponse, res);
    }));
    router.patch("/approve", authenticateToken_1.default, (0, permissions_1.authorizeByName)("การอนุมัติขอแก้ไขใบชำระเงิน", ["A"]), (0, httpHandlers_1.validateRequest)(paymentEditsModel_1.UpdatePaymentStatusSchema), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const { id } = req.body;
        const { company_id } = req.token.payload;
        const payload = req.body;
        const userId = req.token.payload.uuid;
        const ServiceResponse = yield paymentEditsService_1.paymentEditsService.approve(id, payload, userId, company_id);
        (0, httpHandlers_1.handleServiceResponse)(ServiceResponse, res);
    }));
    router.patch("/cancel", authenticateToken_1.default, (0, permissions_1.authorizeByName)("การอนุมัติขอแก้ไขใบชำระเงิน", ["A"]), (0, httpHandlers_1.validateRequest)(paymentEditsModel_1.UpdatePaymentStatusSchema), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const { id } = req.body;
        const { company_id } = req.token.payload;
        const payload = req.body;
        const userId = req.token.payload.uuid;
        const ServiceResponse = yield paymentEditsService_1.paymentEditsService.cancel(id, payload, userId, company_id);
        (0, httpHandlers_1.handleServiceResponse)(ServiceResponse, res);
    }));
    router.patch("/reject", authenticateToken_1.default, (0, permissions_1.authorizeByName)("การอนุมัติขอแก้ไขใบชำระเงิน", ["A"]), (0, httpHandlers_1.validateRequest)(paymentEditsModel_1.UpdatePaymentStatusSchema), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const { id } = req.body;
        const { company_id } = req.token.payload;
        const payload = req.body;
        const userId = req.token.payload.uuid;
        const ServiceResponse = yield paymentEditsService_1.paymentEditsService.reject(id, payload, userId, company_id);
        (0, httpHandlers_1.handleServiceResponse)(ServiceResponse, res);
    }));
    return router;
})();
