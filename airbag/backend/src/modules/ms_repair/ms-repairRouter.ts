import express, { Request, Response } from "express";
import {
  handleServiceResponse,
  validateRequest,
} from "@common/utils/httpHandlers";
import { repairService } from "@modules/ms_repair/ms-repairService";
import {
  CreateRepairSchema,
  UpdateRepairSchema,
  GetRepairSchema,
  GetParamRepairSchema,
} from "@modules/ms_repair/ms-repairModel";
import authenticateToken from "@common/middleware/authenticateToken";
import authorizeAll from "@common/middleware/authorizeAll";
import { authorizeByName } from "@common/middleware/permissions";

export const ms_repairRouter = (() => {
  const router = express.Router();

    router.get("/get",
        authenticateToken,
        authorizeByName("รายการซ่อม", ["A"]),
        async (req: Request, res: Response) => {
            try {
                const companyId = req.token.company_id;
                const page = parseInt(req.query.page as string) || 1;
                const pageSize = parseInt(req.query.pageSize as string) || 12;
                const searchText = (req.query.searchText as string) || "";

                const ServiceResponse = await repairService.findAll(companyId, page, pageSize, searchText);
                handleServiceResponse(ServiceResponse, res);
            } catch (error) {
                console.error("Error in GET request:", error);
                res.status(500).json({ status: "error", message: "Internal Server Error" });
            }
        });
  router.get("/get_all", 
    authenticateToken,
    authorizeByName("รายการซ่อมเพิ่มเติม", ["A", "R"]),
    async (req: Request, res: Response) => {
      const { company_id } = req.token.payload;
      const companyId = company_id;
      const ServiceResponse = await repairService.findAllNoPagination(companyId);
      handleServiceResponse(ServiceResponse, res);
  });

  router.post(
    "/create",
    authenticateToken,
    authorizeByName("รายการซ่อม", ["A"]),
    validateRequest(CreateRepairSchema),
    async (req: Request, res: Response) => {
      try {
        const { company_id, uuid } = req.token.payload;
        const companyId = company_id;
        const userId = uuid;
        const payload = req.body;

        const serviceResponse = await repairService.create(
          companyId,
          userId,
          payload
        );
        handleServiceResponse(serviceResponse, res);
      } catch (error) {
        console.error("Error in POST request:", error);
        res
          .status(500)
          .json({ status: "error", message: "Internal Server Error" });
      }
    }
  );

  router.patch(
    "/update",
    authenticateToken,
    authorizeByName("รายการซ่อม", ["A"]),
    validateRequest(UpdateRepairSchema),
    async (req: Request, res: Response) => {
      try {
        const { company_id, uuid } = req.token.payload;
        const companyId = company_id;
        const userId = uuid;
        const { master_repair_id } = req.body;
        const payload = req.body;

        const serviceResponse = await repairService.update(
          companyId,
          userId,
          master_repair_id,
          payload
        );
        handleServiceResponse(serviceResponse, res);
      } catch (error) {
        console.error("Error in PATCH request:", error);
        res
          .status(500)
          .json({ status: "error", message: "Internal Server Error" });
      }
    }
  );

  router.delete(
    "/delete/:master_repair_id",
    authenticateToken,
    authorizeByName("รายการซ่อม", ["A"]),
    validateRequest(GetParamRepairSchema),
    async (req: Request, res: Response) => {
      try {
        const { company_id } = req.token.payload;
        const companyId = company_id;
        const { master_repair_id } = req.params;

        const serviceResponse = await repairService.delete(
          companyId,
          master_repair_id
        );
        handleServiceResponse(serviceResponse, res);
      } catch (error) {
        console.error("Error in DELETE request:", error);
        res
          .status(500)
          .json({ status: "error", message: "Internal Server Error" });
      }
    }
  );

  router.get(
    "/getByID/:master_repair_id",
    authenticateToken,
    authorizeByName("รายการซ่อม", ["A"]),
    validateRequest(GetParamRepairSchema),
    async (req: Request, res: Response) => {
      try {
        const companyId = req.token.company_id;
        const { master_repair_id } = req.params;

        const ServiceResponse = await repairService.findById(
          companyId,
          master_repair_id
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

  // ไม่มีจุด frontend ที่เรียกใช้งาน
  router.get(
    "/get_repair_names",
    authenticateToken,
    authorizeByName("รายการซ่อม", ["A"]),
    async (req: Request, res: Response) => {
      try {
        const companyId = req.token.company_id;
  
        // ดึงข้อมูลจาก Service
        const serviceResponse = await repairService.findRepairNames(companyId);
  
        handleServiceResponse(serviceResponse, res);
      } catch (error) {
        console.error("Error in GET request:", error);
        res.status(500).json({ status: "error", message: "Internal Server Error" });
      }
    }
  );
  

  return router;
})();
