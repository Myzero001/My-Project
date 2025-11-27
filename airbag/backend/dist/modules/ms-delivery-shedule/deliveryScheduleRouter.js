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
exports.deliveryScheduleRouter = void 0;
const express_1 = __importDefault(require("express"));
const httpHandlers_1 = require("@common/utils/httpHandlers");
const authenticateToken_1 = __importDefault(require("@common/middleware/authenticateToken"));
const deliveryScheduleService_1 = require("./deliveryScheduleService");
const deliveryScheduleModel_1 = require("./deliveryScheduleModel");
const permissions_1 = require("@common/middleware/permissions");
exports.deliveryScheduleRouter = (() => {
    const router = express_1.default.Router();
    router.get("/get", authenticateToken_1.default, (0, permissions_1.authorizeByName)("บิลใบส่งมอบ", ["A", "R"]), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const { company_id } = req.token.payload;
        const page = parseInt(req.query.page) || 1;
        const pageSize = parseInt(req.query.pageSize) || 12;
        const searchText = req.query.searchText || "";
        const status = req.query.status || "";
        const ServiceResponse = yield deliveryScheduleService_1.deliveryScheduleService.findAll(company_id, page, pageSize, searchText, status);
        (0, httpHandlers_1.handleServiceResponse)(ServiceResponse, res);
    }));
    router.get("/get_all", authenticateToken_1.default, (0, permissions_1.authorizeByName)("บิลใบส่งมอบเพิ่มเติม", ["A", "R"]), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const { company_id } = req.token.payload;
        const ServiceResponse = yield deliveryScheduleService_1.deliveryScheduleService.findAllNoPagination(company_id);
        (0, httpHandlers_1.handleServiceResponse)(ServiceResponse, res);
    }));
    router.get("/get_all_payment", authenticateToken_1.default, (0, permissions_1.authorizeByName)("บิลใบส่งมอบเพิ่มเติม", ["A", "R"]), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const { company_id } = req.token.payload;
        const ServiceResponse = yield deliveryScheduleService_1.deliveryScheduleService.findAllPaymentNoPagination(company_id);
        (0, httpHandlers_1.handleServiceResponse)(ServiceResponse, res);
    }));
    router.get("/get/:id", authenticateToken_1.default, (0, permissions_1.authorizeByName)("บิลใบส่งมอบ", ["A", "R"]), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const id = req.params.id;
        const ServiceResponse = yield deliveryScheduleService_1.deliveryScheduleService.findAllById(id);
        (0, httpHandlers_1.handleServiceResponse)(ServiceResponse, res);
    }));
    router.post("/create", authenticateToken_1.default, (0, permissions_1.authorizeByName)("บิลใบส่งมอบ", ["A"]), (0, httpHandlers_1.validateRequest)(deliveryScheduleModel_1.CreateDeliveryScheduleSchema), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const payload = req.body;
        const userId = req.token.payload.uuid;
        const { company_id } = req.token.payload;
        const ServiceResponse = yield deliveryScheduleService_1.deliveryScheduleService.create(payload, userId, company_id);
        (0, httpHandlers_1.handleServiceResponse)(ServiceResponse, res);
    }));
    router.patch("/update", authenticateToken_1.default, (0, permissions_1.authorizeByName)("บิลใบส่งมอบ", ["A"]), (0, httpHandlers_1.validateRequest)(deliveryScheduleModel_1.UpdateDeliveryScheduleSchema), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const payload = req.body;
        const { id } = req.body;
        const userId = req.token.payload.uuid;
        const ServiceResponse = yield deliveryScheduleService_1.deliveryScheduleService.update(id, payload, userId);
        (0, httpHandlers_1.handleServiceResponse)(ServiceResponse, res);
    }));
    router.patch("/request_delivery", authenticateToken_1.default, (0, permissions_1.authorizeByName)("บิลใบส่งมอบ", ["A"]), (0, httpHandlers_1.validateRequest)(deliveryScheduleModel_1.UpdateDeliveryScheduleStatusSchema), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const { id } = req.body;
        const payload = req.body;
        const ServiceResponse = yield deliveryScheduleService_1.deliveryScheduleService.requestDelivery(id, payload);
        (0, httpHandlers_1.handleServiceResponse)(ServiceResponse, res);
    }));
    router.delete("/delete/:id", (0, permissions_1.authorizeByName)("บิลใบส่งมอบ", ["A"]), (0, httpHandlers_1.validateRequest)(deliveryScheduleModel_1.deleteDeliveryScheduleSchema), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const { id } = req.params;
        const ServiceResponse = yield deliveryScheduleService_1.deliveryScheduleService.delete(id);
        (0, httpHandlers_1.handleServiceResponse)(ServiceResponse, res);
    }));
    router.get("/get_all_overdue_payments", authenticateToken_1.default, (0, permissions_1.authorizeByName)("การชำระเงินล่าช้า", ["A"]), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const { company_id } = req.token.payload;
        // รับค่า query parameters จาก URL (เช่น /.../?page=1&pageSize=25&searchText=test)
        const page = req.query.page || '1';
        const pageSize = req.query.pageSize || '25';
        const searchText = req.query.searchText || ''; // ถ้าไม่มีให้เป็นค่าว่าง
        // ส่งค่าทั้งหมดไปยัง Service
        const serviceResponse = yield deliveryScheduleService_1.deliveryScheduleService.findOverduePayments(company_id, page, pageSize, searchText);
        (0, httpHandlers_1.handleServiceResponse)(serviceResponse, res);
    }));
    router.get("/get_customers", authenticateToken_1.default, (0, permissions_1.authorizeByName)("บิลใบส่งมอบ", ["A", "R"]), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const { company_id } = req.token.payload;
        const dateRange = req.query.dateRange; // '7days', '15days', '30days', '3months', '1year'
        const serviceResponse = yield deliveryScheduleService_1.deliveryScheduleService.findCustomersByCompanyId(company_id, dateRange);
        (0, httpHandlers_1.handleServiceResponse)(serviceResponse, res);
    }));
    router.get("/get_inactive_customers", authenticateToken_1.default, (0, permissions_1.authorizeByName)("บิลใบส่งมอบ", ["A", "R"]), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const { company_id } = req.token.payload;
        const dateRange = req.query.dateRange; // '15days', '30days', '1month', '3months', '6months', '1year'
        const serviceResponse = yield deliveryScheduleService_1.deliveryScheduleService.findInactiveCustomersByCompanyId(company_id, dateRange);
        (0, httpHandlers_1.handleServiceResponse)(serviceResponse, res);
    }));
    router.get("/select", authenticateToken_1.default, (0, permissions_1.authorizeByName)("บิลใบส่งมอบ", ["A", "R"]), (0, httpHandlers_1.validateRequest)(deliveryScheduleModel_1.SelectSchema), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const { company_id } = req.token.payload;
        const searchText = req.query.searchText || "";
        const companyId = company_id;
        const ServiceResponse = yield deliveryScheduleService_1.deliveryScheduleService.select(companyId, searchText);
        (0, httpHandlers_1.handleServiceResponse)(ServiceResponse, res);
    }));
    router.post("/get/delivery_schedule", authenticateToken_1.default, (0, httpHandlers_1.validateRequest)(deliveryScheduleModel_1.ShowCalendarScheduleSchema), (0, permissions_1.authorizeByName)("บิลใบส่งมอบ", ["A"]), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const companyId = req.token.company_id;
        const startDateFilter = req.body.startDate;
        const endDateFilter = req.body.endDate;
        const ServiceResponse = yield deliveryScheduleService_1.deliveryScheduleService.findCalendarRemoval(companyId, startDateFilter, endDateFilter);
        (0, httpHandlers_1.handleServiceResponse)(ServiceResponse, res);
    }));
    return router;
})();
