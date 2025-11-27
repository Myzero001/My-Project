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
exports.brandModelRouter = void 0;
const express_1 = __importDefault(require("express"));
const httpHandlers_1 = require("@common/utils/httpHandlers");
const ms_brand_Model_1 = require("@modules/ms-brandmodel/ms-brand-Model");
const ms_brandModelService_1 = require("@modules/ms-brandmodel/ms-brandModelService");
const authenticateToken_1 = __importDefault(require("@common/middleware/authenticateToken"));
const permissions_1 = require("@common/middleware/permissions");
exports.brandModelRouter = (() => {
    const router = express_1.default.Router();
    router.get("/get", authenticateToken_1.default, (0, permissions_1.authorizeByName)("รุ่นรถ", ["A"]), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const { company_id } = req.token.payload;
        const companyId = company_id;
        const page = parseInt(req.query.page) || 1;
        const pageSize = parseInt(req.query.pageSize) || 12;
        const searchText = req.query.searchText || "";
        const ServiceResponse = yield ms_brandModelService_1.brandModelService.findAll(companyId, page, pageSize, searchText);
        (0, httpHandlers_1.handleServiceResponse)(ServiceResponse, res);
    }));
    router.get("/get_all", authenticateToken_1.default, (0, permissions_1.authorizeByName)("รุ่นรถเพิ่มเติม", ["A", "R"]), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const { company_id } = req.token.payload;
        const companyId = company_id;
        const ServiceResponse = yield ms_brandModelService_1.brandModelService.findAllNoPagination(companyId);
        (0, httpHandlers_1.handleServiceResponse)(ServiceResponse, res);
    }));
    router.get("/get-by-brand/:master_brand_id", authenticateToken_1.default, (0, permissions_1.authorizeByName)("รุ่นรถ", ["A", "R"]), (0, httpHandlers_1.validateRequest)(ms_brand_Model_1.FindByBrandSchema), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const { company_id } = req.token.payload;
        const companyId = company_id;
        const { master_brand_id } = req.params;
        const ServiceResponse = yield ms_brandModelService_1.brandModelService.findByBrand(companyId, master_brand_id);
        (0, httpHandlers_1.handleServiceResponse)(ServiceResponse, res);
    }));
    router.post("/create", authenticateToken_1.default, (0, permissions_1.authorizeByName)("รุ่นรถ", ["A"]), (0, httpHandlers_1.validateRequest)(ms_brand_Model_1.CreateBrandModelSchema), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const { company_id, uuid } = req.token.payload;
        const companyId = company_id;
        const userId = uuid;
        const payload = req.body;
        const ServiceResponse = yield ms_brandModelService_1.brandModelService.create(companyId, userId, payload);
        (0, httpHandlers_1.handleServiceResponse)(ServiceResponse, res);
    }));
    router.patch("/update", authenticateToken_1.default, (0, permissions_1.authorizeByName)("รุ่นรถ", ["A"]), (0, httpHandlers_1.validateRequest)(ms_brand_Model_1.UpdateBrandModelSchema), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const { company_id, uuid } = req.token.payload;
        const companyId = company_id;
        const userId = uuid;
        const { ms_brandmodel_id } = req.body;
        const payload = req.body;
        const ServiceResponse = yield ms_brandModelService_1.brandModelService.update(companyId, userId, ms_brandmodel_id, payload);
        (0, httpHandlers_1.handleServiceResponse)(ServiceResponse, res);
    }));
    router.delete("/delete/:ms_brandmodel_id", authenticateToken_1.default, (0, permissions_1.authorizeByName)("รุ่นรถ", ["A"]), (0, httpHandlers_1.validateRequest)(ms_brand_Model_1.GetParamBrandModelSchema), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const { company_id } = req.token.payload;
        const companyId = company_id;
        const { ms_brandmodel_id } = req.params;
        const ServiceResponse = yield ms_brandModelService_1.brandModelService.delete(companyId, ms_brandmodel_id);
        (0, httpHandlers_1.handleServiceResponse)(ServiceResponse, res);
    }));
    router.get("/get/:ms_brandmodel_id", authenticateToken_1.default, (0, permissions_1.authorizeByName)("รุ่นรถ", ["A"]), (0, httpHandlers_1.validateRequest)(ms_brand_Model_1.GetParamBrandModelSchema), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const { company_id } = req.token.payload;
        const companyId = company_id;
        const { ms_brandmodel_id } = req.params;
        const ServiceResponse = yield ms_brandModelService_1.brandModelService.findById(companyId, ms_brandmodel_id);
        (0, httpHandlers_1.handleServiceResponse)(ServiceResponse, res);
    }));
    router.get("/select/:brand_id", authenticateToken_1.default, (0, permissions_1.authorizeByName)("รุ่นรถ", ["A", "R"]), (0, httpHandlers_1.validateRequest)(ms_brand_Model_1.SelectSchema), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const { company_id } = req.token.payload;
        const searchText = req.query.searchText || "";
        const companyId = company_id;
        const brand_id = req.params.brand_id;
        const ServiceResponse = yield ms_brandModelService_1.brandModelService.select(companyId, brand_id, searchText);
        (0, httpHandlers_1.handleServiceResponse)(ServiceResponse, res);
    }));
    return router;
})();
