import exprss, { Request, Response } from "express";
import {
  handleServiceResponse,
  validateRequest,
} from "@common/utils/httpHandlers";
import authenticateToken from "@common/middleware/authenticateToken";
import { paymentEditsService } from "./paymentEditsService";
import {
  CreatePaymentEditsSchema,
  UpdatePaymentEditsSchema,
  UpdatePaymentStatusSchema,
} from "./paymentEditsModel";
import { authorizeByName } from "@common/middleware/permissions";

export const paymentEditsRouter = (() => {
  const router = exprss.Router();

  router.get(
    "/get",
    authenticateToken,
    authorizeByName("การอนุมัติขอแก้ไขใบชำระเงิน", ["A", "R"]),
    async (req: Request, res: Response) => {
      const { company_id } = req.token.payload;
      const page = parseInt(req.query.page as string) || 1;
      const pageSize = parseInt(req.query.pageSize as string) || 12;
      const searchText = (req.query.searchText as string) || "";
      const status = (req.query.status as string) || "";
      const ServiceResponse = await paymentEditsService.findAll(
        company_id,
        page,
        pageSize,
        searchText,
        status
      );
      handleServiceResponse(ServiceResponse, res);
    }
  );

  router.get(
    "/get_all",
    authenticateToken,
    authorizeByName("การอนุมัติขอแก้ไขใบชำระเงิน", ["A", "R"]),
    async (_req: Request, res: Response) => {
      const ServiceResponse = await paymentEditsService.findAllNoPagination();
      handleServiceResponse(ServiceResponse, res);
    }
  );

  router.get(
    "/get/:id",
    authenticateToken,
    authorizeByName("การอนุมัติขอแก้ไขใบชำระเงิน", ["A", "R"]),
    async (req: Request, res: Response) => {
      const id = req.params.id;
      const ServiceResponse = await paymentEditsService.findAllById(id);
      handleServiceResponse(ServiceResponse, res);
    }
  );

  router.get(
    "/get_by_payment_id/:id",
    authenticateToken,
    authorizeByName("การอนุมัติขอแก้ไขใบชำระเงิน", ["A", "R"]),
    async (req: Request, res: Response) => {
      const id = req.params.id;
      const ServiceResponse = await paymentEditsService.findByPaymentId(id);
      handleServiceResponse(ServiceResponse, res);
    }
  );
  router.get(
    "/get_log_by_payment_id/:id",
    authenticateToken,
    authorizeByName("การอนุมัติขอแก้ไขใบชำระเงิน", ["A", "R"]),
    async (req: Request, res: Response) => {
      const id = req.params.id;
      const ServiceResponse = await paymentEditsService.findLogByPaymentId(id);
      handleServiceResponse(ServiceResponse, res);
    }
  );

  router.post(
    "/create",
    authenticateToken,
    authorizeByName("การอนุมัติขอแก้ไขใบชำระเงิน", ["A", "R"]),
    validateRequest(CreatePaymentEditsSchema),
    async (req: Request, res: Response) => {
      const payload = req.body;
      const userId = req.token.payload.uuid;
      const { company_id } = req.token.payload;
      const ServiceResponse = await paymentEditsService.create(
        payload,
        userId,
        company_id
      );
      handleServiceResponse(ServiceResponse, res);
    }
  );

  router.patch(
    "/update",
    authenticateToken,
    authorizeByName("การอนุมัติขอแก้ไขใบชำระเงิน", ["A"]),
    validateRequest(UpdatePaymentEditsSchema),
    async (req: Request, res: Response) => {
      const payload = req.body;
      const { id } = req.body;
      const userId = req.token.payload.uuid;
      const ServiceResponse = await paymentEditsService.update(
        id,
        payload,
        userId
      );
      handleServiceResponse(ServiceResponse, res);
    }
  );

  router.patch(
    "/approve",
    authenticateToken,
    authorizeByName("การอนุมัติขอแก้ไขใบชำระเงิน", ["A"]),
    validateRequest(UpdatePaymentStatusSchema),
    async (req: Request, res: Response) => {
      const { id } = req.body;
      const { company_id } = req.token.payload;
      const payload = req.body;
      const userId = req.token.payload.uuid;
      const ServiceResponse = await paymentEditsService.approve(
        id,
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
    authorizeByName("การอนุมัติขอแก้ไขใบชำระเงิน", ["A"]),
    validateRequest(UpdatePaymentStatusSchema),
    async (req: Request, res: Response) => {
      const { id } = req.body;
      const { company_id } = req.token.payload;
      const payload = req.body;
      const userId = req.token.payload.uuid;
      const ServiceResponse = await paymentEditsService.cancel(
        id,
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
    authorizeByName("การอนุมัติขอแก้ไขใบชำระเงิน", ["A"]),
    validateRequest(UpdatePaymentStatusSchema),
    async (req: Request, res: Response) => {
      const { id } = req.body;
      const { company_id } = req.token.payload;
      const payload = req.body;
      const userId = req.token.payload.uuid;
      const ServiceResponse = await paymentEditsService.reject(
        id,
        payload,
        userId,
        company_id
      );
      handleServiceResponse(ServiceResponse, res);
    }
  );

  return router;
})();
