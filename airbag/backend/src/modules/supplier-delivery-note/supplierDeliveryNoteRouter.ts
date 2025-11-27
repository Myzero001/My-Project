import exprss, { Request, Response } from "express";
import { handleServiceResponse, validateRequest } from "@common/utils/httpHandlers";
import { supplierDeliveryNoteService } from "@modules/supplier-delivery-note/supplierDeliveryNoteService";
import { CreateSupplierDeliveryNoteSchema, UpdateSupplierDeliveryNoteSchema, GetParamSupplierDeliveryNoteSchema , SelectSchema } from "@modules/supplier-delivery-note/supplierDeliveryNoteModel";
import authenticateToken from "@common/middleware/authenticateToken";
import authorizeAll from "@common/middleware/authorizeAll";
import { authorizeByName } from "@common/middleware/permissions";
import { ServiceResponse, ResponseStatus } from "@common/models/serviceResponse";
import { StatusCodes } from "http-status-codes";

export const supplierDeliveryNoteRouter = (() => {
    const router = exprss.Router();

    router.get("/get",
        authenticateToken,
        authorizeByName("ใบส่งซัพพลายเออร์", ["A"]),
        async (req: Request, res: Response) => {
            try {
                const companyId = req.token.company_id;
                const page = parseInt(req.query.page as string) || 1;
                const pageSize = parseInt(req.query.pageSize as string) || 12;
                const searchText = (req.query.searchText as string) || "";

                const ServiceResponse = await supplierDeliveryNoteService.findAll(companyId, page, pageSize, searchText);
                handleServiceResponse(ServiceResponse, res);
            } catch (error) {
                console.error("Error in GET request:", error);
                res.status(500).json({ status: "error", message: "Internal Server Error" });
            }
        });

    router.post("/create",
        authenticateToken,
        authorizeByName("ใบส่งซัพพลายเออร์", ["A"]),
        validateRequest(CreateSupplierDeliveryNoteSchema),
        async (req: Request, res: Response) => {
            try {
                const { company_id, uuid } = req.token.payload;
                const companyId = company_id;
                const userId = uuid;
                const payload = req.body;

                const ServiceResponse = await supplierDeliveryNoteService.create(companyId, userId, payload);
                handleServiceResponse(ServiceResponse, res);
            } catch (error) {
                console.error("Error in POST request:", error);
                res.status(500).json({ status: "error", message: "Internal Server Error" });
            }
        });

    router.patch("/update",
        authenticateToken,
        authorizeByName("ใบส่งซัพพลายเออร์", ["A"]),
        validateRequest(UpdateSupplierDeliveryNoteSchema),
        async (req: Request, res: Response) => {
            try {
                const { company_id, uuid } = req.token.payload;
                const companyId = company_id;
                const userId = uuid;
                const { supplier_delivery_note_id } = req.body;
                const payload = req.body;
                const ServiceResponse = await supplierDeliveryNoteService.update(companyId, userId, supplier_delivery_note_id, payload);
                handleServiceResponse(ServiceResponse, res);
            } catch (error) {
                console.error("Error in PATCH request:", error);
                res.status(500).json({ status: "error", message: "Internal Server Error" });
            }
        });

    

    router.delete("/delete/:supplier_delivery_note_id",
        authenticateToken,
        authorizeByName("ใบส่งซัพพลายเออร์", ["A"]),
        validateRequest(GetParamSupplierDeliveryNoteSchema),
        async (req: Request, res: Response) => {
            try {
                const { company_id } = req.token.payload;
                const companyId = company_id;
                const { supplier_delivery_note_id } = req.params;
                const ServiceResponse = await supplierDeliveryNoteService.delete(companyId, supplier_delivery_note_id);
                handleServiceResponse(ServiceResponse, res);
            } catch (error) {
                console.error("Error in DELETE request:", error);
                res.status(500).json({ status: "error", message: "Internal Server Error" });
            }
        });

    router.get("/getByID/:supplier_delivery_note_id",
        authenticateToken,
        authorizeByName("ใบส่งซัพพลายเออร์", ["A"]),
        validateRequest(GetParamSupplierDeliveryNoteSchema),
        async (req: Request, res: Response) => {
            try {
                const { company_id } = req.token.payload;
                const companyId = company_id;
                const { supplier_delivery_note_id } = req.params;
                const ServiceResponse = await supplierDeliveryNoteService.findOne(companyId, supplier_delivery_note_id);
                handleServiceResponse(ServiceResponse, res);
            } catch (error) {
                console.error("Error in GET request:", error);
                res.status(500).json({ status: "error", message: "Internal Server Error" });
            }
            })
    
    router.get("/getSupplierDeliveryNoteDoc",
        authenticateToken,
        authorizeByName("ใบส่งซัพพลายเออร์", ["A"]),
        async (req: Request, res: Response) => {
            try {
                const { company_id } = req.token.payload;
                const companyId = company_id;
                const ServiceResponse = await supplierDeliveryNoteService.getSupplierDeliveryNoteDoc(companyId);
                handleServiceResponse(ServiceResponse, res);
            } catch (error) {
                console.error("Error in GET request:", error);
                res.status(500).json({ status: "error", message: "Internal Server Error" });
            }
        }
    );

    router.get(
        "/get-delivery-note-docs-only",
        authenticateToken,
        authorizeByName("ใบส่งซัพพลายเออร์", ["A"]),
        async (req: Request, res: Response) => {
            try {
                // ดึง company_id จาก token
                const company_id = (req.token as any)?.payload?.company_id;

                if (!company_id) {
                    handleServiceResponse(new ServiceResponse(
                        ResponseStatus.Failed,
                        "Company ID not found in token.",
                        null,
                        StatusCodes.UNAUTHORIZED
                    ), res);
                    return; // ออกจากฟังก์ชัน
                }

                // เรียก Service function ใหม่
                const serviceResponse = await supplierDeliveryNoteService.findOnlyDeliveryNoteDocsByCompanyId(company_id);
                handleServiceResponse(serviceResponse, res);

            } catch (error) {
                console.error("Error in GET /get-delivery-note-docs-only request:", error);
                 handleServiceResponse(new ServiceResponse(
                        ResponseStatus.Failed,
                        "An unexpected error occurred while fetching delivery note documents.",
                        null,
                        StatusCodes.INTERNAL_SERVER_ERROR
                    ), res);
            }
        }
    );

    router.get("/get-with-responsible/:supplier_delivery_note_id",
        authenticateToken,
        authorizeByName("ใบส่งซัพพลายเออร์", ["A", "R"]),
        async (req: Request, res: Response) => {
            try {
                const { company_id } = req.token.payload;
                const { supplier_delivery_note_id } = req.params;
    
                if (!supplier_delivery_note_id) {
                    handleServiceResponse(new ServiceResponse(
                        ResponseStatus.Failed,
                        "Supplier delivery note ID is required.",
                        null,
                        StatusCodes.BAD_REQUEST
                    ), res);
                    return;
                }
                // เรียกฟังก์ชัน service ที่อัปเดตแล้ว
                const serviceResponse = await supplierDeliveryNoteService.findResponsibleUserForDeliveryNote(company_id, supplier_delivery_note_id);
                handleServiceResponse(serviceResponse, res);
            } catch (error) {
                console.error(`Error in /get-with-responsible/${req.params.supplier_delivery_note_id}:`, error);
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
    authorizeByName("ใบส่งซัพพลายเออร์", ["A", "R"]),
    validateRequest(SelectSchema),
    async (req: Request, res: Response) => {
      const { company_id } = req.token.payload;
      const searchText = (req.query.searchText as string) || "";
      const companyId = company_id;
      const ServiceResponse = await supplierDeliveryNoteService.select(companyId, searchText);
      handleServiceResponse(ServiceResponse, res);
    }
  );

    return router;
})();


