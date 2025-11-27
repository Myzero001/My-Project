import express, { Request, response, Response } from "express";
import {
  handleServiceResponse,
  validateRequest,
} from "@common/utils/httpHandlers";
import authenticateToken from "@common/middleware/authenticateToken";
import authorizeAll from "@common/middleware/authorizeAll";
import {
  CreateCelarBySchema,
  UpdateCelarBySchema,
  GetClearBySchema,
  GetParamClearBySchema,
  SelectSchema
} from "@modules/master_clear_by/ms-clear-by-reasonModel";
import { clearByReasonService } from "@modules/master_clear_by/ms-clear-by-resonService";
import { authorizeByName } from "@common/middleware/permissions";
export const clearByReasonRouter = (() => {
  const router = express.Router();

  //test
  router.get("/test", (req, res) => {
    res.json({ message: "Hello World!" });
  });

  router.get(
    "/get",
    authenticateToken,
    authorizeByName("clearby", ["A"]),
    async (req: Request, res: Response) => {
      try {
        const page = parseInt(req.query.page as string) || 1;
        const pageSize = parseInt(req.query.pageSize as string) || 12;
        const companyId = req.token.company_id;
        const searchText = (req.query.searchText as string) || "";
        const ServiceResponse = await clearByReasonService.findAll(
          companyId,
          page,
          pageSize,
          searchText
        );
        handleServiceResponse(ServiceResponse, res);
      } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
      }
    }
  );

  router.get("/get_all", async (_req: Request, res: Response) => {
    const ServiceResponse = await clearByReasonService.findAllNoPagination();
    handleServiceResponse(ServiceResponse, res);
  });

  router.post(
    "/create",
    authenticateToken,
    authorizeByName("clearby", ["A"]),
    validateRequest(CreateCelarBySchema),
    async (req: Request, res: Response) => {
      try {
        const { company_id, uuid } = req.token.payload;
        const payload = req.body;
        const ServiceResponse = await clearByReasonService.create(
          company_id,
          uuid,
          payload
        );
        handleServiceResponse(ServiceResponse, res);
      } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
      }
    }
  );

  router.patch(
    "/update",
    authenticateToken,
    authorizeByName("clearby", ["A"]),
    validateRequest(UpdateCelarBySchema),
    async (req: Request, res: Response) => {
      try {
        const { company_id, uuid } = req.token.payload;
        const { clear_by_id } = req.body;
        const payload = req.body;
        const ServiceResponse = await clearByReasonService.update(
          company_id,
          uuid,
          clear_by_id,
          payload
        );
        handleServiceResponse(ServiceResponse, res);
      } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
      }
    }
  );

  router.delete(
    "/delete/:clear_by_id",
    authenticateToken,
    authorizeByName("clearby", ["A"]),
    validateRequest(GetParamClearBySchema),
    async (req: Request, res: Response) => {
      try {
        const { company_id} = req.token.payload;
        const { clear_by_id } = req.params;
        const ServiceResponse = await clearByReasonService.delete(
          company_id,
          clear_by_id
        );
        handleServiceResponse(ServiceResponse, res);
      } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
      }
    }
  );

  router.get(
    "/get/:clear_by_id",
    authenticateToken,
    authorizeByName("clearby", ["A"]),
    validateRequest(GetParamClearBySchema),
    async (req: Request, res: Response) => {
      try {
        const { company_id } = req.token.payload;
        const { clear_by_id } = req.params;
        const ServiceResponse = await clearByReasonService.findById(
          company_id,
          clear_by_id
        );
        handleServiceResponse(ServiceResponse, res);
      } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
      }
    }
  );

  router.get("/select",
    authenticateToken,
    authorizeByName("clearby", ["A", "R"]),
    validateRequest(SelectSchema),
    async (req: Request, res: Response) => {
      const { company_id } = req.token.payload;
      const searchText = (req.query.searchText as string) || "";
      const companyId = company_id;
      const ServiceResponse = await clearByReasonService.select(companyId, searchText);
      handleServiceResponse(ServiceResponse, res);
    }
  );

  return router;
})();
