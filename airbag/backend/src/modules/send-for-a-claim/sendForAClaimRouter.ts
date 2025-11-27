import express, { Request, Response } from "express";
import { handleServiceResponse, validateRequest } from "@common/utils/httpHandlers";
import authenticateToken from "@common/middleware/authenticateToken";
import authorizeAll from "@common/middleware/authorizeAll";
import { sendForAClaimService } from "@modules/send-for-a-claim/sendForAClaimService";
import { CreateSendForAClaimSchema, UpdateSendForAClaimSchema, GetParamSendForAClaimSchema,GetParamSupplierRepairReceiptSchema , SelectSchema } from "@modules/send-for-a-claim/sendForAClaimModel";
import { authorizeByName } from "@common/middleware/permissions";
import { ServiceResponse, ResponseStatus } from "@common/models/serviceResponse";
import { StatusCodes } from "http-status-codes";


export const sendForAClaimRouter = (() => {
    const router = express.Router();

    router.get("/get",
        authenticateToken,
        authorizeByName("ใบส่งเคลม", ["A"]),
        async (req: Request, res: Response) => {
            try {
                const companyId = req.token.company_id;
                const page = parseInt(req.query.page as string) || 1;
                const pageSize = parseInt(req.query.pageSize as string) || 12;
                const searchText = (req.query.searchText as string) || "";

                const serviceResponse = await sendForAClaimService.findAll(companyId, page, pageSize, searchText);
                handleServiceResponse(serviceResponse, res);
            } catch (error) {
                console.error("Error in GET request:", error);
                res.status(500).json({ status: "error", message: "Internal Server Error" });
            }
        });

    router.post("/create",
        authenticateToken,
        authorizeByName("ใบส่งเคลม", ["A"]),
        validateRequest(CreateSendForAClaimSchema),
        async (req: Request, res: Response) => {
            try {
                const { company_id, uuid } = req.token.payload;
                const companyId = company_id;
                const userId = uuid;
                const payload = req.body;
                const serviceResponse = await sendForAClaimService.create(companyId, userId, payload);
                handleServiceResponse(serviceResponse, res);
            } catch (error) {
                console.error("Error in POST request:", error);
                res.status(500).json({ status: "error", message: "Internal Server Error" });
            }
        });

    router.patch("/update",
        authenticateToken,
        authorizeByName("ใบส่งเคลม", ["A"]),
        validateRequest(UpdateSendForAClaimSchema),
        async (req: Request, res: Response) => {
            try {
                const { company_id, uuid } = req.token.payload;
                const companyId = company_id;
                const userId = uuid;
                const { send_for_a_claim_id } = req.body;
                const payload = req.body;
                const serviceResponse = await sendForAClaimService.update(companyId, userId, send_for_a_claim_id, payload);
                handleServiceResponse(serviceResponse, res);
            } catch (error) {
                console.error("Error in PATCH request:", error);
                res.status(500).json({ status: "error", message: "Internal Server Error" });
            }
        });

    router.delete("/delete/:send_for_a_claim_id",
        authenticateToken,
        authorizeByName("ใบส่งเคลม", ["A"]),
        validateRequest(GetParamSendForAClaimSchema),
        async (req: Request, res: Response) => {
            try {
                const { company_id } = req.token.payload;
                const companyId = company_id;
                const { send_for_a_claim_id } = req.params;
                const ServiceResponse = await sendForAClaimService.delete(companyId, send_for_a_claim_id);
                handleServiceResponse(ServiceResponse, res);
            } catch (error) {
                console.error("Error in DELETE request:", error);
                res.status(500).json({ status: "error", message: "Internal Server Error" });
            }
        });

    router.get("/getByID/:send_for_a_claim_id",
        authenticateToken,
        authorizeByName("ใบส่งเคลม", ["A"]),
        validateRequest(GetParamSendForAClaimSchema),
        async (req: Request, res: Response) => {
            try {
                const { company_id } = req.token.payload;
                const companyId = company_id;
                const { send_for_a_claim_id } = req.params;
                const serviceResponse = await sendForAClaimService.findById(companyId, send_for_a_claim_id);
                handleServiceResponse(serviceResponse, res);
            } catch (error) {
                console.error("Error in GET request:", error);
                res.status(500).json({ status: "error", message: "Internal Server Error" });
            }
        });


    router.get("/getSupplierRepairReceiptDoc",
        authenticateToken,
        authorizeByName("ใบส่งเคลม", ["A"]),
        async (req: Request, res: Response) => {
            try {
                const { company_id } = req.token.payload;
                const serviceResponse = await sendForAClaimService.findDoc(company_id);
                handleServiceResponse(serviceResponse, res);
            } catch (error) {
                console.error("Error in GET payload request:", error);
                res.status(500).json({ status: "error", message: "Internal Server Error" });
            }
        });


    router.get("/getBySupplierRepairReceiptId/:id",
        authenticateToken,
        authorizeByName("ใบส่งเคลม", ["A"]),
        validateRequest(GetParamSupplierRepairReceiptSchema),
        async (req: Request, res: Response) => {
            try {
                const { company_id } = req.token.payload;
                const companyId = company_id;
                const { id } = req.params;
                const serviceResponse = await sendForAClaimService.findBySupplierRepairReceiptId(companyId, id);
                handleServiceResponse(serviceResponse, res);
            } catch (error) {
                console.error("Error in GET request:", error);
                res.status(500).json({ status: "error", message: "Internal Server Error" });
            }
        });

        router.get(
            "/get-send-claim-docs-only", // ตั้งชื่อ path ให้สื่อความหมาย
            authenticateToken,
            // กำหนด Permission ที่เหมาะสม (อาจจะแค่ Read ก็พอ)
            authorizeByName("ใบส่งเคลม", ["R", "A"]),
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
                    const serviceResponse = await sendForAClaimService.findOnlySendClaimDocsByCompanyId(company_id);
                    handleServiceResponse(serviceResponse, res);
    
                } catch (error) {
                    console.error("Error in GET /get-send-claim-docs-only request:", error);
                     handleServiceResponse(new ServiceResponse(
                            ResponseStatus.Failed,
                            "An unexpected error occurred while fetching send for claim documents.",
                            null, // หรือ []
                            StatusCodes.INTERNAL_SERVER_ERROR
                        ), res);
                }
            }
        );

        router.get("/get-with-responsible/:send_for_a_claim_id",
            authenticateToken,
            authorizeByName("ใบส่งเคลม", ["A", "R"]), 
            validateRequest(GetParamSendForAClaimSchema),
            async (req: Request, res: Response) => {
                try {
                    const { company_id } = req.token.payload;
                    const { send_for_a_claim_id } = req.params;
    
                    const serviceResponse = await sendForAClaimService.findResponsibleUserForSendForAClaim(company_id, send_for_a_claim_id);
                    handleServiceResponse(serviceResponse, res);
                    // ไม่มีการ return ที่นี่
                } catch (error) {
                    console.error(`Error in /get-with-responsible/${req.params.send_for_a_claim_id}:`, error);
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
            authorizeByName("ใบส่งเคลม", ["A", "R"]),
            validateRequest(SelectSchema),
            async (req: Request, res: Response) => {
            const { company_id } = req.token.payload;
            const searchText = (req.query.searchText as string) || "";
            const companyId = company_id;
            const ServiceResponse = await sendForAClaimService.select(companyId, searchText);
            handleServiceResponse(ServiceResponse, res);
            }
        );
    return router;
})();