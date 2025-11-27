import express, { Request, Response } from "express";
import {
  CreateResponsiblePersonSchema,
  UpdateResponsiblePersonSchema,
  GetParamResponsiblePersonSchema,
  ResponsiblePersonType as AppResponsiblePersonType
} from "./responsiblePersonModel";
import { responsiblePersonService } from "./responsiblePersonService";
import { handleServiceResponse, validateRequest } from "@common/utils/httpHandlers";
import authenticateToken from "@common/middleware/authenticateToken";
import authorizeAll from "@common/middleware/authorizeAll";
import { ResponsiblePersonType } from "@prisma/client";
import { authorizeByName } from "@common/middleware/permissions";

export const responsiblePersonRouter = (() => {
  const router = express.Router();

  router.get("/get",
    authenticateToken,
    authorizeByName("เปลี่ยนผู้รับผิดชอบ", ["A"]),
    async (req: Request, res: Response) => {
    const { company_id } = req.token.payload;
    const page = parseInt(req.query.page as string) || 1;
    const pageSize = parseInt(req.query.pageSize as string) || 12;

    const response = await responsiblePersonService.findAll(company_id, page, pageSize);
    handleServiceResponse(response, res);
  });

  router.get("/types",
    authenticateToken,
    authorizeByName("เปลี่ยนผู้รับผิดชอบ", ["A"]),
    async (req: Request, res: Response) => {
    const response = await responsiblePersonService.getResponsiblePersonsTypes();
    handleServiceResponse(response, res);
  });

  router.get("/get/:log_id",
    authenticateToken,
    authorizeByName("เปลี่ยนผู้รับผิดชอบ", ["A"]),
    validateRequest(GetParamResponsiblePersonSchema), async (req: Request, res: Response) => {
    const { company_id } = req.token.payload;
    const { log_id } = req.params;

    const response = await responsiblePersonService.findById(company_id, log_id);
    handleServiceResponse(response, res);
  });

  router.post(
    "/create",
    authenticateToken,
    authorizeByName("เปลี่ยนผู้รับผิดชอบ", ["A"]),
    validateRequest(CreateResponsiblePersonSchema),
    async (req: Request, res: Response) => {
      const { company_id, uuid } = req.token.payload;
      const payload = req.body;

      const response = await responsiblePersonService.create(company_id, uuid, payload);
      handleServiceResponse(response, res);
    }
  );

  router.patch("/update",
    authenticateToken,
    authorizeByName("เปลี่ยนผู้รับผิดชอบ", ["A"]),
    validateRequest(UpdateResponsiblePersonSchema),
    async (req: Request, res: Response) => {
    const { company_id } = req.token.payload;
    const { log_id, ...updatePayload } = req.body;

    const response = await responsiblePersonService.update(company_id, log_id, updatePayload);
    handleServiceResponse(response, res);
  });

  router.delete("/delete/:log_id",
    authenticateToken,
    authorizeByName("เปลี่ยนผู้รับผิดชอบ", ["A"]),
    validateRequest(GetParamResponsiblePersonSchema), async (req: Request, res: Response) => {
    const { company_id } = req.token.payload;
    const { log_id } = req.params;

    const response = await responsiblePersonService.delete(company_id, log_id);
    handleServiceResponse(response, res);
  });

  return router;
})();