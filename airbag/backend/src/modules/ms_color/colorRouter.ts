import express, { Request, Response } from "express";
import {
  handleServiceResponse,
  validateRequest,
} from "@common/utils/httpHandlers";
import { authorizeByName } from "@common/middleware/permissions";
import { colorService } from "./colorService";
import {
  CreateColorSchema,
  GetColorSchema,
  deleteColorSchema,
  UpdateColorSchema,
  SelectSchema
} from "./colorModel";
import authenticateToken from "@common/middleware/authenticateToken";
import authorizeAll from "@common/middleware/authorizeAll";

export const colorRouter = (() => {
  const router = express.Router();

  router.get("/get",
    authenticateToken,
    authorizeByName("สี", ["A"]), 
    async (req: Request, res: Response) => {
      try{
          const page = parseInt(req.query.page as string) || 1;
          const pageSize = parseInt(req.query.pageSize as string) || 12;
          const companyId = req.token.company_id;
          const searchText = (req.query.searchText as string) || "";
          const ServiceResponse = await colorService.findAll(companyId, page, pageSize,searchText);
          handleServiceResponse(ServiceResponse, res);
      }catch (error) {
        console.error("Error in GET request:", error);
        res
          .status(500)
          .json({ status: "error", message: "Internal Server Error" });
      }
    }
  );

  router.get("/get_all", 
    authenticateToken,
    authorizeByName("สีเพิ่มเติม", ["A", "R"]), 
    async (req: Request, res: Response) => {
      const { company_id,  } = req.token.payload;
      const companyId = company_id;
      const ServiceResponse = await colorService.findAllNoPagination(companyId);
    handleServiceResponse(ServiceResponse, res);
  });

  router.post(
    "/create",
    authenticateToken,
    authorizeByName("สี", ["A"]), 
    validateRequest(CreateColorSchema),
    async (req: Request, res: Response) => {
      try {
        const { company_id, uuid } = req.token.payload;
        const companyId = company_id;
        const userId = uuid;
        const payload = req.body;
        const ServiceResponse = await colorService.create(
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

  router.patch(
    "/update/:color_id",
    authenticateToken,
    authorizeByName("สี", ["A"]), 
    validateRequest(UpdateColorSchema),
    async (req: Request, res: Response) => {
      try {
        const { company_id, uuid } = req.token.payload;
        const companyId = company_id;
        const userId = uuid;
        const { color_id } = req.params;
        const payload = req.body;
        const ServiceResponse = await colorService.update(
          color_id,
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

  //
  router.delete(
    "/delete/:color_id",
    authenticateToken,
    authorizeByName("สี", ["A"]), 
    validateRequest(deleteColorSchema),
    async (req: Request, res: Response) => {
      try {
        const { company_id } = req.token.payload; // ดึง company_id จาก token
        const { color_id } = req.params;

        const ServiceResponse = await colorService.delete(company_id, color_id); // ส่ง company_id และ color_id
        handleServiceResponse(ServiceResponse, res);
      } catch (error) {
        console.error("Error in DELETE request:", error);
        res
          .status(500)
          .json({ status: "error", message: "Internal Server Error" });
      }
    }
  );


  

  router.get("/get/:color_name", 
    authenticateToken,
    authorizeByName("สี", ["A"]),
    validateRequest(GetColorSchema),
    async (req: Request, res: Response) => {
    try{
      const { company_id,  } = req.token.payload;
      const companyId = company_id;
      const { color_id } = req.params; // รับ query จาก params
    const ServiceResponse = await colorService.search(color_id, companyId);
    handleServiceResponse(ServiceResponse, res);
    }
    catch (error) {
      console.error("Error in GET request:", error);
      res
        .status(500)
        .json({ status: "error", message: "Internal Server Error" });
    }
  });

  router.get("/select",
    authenticateToken,
    authorizeByName("สี", ["A", "R"]),
    validateRequest(SelectSchema),
    async (req: Request, res: Response) => {
      const { company_id } = req.token.payload;
      const searchText = (req.query.searchText as string) || "";
      const companyId = company_id;
      const ServiceResponse = await colorService.select(companyId, searchText);
      handleServiceResponse(ServiceResponse, res);
    }
  );

  return router;
})();
