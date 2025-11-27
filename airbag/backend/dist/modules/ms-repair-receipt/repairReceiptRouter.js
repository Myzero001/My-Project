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
exports.repairReceiptRouter = void 0;
const express_1 = __importDefault(require("express"));
const httpHandlers_1 = require("@common/utils/httpHandlers");
const authenticateToken_1 = __importDefault(require("@common/middleware/authenticateToken"));
const repairReceiptService_1 = require("./repairReceiptService");
const repairReceiptModel_1 = require("./repairReceiptModel");
const permissions_1 = require("@common/middleware/permissions");
const http_status_codes_1 = require("http-status-codes");
const serviceResponse_1 = require("@common/models/serviceResponse");
exports.repairReceiptRouter = (() => {
    const router = express_1.default.Router();
    router.get("/get", authenticateToken_1.default, (0, permissions_1.authorizeByName)("ใบรับซ่อม", ["A", "R"]), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const { company_id } = req.token.payload;
        const page = parseInt(req.query.page) || 1;
        const pageSize = parseInt(req.query.pageSize) || 12;
        const searchText = req.query.searchText || "";
        const status = req.query.status || "all";
        const ServiceResponse = yield repairReceiptService_1.repairReceiptService.findAll(company_id, page, pageSize, searchText, status);
        (0, httpHandlers_1.handleServiceResponse)(ServiceResponse, res);
    }));
    // router.get(
    //   "/get_all",
    //   authenticateToken,
    //   // authorizeByName("ใบเสนอราคา", ["A", "R"]),
    //   async (req: Request, res: Response) => {
    //     const { company_id } = req.token.payload;
    //     const ServiceResponse = await repairReceiptService.findAllNoPagination(company_id);
    //     handleServiceResponse(ServiceResponse, res);
    //   }
    // );
    router.get("/get_by_not_delivered", authenticateToken_1.default, (0, permissions_1.authorizeByName)("ใบเสนอราคา", ["A", "R"]), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const { company_id } = req.token.payload;
        const ServiceResponse = yield repairReceiptService_1.repairReceiptService.findAllNotDeliveryNoPagination(company_id);
        (0, httpHandlers_1.handleServiceResponse)(ServiceResponse, res);
    }));
    router.get("/get/:id", authenticateToken_1.default, (0, permissions_1.authorizeByName)("ใบเสนอราคา", ["A", "R"]), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const id = req.params.id;
        const ServiceResponse = yield repairReceiptService_1.repairReceiptService.findAllById(id);
        (0, httpHandlers_1.handleServiceResponse)(ServiceResponse, res);
    }));
    router.post("/create", authenticateToken_1.default, (0, httpHandlers_1.validateRequest)(repairReceiptModel_1.CreateRepairReceiptSchema), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const payload = req.body;
        const { company_id } = req.token.payload;
        const userId = req.token.payload.uuid;
        const ServiceResponse = yield repairReceiptService_1.repairReceiptService.create(payload, userId, company_id);
        (0, httpHandlers_1.handleServiceResponse)(ServiceResponse, res);
    }));
    router.patch("/update", authenticateToken_1.default, (0, permissions_1.authorizeByName)("ใบรับซ่อมหน้าแรกหน้ารายการซ่อม", ["A"]), (0, httpHandlers_1.validateRequest)(repairReceiptModel_1.UpdateRepairReceiptSchema), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const payload = req.body;
        const { id } = req.body;
        const userId = req.token.payload.uuid;
        const ServiceResponse = yield repairReceiptService_1.repairReceiptService.update(id, payload, userId);
        (0, httpHandlers_1.handleServiceResponse)(ServiceResponse, res);
    }));
    router.patch("/update/box", authenticateToken_1.default, (0, permissions_1.authorizeByName)("ใบรับซ่อมหน้ากล่อง", ["A"]), (0, httpHandlers_1.validateRequest)(repairReceiptModel_1.UpdateRepairReceiptSchema), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const payload = req.body;
        const { id } = req.body;
        const userId = req.token.payload.uuid;
        const ServiceResponse = yield repairReceiptService_1.repairReceiptService.updateBox(id, payload, userId);
        (0, httpHandlers_1.handleServiceResponse)(ServiceResponse, res);
    }));
    router.patch("/update/box_clear_by", authenticateToken_1.default, (0, permissions_1.authorizeByName)("ใบรับซ่อมหน้ากล่อง clear by", ["A"]), (0, httpHandlers_1.validateRequest)(repairReceiptModel_1.UpdateRepairReceiptSchema), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const payload = req.body;
        const { id } = req.body;
        const userId = req.token.payload.uuid;
        const ServiceResponse = yield repairReceiptService_1.repairReceiptService.updateBox(id, payload, userId);
        (0, httpHandlers_1.handleServiceResponse)(ServiceResponse, res);
    }));
    router.patch("/success", authenticateToken_1.default, (0, httpHandlers_1.validateRequest)(repairReceiptModel_1.UpdateStatusRepairReceiptSchema), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const { quotation_id } = req.body;
        const payload = req.body;
        const ServiceResponse = yield repairReceiptService_1.repairReceiptService.success(quotation_id, payload);
        (0, httpHandlers_1.handleServiceResponse)(ServiceResponse, res);
    }));
    router.patch("/cancel", authenticateToken_1.default, (0, httpHandlers_1.validateRequest)(repairReceiptModel_1.UpdateStatusRepairReceiptSchema), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const { id } = req.body;
        const payload = req.body;
        const ServiceResponse = yield repairReceiptService_1.repairReceiptService.cancel(id, payload);
        (0, httpHandlers_1.handleServiceResponse)(ServiceResponse, res);
    }));
    router.delete("/delete/:id", (0, httpHandlers_1.validateRequest)(repairReceiptModel_1.deleteRepairReceiptSchema), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const { id } = req.params;
        const ServiceResponse = yield repairReceiptService_1.repairReceiptService.delete(id);
        (0, httpHandlers_1.handleServiceResponse)(ServiceResponse, res);
    }));
    router.get("/get/payloadjob/:id", authenticateToken_1.default, (0, permissions_1.authorizeByName)("งาน", ["A", "R"]), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const id = req.params.id;
        const ServiceResponse = yield repairReceiptService_1.repairReceiptService.findSelectedFieldsById(id);
        (0, httpHandlers_1.handleServiceResponse)(ServiceResponse, res);
    }));
    router.patch("/finish/:id", authenticateToken_1.default, (0, permissions_1.authorizeByName)("งาน", ["A", "R"]), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const id = req.params.id;
        const ServiceResponse = yield repairReceiptService_1.repairReceiptService.setFinishToTrue(id);
        (0, httpHandlers_1.handleServiceResponse)(ServiceResponse, res);
    }));
    router.patch("/unfinish/:id", authenticateToken_1.default, (0, permissions_1.authorizeByName)("งาน", ["A", "R"]), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const id = req.params.id;
        const ServiceResponse = yield repairReceiptService_1.repairReceiptService.setFinishToFalse(id);
        (0, httpHandlers_1.handleServiceResponse)(ServiceResponse, res);
    }));
    router.get("/get-by-finish/:id", authenticateToken_1.default, (0, permissions_1.authorizeByName)("งาน", ["A", "R"]), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const id = req.params.id;
        const isFinished = req.query.finish === "true";
        const ServiceResponse = yield repairReceiptService_1.repairReceiptService.findByFinishStatusAndId(id, isFinished);
        (0, httpHandlers_1.handleServiceResponse)(ServiceResponse, res);
    }));
    router.get("/get-select", authenticateToken_1.default, (0, permissions_1.authorizeByName)("ปฏิทินนัดหมายถอด", ["A", "R"]), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const companyId = req.token.company_id;
        const ServiceResponse = yield repairReceiptService_1.repairReceiptService.findSelect(companyId);
        (0, httpHandlers_1.handleServiceResponse)(ServiceResponse, res);
    }));
    router.get("/pay-load-calendar-removal/:id", authenticateToken_1.default, (0, permissions_1.authorizeByName)("ปฏิทินนัดหมายถอด", ["A"]), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const id = req.params.id;
        const { company_id } = req.token.payload;
        const ServiceResponse = yield repairReceiptService_1.repairReceiptService.findCalendarRemoval(id, company_id);
        (0, httpHandlers_1.handleServiceResponse)(ServiceResponse, res);
    }));
    router.get("/get-doc-id", authenticateToken_1.default, (0, permissions_1.authorizeByName)("ปฏิทินนัดหมายถอด", ["A"]), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const companyId = req.token.company_id;
        const ServiceResponse = yield repairReceiptService_1.repairReceiptService.findDocAndId(companyId);
        (0, httpHandlers_1.handleServiceResponse)(ServiceResponse, res);
    }));
    router.get("/get-repair-docs", authenticateToken_1.default, (0, permissions_1.authorizeByName)("เปลี่ยนผู้รับผิดชอบ", ["A"]), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        var _a, _b;
        const company_id = (_b = (_a = req.token) === null || _a === void 0 ? void 0 : _a.payload) === null || _b === void 0 ? void 0 : _b.company_id;
        if (!company_id) {
            (0, httpHandlers_1.handleServiceResponse)(new serviceResponse_1.ServiceResponse(serviceResponse_1.ResponseStatus.Failed, "Company ID not found in token.", null, http_status_codes_1.StatusCodes.UNAUTHORIZED), res);
            return;
        }
        const serviceResponse = yield repairReceiptService_1.repairReceiptService.findRepairDocsByCompanyId(company_id);
        (0, httpHandlers_1.handleServiceResponse)(serviceResponse, res);
    }));
    router.get("/get-with-responsible/:id", authenticateToken_1.default, (0, permissions_1.authorizeByName)("เปลี่ยนผู้รับผิดชอบ", ["A"]), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const id = req.params.id;
            if (!id) {
                (0, httpHandlers_1.handleServiceResponse)(new serviceResponse_1.ServiceResponse(serviceResponse_1.ResponseStatus.Failed, "Repair receipt ID is required.", null, http_status_codes_1.StatusCodes.BAD_REQUEST), res);
                return;
            }
            // เรียกฟังก์ชัน service ที่อัปเดตแล้ว
            const serviceResponse = yield repairReceiptService_1.repairReceiptService.findResponsibleUserForRepairReceipt(id);
            (0, httpHandlers_1.handleServiceResponse)(serviceResponse, res);
        }
        catch (error) {
            console.error(`Error in /get-with-responsible/${req.params.id}:`, error);
            const errorMessage = (error instanceof Error) ? error.message : "An unexpected error occurred.";
            (0, httpHandlers_1.handleServiceResponse)(new serviceResponse_1.ServiceResponse(serviceResponse_1.ResponseStatus.Failed, `Error processing request: ${errorMessage}`, null, http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR), res);
        }
    }));
    router.patch("/update-responsible/:id", authenticateToken_1.default, (0, permissions_1.authorizeByName)("เปลี่ยนผู้รับผิดชอบ", ["A"]), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        var _a, _b, _c;
        try {
            const { id } = req.params;
            const responsible_by = (_a = req.body) === null || _a === void 0 ? void 0 : _a.responsible_by;
            const userId = (_c = (_b = req.token) === null || _b === void 0 ? void 0 : _b.payload) === null || _c === void 0 ? void 0 : _c.uuid;
            if (!id) {
                (0, httpHandlers_1.handleServiceResponse)(new serviceResponse_1.ServiceResponse(serviceResponse_1.ResponseStatus.Failed, "Document ID is required in path parameters.", null, http_status_codes_1.StatusCodes.BAD_REQUEST), res);
                return; // ออกจากฟังก์ชันหลังจากส่ง response
            }
            if (!responsible_by) {
                (0, httpHandlers_1.handleServiceResponse)(new serviceResponse_1.ServiceResponse(serviceResponse_1.ResponseStatus.Failed, "responsible_by field is required in the payload.", null, http_status_codes_1.StatusCodes.BAD_REQUEST), res);
                return; // ออกจากฟังก์ชันหลังจากส่ง response
            }
            if (!userId) {
                (0, httpHandlers_1.handleServiceResponse)(new serviceResponse_1.ServiceResponse(serviceResponse_1.ResponseStatus.Failed, "User ID not found in token.", null, http_status_codes_1.StatusCodes.UNAUTHORIZED), res);
                return;
            }
            const serviceResponse = yield repairReceiptService_1.repairReceiptService.updateResponsibleBy(id, responsible_by, userId);
            (0, httpHandlers_1.handleServiceResponse)(serviceResponse, res);
        }
        catch (error) {
            console.error(`Critical error in PATCH /${req.params.id}/responsible-by:`, error);
            (0, httpHandlers_1.handleServiceResponse)(new serviceResponse_1.ServiceResponse(serviceResponse_1.ResponseStatus.Failed, "An unexpected server error occurred.", null, http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR), res);
        }
    }));
    router.get("/select", authenticateToken_1.default, (0, permissions_1.authorizeByName)("ใบรับซ่อม", ["A", "R"]), (0, httpHandlers_1.validateRequest)(repairReceiptModel_1.SelectSchema), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const { company_id } = req.token.payload;
        const searchText = req.query.searchText || "";
        const companyId = company_id;
        const ServiceResponse = yield repairReceiptService_1.repairReceiptService.select(companyId, searchText);
        (0, httpHandlers_1.handleServiceResponse)(ServiceResponse, res);
    }));
    router.get("/jobs", authenticateToken_1.default, (0, permissions_1.authorizeByName)("งาน", ["A", "R"]), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try { // <-- แนะนำให้ครอบด้วย try...catch ด้วย
            const { company_id } = req.token.payload;
            const page = parseInt(req.query.page) || 1;
            const pageSize = parseInt(req.query.pageSize) || 25;
            const searchText = req.query.searchText || "";
            const status = req.query.status || "all";
            if (!['all', 'pending', 'success'].includes(status)) {
                // ไม่ต้องมี return ข้างหน้า handleServiceResponse
                (0, httpHandlers_1.handleServiceResponse)(new serviceResponse_1.ServiceResponse(serviceResponse_1.ResponseStatus.Failed, "Invalid status value. Must be 'all', 'pending', or 'success'.", null, http_status_codes_1.StatusCodes.BAD_REQUEST), res);
                return; // ใช้ return เปล่าๆ เพื่อจบการทำงานของฟังก์ชัน
            }
            const serviceResponse = yield repairReceiptService_1.repairReceiptService.findAllJobs(company_id, page, pageSize, status, searchText);
            (0, httpHandlers_1.handleServiceResponse)(serviceResponse, res);
        }
        catch (error) {
            // จัดการ error ที่อาจเกิดขึ้นโดยไม่คาดฝัน
            (0, httpHandlers_1.handleServiceResponse)(new serviceResponse_1.ServiceResponse(serviceResponse_1.ResponseStatus.Failed, "An unexpected error occurred in /jobs endpoint.", null, http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR), res);
        }
    }));
    return router;
})();
