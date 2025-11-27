import exprss, { Request, Response } from "express";
import {
  handleServiceResponse,
  validateRequest,
} from "@common/utils/httpHandlers";
import { quotationService } from "./quotationService";
import {
  UpdateQuotationSchema,
  CreateQuotationSchema,
  UpdateStatusQuotationSchema,
  DeleteQuotationSchema,
  RequestEditQuotationSchema,
  ShowCalendarRemovalSchema
} from "@modules/quotation/quotationModel";
import authenticateToken from "@common/middleware/authenticateToken";
import authorizeAll from "@common/middleware/authorizeAll";
import { GetParamQuotationSchema } from "@modules/quotation_log_status/quotationLogStatusModel";
import { authorizeByName } from "@common/middleware/permissions";
import e from "express";

export const quotationRouter = (() => {
  const router = exprss.Router();

  router.get(
    "/get",
    authenticateToken,
    authorizeByName("ใบเสนอราคา", ["A", "R"]),
    async (req: Request, res: Response) => {
      const { company_id } = req.token.payload;
      const page = parseInt(req.query.page as string) || 1;
      const pageSize = parseInt(req.query.pageSize as string) || 12;
      const searchText = (req.query.searchText as string) || "";
      const status = (req.query.status as string) || "";
      const ServiceResponse = await quotationService.findAll(
        page,
        pageSize,
        searchText,
        status,
        company_id
      );
      handleServiceResponse(ServiceResponse, res);
    }
  );

  router.get(
    "/get/approve",
    authenticateToken,
    authorizeByName("ใบเสนอราคา", ["A", "R"]),
    async (req: Request, res: Response) => {
      const { company_id } = req.token.payload;
      const page = parseInt(req.query.page as string) || 1;
      const pageSize = parseInt(req.query.pageSize as string) || 12;
      const searchText = (req.query.searchText as string) || "";
      const status = (req.query.status as string) || "";
      const ServiceResponse = await quotationService.findAllApprove(
        page,
        pageSize,
        searchText,
        status,
        company_id
      );
      handleServiceResponse(ServiceResponse, res);
    }
  );

  router.get(
    "/get/:id",
    authenticateToken,
    authorizeByName("ใบเสนอราคา", ["A", "R"]),
    async (req: Request, res: Response) => {
      const id = req.params.id;
      const ServiceResponse = await quotationService.findById(id);
      handleServiceResponse(ServiceResponse, res);
    }
  );

  router.post(
    "/create",
    authenticateToken,
    authorizeByName("ใบเสนอราคา", ["A"]),
    validateRequest(CreateQuotationSchema),
    async (req: Request, res: Response) => {
      const { company_id } = req.token.payload;
      const payload = req.body;
      const userId = req.token.payload.uuid;
      const ServiceResponse = await quotationService.create(
        payload,
        userId,
        company_id
      );
      handleServiceResponse(ServiceResponse, res);
    }
  );

  router.patch(
    "/update/:quotation_id",
    authenticateToken,
    authorizeByName("ใบเสนอราคา", ["A"]),
    validateRequest(UpdateQuotationSchema),
    async (req: Request, res: Response) => {
      const { quotation_id } = req.params;
      const payload = req.body;
      const ServiceResponse = await quotationService.update(
        quotation_id,
        payload
      );
      handleServiceResponse(ServiceResponse, res);
    }
  );

  router.patch(
    "/approve",
    authenticateToken,
    authorizeByName("การอนุมัติใบเสนอราคา", ["A"]),
    validateRequest(UpdateQuotationSchema),
    async (req: Request, res: Response) => {
      const { quotation_id } = req.body;
      const { company_id } = req.token.payload;
      const payload = req.body;
      const userId = req.token.payload.uuid;
      const ServiceResponse = await quotationService.approve(
        quotation_id,
        payload,
        userId,
        company_id
      );
      handleServiceResponse(ServiceResponse, res);
    }
  );

  router.patch(
    "/reject",
    authenticateToken,
    authorizeByName("การอนุมัติใบเสนอราคา", ["A"]),
    validateRequest(UpdateQuotationSchema),
    async (req: Request, res: Response) => {
      const { quotation_id } = req.body;
      const { company_id } = req.token.payload;
      const payload = req.body;
      const userId = req.token.payload.uuid;
      const ServiceResponse = await quotationService.reject(
        quotation_id,
        payload,
        userId,
        company_id
      );
      handleServiceResponse(ServiceResponse, res);
    }
  );

  router.patch(
    "/request_approve",
    authenticateToken,
    authorizeByName("ใบเสนอราคา", ["A"]),
    validateRequest(UpdateStatusQuotationSchema),
    async (req: Request, res: Response) => {
      const { company_id } = req.token.payload;
      const { quotation_id } = req.body;
      const userId = req.token.payload.uuid;
      const ServiceResponse = await quotationService.requestApprove(
        quotation_id,
        userId,
        company_id
      );
      handleServiceResponse(ServiceResponse, res);
    }
  );

  router.patch(
    "/request_edit",
    authenticateToken,
    authorizeByName("ใบเสนอราคา", ["A"]),
    validateRequest(RequestEditQuotationSchema),
    async (req: Request, res: Response) => {
      const { company_id } = req.token.payload;
      const { quotation_id, remark } = req.body;
      const userId = req.token.payload.uuid;
      const ServiceResponse = await quotationService.requestEdit(
        quotation_id,
        remark,
        userId,
        company_id
      );
      handleServiceResponse(ServiceResponse, res);
    }
  );

  router.patch(
    "/close_deal",
    authenticateToken,
    authorizeByName("ใบเสนอราคา", ["A"]),
    validateRequest(UpdateStatusQuotationSchema),
    async (req: Request, res: Response) => {
      const { quotation_id } = req.body;
      const { company_id } = req.token.payload;
      const payload = req.body;
      const userId = req.token.payload.uuid;
      const ServiceResponse = await quotationService.closeDeal(
        quotation_id,
        payload,
        userId,
        company_id
      );
      handleServiceResponse(ServiceResponse, res);
    }
  );

  router.patch(
    "/cancel",
    authenticateToken,
    authorizeByName("ใบเสนอราคา", ["A"]),
    validateRequest(UpdateStatusQuotationSchema),
    async (req: Request, res: Response) => {
      const { company_id } = req.token.payload;
      const { quotation_id, remark } = req.body;
      const userId = req.token.payload.uuid;
      const ServiceResponse = await quotationService.cancel(
        quotation_id,
        remark,
        userId,
        company_id
      );
      handleServiceResponse(ServiceResponse, res);
    }
  );

  router.delete(
    "/delete/:id",
    authenticateToken,
    authorizeByName("ใบเสนอราคา", ["A"]),
    validateRequest(DeleteQuotationSchema),
    async (req: Request, res: Response) => {
      const { id } = req.params;
      const ServiceResponse = await quotationService.delete(id);
      handleServiceResponse(ServiceResponse, res);
    }
  );

  // ดึงเฉพาะ quotation_doc
  router.get(
    "/get-docs",
    authenticateToken,
    authorizeByName("ใบเสนอราคา", ["A", "R"]),
    async (req: Request, res: Response) => {
      const companyId = req.token.company_id;
      const ServiceResponse = await quotationService.findQuotationDocs(companyId);
      handleServiceResponse(ServiceResponse, res);
    }
  );

  // ดึงเฉพาะ responsible-by
  router.get(
    "/responsible-by/:quotation_doc",
    authenticateToken,
    authorizeByName("เปลี่ยนผู้รับผิดชอบ", ["A"]),
    async (req: Request, res: Response) => {
      const { quotation_doc } = req.params;
      const companyId = req.token.company_id;
      const ServiceResponse = await quotationService.findResponsibleBy(
        quotation_doc,
        companyId
      );
      handleServiceResponse(ServiceResponse, res);
    }
  );

  router.post(
    "/get/calendar-removal",
    authenticateToken,
    validateRequest(ShowCalendarRemovalSchema),
    authorizeByName("ปฏิทินนัดหมายถอด", ["A"]),
    async (req: Request, res: Response) => {
      const companyId = req.token.company_id;
      const startDateFilter = req.body.startDate;
      const endDateFilter = req.body.endDate;
      const ServiceResponse = await quotationService.findCalendarRemoval(
        companyId,
        startDateFilter,
        endDateFilter
      );
      handleServiceResponse(ServiceResponse, res);
    }
  );

  return router;
})();
