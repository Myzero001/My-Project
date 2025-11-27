import exprss, { Request, Response } from "express";
import {
  handleServiceResponse,
  validateRequest,
} from "@common/utils/httpHandlers";
import authenticateToken from "@common/middleware/authenticateToken";
import { paymentService } from "./paymentService";
import {
  CreatePaymentSchema,
  deletePaymentSchema,
  GetPaymentByDeliveryScheduleIdSchema,
  UpdatePaymentSchema,
} from "./paymentModel";
import { authorizeByName } from "@common/middleware/permissions";

export const paymentRouter = (() => {
  const router = exprss.Router();

  router.get(
    "/get",
    authenticateToken,
    authorizeByName("การชำระเงิน", ["A", "R"]),
    async (req: Request, res: Response) => {
      const { company_id } = req.token.payload;
      const page = parseInt(req.query.page as string) || 1;
      const pageSize = parseInt(req.query.pageSize as string) || 12;
      const searchText = (req.query.searchText as string) || "";
      const status = (req.query.status as string) || "";
      const ServiceResponse = await paymentService.findAll(
        company_id,
        page,
        pageSize,
        searchText,
        status
      );
      handleServiceResponse(ServiceResponse, res);
    }
  );

  router.get("/get_all", 
    authenticateToken,
    authorizeByName("การชำระเงิน", ["A", "R"]),
    async (req: Request, res: Response) => {
      const { company_id } = req.token.payload;
    const ServiceResponse = await paymentService.findAllNoPagination(company_id);
    handleServiceResponse(ServiceResponse, res);
  });

  router.get(
    "/get/:id",
    authenticateToken,
    authorizeByName("การชำระเงิน", ["A", "R"]),
    async (req: Request, res: Response) => {
      const id = req.params.id;
      const ServiceResponse = await paymentService.findAllById(id);
      handleServiceResponse(ServiceResponse, res);
    }
  );

  router.get(
    "/get_by_repair_receipt_id/:id",
    authenticateToken,
    authorizeByName("การชำระเงิน", ["A", "R"]),
    validateRequest(GetPaymentByDeliveryScheduleIdSchema),
    async (req: Request, res: Response) => {
      const id = req.params.id;
      const ServiceResponse = await paymentService.findAllByRepairReceiptId(id);
      handleServiceResponse(ServiceResponse, res);
    }
  );

  router.post(
    "/create",
    authenticateToken,
    authorizeByName("การชำระเงิน", ["A"]),
    validateRequest(CreatePaymentSchema),
    async (req: Request, res: Response) => {
      const payload = req.body;
      const userId = req.token.payload.uuid;
      const { company_id } = req.token.payload;
      const ServiceResponse = await paymentService.create(
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
    authorizeByName("การชำระเงิน", ["A"]),
    validateRequest(UpdatePaymentSchema),
    async (req: Request, res: Response) => {
      const payload = req.body;
      const { id } = req.body;
      const userId = req.token.payload.uuid;
      const ServiceResponse = await paymentService.update(id, payload, userId);
      handleServiceResponse(ServiceResponse, res);
    }
  );

  router.delete(
    "/delete/:id",
    validateRequest(deletePaymentSchema),
    authorizeByName("การชำระเงิน", ["A"]),
    async (req: Request, res: Response) => {
      const { id } = req.params;
      const ServiceResponse = await paymentService.delete(id);
      handleServiceResponse(ServiceResponse, res);
    }
  );

  return router;
})();
