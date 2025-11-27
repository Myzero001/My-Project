import express, { Request, Response } from "express";
import {
  handleServiceResponse,
  validateRequest,
} from "@common/utils/httpHandlers";
import { toolingReasonService } from "@modules/ms-tooling-reason/ms-tooling-reasonService";
import {
  CreateToolingReasonSchema,
  UpdateToolingReasonSchema,
  GetToolingReasonSchema,
  GetParamToolingReasonSchema,
  SelectSchema
} from "@modules/ms-tooling-reason/ms-tooling-reasonModel";
import authenticateToken from "@common/middleware/authenticateToken";
import { authorizeByName } from "@common/middleware/permissions";

export const toolingReasonRouter = (() => {
  const router = express.Router();

  router.get(
    "/get",
    authenticateToken,
    authorizeByName("เหตุผลการใช้เครื่องมือ", ["A"]),
    async (req: Request, res: Response) => {
      const { company_id } = req.token.payload;
      const page = parseInt(req.query.page as string) || 1;
      const pageSize = parseInt(req.query.pageSize as string) || 12;
      const searchText = (req.query.searchText as string) || "";
      const ServiceResponse = await toolingReasonService.findAll(
        company_id,
        page,
        pageSize,
        searchText
      );
      handleServiceResponse(ServiceResponse, res);
    }
  );

  router.get("/get_all", 
    authenticateToken,
    authorizeByName("เหตุผลการใช้เครื่องมือเพิ่มเติม", ["A", "R"]),
    async (req: Request, res: Response) => {
      const { company_id } = req.token.payload;
    const ServiceResponse = await toolingReasonService.findAllNoPagination(company_id);
    handleServiceResponse(ServiceResponse, res);
  });

  router.post(
    "/create",
    authenticateToken,
    authorizeByName("เหตุผลการใช้เครื่องมือ", ["A"]),
    validateRequest(CreateToolingReasonSchema),
    async (req: Request, res: Response) => {
      const { company_id, uuid } = req.token.payload;
      const payload = req.body;

      const ServiceResponse = await toolingReasonService.create(
        company_id,
        uuid,
        payload
      );
      handleServiceResponse(ServiceResponse, res);
    }
  );

  router.patch(
    "/update",
    authenticateToken,
    authorizeByName("เหตุผลการใช้เครื่องมือ", ["A"]),
    validateRequest(UpdateToolingReasonSchema),
    async (req: Request, res: Response) => {
      const { company_id, uuid } = req.token.payload;
      const { master_tooling_reason_id } = req.body;
      const payload = req.body;

      const ServiceResponse = await toolingReasonService.update(
        company_id,
        uuid,
        master_tooling_reason_id,
        payload
      );
      handleServiceResponse(ServiceResponse, res);
    }
  );

  router.delete(
    "/delete/:master_tooling_reason_id",
    authenticateToken,
    authorizeByName("เหตุผลการใช้เครื่องมือ", ["A"]),
    validateRequest(GetParamToolingReasonSchema),
    async (req: Request, res: Response) => {
      const { company_id } = req.token.payload;
      const { master_tooling_reason_id } = req.params;

      const ServiceResponse = await toolingReasonService.delete(
        company_id,
        master_tooling_reason_id
      );
      handleServiceResponse(ServiceResponse, res);
    }
  );

  router.get(
    "/get/:master_tooling_reason_id",
    authenticateToken,
    authorizeByName("เหตุผลการใช้เครื่องมือ", ["A"]),
    validateRequest(GetParamToolingReasonSchema),
    async (req: Request, res: Response) => {
      const { company_id } = req.token.payload;
      const { master_tooling_reason_id } = req.params;

      const ServiceResponse = await toolingReasonService.findById(
        company_id,
        master_tooling_reason_id
      );
      handleServiceResponse(ServiceResponse, res);
    }
  );

  router.get(
    "/get-minimal",
    authenticateToken,
    authorizeByName("เหตุผลการใช้เครื่องมือ", ["A"]),
    async (req: Request, res: Response) => {
      const companyId = req.token.company_id;

      const ServiceResponse = await toolingReasonService.findMinimal(companyId);
      handleServiceResponse(ServiceResponse, res);
    }
  );

  router.get("/select",
    authenticateToken,
    authorizeByName("เหตุผลการใช้เครื่องมือ", ["A", "R"]),
    validateRequest(SelectSchema),
    async (req: Request, res: Response) => {
      const { company_id } = req.token.payload;
      const searchText = (req.query.searchText as string) || "";
      const companyId = company_id;
      const ServiceResponse = await toolingReasonService.select(companyId, searchText);
      handleServiceResponse(ServiceResponse, res);
    }
  );

  return router;
})();
