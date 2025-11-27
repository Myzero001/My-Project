import express, { Request, Response } from "express";
import { handleServiceResponse, validateRequest } from "@common/utils/httpHandlers";
import { supplierRepairReceiptListService } from "./supplierRepairReceiptListService";
import {
    CreateSupplierRepairReceiptListSchema,
    UpdateSupplierRepairReceiptListSchema,
    GetParamSupplierRepairReceiptListSchema,
    UpdateFinishStatusSchema,
    GetParamPayloadListSchema,
    UpdateSupplierRepairReceiptIdSchema,
} from "./supplierRepairReceiptListModel";
import authenticateToken from "@common/middleware/authenticateToken";
import authorizeAll from "@common/middleware/authorizeAll";
import { authorizeByName } from "@common/middleware/permissions";

export const supplierRepairReceiptListRouter = (() => {
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

                const serviceResponse = await supplierRepairReceiptListService.findAll(companyId, page, pageSize, searchText);
                handleServiceResponse(serviceResponse, res);
            } catch (error) {
                console.error("Error in GET request:", error);
                res.status(500).json({ status: "error", message: "Internal Server Error" });
            }
        });

    router.post("/create",
        authenticateToken,
        authorizeByName("ใบรับซ่อมซัพพลายเออร์", ["A"]),
        validateRequest(CreateSupplierRepairReceiptListSchema),
        async (req: Request, res: Response) => {
            try {
                const { company_id, uuid } = req.token.payload;
                const payload = req.body;
                const serviceResponse = await supplierRepairReceiptListService.create(company_id, uuid, payload);
                handleServiceResponse(serviceResponse, res);
            } catch (error) {
                console.error("Error in POST request:", error);
                res.status(500).json({ status: "error", message: "Internal Server Error" });
            }
        });

    router.patch("/update",
        authenticateToken,
        authorizeByName("ใบรับซ่อมซัพพลายเออร์", ["A"]),
        validateRequest(UpdateSupplierRepairReceiptListSchema),
        async (req: Request, res: Response) => {
            try {
                const { company_id, uuid } = req.token.payload;
                const { supplier_delivery_note_repair_receipt_list_id } = req.body;
                const payload = req.body;
                const serviceResponse = await supplierRepairReceiptListService.update(
                    company_id,
                    uuid,
                    supplier_delivery_note_repair_receipt_list_id,
                    payload
                );
                handleServiceResponse(serviceResponse, res);
            } catch (error) {
                console.error("Error in PATCH request:", error);
                res.status(500).json({ status: "error", message: "Internal Server Error" });
            }
        });

        router.delete("/delete/:supplier_repair_receipt_list_id",
            authenticateToken,
            authorizeByName("ใบรับซ่อมซัพพลายเออร์", ["A"]),
            validateRequest(GetParamSupplierRepairReceiptListSchema),
            async (req: Request, res: Response) => {
                try {
                    const { company_id } = req.token.payload;
                    const { supplier_repair_receipt_list_id } = req.params;
                    const serviceResponse = await supplierRepairReceiptListService.delete(
                        company_id,
                        supplier_repair_receipt_list_id
                    );
                    handleServiceResponse(serviceResponse, res);
                } catch (error) {
                    console.error("Error in DELETE request:", error);
                    res.status(500).json({ status: "error", message: "Internal Server Error" });
                }
        });

    router.get("/getById/:supplier_repair_receipt_list_id",
        authenticateToken,
        authorizeByName("ใบรับซ่อมซัพพลายเออร์", ["A"]),
        validateRequest(GetParamSupplierRepairReceiptListSchema),
        async (req: Request, res: Response) => {
            try {
                const { company_id } = req.token.payload;
                const { supplier_delivery_note_repair_receipt_list_id } = req.params;
                const serviceResponse = await supplierRepairReceiptListService.findOne(
                    company_id,
                    supplier_delivery_note_repair_receipt_list_id
                );
                handleServiceResponse(serviceResponse, res);
            } catch (error) {
                console.error("Error in GET request:", error);
                res.status(500).json({ status: "error", message: "Internal Server Error" });
            }
        });

        router.patch(
            "/updateFinishStatus/:supplier_delivery_note_repair_receipt_list_id",
            authenticateToken,
            authorizeByName("ใบรับซ่อมซัพพลายเออร์", ["A"]),
            validateRequest(UpdateFinishStatusSchema),
            async (req: Request, res: Response) => {
                try {
                    const { company_id, uuid } = req.token.payload;
                    const { supplier_delivery_note_repair_receipt_list_id } = req.params;
                    const { finish, finish_by_receipt_doc, supplier_repair_receipt_id } = req.body; // ดึงค่าใหม่จาก body
        
                    const response = await supplierRepairReceiptListService.updateFinishStatus(
                        company_id,
                        uuid,
                        supplier_delivery_note_repair_receipt_list_id,
                        finish,
                        finish_by_receipt_doc,
                        supplier_repair_receipt_id // ส่งค่าไป Service
                    );
        
                    res.status(response.statusCode).json(response);
                } catch (error) {
                    console.error("Error in PATCH request:", error);
                    res.status(500).json({ 
                        success: false,
                        message: "Internal Server Error",
                        responseObject: null,
                        statusCode: 500
                    });
                }
            }
        );
        
        router.get(
            "/payLoadForSupplierRepairReceiptList/:supplier_repair_receipt_id/:supplier_delivery_note_id",
            authenticateToken,
            authorizeByName("ใบรับซ่อมซัพพลายเออร์", ["A"]),
            validateRequest(GetParamPayloadListSchema),
            async (req: Request, res: Response) => {
                try {
                    const { company_id } = req.token.payload;
                    const { supplier_repair_receipt_id, supplier_delivery_note_id } = req.params;
                    
                    const serviceResponse = await supplierRepairReceiptListService.findPayloadList(
                        company_id, 
                        supplier_repair_receipt_id,
                        supplier_delivery_note_id
                    );
                    handleServiceResponse(serviceResponse, res);
                } catch (error) {
                    console.error("Error in GET payload list request:", error);
                    res.status(500).json({ status: "error", message: "Internal Server Error" });
                }
            }
        );

        router.patch(
            "/updateSupplierRepairReceiptId/:supplier_delivery_note_repair_receipt_list_id",
            authenticateToken,
            authorizeByName("ใบรับซ่อมซัพพลายเออร์", ["A"]),
            validateRequest(UpdateSupplierRepairReceiptIdSchema),
            async (req: Request, res: Response) => {
                try {
                    const { company_id, uuid } = req.token.payload;
                    const { supplier_delivery_note_repair_receipt_list_id } = req.params;
                    const { supplier_repair_receipt_id } = req.body;
                    
                    const serviceResponse = await supplierRepairReceiptListService.updateSupplierRepairReceiptId(
                        company_id,
                        uuid,
                        supplier_delivery_note_repair_receipt_list_id,
                        supplier_repair_receipt_id
                    );
                    
                    handleServiceResponse(serviceResponse, res);
                } catch (error) {
                    console.error("Error in PATCH request:", error);
                    res.status(500).json({ status: "error", message: "Internal Server Error" });
                }
            }
        );

    return router;
})();