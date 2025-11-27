import express, { Request, Response, Router } from "express";
import {
  handleServiceResponse,
  validateRequest,
} from "@common/utils/httpHandlers";
import { toolService } from "@modules/tool/toolService";
import {
  CreatetoolSchema,
  GetCategorySchema,
  UpdateCategorySchema,
  SelectSchema
} from "@modules/tool/toolModel";
import authenticateToken from "@common/middleware/authenticateToken";
import authorizeAll from "@common/middleware/authorizeAll";
import {authorizeByName} from "@common/middleware/permissions";
export const toolRouter = (() => {
  const router = express.Router();

  router.get(
    "/get",
    authenticateToken,
    authorizeByName("เครื่องมือ", ["A"]),
    async (req: Request, res: Response) => {
      try {
        const page = parseInt(req.query.page as string) || 1;
        const pageSize = parseInt(req.query.pageSize as string) || 12;
        const companyId = req.token.company_id;
        const searchText = (req.query.searchText as string) || "";
        const ServiceResponse = await toolService.findAll(
          companyId,
          page,
          pageSize,
          searchText
        );
        handleServiceResponse(ServiceResponse, res);
      } catch (error) {
        console.error("Error in GET request:", error);
        res
          .status(500)
          .json({ status: "error", message: "Internal Server Error" });
      }
    }
  );

  router.get("/get_all",
    authenticateToken,
    authorizeByName("เครื่องมือ", ["A"]), 
    async (req: Request, res: Response) => {
      const { company_id } = req.token.payload;
      const ServiceResponse = await toolService.findAllNoPagination(company_id);
    
      handleServiceResponse(ServiceResponse, res); //create by kanyarat
  });

  router.post(
    "/create",
    authenticateToken,
    authorizeByName("เครื่องมือ", ["A"]),
    validateRequest(CreatetoolSchema),
    async (req: Request, res: Response) => {
      try {
        const { company_id, uuid } = req.token.payload;
        const companyId = company_id;
        const userId = uuid;
        const payload = req.body;
        const ServiceResponse = await toolService.create(
          companyId,
          userId,
          payload
        );
        handleServiceResponse(ServiceResponse, res);
      } catch (error) {
        console.error("Error in POST request:", error);
        res
          .status(500)
          .json({ status: "error", message: "Internal Server Error" });
      }
    }
  );

  router.delete(
    "/delete/:tool_id",
    authenticateToken,
    authorizeByName("เครื่องมือ", ["A"]),
    validateRequest(GetCategorySchema),
    async (req: Request, res: Response) => {
      try {
        const { company_id } = req.token.payload;
        const companyId = company_id;
        const { tool_id } = req.params;

        const ServiceResponse = await toolService.delete(companyId, tool_id);
        handleServiceResponse(ServiceResponse, res);
      } catch (error) {
        console.error("Error in DELETE request:", error);
        res
          .status(500)
          .json({ status: "error", message: "Internal Server Error" });
      }
    }
  );

  router.patch(
    "/update/:tool_id",
    authenticateToken,
    authorizeByName("เครื่องมือ", ["A"]),
    validateRequest(UpdateCategorySchema),
    async (req: Request, res: Response) => {
      try {
        const { company_id, uuid } = req.token.payload;
        const companyId = company_id;
        const userId = uuid;
        const { tool_id } = req.params;
        const payload = req.body;

        const ServiceResponse = await toolService.update(
          tool_id,
          payload,
          companyId,
          userId
        );
        handleServiceResponse(ServiceResponse, res);
      } catch (error) {
        console.error("Error in PATCH request:", error);
        res
          .status(500)
          .json({ status: "error", message: "Internal Server Error" });
      }
    }
  );

  router.get(
    "/get/:tool_id",
    authenticateToken,
    authorizeByName("เครื่องมือ", ["A"]),
    validateRequest(GetCategorySchema),
    async (req: Request, res: Response) => {
      const { tool_id } = req.params;
      const ServiceResponse = await toolService.search(tool_id);
      handleServiceResponse(ServiceResponse, res);
    }
  );

  router.get("/select",
    authenticateToken,
    authorizeByName("สี", ["A", "R"]),
    validateRequest(SelectSchema),
    async (req: Request, res: Response) => {
      const { company_id } = req.token.payload;
      const searchText = (req.query.searchText as string) || "";
      const companyId = company_id;
      const ServiceResponse = await toolService.select(companyId, searchText);
      handleServiceResponse(ServiceResponse, res);
    }
  );

  return router;
})();
