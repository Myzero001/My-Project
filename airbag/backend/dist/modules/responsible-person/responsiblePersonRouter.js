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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.responsiblePersonRouter = void 0;
const express_1 = __importDefault(require("express"));
const responsiblePersonModel_1 = require("./responsiblePersonModel");
const responsiblePersonService_1 = require("./responsiblePersonService");
const httpHandlers_1 = require("@common/utils/httpHandlers");
const authenticateToken_1 = __importDefault(require("@common/middleware/authenticateToken"));
const permissions_1 = require("@common/middleware/permissions");
exports.responsiblePersonRouter = (() => {
    const router = express_1.default.Router();
    router.get("/get", authenticateToken_1.default, (0, permissions_1.authorizeByName)("เปลี่ยนผู้รับผิดชอบ", ["A"]), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const { company_id } = req.token.payload;
        const page = parseInt(req.query.page) || 1;
        const pageSize = parseInt(req.query.pageSize) || 12;
        const response = yield responsiblePersonService_1.responsiblePersonService.findAll(company_id, page, pageSize);
        (0, httpHandlers_1.handleServiceResponse)(response, res);
    }));
    router.get("/types", authenticateToken_1.default, (0, permissions_1.authorizeByName)("เปลี่ยนผู้รับผิดชอบ", ["A"]), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield responsiblePersonService_1.responsiblePersonService.getResponsiblePersonsTypes();
        (0, httpHandlers_1.handleServiceResponse)(response, res);
    }));
    router.get("/get/:log_id", authenticateToken_1.default, (0, permissions_1.authorizeByName)("เปลี่ยนผู้รับผิดชอบ", ["A"]), (0, httpHandlers_1.validateRequest)(responsiblePersonModel_1.GetParamResponsiblePersonSchema), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const { company_id } = req.token.payload;
        const { log_id } = req.params;
        const response = yield responsiblePersonService_1.responsiblePersonService.findById(company_id, log_id);
        (0, httpHandlers_1.handleServiceResponse)(response, res);
    }));
    router.post("/create", authenticateToken_1.default, (0, permissions_1.authorizeByName)("เปลี่ยนผู้รับผิดชอบ", ["A"]), (0, httpHandlers_1.validateRequest)(responsiblePersonModel_1.CreateResponsiblePersonSchema), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const { company_id, uuid } = req.token.payload;
        const payload = req.body;
        const response = yield responsiblePersonService_1.responsiblePersonService.create(company_id, uuid, payload);
        (0, httpHandlers_1.handleServiceResponse)(response, res);
    }));
    router.patch("/update", authenticateToken_1.default, (0, permissions_1.authorizeByName)("เปลี่ยนผู้รับผิดชอบ", ["A"]), (0, httpHandlers_1.validateRequest)(responsiblePersonModel_1.UpdateResponsiblePersonSchema), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const { company_id } = req.token.payload;
        const _a = req.body, { log_id } = _a, updatePayload = __rest(_a, ["log_id"]);
        const response = yield responsiblePersonService_1.responsiblePersonService.update(company_id, log_id, updatePayload);
        (0, httpHandlers_1.handleServiceResponse)(response, res);
    }));
    router.delete("/delete/:log_id", authenticateToken_1.default, (0, permissions_1.authorizeByName)("เปลี่ยนผู้รับผิดชอบ", ["A"]), (0, httpHandlers_1.validateRequest)(responsiblePersonModel_1.GetParamResponsiblePersonSchema), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const { company_id } = req.token.payload;
        const { log_id } = req.params;
        const response = yield responsiblePersonService_1.responsiblePersonService.delete(company_id, log_id);
        (0, httpHandlers_1.handleServiceResponse)(response, res);
    }));
    return router;
})();
