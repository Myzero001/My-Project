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
exports.paymentRouter = void 0;
const express_1 = __importDefault(require("express"));
const httpHandlers_1 = require("@common/utils/httpHandlers");
const authenticateToken_1 = __importDefault(require("@common/middleware/authenticateToken"));
const paymentService_1 = require("./paymentService");
const paymentModel_1 = require("./paymentModel");
const permissions_1 = require("@common/middleware/permissions");
exports.paymentRouter = (() => {
    const router = express_1.default.Router();
    router.get("/get", authenticateToken_1.default, (0, permissions_1.authorizeByName)("การชำระเงิน", ["A", "R"]), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const { company_id } = req.token.payload;
        const page = parseInt(req.query.page) || 1;
        const pageSize = parseInt(req.query.pageSize) || 12;
        const searchText = req.query.searchText || "";
        const status = req.query.status || "";
        const ServiceResponse = yield paymentService_1.paymentService.findAll(company_id, page, pageSize, searchText, status);
        (0, httpHandlers_1.handleServiceResponse)(ServiceResponse, res);
    }));
    router.get("/get_all", authenticateToken_1.default, (0, permissions_1.authorizeByName)("การชำระเงิน", ["A", "R"]), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const { company_id } = req.token.payload;
        const ServiceResponse = yield paymentService_1.paymentService.findAllNoPagination(company_id);
        (0, httpHandlers_1.handleServiceResponse)(ServiceResponse, res);
    }));
    router.get("/get/:id", authenticateToken_1.default, (0, permissions_1.authorizeByName)("การชำระเงิน", ["A", "R"]), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const id = req.params.id;
        const ServiceResponse = yield paymentService_1.paymentService.findAllById(id);
        (0, httpHandlers_1.handleServiceResponse)(ServiceResponse, res);
    }));
    router.get("/get_by_repair_receipt_id/:id", authenticateToken_1.default, (0, permissions_1.authorizeByName)("การชำระเงิน", ["A", "R"]), (0, httpHandlers_1.validateRequest)(paymentModel_1.GetPaymentByDeliveryScheduleIdSchema), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const id = req.params.id;
        const ServiceResponse = yield paymentService_1.paymentService.findAllByRepairReceiptId(id);
        (0, httpHandlers_1.handleServiceResponse)(ServiceResponse, res);
    }));
    router.post("/create", authenticateToken_1.default, (0, permissions_1.authorizeByName)("การชำระเงิน", ["A"]), (0, httpHandlers_1.validateRequest)(paymentModel_1.CreatePaymentSchema), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const payload = req.body;
        const userId = req.token.payload.uuid;
        const { company_id } = req.token.payload;
        const ServiceResponse = yield paymentService_1.paymentService.create(payload, userId, company_id);
        (0, httpHandlers_1.handleServiceResponse)(ServiceResponse, res);
    }));
    router.patch("/update", authenticateToken_1.default, (0, permissions_1.authorizeByName)("การชำระเงิน", ["A"]), (0, httpHandlers_1.validateRequest)(paymentModel_1.UpdatePaymentSchema), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const payload = req.body;
        const { id } = req.body;
        const userId = req.token.payload.uuid;
        const ServiceResponse = yield paymentService_1.paymentService.update(id, payload, userId);
        (0, httpHandlers_1.handleServiceResponse)(ServiceResponse, res);
    }));
    router.delete("/delete/:id", (0, httpHandlers_1.validateRequest)(paymentModel_1.deletePaymentSchema), (0, permissions_1.authorizeByName)("การชำระเงิน", ["A"]), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const { id } = req.params;
        const ServiceResponse = yield paymentService_1.paymentService.delete(id);
        (0, httpHandlers_1.handleServiceResponse)(ServiceResponse, res);
    }));
    return router;
})();
