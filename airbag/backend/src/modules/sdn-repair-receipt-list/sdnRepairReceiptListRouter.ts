import exprss, { Request, Response } from "express";
import { handleServiceResponse, validateRequest } from "@common/utils/httpHandlers";
import { supplierDeliveryRRListNoteService } from "@modules/sdn-repair-receipt-list/sdnRepairReceiptListService";
import { CreateSupplierDeliveryNoteRRListSchema, UpdateSupplierDeliveryNoteRRListSchema, GetParamSupplierDeliveryNoteRRListSchema, SubmitSupplierDeliveryNoteRRListSchema } from "@modules/sdn-repair-receipt-list/sdnRepairReceiptListModel";
import authenticateToken from "@common/middleware/authenticateToken";
import authorizeAll from "@common/middleware/authorizeAll";
import { authorizeByName } from "@common/middleware/permissions";

export const sdnRepairReceiptListRouter = (() => {
    const router = exprss.Router();

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

    router.post("/create",
        authenticateToken,
        authorizeByName("ใบส่งซัพพลายเออร์", ["A"]),
        validateRequest(CreateSupplierDeliveryNoteRRListSchema),
        async (req: Request, res: Response) => {
            try {
                const { company_id, uuid } = req.token.payload;
                const companyId = company_id;
                const userId = uuid;
                const payload = req.body;

                const ServiceResponse = await supplierDeliveryRRListNoteService.create(companyId, userId, payload);
                handleServiceResponse(ServiceResponse, res);
            } catch (error) {
                console.error("Error in POST request:", error);
                res.status(500).json({ status: "error", message: "Internal Server Error" });
            }
        });

    router.patch("/update",
        authenticateToken,
        authorizeByName("ใบส่งซัพพลายเออร์", ["A"]),
        validateRequest(UpdateSupplierDeliveryNoteRRListSchema),
        async (req: Request, res: Response) => {
            try {
                const { company_id, uuid } = req.token.payload;
                const companyId = company_id;
                const userId = uuid;
                const { supplier_delivery_note_repair_receipt_list_id } = req.body;
                const payload = req.body;
                const ServiceResponse = await supplierDeliveryRRListNoteService.update(companyId, userId, supplier_delivery_note_repair_receipt_list_id, payload);
                handleServiceResponse(ServiceResponse, res);
            } catch (error) {
                console.error("Error in PATCH request:", error);
                res.status(500).json({ status: "error", message: "Internal Server Error" });
            }
        });



    router.delete("/delete/:supplier_delivery_note_repair_receipt_list_id",
        authenticateToken,
        authorizeByName("ใบส่งซัพพลายเออร์", ["A"]),
        validateRequest(GetParamSupplierDeliveryNoteRRListSchema),
        async (req: Request, res: Response) => {
            try {
                const { company_id } = req.token.payload;
                const companyId = company_id;
                const { supplier_delivery_note_repair_receipt_list_id } = req.params;
                const ServiceResponse = await supplierDeliveryRRListNoteService.delete(companyId, supplier_delivery_note_repair_receipt_list_id);
                handleServiceResponse(ServiceResponse, res);
            } catch (error) {
                console.error("Error in DELETE request:", error);
                res.status(500).json({ status: "error", message: "Internal Server Error" });
            }
        });

    router.get("/getByID/:supplier_delivery_note_repair_receipt_list_id",
        authenticateToken,
        authorizeByName("ใบส่งซัพพลายเออร์", ["A"]),
        validateRequest(GetParamSupplierDeliveryNoteRRListSchema),
        async (req: Request, res: Response) => {
            try {
                const { company_id } = req.token.payload;
                const companyId = company_id;
                const { supplier_delivery_note_repair_receipt_list_id } = req.params;
                const ServiceResponse = await supplierDeliveryRRListNoteService.findOne(companyId, supplier_delivery_note_repair_receipt_list_id);
                handleServiceResponse(ServiceResponse, res);
            } catch (error) {
                console.error("Error in GET request:", error);
                res.status(500).json({ status: "error", message: "Internal Server Error" });
            }
        });

    router.get("/getByRRID/:repair_receipt_id",
        authenticateToken,
        authorizeByName("ใบส่งซัพพลายเออร์", ["A"]),
        // validateRequest(GetParamSupplierDeliveryNoteRRListSchema),
        async (req: Request, res: Response) => {
            try {
                const { company_id } = req.token.payload;
                const companyId = company_id;
                const {  supplier_delivery_note_id, repair_receipt_id } = req.params;

                const ServiceResponse = await supplierDeliveryRRListNoteService.findByRRId(companyId, repair_receipt_id);
                handleServiceResponse(ServiceResponse, res);
            } catch (error) {
                console.error("Error in GET request:", error);
                res.status(500).json({ status: "error", message: "Internal Server Error" });
            }
        });

    router.post("/update-data",
        authenticateToken,
        authorizeByName("ใบส่งซัพพลายเออร์", ["A"]),
        validateRequest(SubmitSupplierDeliveryNoteRRListSchema),
        async (req: Request, res: Response) => {
            try {
                const { company_id, uuid } = req.token.payload;
                const companyId = company_id;
                const userId = uuid;
                const payload = req.body;

                const ServiceResponse = await supplierDeliveryRRListNoteService.updateData(companyId, userId, payload);
                handleServiceResponse(ServiceResponse, res);
            } catch (error) {
                console.error("Error in POST request:", error);
                res.status(500).json({ status: "error", message: "Internal Server Error" });
            }
        });
    return router;
})();


