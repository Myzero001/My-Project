import exprss, { Request, Response } from "express";
import {
  handleServiceResponse,
  validateRequest,
} from "@common/utils/httpHandlers";
import { quotationRepairService } from "./quotationRepairService";
import {
  UpdateQuotationSchema,
  CreateQuotationSchema,
  // deleteQuotationRepairSchema,
} from "@modules/quotation/quotationModel";
import authenticateToken from "@common/middleware/authenticateToken";
import { authorizeByName } from "@common/middleware/permissions";

export const quotationRepairRouter = (() => {
  const router = exprss.Router();

  // ไม่ได้ใช้
  router.get("/get", async (req: Request, res: Response) => {
    const ServiceResponse = await quotationRepairService.findAllNoPagination();
    handleServiceResponse(ServiceResponse, res);
  });

  // ไม่จำเป็นต้องใช้ company id เนื่องจาก มี quotation id อยู่แล้ว ที่เป็น key
  router.get("/get_by_quotationid/:id", 
    authenticateToken,
    authorizeByName("ใบเสนอราคาซ่อม",["A", "R"]),
    async (req: Request, res: Response) => {
    const id = req.params.id;
    const ServiceResponse = await quotationRepairService.findByQuotationId(id);
    handleServiceResponse(ServiceResponse, res);
  });

  // ไม่ได้ใช้
  router.get("/get/:id", async (req: Request, res: Response) => {
    const id = req.params.id;
    const ServiceResponse = await quotationRepairService.findById(id);
    handleServiceResponse(ServiceResponse, res);
  });

  // ไม่ได้ใช้
  router.post(
    "/create",
    authenticateToken,
    validateRequest(CreateQuotationSchema),
    async (req: Request, res: Response) => {
      const payload = req.body;
      const ServiceResponse = await quotationRepairService.create(payload);
      handleServiceResponse(ServiceResponse, res);
    }
  );

  // ไม่ได้ใช้
  router.patch(
    "/update/:id",
    validateRequest(UpdateQuotationSchema),
    async (req: Request, res: Response) => {
      const { id } = req.params;
      const payload = req.body;
      const ServiceResponse = await quotationRepairService.update(id, payload);
      handleServiceResponse(ServiceResponse, res);
    }
  );

  // router.delete(
  //   "/delete/:id",
  //   validateRequest(GetParamQuotationSchema),
  //   async (req: Request, res: Response) => {
  //     const { id } = req.params;
  //     const ServiceResponse = await quotationRepairService.delete(id);
  //     handleServiceResponse(ServiceResponse, res);
  //   }
  // );

  // ไม่ได้ใช้
  // router.post(
  //   "/delete",
  //   validateRequest(deleteQuotationRepairSchema),
  //   async (req: Request, res: Response) => {
  //     const { ids } = req.body;
  //     const ServiceResponse = await quotationRepairService.deleteByMultiId(ids);
  //     handleServiceResponse(ServiceResponse, res);
  //   }
  // );

  return router;
})();
