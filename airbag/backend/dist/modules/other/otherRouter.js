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
exports.otherRouter = void 0;
const express_1 = __importDefault(require("express"));
const httpHandlers_1 = require("@common/utils/httpHandlers");
const otherModel_1 = require("./otherModel");
const otherService_1 = require("./otherService");
const authenticateToken_1 = __importDefault(require("@common/middleware/authenticateToken"));
exports.otherRouter = (() => {
    const router = express_1.default.Router();
    router.get("/search-register", authenticateToken_1.default, (0, httpHandlers_1.validateRequest)(otherModel_1.searchRegisterSchema), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const companyId = req.token.company_id;
            const page = parseInt(req.query.page) || 1;
            const pageSize = parseInt(req.query.pageSize) || 50;
            const searchText = req.query.search || "";
            const ServiceResponse = yield otherService_1.otherService.searchRegister(companyId, searchText, page, pageSize);
            (0, httpHandlers_1.handleServiceResponse)(ServiceResponse, res);
        }
        catch (error) {
            console.error("Error in GET request:", error);
            res
                .status(500)
                .json({ status: "error", message: "Internal Server Error" });
        }
    }));
    return router;
})();
