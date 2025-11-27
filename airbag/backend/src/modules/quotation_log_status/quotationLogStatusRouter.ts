import exprss, { Request, Response } from "express";
import { handleServiceResponse } from "@common/utils/httpHandlers";
import { quotationLogStatusService } from "./quotationLogStatusService";
import authenticateToken from "@common/middleware/authenticateToken";
import { authorizeByName } from "@common/middleware/permissions";

export const quotationLogStatusRouter = (() => {
  const router = exprss.Router();

  router.get("/get", 
    authenticateToken,
    authorizeByName("ใบเสนอราคา", ["A", "R"]),
    async (req: Request, res: Response) => {
      const { company_id } = req.token.payload;
    const ServiceResponse = await quotationLogStatusService.findAll(company_id);
    handleServiceResponse(ServiceResponse, res);
  });

  router.get(
    "/get_by_quotation_id/:id",
    authenticateToken,
    authorizeByName("ใบเสนอราคา", ["A", "R"]),
    async (req: Request, res: Response) => {
      const { company_id } = req.token.payload;
      const id = req.params.id;
      const ServiceResponse =
        await quotationLogStatusService.findByQuotationId(id, company_id);
      handleServiceResponse(ServiceResponse, res);
    }
  );

  return router;
})();
