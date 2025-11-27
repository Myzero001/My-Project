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
exports.roleRouter = void 0;
const express_1 = __importDefault(require("express"));
const httpHandlers_1 = require("@common/utils/httpHandlers");
const rolemodel_1 = require("./rolemodel");
const roleService_1 = require("./roleService");
const authenticateToken_1 = __importDefault(require("@common/middleware/authenticateToken"));
exports.roleRouter = (() => {
    const router = express_1.default.Router();
    router.get("/get", authenticateToken_1.default, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            //const companyId =req.token.company_id;
            const ServiceResponse = yield roleService_1.roleService.findAll();
            (0, httpHandlers_1.handleServiceResponse)(ServiceResponse, res);
        }
        catch (error) {
            console.error("Error in GET request:", error);
            res
                .status(500)
                .json({ status: "error", message: "Internal Server Error" });
        }
    }));
    router.get("/get/:role_id", authenticateToken_1.default, (0, httpHandlers_1.validateRequest)(rolemodel_1.GetRoleByIdSchema), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const { company_id } = req.token.payload;
            const { role_id } = req.params;
            const companyId = company_id;
            const ServiceResponse = yield roleService_1.roleService.findById(role_id);
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
