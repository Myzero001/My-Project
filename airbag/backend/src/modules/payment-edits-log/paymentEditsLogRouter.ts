import exprss, { Request, Response } from "express";
import { handleServiceResponse } from "@common/utils/httpHandlers";
import { paymentEditsLogService } from "./paymentEditsLogService";
import authenticateToken from "@common/middleware/authenticateToken";
import { authorizeByName } from "@common/middleware/permissions";

export const repairReceiptListRepairLogStatusRouter = (() => {
  const router = exprss.Router();

  router.get(
    "/get",
    authenticateToken,
    authorizeByName("การชำระเงิน", ["A", "R"]),
    async (req: Request, res: Response) => {
      const ServiceResponse = await paymentEditsLogService.findAll();
      handleServiceResponse(ServiceResponse, res);
    }
  );

  router.get(
    "/get_by_payment_id/:id",
    authenticateToken,
    authorizeByName("การชำระเงิน", ["A", "R"]),
    async (req: Request, res: Response) => {
      const id = req.params.id;
      const ServiceResponse = await paymentEditsLogService.findByPaymentId(id);
      handleServiceResponse(ServiceResponse, res);
    }
  );

  return router;
})();
