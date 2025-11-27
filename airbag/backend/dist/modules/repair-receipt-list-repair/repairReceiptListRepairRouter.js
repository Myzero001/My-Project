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
exports.repairReceiptListRepairRouter = void 0;
const express_1 = __importDefault(require("express"));
const httpHandlers_1 = require("@common/utils/httpHandlers");
const authenticateToken_1 = __importDefault(require("@common/middleware/authenticateToken"));
const authorizeAll_1 = __importDefault(require("@common/middleware/authorizeAll"));
const repairReceiptListRepairService_1 = require("./repairReceiptListRepairService");
const repairReceiptListRepairModel_1 = require("./repairReceiptListRepairModel");
const permissions_1 = require("@common/middleware/permissions");
exports.repairReceiptListRepairRouter = (() => {
    const router = express_1.default.Router();
    // ไม่เจอจุดใช้
    router.get("/get", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const { company_id } = req.token.payload;
        const ServiceResponse = yield repairReceiptListRepairService_1.repairReceiptListRepairService.findAllNoPagination(company_id);
        (0, httpHandlers_1.handleServiceResponse)(ServiceResponse, res);
    }));
    router.get("/get_by_repair_receipt_id/:id", authenticateToken_1.default, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const { company_id } = req.token.payload;
        const { id } = req.params;
        const ServiceResponse = yield repairReceiptListRepairService_1.repairReceiptListRepairService.findByRepairReceiptId(id, company_id);
        (0, httpHandlers_1.handleServiceResponse)(ServiceResponse, res);
    }));
    router.get("/get_by_repair_receipt_id_active/:id", authenticateToken_1.default, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const { company_id } = req.token.payload;
        const { id } = req.params;
        const ServiceResponse = yield repairReceiptListRepairService_1.repairReceiptListRepairService.findByRepairReceiptIdActive(id, company_id);
        (0, httpHandlers_1.handleServiceResponse)(ServiceResponse, res);
    }));
    router.get("/get/:id", authenticateToken_1.default, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const id = req.params.id;
        const ServiceResponse = yield repairReceiptListRepairService_1.repairReceiptListRepairService.findById(id);
        (0, httpHandlers_1.handleServiceResponse)(ServiceResponse, res);
    }));
    router.post("/create", authenticateToken_1.default, (0, httpHandlers_1.validateRequest)(repairReceiptListRepairModel_1.CreateRepairReceiptListRepairSchema), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const payload = req.body;
        const { company_id } = req.token.payload;
        const userId = req.token.payload.uuid;
        const ServiceResponse = yield repairReceiptListRepairService_1.repairReceiptListRepairService.create(payload, company_id, userId);
        (0, httpHandlers_1.handleServiceResponse)(ServiceResponse, res);
    }));
    router.patch("/update/:id", authenticateToken_1.default, (0, httpHandlers_1.validateRequest)(repairReceiptListRepairModel_1.UpdateRepairReceiptListRepairSchema), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const { id } = req.params;
        const payload = req.body;
        const ServiceResponse = yield repairReceiptListRepairService_1.repairReceiptListRepairService.update(id, payload);
        (0, httpHandlers_1.handleServiceResponse)(ServiceResponse, res);
    }));
    router.patch("/", authenticateToken_1.default, (0, httpHandlers_1.validateRequest)(repairReceiptListRepairModel_1.UpdateRepairReceiptListRepairStatusIsActiveSchema), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const { company_id } = req.token.payload;
        const { id } = req.body;
        const payload = req.body;
        const userId = req.token.payload.uuid;
        const ServiceResponse = yield repairReceiptListRepairService_1.repairReceiptListRepairService.updateStatusIsActive(id, payload, company_id, userId);
        (0, httpHandlers_1.handleServiceResponse)(ServiceResponse, res);
    }));
    // router.delete(
    //   "/delete/:id",
    //   validateRequest(GetParamQuotationSchema),
    //   async (req: Request, res: Response) => {
    //     const { id } = req.params;
    //     const ServiceResponse = await repairReceiptListRepairService.delete(id);
    //     handleServiceResponse(ServiceResponse, res);
    //   }
    // );
    router.post("/delete", authenticateToken_1.default, (0, httpHandlers_1.validateRequest)(repairReceiptListRepairModel_1.DeleteRepairReceiptListRepairBarcodeSchema), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const { ids } = req.body;
        const ServiceResponse = yield repairReceiptListRepairService_1.repairReceiptListRepairService.deleteByMultiId(ids);
        (0, httpHandlers_1.handleServiceResponse)(ServiceResponse, res);
    }));
    router.patch("/update-checked-box-status", authenticateToken_1.default, authorizeAll_1.default, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const { uuid } = req.token.payload;
        const { id, statusDate } = req.body;
        const ServiceResponse = yield repairReceiptListRepairService_1.repairReceiptListRepairService.updateStatusCheckedBox(id, statusDate, uuid);
        (0, httpHandlers_1.handleServiceResponse)(ServiceResponse, res);
    }));
    router.patch("/update-uncheck-box-status", authenticateToken_1.default, authorizeAll_1.default, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const { uuid } = req.token.payload;
        const { id } = req.body;
        const ServiceResponse = yield repairReceiptListRepairService_1.repairReceiptListRepairService.updateStatusUnCheckedBox(id, uuid);
        (0, httpHandlers_1.handleServiceResponse)(ServiceResponse, res);
    }));
    router.patch("/update_status_is_active", authenticateToken_1.default, (0, permissions_1.authorizeByName)("ใบรับซ่อมหน้าการชำระเงิน", ["A"]), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const { id } = req.body;
        const payload = req.body;
        const { company_id } = req.token.payload;
        const userId = req.token.payload.uuid;
        const ServiceResponse = yield repairReceiptListRepairService_1.repairReceiptListRepairService.updateStatusIsActive(id, payload, company_id, userId);
        (0, httpHandlers_1.handleServiceResponse)(ServiceResponse, res);
    }));
    return router;
})();
