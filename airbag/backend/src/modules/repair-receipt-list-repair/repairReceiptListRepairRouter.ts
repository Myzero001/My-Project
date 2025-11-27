import exprss, { Request, Response } from "express";
import {
  handleServiceResponse,
  validateRequest,
} from "@common/utils/httpHandlers";

import authenticateToken from "@common/middleware/authenticateToken";
import authorizeAll from "@common/middleware/authorizeAll";
import { repairReceiptListRepairService } from "./repairReceiptListRepairService";
import {
  CreateRepairReceiptListRepairSchema,
  DeleteRepairReceiptListRepairBarcodeSchema,
  UpdateRepairReceiptListRepairBarcodeSchema,
  UpdateRepairReceiptListRepairSchema,
  UpdateRepairReceiptListRepairStatusIsActiveSchema,
} from "./repairReceiptListRepairModel";
import { authorizeByName } from "@common/middleware/permissions";

export const repairReceiptListRepairRouter = (() => {
  const router = exprss.Router();

  // ไม่เจอจุดใช้
  router.get("/get", async (req: Request, res: Response) => {
    const { company_id } = req.token.payload;
    const ServiceResponse =
      await repairReceiptListRepairService.findAllNoPagination(company_id);
    handleServiceResponse(ServiceResponse, res);
  });

  router.get(
    "/get_by_repair_receipt_id/:id",
    authenticateToken,
    async (req: Request, res: Response) => {
      const { company_id } = req.token.payload;
      const { id } = req.params;
      const ServiceResponse =
        await repairReceiptListRepairService.findByRepairReceiptId(id, company_id);
      handleServiceResponse(ServiceResponse, res);
    }
  );

  router.get(
    "/get_by_repair_receipt_id_active/:id",
    authenticateToken,
    async (req: Request, res: Response) => {
      const { company_id } = req.token.payload;
      const { id } = req.params;
      const ServiceResponse =
        await repairReceiptListRepairService.findByRepairReceiptIdActive(id, company_id);
      handleServiceResponse(ServiceResponse, res);
    }
  );


  
  router.get("/get/:id",
    authenticateToken,
    async (req: Request, res: Response) => {
    const id = req.params.id;
    const ServiceResponse = await repairReceiptListRepairService.findById(id);
    handleServiceResponse(ServiceResponse, res);
  });

  router.post(
    "/create",
    authenticateToken,
    validateRequest(CreateRepairReceiptListRepairSchema),
    async (req: Request, res: Response) => {
      const payload = req.body;
      const { company_id } = req.token.payload;
      const userId = req.token.payload.uuid;

      const ServiceResponse = await repairReceiptListRepairService.create(
        payload,
        company_id,
        userId
      );
      handleServiceResponse(ServiceResponse, res);
    }
  );

  router.patch(
    "/update/:id",
    authenticateToken,
    validateRequest(UpdateRepairReceiptListRepairSchema),
    async (req: Request, res: Response) => {
      const { id } = req.params;
      const payload = req.body;
      const ServiceResponse = await repairReceiptListRepairService.update(
        id,
        payload
      );
      handleServiceResponse(ServiceResponse, res);
    }
  );

  router.patch(
    "/",
    authenticateToken,
    validateRequest(UpdateRepairReceiptListRepairStatusIsActiveSchema),
    async (req: Request, res: Response) => {
      const { company_id } = req.token.payload;
      const { id } = req.body;
      const payload = req.body;
      const userId = req.token.payload.uuid;

      const ServiceResponse =
        await repairReceiptListRepairService.updateStatusIsActive(
          id,
          payload,
          company_id,
          userId
        );
      handleServiceResponse(ServiceResponse, res);
    }
  );

  // router.delete(
  //   "/delete/:id",
  //   validateRequest(GetParamQuotationSchema),
  //   async (req: Request, res: Response) => {
  //     const { id } = req.params;
  //     const ServiceResponse = await repairReceiptListRepairService.delete(id);
  //     handleServiceResponse(ServiceResponse, res);
  //   }
  // );

  router.post(
    "/delete",
    authenticateToken,
    validateRequest(DeleteRepairReceiptListRepairBarcodeSchema),
    async (req: Request, res: Response) => {
      const { ids } = req.body;
      const ServiceResponse =
        await repairReceiptListRepairService.deleteByMultiId(ids);
      handleServiceResponse(ServiceResponse, res);
    }
  );

  router.patch(
    "/update-checked-box-status",
    authenticateToken,
    authorizeAll,
    async (req: Request, res: Response) => {
      const { uuid } = req.token.payload;
      const { id, statusDate } = req.body;

      const ServiceResponse =
        await repairReceiptListRepairService.updateStatusCheckedBox(
          id,
          statusDate,
          uuid
        );
      handleServiceResponse(ServiceResponse, res);
    }
  );

  router.patch(
    "/update-uncheck-box-status",
    authenticateToken,
    authorizeAll,
    async (req: Request, res: Response) => {
      const { uuid } = req.token.payload;
      const { id } = req.body;

      const ServiceResponse =
        await repairReceiptListRepairService.updateStatusUnCheckedBox(id, uuid);
      handleServiceResponse(ServiceResponse, res);
    }
  );

  router.patch(
    "/update_status_is_active",
    authenticateToken,
    authorizeByName("ใบรับซ่อมหน้าการชำระเงิน", ["A"]),
    async (req: Request, res: Response) => {
      const { id } = req.body;
      const payload = req.body;
      const { company_id } = req.token.payload;
      const userId = req.token.payload.uuid;

      const ServiceResponse =
        await repairReceiptListRepairService.updateStatusIsActive(
          id,
          payload,
          company_id,
          userId
        );
      handleServiceResponse(ServiceResponse, res);
    }
  );

  return router;
})();
