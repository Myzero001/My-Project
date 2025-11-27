import express, { Request, Response } from "express";
import { handleServiceResponse, validateRequest } from "@common/utils/httpHandlers";
import { receiveForAClaimListService } from "./receiveForClaimListService";
import {
    CreateReceiveForAClaimListSchema,
    CreateMultipleReceiveForAClaimListSchema,
    UpdateReceiveForAClaimListSchema,
    GetParamReceiveForAClaimListSchema,
    GetByReceiveForAClaimIdSchema,
    GetParamPayloadListSchema,
} from "./receiveForClaimListModel";
import authenticateToken from "@common/middleware/authenticateToken";
import authorizeAll from "@common/middleware/authorizeAll";
import { authorizeByName } from "@common/middleware/permissions";

export const receiveForAClaimListRouter = (() => {
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

                const serviceResponse = await receiveForAClaimListService.findAll(companyId, page, pageSize, searchText);
                handleServiceResponse(serviceResponse, res);
            } catch (error) {
                console.error("Error in GET request:", error);
                res.status(500).json({ status: "error", message: "Internal Server Error" });
            }
        });

    router.get("/getByReceiveForAClaimId/:receive_for_a_claim_id",
        authenticateToken,
        authorizeByName("ใบรับเคลม", ["A"]),
        validateRequest(GetByReceiveForAClaimIdSchema),
        async (req: Request, res: Response) => {
            try {
                const { receive_for_a_claim_id } = req.params;
                const serviceResponse = await receiveForAClaimListService.findByReceiveForAClaimId(receive_for_a_claim_id);
                handleServiceResponse(serviceResponse, res);
            } catch (error) {
                console.error("Error in GET request:", error);
                res.status(500).json({ status: "error", message: "Internal Server Error" });
            }
        });

    router.post("/create",
        authenticateToken,
        authorizeByName("ใบรับเคลม", ["A"]),
        validateRequest(CreateReceiveForAClaimListSchema),
        async (req: Request, res: Response) => {
            try {
                const { uuid, company_id } = req.token.payload;
                const payload = req.body;
    
                const serviceResponse = await receiveForAClaimListService.create(uuid, payload, company_id);
                handleServiceResponse(serviceResponse, res);
            } catch (error) {
                console.error("Error in POST request:", error);
                res.status(500).json({ status: "error", message: "Internal Server Error" });
            }
        });
        
    router.post("/createMany",
        authenticateToken,
        authorizeByName("ใบรับเคลม", ["A"]),
        validateRequest(CreateMultipleReceiveForAClaimListSchema),
        async (req: Request, res: Response) => {
            try {
                const { uuid, company_id } = req.token.payload;
                const { items } = req.body;
    
                const serviceResponse = await receiveForAClaimListService.createMany(uuid, items, company_id);
                handleServiceResponse(serviceResponse, res);
            } catch (error) {
                console.error("Error in POST request:", error);
                res.status(500).json({ status: "error", message: "Internal Server Error" });
            }
        });

    router.patch("/update/:id",
        authenticateToken,
        authorizeByName("ใบรับเคลม", ["A"]),
        validateRequest(UpdateReceiveForAClaimListSchema),
        async (req: Request, res: Response) => {
            try {
                const { uuid } = req.token.payload;
                const { id } = req.params;
                const payload = req.body;
                const serviceResponse = await receiveForAClaimListService.update(
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
        validateRequest(GetParamReceiveForAClaimListSchema),
        async (req: Request, res: Response) => {
            try {
                const { id } = req.params;
                const serviceResponse = await receiveForAClaimListService.delete(id);
                handleServiceResponse(serviceResponse, res);
            } catch (error) {
                console.error("Error in DELETE request:", error);
                res.status(500).json({ status: "error", message: "Internal Server Error" });
            }
        });

    router.get("/getById/:id",
        authenticateToken,
        authorizeByName("ใบรับเคลม", ["A"]),
        validateRequest(GetParamReceiveForAClaimListSchema),
        async (req: Request, res: Response) => {
            try {
                const { id } = req.params;
                const serviceResponse = await receiveForAClaimListService.findOne(id);
                handleServiceResponse(serviceResponse, res);
            } catch (error) {
                console.error("Error in GET request:", error);
                res.status(500).json({ status: "error", message: "Internal Server Error" });
            }
        });

        router.get(
            "/payLoadForReceiveForAClaimList/:receive_for_a_claim_id/:send_for_a_claim_id",
            authenticateToken,
            authorizeByName("ใบรับเคลม", ["A"]),
            validateRequest(GetParamPayloadListSchema),
            async (req: Request, res: Response) => {
                try {
                    const companyId = req.token.company_id;
                    const { receive_for_a_claim_id, send_for_a_claim_id } = req.params;
                    
                    const serviceResponse = await receiveForAClaimListService.findPayloadList(
                        companyId, 
                        receive_for_a_claim_id,
                        send_for_a_claim_id
                    );
                    handleServiceResponse(serviceResponse, res);
                } catch (error) {
                    console.error("Error in GET payload list request:", error);
                    res.status(500).json({ status: "error", message: "Internal Server Error" });
                }
            }
        );

    return router;
})();