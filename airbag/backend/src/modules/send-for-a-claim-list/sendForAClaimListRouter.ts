import express, { Request, Response } from "express";
import { handleServiceResponse, validateRequest } from "@common/utils/httpHandlers";
import authenticateToken from "@common/middleware/authenticateToken";
import authorizeAll from "@common/middleware/authorizeAll";
import { sendForAClaimListService } from "@modules/send-for-a-claim-list/sendForAClaimListService";
import { CreateSendForAClaimListSchema, UpdateSendForAClaimListSchema, GetParamSendForAClaimListSchema, SubmitSendForAClaimListSchema } from "@modules/send-for-a-claim-list/sendForAClaimListModel";

import { authorizeByName } from "@common/middleware/permissions";


export const sendForAClaimListRouter = (() => {
    const router = express.Router();

    router.get("/get",
        authenticateToken,
        authorizeByName("ใบส่งเคลม", ["A"]),
        async (req: Request, res: Response) => {
            try {
                const companyId = req.token.company_id;

                const { send_for_a_claim_id } = req.params;
                const serviceResponse = await sendForAClaimListService.findAll(companyId);
                handleServiceResponse(serviceResponse, res);
            } catch (error) {
                console.error("Error in GET request:", error);
                res.status(500).json({ status: "error", message: "Internal Server Error" });
            }
        });

    router.post("/create",
        authenticateToken,
        authorizeByName("ใบส่งเคลม", ["A"]),
        validateRequest(CreateSendForAClaimListSchema),
        async (req: Request, res: Response) => {
            try {
                const { company_id, uuid } = req.token.payload;
                const companyId = company_id;
                const userId = uuid;
                const payload = req.body;
                const serviceResponse = await sendForAClaimListService.create(companyId, userId, payload);
                handleServiceResponse(serviceResponse, res);
            } catch (error) {
                console.error("Error in POST request:", error);
                res.status(500).json({ status: "error", message: "Internal Server Error" });
            }
        });

    router.patch("/update",
        authenticateToken,
        authorizeByName("ใบส่งเคลม", ["A"]),
        validateRequest(UpdateSendForAClaimListSchema),
        async (req: Request, res: Response) => {
            try {
                const { company_id, uuid } = req.token.payload;
                const companyId = company_id;
                const userId = uuid;
                const { send_for_a_claim_list_id } = req.body;
                const payload = req.body;
                const serviceResponse = await sendForAClaimListService.update(companyId, userId, send_for_a_claim_list_id, payload);
                handleServiceResponse(serviceResponse, res);
            } catch (error) {
                console.error("Error in PATCH request:", error);
                res.status(500).json({ status: "error", message: "Internal Server Error" });
            }
        });

    router.delete("/delete/:send_for_a_claim_list_id",
        authenticateToken,
        authorizeByName("ใบส่งเคลม", ["A"]),
        validateRequest(GetParamSendForAClaimListSchema),
        async (req: Request, res: Response) => {
            try {
                const { company_id } = req.token.payload;
                const companyId = company_id;
                const { send_for_a_claim_list_id } = req.params;
                const ServiceResponse = await sendForAClaimListService.delete(companyId, send_for_a_claim_list_id);
                handleServiceResponse(ServiceResponse, res);
            } catch (error) {
                console.error("Error in DELETE request:", error);
                res.status(500).json({ status: "error", message: "Internal Server Error" });
            }
        });

    router.get("/getByID/:send_for_a_claim_list_id",
        authenticateToken,
        authorizeByName("ใบส่งเคลม", ["A"]),
        validateRequest(GetParamSendForAClaimListSchema),
        async (req: Request, res: Response) => {
            try {
                const { company_id } = req.token.payload;
                const companyId = company_id;
                const { send_for_a_claim_list_id } = req.params;
                const serviceResponse = await sendForAClaimListService.findById(companyId, send_for_a_claim_list_id);
                handleServiceResponse(serviceResponse, res);
            } catch (error) {
                console.error("Error in GET request:", error);
                res.status(500).json({ status: "error", message: "Internal Server Error" });
            }
        });

    router.post("/update-data",
        authenticateToken,
        authorizeByName("ใบส่งเคลม", ["A"]),
        validateRequest(SubmitSendForAClaimListSchema),
        async (req: Request, res: Response) => {
            try {
                const { company_id, uuid } = req.token.payload;
                const companyId = company_id;
                const userId = uuid;
                const payload = req.body;
                const serviceResponse = await sendForAClaimListService.updateData(companyId, userId, payload);
                handleServiceResponse(serviceResponse, res);
            } catch (error) {
                console.error("Error in POST request:", error);
                res.status(500).json({ status: "error", message: "Internal Server Error" });
            }
        });
    return router;
})();