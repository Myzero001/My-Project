// issueReasonRouter
import express, { Request, Response, Router } from "express";
import {
  handleServiceResponse,
  validateRequest,
} from "@common/utils/httpHandlers";
import { issueReasonService } from "@modules/ms-issue-reason/issueReasonService";
import {
  GetIssueReasonSchema,
  CreateIssueReasonSchema,
  UpdateIssueReasonSchema,
  DeleteIssueReasonSchema,
  SelectSchema
} from "@modules/ms-issue-reason/issueReasonModel";
import authenticateToken from "@common/middleware/authenticateToken";
import { authorizeByName } from "@common/middleware/permissions";

export const issueReasonRouter = (() => {
  const router = express.Router();

  router.get(
    "/get",
    authenticateToken,
    authorizeByName("สาเหตุ", ["A"]),
    async (req: Request, res: Response) => {
      const companyId = req.token.company_id;
      const page = parseInt(req.query.page as string) || 1;
      const pageSize = parseInt(req.query.pageSize as string) || 12;
      const searchText = (req.query.searchText as string) || "";

      const ServiceResponse = await issueReasonService.findAll(
        companyId,
        page,
        pageSize,
        searchText
      );
      handleServiceResponse(ServiceResponse, res);
    }
  );

  router.get("/get_all", 
    authenticateToken,
    authorizeByName("สาเหตุ", ["A"]),
    async (req: Request, res: Response) => {
      const { company_id } = req.token.payload;
      const companyId = company_id;
      const ServiceResponse = await issueReasonService.findAllNoPagination(companyId);
      handleServiceResponse(ServiceResponse, res);
    });

  router.post(
    "/create",
    authenticateToken,
    authorizeByName("สาเหตุ", ["A"]),
    validateRequest(CreateIssueReasonSchema),
    async (req: Request, res: Response) => {
      const { company_id, uuid } = req.token.payload;
      const companyId = company_id;
      const userId = uuid;
      const payload = req.body;
      const ServiceResponse = await issueReasonService.create(
        companyId,
        userId,
        payload
      );
      handleServiceResponse(ServiceResponse, res);
    }
  );

  router.patch(
    "/update",
    authenticateToken,
    authorizeByName("สาเหตุ", ["A"]),
    validateRequest(UpdateIssueReasonSchema),
    async (req: Request, res: Response) => {
      const { company_id, uuid } = req.token.payload;
      const companyId = company_id;
      const userId = uuid;
      const { issue_reason_id } = req.body;
      const payload = req.body;
      const ServiceResponse = await issueReasonService.update(
        companyId,
        userId,
        issue_reason_id,
        payload
      );
      handleServiceResponse(ServiceResponse, res);
    }
  );

  router.delete(
    "/delete/:issue_reason_id",
    authenticateToken,
    authorizeByName("สาเหตุ", ["A"]),
    validateRequest(DeleteIssueReasonSchema),
    async (req: Request, res: Response) => {
      const { company_id } = req.token.payload;
      const companyId = company_id;
      const { issue_reason_id } = req.params;
      const ServiceResponse = await issueReasonService.delete(
        companyId,
        issue_reason_id
      );
      handleServiceResponse(ServiceResponse, res);
    }
  );

  router.get(
    "/get/:issue_reason_id",
    authenticateToken,
    authorizeByName("สาเหตุ", ["A"]),
    validateRequest(GetIssueReasonSchema),
    async (req: Request, res: Response) => {
      const { company_id } = req.token.payload;
      const companyId = company_id;
      const { issue_reason_id } = req.params;
      const ServiceResponse = await issueReasonService.findById(
        companyId,
        issue_reason_id
      );
      handleServiceResponse(ServiceResponse, res);
    }
  );
  router.get("/select",
    authenticateToken,
    authorizeByName("สาเหตุ", ["A", "R"]),
    validateRequest(SelectSchema),
    async (req: Request, res: Response) => {
      const { company_id } = req.token.payload;
      const searchText = (req.query.searchText as string) || "";
      const companyId = company_id;
      const ServiceResponse = await issueReasonService.select(companyId, searchText);
      handleServiceResponse(ServiceResponse, res);
    }
  );

  return router;
})();
