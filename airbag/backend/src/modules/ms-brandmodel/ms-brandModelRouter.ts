import express, { Request, Response } from "express";
import {
  handleServiceResponse,
  validateRequest,
} from "@common/utils/httpHandlers";
import {
  CreateBrandModelSchema,
  UpdateBrandModelSchema,
  GetParamBrandModelSchema,
  FindByBrandSchema,
  SelectSchema
} from "@modules/ms-brandmodel/ms-brand-Model";
import { brandModelService } from "@modules/ms-brandmodel/ms-brandModelService";
import authenticateToken from "@common/middleware/authenticateToken";
import { authorizeByName } from "@common/middleware/permissions";

export const brandModelRouter = (() => {
  const router = express.Router();

  router.get(
    "/get",
    authenticateToken,
    authorizeByName("รุ่นรถ", ["A"]),
    async (req: Request, res: Response) => {
      const { company_id } = req.token.payload;
      const companyId = company_id;
      const page = parseInt(req.query.page as string) || 1;
      const pageSize = parseInt(req.query.pageSize as string) || 12;
      const searchText = (req.query.searchText as string) || "";
      const ServiceResponse = await brandModelService.findAll(companyId, page, pageSize,searchText);
      handleServiceResponse(ServiceResponse, res);
    }
  );

  router.get("/get_all", 
    authenticateToken,
    authorizeByName("รุ่นรถเพิ่มเติม", ["A", "R"]),
    async (req: Request, res: Response) => {
      const { company_id } = req.token.payload;
      const companyId = company_id;
    const ServiceResponse = await brandModelService.findAllNoPagination(companyId);
    handleServiceResponse(ServiceResponse, res);
  });

  router.get(
    "/get-by-brand/:master_brand_id",
    authenticateToken,
    authorizeByName("รุ่นรถ", ["A", "R"]),
    validateRequest(FindByBrandSchema),
    async (req: Request, res: Response) => {
      const { company_id } = req.token.payload;
      const companyId = company_id;
      const { master_brand_id } = req.params;

      const ServiceResponse = await brandModelService.findByBrand(
        companyId,
        master_brand_id
      );
      handleServiceResponse(ServiceResponse, res);
    }
  );

  router.post(
    "/create",
    authenticateToken,
    authorizeByName("รุ่นรถ", ["A"]),
    validateRequest(CreateBrandModelSchema),
    async (req: Request, res: Response) => {
      const { company_id, uuid } = req.token.payload;
      const companyId = company_id;
      const userId = uuid;
      const payload = req.body;
      const ServiceResponse = await brandModelService.create(
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
    authorizeByName("รุ่นรถ", ["A"]),
    validateRequest(UpdateBrandModelSchema),
    async (req: Request, res: Response) => {
      const { company_id, uuid } = req.token.payload;
      const companyId = company_id;
      const userId = uuid;
      const { ms_brandmodel_id } = req.body;
      const payload = req.body;
      const ServiceResponse = await brandModelService.update(
        companyId,
        userId,
        ms_brandmodel_id,
        payload
      );
      handleServiceResponse(ServiceResponse, res);
    }
  );

  router.delete(
    "/delete/:ms_brandmodel_id",
    authenticateToken,
    authorizeByName("รุ่นรถ", ["A"]),
    validateRequest(GetParamBrandModelSchema),
    async (req: Request, res: Response) => {
      const { company_id } = req.token.payload;
      const companyId = company_id;
      const { ms_brandmodel_id } = req.params;
      const ServiceResponse = await brandModelService.delete(
        companyId,
        ms_brandmodel_id
      );
      handleServiceResponse(ServiceResponse, res);
    }
  );

  router.get(
    "/get/:ms_brandmodel_id",
    authenticateToken,
    authorizeByName("รุ่นรถ", ["A"]),
    validateRequest(GetParamBrandModelSchema),
    async (req: Request, res: Response) => {
      const { company_id } = req.token.payload;
      const companyId = company_id;
      const { ms_brandmodel_id } = req.params;
      const ServiceResponse = await brandModelService.findById(
        companyId,
        ms_brandmodel_id
      );
      handleServiceResponse(ServiceResponse, res);
    }
  );

  router.get("/select/:brand_id",
    authenticateToken,
    authorizeByName("รุ่นรถ", ["A", "R"]),
    validateRequest(SelectSchema),
    async (req: Request, res: Response) => {
      const { company_id } = req.token.payload;
      const searchText = (req.query.searchText as string) || "";
      const companyId = company_id;
      const brand_id = req.params.brand_id;
      const ServiceResponse = await brandModelService.select(companyId , brand_id , searchText);
      handleServiceResponse(ServiceResponse, res);
    }
  );

  return router;
})();
