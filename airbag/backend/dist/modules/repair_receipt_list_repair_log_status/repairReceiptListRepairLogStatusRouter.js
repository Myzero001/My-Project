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
exports.repairReceiptListRepairLogStatusRouter = void 0;
const express_1 = __importDefault(require("express"));
const httpHandlers_1 = require("@common/utils/httpHandlers");
const repairReceiptListRepairLogStatusService_1 = require("./repairReceiptListRepairLogStatusService");
const authenticateToken_1 = __importDefault(require("@common/middleware/authenticateToken"));
const repairReceiptListRepairLogStatusModel_1 = require("./repairReceiptListRepairLogStatusModel");
exports.repairReceiptListRepairLogStatusRouter = (() => {
    const router = express_1.default.Router();
    router.get("/get", authenticateToken_1.default, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const { company_id } = req.token.payload;
        const ServiceResponse = yield repairReceiptListRepairLogStatusService_1.repairReceiptListRepairLogStatusService.findAll(company_id);
        (0, httpHandlers_1.handleServiceResponse)(ServiceResponse, res);
    }));
    router.get("/get_by_repair_receipt_id/:id", authenticateToken_1.default, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const id = req.params.id;
        const { company_id } = req.token.payload;
        const ServiceResponse = yield repairReceiptListRepairLogStatusService_1.repairReceiptListRepairLogStatusService.findByRepairReceiptId(id, company_id);
        (0, httpHandlers_1.handleServiceResponse)(ServiceResponse, res);
    }));
    router.patch("/create", authenticateToken_1.default, (0, httpHandlers_1.validateRequest)(repairReceiptListRepairLogStatusModel_1.CreateRepairReceiptListRepairLogStatusSchema), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const { company_id } = req.token.payload;
        const payload = req.body;
        const userId = req.token.payload.uuid;
        const ServiceResponse = yield repairReceiptListRepairLogStatusService_1.repairReceiptListRepairLogStatusService.create(payload, userId, company_id);
        (0, httpHandlers_1.handleServiceResponse)(ServiceResponse, res);
    }));
    return router;
})();
