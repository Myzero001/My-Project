import express, { Request, Response } from "express";
import { handleServiceResponse, validateRequest } from "@common/utils/httpHandlers";
import authenticateToken from "@common/middleware/authenticateToken";
import authorizeAll  from "@common/middleware/authorizeAll";
import { CompaniesService } from "./ms_companireService";
import {CreateCompaniesSchema,UpdateCompaniesSchema,GetCompaniesSchema} from "./ms_companiesModel";
import { authorizeByName } from "@common/middleware/permissions";


export const ms_companiesModelRouter = (() => {

    const router = express.Router();
    router.get("/get",
        authenticateToken,
        authorizeByName("จัดการสาขา", ["A"]),
        async (req: Request, res: Response) => {
            const page = parseInt(req.query.page as string) || 1;
            const pageSize = parseInt(req.query.pageSize as string) || 12;
            const companyId = req.token.company_id; // ดึง companyId จาก token
            const searchText = (req.query.searchText as string) || ""; // ใช้ค่า query จาก client
    
            const ServiceResponse = await CompaniesService.findAll(companyId, page, pageSize, searchText);
            handleServiceResponse(ServiceResponse, res);
        }
    );
    

    router.post(
        "/create",
        authenticateToken,
        authorizeByName("จัดการสาขา", ["A"]),
        validateRequest(CreateCompaniesSchema),
        async (req: Request, res: Response) => {
            try {
                // ดึงข้อมูล userId จาก token
                const { company_id, uuid } = req.token.payload;
                const companyId = company_id;
                const userId = uuid;
                const payload = req.body;
                // เรียก Service เพื่อสร้าง company โดยไม่ต้องส่ง created_by
                const ServiceResponse = await CompaniesService.create(companyId,userId, payload);
                handleServiceResponse(ServiceResponse, res);
            } catch (error) {
                console.error(`Error in POST /create: ${error}`);
                res.status(500).json({ status: "error", message: "Internal Server Error" });
            }
        }
    );
    
    
    
    

    router.patch("/update/:company_id",
        authenticateToken,
        authorizeByName("จัดการสาขาแก้ไข", ["A", "R"]),
        validateRequest(UpdateCompaniesSchema),
        async (req: Request, res: Response) => {
            try {
                const { uuid } = req.token.payload;
                const company_id = req.params.company_id as string; // แปลงเป็น string
                const userId = uuid;
                const payload = req.body;
    
                const ServiceResponse = await CompaniesService.update(company_id, userId, payload);
                handleServiceResponse(ServiceResponse, res);
            } catch (error) {
                console.error(`Error in PATCH request: ${error}`);
                res.status(500).json({ status: "error", message: "Internal Server Error" });
            }
        }
    );

    router.delete("/delete/:company_id",
        authenticateToken,
        authorizeByName("จัดการสาขา", ["A"]),
        validateRequest(GetCompaniesSchema),
        async (req: Request, res: Response) => {
            try {
                const { uuid } = req.token.payload;
                const userId = uuid;
                const company_id = req.params.company_id; // แปลงเป็น string
    
                const ServiceResponse = await CompaniesService.delete(userId, company_id);
                handleServiceResponse(ServiceResponse, res);
            } catch (error) {
                console.error(`Error in DELETE request: ${error}`);
                res.status(500).json({ status: "error", message: "Internal Server Error" });
            }
        }
    );

    router.get(
        "/get/:company_id",
        authenticateToken,
        authorizeByName("จัดการสาขาแก้ไข", ["A"]),
        validateRequest(GetCompaniesSchema),
        async (req: Request, res: Response) => {
          try {
            const { company_id } = req.params;
            const companyId = company_id;
            const ServiceResponse = await CompaniesService.findById(
              companyId,
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


    return router;
})();

