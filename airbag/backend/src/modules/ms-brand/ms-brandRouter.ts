import express, { Request, Response } from "express";
import {
  handleServiceResponse,
  validateRequest,
} from "@common/utils/httpHandlers";
import { brandService } from "@modules/ms-brand/ms-brandService";
import {
  CreateBrandSchema,
  UpdateBrandSchema,
  GetBrandSchema,
  GetParamBrandSchema,
  SelectSchema
} from "@modules/ms-brand/ms-brandModel";
import authenticateToken from "@common/middleware/authenticateToken";
import { authorizeByName } from "@common/middleware/permissions";

export const brandRouter = (() => {
  const router = express.Router();

    router.get("/get", 
        authenticateToken, 
        authorizeByName("แบรนด์", ["A"]),
        async (req: Request, res: Response) => {
            const companyId = req.token.company_id;
            const page = parseInt(req.query.page as string) || 1;
            const pageSize = parseInt(req.query.pageSize as string) || 12;
            const searchText = (req.query.searchText as string) || "";
            const ServiceResponse = await brandService.findAll(companyId, page, pageSize,searchText);
            handleServiceResponse(ServiceResponse, res);
        }
  );

  router.get("/get_all", 
    authenticateToken, 
    authorizeByName("แบรนด์เพิ่มเติม", ["A", "R"]),
    async (req: Request, res: Response) => {
      const { company_id } = req.token.payload;
      const companyId = company_id;
      const ServiceResponse = await brandService.findAllNoPagination(companyId);
      handleServiceResponse(ServiceResponse, res);
  });

  router.post(
    "/create",
    authenticateToken,
    authorizeByName("แบรนด์", ["A"]),
    validateRequest(CreateBrandSchema),
    async (req: Request, res: Response) => {
      const { company_id, uuid } = req.token.payload;
      const companyId = company_id;
      const userId = uuid;
      const payload = req.body;
      const ServiceResponse = await brandService.create(
        companyId,
        userId,
        payload
      );
      handleServiceResponse(ServiceResponse, res);
    }
  );

  router.patch(
    "/update",
    authenticateToken,
    authorizeByName("แบรนด์", ["A"]),
    validateRequest(UpdateBrandSchema),
    async (req: Request, res: Response) => {
      const { company_id, uuid } = req.token.payload;
      const companyId = company_id;
      const userId = uuid;
      const { master_brand_id } = req.body;
      const payload = req.body;

      const ServiceResponse = await brandService.update(
        companyId,
        userId,
        master_brand_id,
        payload
      );
      handleServiceResponse(ServiceResponse, res);
    }
  );

  router.delete(
    "/delete/:master_brand_id",
    authenticateToken,
    authorizeByName("แบรนด์", ["A"]),
    validateRequest(GetParamBrandSchema),
    async (req: Request, res: Response) => {
      const { company_id } = req.token.payload;
      const companyId = company_id;
      const { master_brand_id } = req.params;

      const ServiceResponse = await brandService.delete(
        companyId,
        master_brand_id
      );
      handleServiceResponse(ServiceResponse, res);
    }
  );

  router.get(
    "/get/:master_brand_id",
    authenticateToken,
    authorizeByName("แบรนด์", ["A"]),
    validateRequest(GetParamBrandSchema),
    async (req: Request, res: Response) => {
      const { company_id } = req.token.payload;
      const companyId = company_id;
      const { master_brand_id } = req.params;

      const ServiceResponse = await brandService.findById(
        companyId,
        master_brand_id
      );
      handleServiceResponse(ServiceResponse, res);
    }
  );

  router.get(
    "/get-minimal",
    authenticateToken,
    authorizeByName("แบรนด์", ["A"]),
    async (req: Request, res: Response) => {
      const companyId = req.token.company_id;

      const ServiceResponse = await brandService.findMinimal(companyId);
      handleServiceResponse(ServiceResponse, res);
    }
  );
  router.get("/select",
    authenticateToken,
    authorizeByName("แบรนด์", ["A", "R"]),
    validateRequest(SelectSchema),
    async (req: Request, res: Response) => {
      const { company_id } = req.token.payload;
      const searchText = (req.query.searchText as string) || "";
      const companyId = company_id;
      const ServiceResponse = await brandService.select(companyId, searchText);
      handleServiceResponse(ServiceResponse, res);
    }
  );

  return router;
})();
