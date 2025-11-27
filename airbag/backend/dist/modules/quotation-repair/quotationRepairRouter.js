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
exports.quotationRepairRouter = void 0;
const express_1 = __importDefault(require("express"));
const httpHandlers_1 = require("@common/utils/httpHandlers");
const quotationRepairService_1 = require("./quotationRepairService");
const quotationModel_1 = require("@modules/quotation/quotationModel");
const authenticateToken_1 = __importDefault(require("@common/middleware/authenticateToken"));
const permissions_1 = require("@common/middleware/permissions");
exports.quotationRepairRouter = (() => {
    const router = express_1.default.Router();
    // ไม่ได้ใช้
    router.get("/get", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const ServiceResponse = yield quotationRepairService_1.quotationRepairService.findAllNoPagination();
        (0, httpHandlers_1.handleServiceResponse)(ServiceResponse, res);
    }));
    // ไม่จำเป็นต้องใช้ company id เนื่องจาก มี quotation id อยู่แล้ว ที่เป็น key
    router.get("/get_by_quotationid/:id", authenticateToken_1.default, (0, permissions_1.authorizeByName)("ใบเสนอราคาซ่อม", ["A", "R"]), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const id = req.params.id;
        const ServiceResponse = yield quotationRepairService_1.quotationRepairService.findByQuotationId(id);
        (0, httpHandlers_1.handleServiceResponse)(ServiceResponse, res);
    }));
    // ไม่ได้ใช้
    router.get("/get/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const id = req.params.id;
        const ServiceResponse = yield quotationRepairService_1.quotationRepairService.findById(id);
        (0, httpHandlers_1.handleServiceResponse)(ServiceResponse, res);
    }));
    // ไม่ได้ใช้
    router.post("/create", authenticateToken_1.default, (0, httpHandlers_1.validateRequest)(quotationModel_1.CreateQuotationSchema), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const payload = req.body;
        const ServiceResponse = yield quotationRepairService_1.quotationRepairService.create(payload);
        (0, httpHandlers_1.handleServiceResponse)(ServiceResponse, res);
    }));
    // ไม่ได้ใช้
    router.patch("/update/:id", (0, httpHandlers_1.validateRequest)(quotationModel_1.UpdateQuotationSchema), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const { id } = req.params;
        const payload = req.body;
        const ServiceResponse = yield quotationRepairService_1.quotationRepairService.update(id, payload);
        (0, httpHandlers_1.handleServiceResponse)(ServiceResponse, res);
    }));
    // router.delete(
    //   "/delete/:id",
    //   validateRequest(GetParamQuotationSchema),
    //   async (req: Request, res: Response) => {
    //     const { id } = req.params;
    //     const ServiceResponse = await quotationRepairService.delete(id);
    //     handleServiceResponse(ServiceResponse, res);
    //   }
    // );
    // ไม่ได้ใช้
    // router.post(
    //   "/delete",
    //   validateRequest(deleteQuotationRepairSchema),
    //   async (req: Request, res: Response) => {
    //     const { ids } = req.body;
    //     const ServiceResponse = await quotationRepairService.deleteByMultiId(ids);
    //     handleServiceResponse(ServiceResponse, res);
    //   }
    // );
    return router;
})();
