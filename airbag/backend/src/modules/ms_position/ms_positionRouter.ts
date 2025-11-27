// ms_positionRouter.ts
import express, { Request, Response } from "express";
import { handleServiceResponse, validateRequest } from "@common/utils/httpHandlers"
import { ms_positionService } from "@modules/ms_position/ms_positionService"
import { CreateMsPositionSchema, UpdateMsPositionSchema, GetMsPositionSchema, GetParamMsPositionSchema , SelectSchema } from "@modules/ms_position/ms_positionModel"
import authenticateToken from "@common/middleware/authenticateToken";
import authorizeAll from "@common/middleware/authorizeAll";
import { authorizeByName } from "@common/middleware/permissions";

export const mspositionRouter = (() => {
    const router = express.Router();

    router.get("/get",
        authenticateToken,
        authorizeByName("ตำแหน่ง", ["A"]),
        async (req: Request, res: Response) => {
            try {
                const companyId = req.token.company_id;
                const page = parseInt(req.query.page as string) || 1;
                const pageSize = parseInt(req.query.pageSize as string) || 12;
                const searchText = (req.query.searchText as string) || "";

                const ServiceResponse = await ms_positionService.findAll(companyId, page, pageSize, searchText);
                handleServiceResponse(ServiceResponse, res);
            } catch (error) {
                console.error("Error in GET request:", error);
                res.status(500).json({ status: "error", message: "Internal Server Error" });
            }
        });

    router.post("/create",
        authenticateToken,
        authorizeByName("ตำแหน่ง", ["A"]),
        validateRequest(CreateMsPositionSchema),
        async (req: Request, res: Response) => {
            try {
                const { company_id, uuid } = req.token.payload;
                const companyId = company_id;
                const userId = uuid;
                const payload = req.body;

                const ServiceResponse = await ms_positionService.create(companyId, userId, payload);
                handleServiceResponse(ServiceResponse, res);
            } catch (error) {
                console.error("Error in POST request:", error);
                res.status(500).json({ status: "error", message: "Internal Server Error" });
            }
        });

    router.patch("/update",
        authenticateToken,
        authorizeByName("ตำแหน่ง", ["A"]),
        validateRequest(UpdateMsPositionSchema),
        async (req: Request, res: Response) => {
            try {
                const { company_id, uuid } = req.token.payload;
                const companyId = company_id;
                const userId = uuid;
                const { position_id } = req.body;
                const payload = req.body;

                const ServiceResponse = await ms_positionService.update(companyId, userId, position_id, payload);
                handleServiceResponse(ServiceResponse, res);
            } catch (error) {
                console.error("Error in PATCH request:", error);
                res.status(500).json({ status: "error", message: "Internal Server Error" });
            }
        });

    router.delete("/delete/:position_id",
        authenticateToken,
        authorizeByName("ตำแหน่ง", ["A"]),
        validateRequest(GetParamMsPositionSchema),
        async (req: Request, res: Response) => {
            try {
                const { company_id } = req.token.payload;
                const companyId = company_id;
                const { position_id } = req.params;

                const ServiceResponse = await ms_positionService.delete(companyId, position_id);
                handleServiceResponse(ServiceResponse, res);
            } catch (error) {
                console.error("Error in DELETE request:", error);
                res.status(500).json({ status: "error", message: "Internal Server Error" });
            }
        });

    router.get("/get/:position_id",
    authenticateToken,
    authorizeByName("ตำแหน่ง", ["A"]),
    validateRequest(GetParamMsPositionSchema),
    async (req: Request, res: Response) => {
        try {
            const companyId = req.token.company_id;

            const { position_id } = req.params;
            const ServiceResponse = await ms_positionService.findById(companyId, position_id);
            handleServiceResponse(ServiceResponse, res);
        } catch (error) {
            console.error("Error in GET request:", error);
            res.status(500).json({ status: "error", message: "Internal Server Error" });
        }
    });

    router.get("/select",
        authenticateToken,
        authorizeByName("ตำแหน่ง", ["A", "R"]),
        validateRequest(SelectSchema),
        async (req: Request, res: Response) => {
        const { company_id } = req.token.payload;
        const searchText = (req.query.searchText as string) || "";
        const companyId = company_id;
        const ServiceResponse = await ms_positionService.select(companyId, searchText);
        handleServiceResponse(ServiceResponse, res);
        }
    );
    return router
})();
