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
exports.toolRouter = void 0;
const express_1 = __importDefault(require("express"));
const httpHandlers_1 = require("@common/utils/httpHandlers");
const toolService_1 = require("@modules/tool/toolService");
const toolModel_1 = require("@modules/tool/toolModel");
const authenticateToken_1 = __importDefault(require("@common/middleware/authenticateToken"));
const permissions_1 = require("@common/middleware/permissions");
exports.toolRouter = (() => {
    const router = express_1.default.Router();
    router.get("/get", authenticateToken_1.default, (0, permissions_1.authorizeByName)("เครื่องมือ", ["A"]), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const page = parseInt(req.query.page) || 1;
            const pageSize = parseInt(req.query.pageSize) || 12;
            const companyId = req.token.company_id;
            const searchText = req.query.searchText || "";
            const ServiceResponse = yield toolService_1.toolService.findAll(companyId, page, pageSize, searchText);
            (0, httpHandlers_1.handleServiceResponse)(ServiceResponse, res);
        }
        catch (error) {
            console.error("Error in GET request:", error);
            res
                .status(500)
                .json({ status: "error", message: "Internal Server Error" });
        }
    }));
    router.get("/get_all", authenticateToken_1.default, (0, permissions_1.authorizeByName)("เครื่องมือ", ["A"]), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const { company_id } = req.token.payload;
        const ServiceResponse = yield toolService_1.toolService.findAllNoPagination(company_id);
        (0, httpHandlers_1.handleServiceResponse)(ServiceResponse, res); //create by kanyarat
    }));
    router.post("/create", authenticateToken_1.default, (0, permissions_1.authorizeByName)("เครื่องมือ", ["A"]), (0, httpHandlers_1.validateRequest)(toolModel_1.CreatetoolSchema), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const { company_id, uuid } = req.token.payload;
            const companyId = company_id;
            const userId = uuid;
            const payload = req.body;
            const ServiceResponse = yield toolService_1.toolService.create(companyId, userId, payload);
            (0, httpHandlers_1.handleServiceResponse)(ServiceResponse, res);
        }
        catch (error) {
            console.error("Error in POST request:", error);
            res
                .status(500)
                .json({ status: "error", message: "Internal Server Error" });
        }
    }));
    router.delete("/delete/:tool_id", authenticateToken_1.default, (0, permissions_1.authorizeByName)("เครื่องมือ", ["A"]), (0, httpHandlers_1.validateRequest)(toolModel_1.GetCategorySchema), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const { company_id } = req.token.payload;
            const companyId = company_id;
            const { tool_id } = req.params;
            const ServiceResponse = yield toolService_1.toolService.delete(companyId, tool_id);
            (0, httpHandlers_1.handleServiceResponse)(ServiceResponse, res);
        }
        catch (error) {
            console.error("Error in DELETE request:", error);
            res
                .status(500)
                .json({ status: "error", message: "Internal Server Error" });
        }
    }));
    router.patch("/update/:tool_id", authenticateToken_1.default, (0, permissions_1.authorizeByName)("เครื่องมือ", ["A"]), (0, httpHandlers_1.validateRequest)(toolModel_1.UpdateCategorySchema), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const { company_id, uuid } = req.token.payload;
            const companyId = company_id;
            const userId = uuid;
            const { tool_id } = req.params;
            const payload = req.body;
            const ServiceResponse = yield toolService_1.toolService.update(tool_id, payload, companyId, userId);
            (0, httpHandlers_1.handleServiceResponse)(ServiceResponse, res);
        }
        catch (error) {
            console.error("Error in PATCH request:", error);
            res
                .status(500)
                .json({ status: "error", message: "Internal Server Error" });
        }
    }));
    router.get("/get/:tool_id", authenticateToken_1.default, (0, permissions_1.authorizeByName)("เครื่องมือ", ["A"]), (0, httpHandlers_1.validateRequest)(toolModel_1.GetCategorySchema), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const { tool_id } = req.params;
        const ServiceResponse = yield toolService_1.toolService.search(tool_id);
        (0, httpHandlers_1.handleServiceResponse)(ServiceResponse, res);
    }));
    router.get("/select", authenticateToken_1.default, (0, permissions_1.authorizeByName)("สี", ["A", "R"]), (0, httpHandlers_1.validateRequest)(toolModel_1.SelectSchema), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const { company_id } = req.token.payload;
        const searchText = req.query.searchText || "";
        const companyId = company_id;
        const ServiceResponse = yield toolService_1.toolService.select(companyId, searchText);
        (0, httpHandlers_1.handleServiceResponse)(ServiceResponse, res);
    }));
    return router;
})();
