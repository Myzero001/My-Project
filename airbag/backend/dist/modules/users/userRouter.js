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
exports.userRouter = void 0;
const express_1 = __importDefault(require("express"));
const httpHandlers_1 = require("@common/utils/httpHandlers");
const userService_1 = require("@modules/users/userService");
const userModel_1 = require("@modules/users/userModel");
const authenticateToken_1 = __importDefault(require("@common/middleware/authenticateToken"));
const permissions_1 = require("@common/middleware/permissions");
exports.userRouter = (() => {
    const router = express_1.default.Router();
    router.post("/login", (0, httpHandlers_1.validateRequest)(userModel_1.LoginUserSchema), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const payload = req.body;
        const ServiceResponse = yield userService_1.userService.login(payload, res);
        (0, httpHandlers_1.handleServiceResponse)(ServiceResponse, res);
    }));
    router.get("/logout", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const ServiceResponse = yield userService_1.userService.logout(res);
        (0, httpHandlers_1.handleServiceResponse)(ServiceResponse, res);
    }));
    router.get("/auth-status", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const ServiceResponse = yield userService_1.userService.authStatus(req);
        (0, httpHandlers_1.handleServiceResponse)(ServiceResponse, res);
    }));
    router.get("/get", authenticateToken_1.default, (0, permissions_1.authorizeByName)("พนักงาน", ["A"]), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const page = parseInt(req.query.page) || 1;
            const pageSize = parseInt(req.query.pageSize) || 12;
            const companyId = req.token.company_id;
            const searchText = req.query.searchText || "";
            const ServiceResponse = yield userService_1.userService.findAll(companyId, page, pageSize, searchText);
            (0, httpHandlers_1.handleServiceResponse)(ServiceResponse, res);
        }
        catch (error) {
            console.error("Error in GET request:", error);
            res.status(500).json({ status: "error", message: "Internal Server Error" });
        }
    })),
        router.patch("/update/:employee_id", authenticateToken_1.default, (0, permissions_1.authorizeByName)("พนักงาน", ["A"]), (0, httpHandlers_1.validateRequest)(userModel_1.UpdateUserSchema), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
            try {
                const { company_id, uuid } = req.token.payload;
                const companyId = company_id;
                const userId = uuid;
                const { employee_id } = req.params;
                const payload = req.body;
                const ServiceResponse = yield userService_1.userService.update(companyId, userId, employee_id, payload);
                (0, httpHandlers_1.handleServiceResponse)(ServiceResponse, res);
            }
            catch (error) {
                console.error("Error in PATCH request:", error);
                res.status(500).json({ status: "error", message: "Internal Server Error" });
            }
        }));
    router.get("/usernames", authenticateToken_1.default, (0, permissions_1.authorizeByName)("พนักงาน", ["A"]), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const ServiceResponse = yield userService_1.userService.getAllUsernames();
        (0, httpHandlers_1.handleServiceResponse)(ServiceResponse, res);
    }));
    router.get("/get/:employee_id", authenticateToken_1.default, (0, permissions_1.authorizeByName)("พนักงาน", ["A"]), (0, httpHandlers_1.validateRequest)(userModel_1.GetUserSchema), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const { company_id } = req.token.payload;
            const { employee_id } = req.params;
            const companyId = company_id;
            const ServiceResponse = yield userService_1.userService.findById(companyId, employee_id);
            (0, httpHandlers_1.handleServiceResponse)(ServiceResponse, res);
        }
        catch (error) {
            console.error("Error in GET request:", error);
            res
                .status(500)
                .json({ status: "error", message: "Internal Server Error" });
        }
    }));
    router.post("/register", authenticateToken_1.default, (0, permissions_1.authorizeByName)("พนักงาน", ["A"]), (0, httpHandlers_1.validateRequest)(userModel_1.CreateUserSchema), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const { company_id, uuid } = req.token.payload;
            const companyId = company_id;
            const userId = uuid;
            const payload = req.body;
            const ServiceResponse = yield userService_1.userService.create(companyId, userId, payload);
            (0, httpHandlers_1.handleServiceResponse)(ServiceResponse, res);
        }
        catch (error) {
            console.error("Error in POST request:", error);
            res.status(500).json({ status: "error", message: "Internal Server Error" });
        }
    }));
    router.get("/get_profile", authenticateToken_1.default, 
    // authorizeByName("พนักงาน", ["A"]),
    (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const { company_id, uuid } = req.token.payload;
            const companyId = company_id;
            const ServiceResponse = yield userService_1.userService.findById4(companyId, uuid);
            (0, httpHandlers_1.handleServiceResponse)(ServiceResponse, res);
        }
        catch (error) {
            console.error("Error in GET request:", error);
            res
                .status(500)
                .json({ status: "error", message: "Internal Server Error" });
        }
    }));
    router.get("/user-and-id", // <--- Endpoint ใหม่
    authenticateToken_1.default, (0, permissions_1.authorizeByName)("พนักงาน", ["A"]), // <-- ใช้ middleware เหมือนเดิม
    (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const ServiceResponse = yield userService_1.userService.getAllUsernamesAndIds(); // <--- เรียก service function ใหม่
        (0, httpHandlers_1.handleServiceResponse)(ServiceResponse, res);
    }));
    // Route เดิมยังคงอยู่
    router.get("/usernames", authenticateToken_1.default, (0, permissions_1.authorizeByName)("พนักงาน", ["A"]), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const ServiceResponse = yield userService_1.userService.getAllUsernames();
        (0, httpHandlers_1.handleServiceResponse)(ServiceResponse, res);
    }));
    return router;
})();
