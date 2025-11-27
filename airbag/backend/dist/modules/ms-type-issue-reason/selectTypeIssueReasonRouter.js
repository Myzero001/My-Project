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
exports.msTypeIssueReasonRouter = void 0;
const express_1 = __importDefault(require("express"));
const httpHandlers_1 = require("@common/utils/httpHandlers");
const selectTypeIssueReasonService_1 = require("@modules/ms-type-issue-reason/selectTypeIssueReasonService");
const selectTypeIssueReasonModel_1 = require("@modules/ms-type-issue-reason/selectTypeIssueReasonModel");
const authenticateToken_1 = __importDefault(require("@common/middleware/authenticateToken"));
const authorizeAll_1 = __importDefault(require("@common/middleware/authorizeAll"));
const permissions_1 = require("@common/middleware/permissions");
exports.msTypeIssueReasonRouter = (() => {
    const router = express_1.default.Router();
    router.get("/get", authenticateToken_1.default, (0, permissions_1.authorizeByName)("ประเภทของปัญหา", ["A", "R"]), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const companyId = req.token.company_id;
            const serviceResponse = yield selectTypeIssueReasonService_1.selectTypeIssueReasonService.findAll(companyId);
            (0, httpHandlers_1.handleServiceResponse)(serviceResponse, res);
        }
        catch (error) {
            console.error("Error in GET request:", error);
            res
                .status(500)
                .json({ status: "error", message: "Internal Server Error" });
        }
    }));
    // ไม่ได้ใช้
    router.post("/create", authenticateToken_1.default, authorizeAll_1.default, (0, httpHandlers_1.validateRequest)(selectTypeIssueReasonModel_1.CreateSelectTypeIssueReasonSchema), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const { company_id, uuid } = req.token.payload;
            const companyId = company_id;
            const userId = uuid;
            const payload = req.body;
            const serviceResponse = yield selectTypeIssueReasonService_1.selectTypeIssueReasonService.create(companyId, userId, payload);
            (0, httpHandlers_1.handleServiceResponse)(serviceResponse, res);
        }
        catch (error) {
            console.error("Error in POST request:", error);
            res
                .status(500)
                .json({ status: "error", message: "Internal Server Error" });
        }
    }));
    // ไม่ได้ใช้
    router.patch("/update", authenticateToken_1.default, authorizeAll_1.default, (0, httpHandlers_1.validateRequest)(selectTypeIssueReasonModel_1.UpdateSelectTypeIssueReasonSchema), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const { company_id, uuid } = req.token.payload;
            const companyId = company_id;
            const userId = uuid;
            const { type_issue_group_id } = req.body;
            const payload = req.body;
            const serviceResponse = yield selectTypeIssueReasonService_1.selectTypeIssueReasonService.update(companyId, userId, type_issue_group_id, payload);
            (0, httpHandlers_1.handleServiceResponse)(serviceResponse, res);
        }
        catch (error) {
            console.error("Error in PATCH request:", error);
            res
                .status(500)
                .json({ status: "error", message: "Internal Server Error" });
        }
    }));
    // ไม่ได้ใช้
    // router.delete(
    //   "/delete/:id",
    //   authenticateToken,
    //   authorizeAll,
    //   validateRequest(DeleteSelectTypeIssueReasonSchema),
    //   async (req: Request, res: Response) => {
    //     try {
    //       const { company_id } = req.token.payload;
    //       const companyId = company_id;
    //       const { id } = req.params;
    //       const type_issue_group_id = id;
    //       const serviceResponse = await selectTypeIssueReasonService.delete(
    //         companyId,
    //         type_issue_group_id
    //       );
    //       handleServiceResponse(serviceResponse, res);
    //     } catch (error) {
    //       console.error("Error in DELETE request:", error);
    //       res
    //         .status(500)
    //         .json({ status: "error", message: "Internal Server Error" });
    //     }
    //   }
    // );
    return router;
})();
