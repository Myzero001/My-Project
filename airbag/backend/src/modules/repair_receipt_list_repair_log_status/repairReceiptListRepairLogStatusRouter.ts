import exprss, { Request, Response } from "express";
import {
  handleServiceResponse,
  validateRequest,
} from "@common/utils/httpHandlers";
import { repairReceiptListRepairLogStatusService } from "./repairReceiptListRepairLogStatusService";
import authenticateToken from "@common/middleware/authenticateToken";
import { CreateRepairReceiptListRepairLogStatusSchema } from "./repairReceiptListRepairLogStatusModel";

export const repairReceiptListRepairLogStatusRouter = (() => {
  const router = exprss.Router();

  router.get("/get", 
    authenticateToken,
    async (req: Request, res: Response) => {
    const { company_id } = req.token.payload;
    const ServiceResponse =
      await repairReceiptListRepairLogStatusService.findAll(company_id);
    handleServiceResponse(ServiceResponse, res);
  });

  router.get(
    "/get_by_repair_receipt_id/:id",
    authenticateToken,
    async (req: Request, res: Response) => {
      const id = req.params.id;
      const { company_id } = req.token.payload;
      const ServiceResponse =
        await repairReceiptListRepairLogStatusService.findByRepairReceiptId(id, company_id);
      handleServiceResponse(ServiceResponse, res);
    }
  );

  router.patch(
    "/create",
    authenticateToken,
    validateRequest(CreateRepairReceiptListRepairLogStatusSchema),
    async (req: Request, res: Response) => {
      const { company_id } = req.token.payload;
      const payload = req.body;
      const userId = req.token.payload.uuid;
      const ServiceResponse =
        await repairReceiptListRepairLogStatusService.create(
          payload,
          userId,
          company_id
        );
      handleServiceResponse(ServiceResponse, res);
    }
  );

  return router;
})();
