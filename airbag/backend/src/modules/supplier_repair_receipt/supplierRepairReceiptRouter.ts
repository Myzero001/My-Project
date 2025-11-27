import express, { Request, Response } from "express";
import { handleServiceResponse, validateRequest } from "@common/utils/httpHandlers";
import { supplierRepairReceiptService } from "./supplierRepairReceiptService";
import { supplierDeliveryRRListNoteService } from "@modules/sdn-repair-receipt-list/sdnRepairReceiptListService";
import {
    CreateSupplierRepairReceiptSchema,
    UpdateSupplierRepairReceiptSchema,
    GetParamSupplierRepairReceiptSchema,
    SelectSchema
} from "./supplierRepairReceiptModel";
import authenticateToken from "@common/middleware/authenticateToken";
import authorizeAll from "@common/middleware/authorizeAll";
import { authorizeByName } from "@common/middleware/permissions";
import { ServiceResponse, ResponseStatus } from "@common/models/serviceResponse";
import { StatusCodes } from "http-status-codes";

export const supplierRepairReceiptRouter = (() => {
    const router = express.Router();

    router.get("/get",
        authenticateToken,
        authorizeByName("ใบรับซ่อมซัพพลายเออร์", ["A"]),
        async (req: Request, res: Response) => {
            try {
                const companyId = req.token.company_id;
                const page = parseInt(req.query.page as string) || 1;
                const pageSize = parseInt(req.query.pageSize as string) || 12;
                const searchText = (req.query.searchText as string) || "";

                const serviceResponse = await supplierRepairReceiptService.findAll(companyId, page, pageSize, searchText);
                handleServiceResponse(serviceResponse, res);
            } catch (error) {
                console.error("Error in GET request:", error);
                res.status(500).json({ status: "error", message: "Internal Server Error" });
            }
        });

        router.post("/create",
            authenticateToken,
            authorizeByName("ใบรับซ่อมซัพพลายเออร์", ["A"]),
            async (req: Request, res: Response) => {
                try {
                    const { company_id, uuid } = req.token.payload;
                    const { supplier_delivery_note_id } = req.body;
        
                    const serviceResponse = await supplierRepairReceiptService.create(company_id, uuid, supplier_delivery_note_id);
                    res.status(serviceResponse.statusCode).json(serviceResponse);
                } catch (error) {
                    console.error("Error in POST request:", error);
                    res.status(500).json({ status: "error", message: "Internal Server Error" });
                }
            }
        );

    router.patch("/update",
        authenticateToken,
        authorizeByName("ใบรับซ่อมซัพพลายเออร์", ["A"]),
        validateRequest(UpdateSupplierRepairReceiptSchema),
        async (req: Request, res: Response) => {
            try {
                const { company_id, uuid } = req.token.payload;
                const { id } = req.body;
                const payload = req.body;
                const serviceResponse = await supplierRepairReceiptService.update(company_id, uuid, id, payload);
                handleServiceResponse(serviceResponse, res);
            } catch (error) {
                console.error("Error in PATCH request:", error);
                res.status(500).json({ status: "error", message: "Internal Server Error" });
            }
        });

        router.delete("/delete/:id",
            authenticateToken,
            authorizeByName("ใบรับซ่อมซัพพลายเออร์", ["A"]),
            validateRequest(GetParamSupplierRepairReceiptSchema),
            async (req: Request, res: Response) => {
                try {
                    const { company_id, uuid } = req.token.payload;
                    const { id } = req.params;
    
                    const serviceResponse = await supplierRepairReceiptService.delete(company_id, uuid, id);
    
                    handleServiceResponse(serviceResponse, res);
                } catch (error) {
                    console.error("Error in DELETE request:", error);
                    res.status(500).json({ status: "error", message: "Internal Server Error" });
                }
            });

    router.get("/getById/:id",
        authenticateToken,
        authorizeByName("ใบรับซ่อมซัพพลายเออร์", ["A"]),
        validateRequest(GetParamSupplierRepairReceiptSchema),
        async (req: Request, res: Response) => {
            try {
                const { company_id } = req.token.payload;
                const { id } = req.params;
                const serviceResponse = await supplierRepairReceiptService.findOne(company_id, id);
                handleServiceResponse(serviceResponse, res);
            } catch (error) {
                console.error("Error in GET request:", error);
                res.status(500).json({ status: "error", message: "Internal Server Error" });
            }
        });

        router.get("/payLoadForSupplierRepairReceipt/:id",
            authenticateToken,
            authorizeByName("ใบรับซ่อมซัพพลายเออร์", ["A"]),
            validateRequest(GetParamSupplierRepairReceiptSchema),
            async (req: Request, res: Response) => {
                try {
                    const { company_id } = req.token.payload;
                    const { id } = req.params;
                    const serviceResponse = await supplierRepairReceiptService.findPayload(company_id, id);
                    handleServiceResponse(serviceResponse, res);
                } catch (error) {
                    console.error("Error in GET payload request:", error);
                    res.status(500).json({ status: "error", message: "Internal Server Error" });
                }
            });

            router.get("/get/:supplier_delivery_note_id",
                authenticateToken,
                authorizeByName("ใบส่งซัพพลายเออร์", ["A"]),
                async (req: Request, res: Response) => {
                    try {
                        const companyId = req.token.company_id;
                        const page = parseInt(req.query.page as string) || 1;
                        const pageSize = parseInt(req.query.pageSize as string) || 12;
                        const searchText = (req.query.searchText as string) || "";
        
                        const { supplier_delivery_note_id } = req.params;
        
                        const ServiceResponse = await supplierDeliveryRRListNoteService.findAll(companyId, page, pageSize, searchText, supplier_delivery_note_id);
                        handleServiceResponse(ServiceResponse, res);
                    } catch (error) {
                        console.error("Error in GET request:", error);
                        res.status(500).json({ status: "error", message: "Internal Server Error" });
                    }
                });

        router.get(
            "/get-receipt-docs", 
            authenticateToken,
            authorizeByName("ใบรับซ่อมซัพพลายเออร์", ["A"]),
            async (req: Request, res: Response) => {
                try {
                    const company_id = (req.token as any)?.payload?.company_id;
    
                    if (!company_id) {
                        handleServiceResponse(new ServiceResponse(
                            ResponseStatus.Failed,
                            "Company ID not found in token.",
                            null,
                            StatusCodes.UNAUTHORIZED
                        ), res);
                        return; 
                    }
    
                    const serviceResponse = await supplierRepairReceiptService.findReceiptDocsByCompanyId(company_id);
                    handleServiceResponse(serviceResponse, res);
    
                } catch (error) {
                    console.error("Error in GET /get-receipt-docs request:", error);
                        handleServiceResponse(new ServiceResponse(
                            ResponseStatus.Failed,
                            "An unexpected error occurred while fetching receipt documents.",
                            null,
                            StatusCodes.INTERNAL_SERVER_ERROR
                        ), res);
                }
            }
        );

        router.get("/get-with-responsible/:id", 
            authenticateToken,
            authorizeByName("ใบรับซ่อมซัพพลายเออร์", ["A"]), 
            validateRequest(GetParamSupplierRepairReceiptSchema),
            async (req: Request, res: Response) => {
                try {
                    const { company_id } = req.token.payload;
                    const { id } = req.params; 
       
                    const serviceResponse = await supplierRepairReceiptService.findResponsibleUserForSupplierRepairReceipt(company_id, id);
                    handleServiceResponse(serviceResponse, res);
                } catch (error) {
                    console.error(`Error in /get-with-responsible/${req.params.id}:`, error);
                    const errorMessage = (error instanceof Error) ? error.message : "An unexpected error occurred.";
                    handleServiceResponse(new ServiceResponse(
                        ResponseStatus.Failed,
                        `Error processing request: ${errorMessage}`,
                        null,
                        StatusCodes.INTERNAL_SERVER_ERROR
                    ), res);
                }
            }
        );
        router.get("/select",
            authenticateToken,
            authorizeByName("ใบรับซ่อมซัพพลายเออร์", ["A", "R"]),
            validateRequest(SelectSchema),
            async (req: Request, res: Response) => {
            const { company_id } = req.token.payload;
            const searchText = (req.query.searchText as string) || "";
            const companyId = company_id;
            const ServiceResponse = await supplierRepairReceiptService.select(companyId, searchText);
            handleServiceResponse(ServiceResponse, res);
            }
        );
            
    return router;
})();