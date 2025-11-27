// ms_positionRouter.ts
import express, { Request, Response } from "express";
import { handleServiceResponse, validateRequest } from "@common/utils/httpHandlers"
import { dashboardCQRepository } from "@modules/dashboardCustomerQuotation/dashboardCQRepository"
// import { CreateMsPositionSchema, UpdateMsPositionSchema, GetMsPositionSchema, GetParamMsPositionSchema } from "@modules/ms_position/ms_positionModel"
import authenticateToken from "@common/middleware/authenticateToken";
import authorizeAll from "@common/middleware/authorizeAll";
import { authorizeByName } from "@common/middleware/permissions";
import { dashboardCQService } from "./dashboardCQService";

export const dashboardCQRouter = (() => {
    const router = express.Router();

    router.get("/getTopTenCustomer",
        authenticateToken,
        authorizeAll,
        async (req: Request, res: Response) => {
            try {
                const companyId = req.token.company_id;
                const ServiceResponse = await dashboardCQService.getTopTenCustomer(companyId);
                handleServiceResponse(ServiceResponse, res);
            } catch (error) {
                console.error("Error in GET request:", error);
                res
                    .status(500)
                    .json({ status: "error", message: "Internal Server Error" });
            }
        }
    );


    router.get("/getTotalAmount",
        authenticateToken,
        authorizeAll,
        async (req: Request, res: Response) => {
            try {
                const companyId = req.token.company_id;
                const ServiceResponse = await dashboardCQService.getTotalAmount(companyId);
                handleServiceResponse(ServiceResponse, res);
            } catch (error) {
                console.error("Error in GET request:", error);
                res
                    .status(500)
                    .json({ status: "error", message: "Internal Server Error" });
            }
        });


    router.get("/getQuotationStatus",
        authenticateToken,
        authorizeAll,
        async (req: Request, res: Response) => {
            try {
                const companyId = req.token.company_id;
                const dateRange = req.query.dateRange as string; // '15days', '30days', '1month', '3months', '6months', '1year'
                const ServiceResponse = await dashboardCQService.getQuotationStatus(companyId, dateRange);
                handleServiceResponse(ServiceResponse, res);
            } catch (error) {
                console.error("Error in GET request:", error);
                res
                    .status(500)
                    .json({ status: "error", message: "Internal Server Error" });
            }
        });

    router.get("/getTopTenSale",
        authenticateToken,
        authorizeAll,
        async (req: Request, res: Response) => {
            try {
                const companyId = req.token.company_id;
                const ServiceResponse = await dashboardCQService.getTopTenSale(companyId);
                handleServiceResponse(ServiceResponse, res);
            } catch (error) {
                console.error("Error in GET request:", error);
                res
                    .status(500)
                    .json({ status: "error", message: "Internal Server Error" });
            }
        }
    );
    router.get("/getQuotationSummary",
        authenticateToken,
        authorizeAll,
        async (req: Request, res: Response) => {
            try {
                const companyId = req.token.company_id;
                const dateRange = req.query.dateRange as string; // '7days','15days', '1month', '3months', '6months', '1year', '3years','all'
                const ServiceResponse = await dashboardCQService.getQuotationSummary(companyId, dateRange);
                handleServiceResponse(ServiceResponse, res);
            } catch (error) {
                console.error("Error in GET request:", error);
                res
                    .status(500)
                    .json({ status: "error", message: "Internal Server Error" });
            }
        });
    return router
})();
