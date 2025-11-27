import exprss, { Request, Response } from "express";
import { handleServiceResponse, validateRequest } from "@common/utils/httpHandlers";
import { visitCustomerService } from "@modules/visit-customer/visitCustomerService";
import { CreateMasterVisitCustomerSchema, UpdateMasterVisitCustomerSchema, GetParamVisitCustomerSchema } from "@modules/visit-customer/visitCustomerModel";
import authenticateToken from "@common/middleware/authenticateToken";
import authorizeAll from "@common/middleware/authorizeAll";
import { authorizeByName } from "@common/middleware/permissions";

export const visitCustomerRouter = (() => {
    const router = exprss.Router();

    router.get("/get",
        authenticateToken,
        authorizeByName("เยี่ยมลูกค้า", ["A"]),
        async (req: Request, res: Response) => {
            try {
                const companyId = req.token.company_id;
                const page = parseInt(req.query.page as string) || 1;
                const pageSize = parseInt(req.query.pageSize as string) || 12;
                const searchText = (req.query.searchText as string) || "";

                const ServiceResponse = await visitCustomerService.findAll(companyId, page, pageSize, searchText);
                handleServiceResponse(ServiceResponse, res);
            } catch (error) {
                console.error("Error in GET request:", error);
                res.status(500).json({ status: "error", message: "Internal Server Error" });
            }
        });

    router.post("/create",
        authenticateToken,
        authorizeByName("เยี่ยมลูกค้า", ["A"]),
        validateRequest(CreateMasterVisitCustomerSchema),
        async (req: Request, res: Response) => {
            try {
                const { company_id, uuid } = req.token.payload;
                const companyId = company_id;
                const userId = uuid;
                const payload = req.body;

                const ServiceResponse = await visitCustomerService.create(companyId, userId, payload);
                handleServiceResponse(ServiceResponse, res);
            } catch (error) {
                console.error("Error in POST request:", error);
                res.status(500).json({ status: "error", message: "Internal Server Error" });
            }
        });

    router.patch("/update",
        authenticateToken,
        authorizeByName("เยี่ยมลูกค้า", ["A"]),
        validateRequest(UpdateMasterVisitCustomerSchema),
        async (req: Request, res: Response) => {
            try {
                const { company_id, uuid } = req.token.payload;
                const companyId = company_id;
                const userId = uuid;
                const { customer_visit_id } = req.body;
                const payload = req.body;
                const ServiceResponse = await visitCustomerService.update(companyId, userId, customer_visit_id, payload);
                handleServiceResponse(ServiceResponse, res);
            } catch (error) {
                console.error("Error in PATCH request:", error);
                res.status(500).json({ status: "error", message: "Internal Server Error" });
            }
        });

    

    router.delete("/delete/:customer_visit_id",
        authenticateToken,
        authorizeByName("เยี่ยมลูกค้า", ["A"]),
        validateRequest(GetParamVisitCustomerSchema),
        async (req: Request, res: Response) => {
            try {
                const { company_id } = req.token.payload;
                const companyId = company_id;
                const { customer_visit_id } = req.params;
                const ServiceResponse = await visitCustomerService.delete(companyId, customer_visit_id);
                handleServiceResponse(ServiceResponse, res);
            } catch (error) {
                console.error("Error in DELETE request:", error);
                res.status(500).json({ status: "error", message: "Internal Server Error" });
            }
        });

    router.get("/getByID/:customer_visit_id",
        authenticateToken,
        authorizeByName("เยี่ยมลูกค้า", ["A"]),
        validateRequest(GetParamVisitCustomerSchema),
        async (req: Request, res: Response) => {
            try {
                const { company_id } = req.token.payload;
                const companyId = company_id;
                const { customer_visit_id } = req.params;
                const ServiceResponse = await visitCustomerService.findOne(companyId, customer_visit_id);
                handleServiceResponse(ServiceResponse, res);
            } catch (error) {
                console.error("Error in GET request:", error);
                res.status(500).json({ status: "error", message: "Internal Server Error" });
            }
            })
    return router;
})();


