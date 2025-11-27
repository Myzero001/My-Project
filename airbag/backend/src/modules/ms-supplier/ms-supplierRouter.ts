import exprss, { Request, Response } from "express";
import { handleServiceResponse, validateRequest } from "@common/utils/httpHandlers";
import { supplierService } from "@modules/ms-supplier/ms-supplierService";
import { CreateMasterSupplierSchema, UpdateMasterSupplierSchema, GetParamMasterSupplierSchema , SelectSchema } from "@modules/ms-supplier/ms-supplierModel";
import authenticateToken from "@common/middleware/authenticateToken";
import authorizeAll from "@common/middleware/authorizeAll";
import { authorizeByName } from "@common/middleware/permissions";

export const msSupplierRouter = (() => {
    const router = exprss.Router();

    router.get("/get",
        authenticateToken,
        authorizeByName("ร้านค้า", ["A"]),
        async (req: Request, res: Response) => {
            try {
                const companyId = req.token.company_id;
                const page = parseInt(req.query.page as string) || 1;
                const pageSize = parseInt(req.query.pageSize as string) || 12;
                const searchText = (req.query.searchText as string) || "";

                const ServiceResponse = await supplierService.findAll(companyId, page, pageSize, searchText);
                handleServiceResponse(ServiceResponse, res);
            } catch (error) {
                console.error("Error in GET request:", error);
                res.status(500).json({ status: "error", message: "Internal Server Error" });
            }
        });

    router.post("/create",
        authenticateToken,
        authorizeByName("ร้านค้า", ["A"]),
        validateRequest(CreateMasterSupplierSchema),
        async (req: Request, res: Response) => {
            try {
                const { company_id, uuid } = req.token.payload;
                const companyId = company_id;
                const userId = uuid;
                const payload = req.body;

                const ServiceResponse = await supplierService.create(companyId, userId, payload);
                handleServiceResponse(ServiceResponse, res);
            } catch (error) {
                console.error("Error in POST request:", error);
                res.status(500).json({ status: "error", message: "Internal Server Error" });
            }
        });

    router.patch("/update",
        authenticateToken,
        authorizeByName("ร้านค้า", ["A"]),
        validateRequest(UpdateMasterSupplierSchema),
        async (req: Request, res: Response) => {
            try {
                const { company_id, uuid } = req.token.payload;
                const companyId = company_id;
                const userId = uuid;
                const { supplier_id } = req.body;
                const payload = req.body;
                const ServiceResponse = await supplierService.update(companyId, userId, supplier_id, payload);
                handleServiceResponse(ServiceResponse, res);
            } catch (error) {
                console.error("Error in PATCH request:", error);
                res.status(500).json({ status: "error", message: "Internal Server Error" });
            }
        });

    router.delete("/delete/:supplier_id",
        authenticateToken,
        authorizeByName("ร้านค้า", ["A"]),
        validateRequest(GetParamMasterSupplierSchema),
        async (req: Request, res: Response) => {
            try {
                const { company_id } = req.token.payload;
                const companyId = company_id;
                const { supplier_id } = req.params;
                const ServiceResponse = await supplierService.delete(companyId, supplier_id);
                handleServiceResponse(ServiceResponse, res);
            } catch (error) {
                console.error("Error in DELETE request:", error);
                res.status(500).json({ status: "error", message: "Internal Server Error" });
            }
        });

    router.get("/getByID/:supplier_id",
        authenticateToken,
        authorizeByName("ร้านค้า", ["A"]),
        validateRequest(GetParamMasterSupplierSchema),
        async (req: Request, res: Response) => {
            try {
                const { company_id } = req.token.payload;
                const companyId = company_id;
                const { supplier_id } = req.params;
                const ServiceResponse = await supplierService.findOne(companyId, supplier_id);
                handleServiceResponse(ServiceResponse, res);
            } catch (error) {
                console.error("Error in GET request:", error);
                res.status(500).json({ status: "error", message: "Internal Server Error" });
            }
        });
    
        router.get("/get_all",
            authenticateToken,
            authorizeByName("ร้านค้า", ["A"]),
            async ( req: Request, res: Response) => {
            try {
                const { company_id } = req.token.payload;
                const companyId = company_id;
                const ServiceResponse = await supplierService.findAllNoPagination(companyId);
                handleServiceResponse(ServiceResponse, res);
            } catch (error) {
                console.error("Error in GET request:", error);
                res.status(500).json({ status: "error", message: "Internal Server Error" });
            }
        });
        router.get("/select",
            authenticateToken,
            authorizeByName("ร้านค้า", ["A", "R"]),
            validateRequest(SelectSchema),
            async (req: Request, res: Response) => {
            const { company_id } = req.token.payload;
            const searchText = (req.query.searchText as string) || "";
            const companyId = company_id;
            const ServiceResponse = await supplierService.select(companyId, searchText);
            handleServiceResponse(ServiceResponse, res);
            }
        );
    return router;
})();


