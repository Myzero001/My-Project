import express, { Request, Response } from "express";
import { handleServiceResponse, validateRequest } from "@common/utils/httpHandlers";
import { receiveForAClaimService } from "./receiveForClaimService";
import {
    CreateReceiveForAClaimSchema,
    UpdateReceiveForAClaimSchema,
    GetParamReceiveForAClaimSchema,
} from "./receiveForClaimModel";
import { ServiceResponse, ResponseStatus } from "@common/models/serviceResponse";
import { StatusCodes } from "http-status-codes";
import authenticateToken from "@common/middleware/authenticateToken";
import authorizeAll from "@common/middleware/authorizeAll";
import { authorizeByName } from "@common/middleware/permissions";

export const receiveForAClaimRouter = (() => {
    const router = express.Router();

    router.get("/get",
        authenticateToken,
        authorizeByName("ใบรับเคลม", ["A"]),
        async (req: Request, res: Response) => {
            try {
                const companyId = req.token.company_id;
                const page = parseInt(req.query.page as string) || 1;
                const pageSize = parseInt(req.query.pageSize as string) || 12;
                const searchText = (req.query.searchText as string) || "";

                const serviceResponse = await receiveForAClaimService.findAll(companyId, page, pageSize, searchText);
                handleServiceResponse(serviceResponse, res);
            } catch (error) {
                console.error("Error in GET request:", error);
                res.status(500).json({ status: "error", message: "Internal Server Error" });
            }
        });

    router.post("/create",
        authenticateToken,
        authorizeByName("ใบรับเคลม", ["A"]),
        validateRequest(CreateReceiveForAClaimSchema),
        async (req: Request, res: Response) => {
            try {
                const { company_id, uuid } = req.token.payload;
                const payload = req.body;
    
                const serviceResponse = await receiveForAClaimService.create(uuid, company_id, payload);
                handleServiceResponse(serviceResponse, res);
            } catch (error) {
                console.error("Error in POST request:", error);
                res.status(500).json({ status: "error", message: "Internal Server Error" });
            }
        });        

    router.patch("/update/:id",
        authenticateToken,
        authorizeByName("ใบรับเคลม", ["A"]),
        validateRequest(UpdateReceiveForAClaimSchema),
        async (req: Request, res: Response) => {
            try {
                const { uuid } = req.token.payload;
                const { id } = req.params;
                const payload = req.body;
                const serviceResponse = await receiveForAClaimService.update(
                    uuid,
                    id,
                    payload
                );
                handleServiceResponse(serviceResponse, res);
            } catch (error) {
                console.error("Error in PATCH request:", error);
                res.status(500).json({ status: "error", message: "Internal Server Error" });
            }
        });

        router.delete("/delete/:id",
            authenticateToken,
            authorizeByName("ใบรับเคลม", ["A"]),
            validateRequest(GetParamReceiveForAClaimSchema),
            async (req: Request, res: Response) => {
                try {
                    const { uuid } = req.token.payload; // Get userId
                    const { id } = req.params;         // Get record id
    
                    // *** ส่ง userId และ id ให้ Service ***
                    const serviceResponse = await receiveForAClaimService.delete(uuid, id);
    
                    handleServiceResponse(serviceResponse, res);
                } catch (error) {
                    console.error("Error in DELETE request:", error);
                    res.status(500).json({ status: "error", message: "Internal Server Error" });
                }
            });

    router.get("/getById/:id",
        authenticateToken,
        authorizeByName("ใบรับเคลม", ["A"]),
        validateRequest(GetParamReceiveForAClaimSchema),
        async (req: Request, res: Response) => {
            try {
                const { id } = req.params;
                const serviceResponse = await receiveForAClaimService.findOne(id);
                handleServiceResponse(serviceResponse, res);
            } catch (error) {
                console.error("Error in GET request:", error);
                res.status(500).json({ status: "error", message: "Internal Server Error" });
            }
        });

    router.get("/payLoadForReceiveForAClaim",
        authenticateToken,
        authorizeByName("ใบรับเคลม", ["A"]),
        async (req: Request, res: Response) => {
            try {
                const companyId = req.token.company_id;
                const page = parseInt(req.query.page as string) || 1;
                const pageSize = parseInt(req.query.pageSize as string) || 12;
                const searchText = (req.query.searchText as string) || "";

                const serviceResponse = await receiveForAClaimService.findPayloadData(companyId, page, pageSize, searchText);
                handleServiceResponse(serviceResponse, res);
            } catch (error) {
                console.error("Error in GET request:", error);
                res.status(500).json({ status: "error", message: "Internal Server Error" });
            }
        });

        router.get("/getSendForClaimDoc",
            authenticateToken,
            authorizeByName("ใบรับเคลม", ["A"]),
            async (req: Request, res: Response) => {
                try {
                    const companyId = req.token.company_id;
                    const serviceResponse = await receiveForAClaimService.getSendForClaimDocs(companyId);
                    handleServiceResponse(serviceResponse, res);
                } catch (error) {
                    console.error("Error in GET request:", error);
                    res.status(500).json({ status: "error", message: "Internal Server Error" });
                }
            });

            router.get(
                "/get-receive-claim-docs-only", // ตั้งชื่อ path ให้สื่อความหมาย
                authenticateToken,
                // กำหนด Permission ที่เหมาะสม (อาจจะแค่ Read ก็พอ)
                authorizeByName("ใบรับเคลม", ["R", "A"]),
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
                        const serviceResponse = await receiveForAClaimService.findOnlyReceiveClaimDocsByCompanyId(company_id);
                        handleServiceResponse(serviceResponse, res);
        
                    } catch (error) {
                        console.error("Error in GET /get-receive-claim-docs-only request:", error);
                         handleServiceResponse(new ServiceResponse(
                                ResponseStatus.Failed,
                                "An unexpected error occurred while fetching receive for claim documents.",
                                null, 
                                StatusCodes.INTERNAL_SERVER_ERROR
                            ), res);
                    }
                }
            );

            router.get("/get-with-responsible/:id",
                authenticateToken,
                authorizeByName("ใบรับเคลม", ["A", "R"]), 
                validateRequest(GetParamReceiveForAClaimSchema), 
                async (req: Request, res: Response) => {
                    try {
                        const { id } = req.params;
        
                        const serviceResponse = await receiveForAClaimService.findResponsibleUserForReceiveForAClaim(id);
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

    return router;
})();