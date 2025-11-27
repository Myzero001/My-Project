import express, { Request, Response } from "express";
import { handleServiceResponse, validateRequest } from "@common/utils/httpHandlers";
import { groupRepairService } from "@modules/ms-group-repair/ms-group-repairService";
import { 
    CreateGroupRepairSchema, 
    UpdateGroupRepairSchema, 
    GetGroupRepairSchema, 
    GetParamGroupRepairSchema 
} from "@modules/ms-group-repair/ms-group-repairModel";
import authenticateToken from "@common/middleware/authenticateToken";
import { authorizeByName } from "@common/middleware/permissions";

export const groupRouterRepair = (() => {
    const router = express.Router();

    router.get(
        "/get",
        authenticateToken,
        authorizeByName("กลุ่มซ่อม", ["A"]),
        async (req: Request, res: Response) => {
            const { company_id } = req.token.payload;
            const page = parseInt(req.query.page as string) || 1;
            const pageSize = parseInt(req.query.pageSize as string) || 12;
            const searchText = (req.query.searchText as string) || "";
            const ServiceResponse = await groupRepairService.findAll(company_id, page, pageSize,searchText);
            handleServiceResponse(ServiceResponse, res);
        }
    );    

    router.post(
        "/create",
        authenticateToken,
        authorizeByName("กลุ่มซ่อม", ["A"]),
        validateRequest(CreateGroupRepairSchema),
        async (req: Request, res: Response) => {
            const { company_id, uuid } = req.token.payload;
            const payload = req.body;

            const ServiceResponse = await groupRepairService.create(company_id, uuid, payload);
            handleServiceResponse(ServiceResponse, res);
        }
    );

    router.patch(
        "/update",
        authenticateToken,
        authorizeByName("กลุ่มซ่อม", ["A"]),
        validateRequest(UpdateGroupRepairSchema),
        async (req: Request, res: Response) => {
            const { company_id, uuid } = req.token.payload;
            const { master_group_repair_id } = req.body;
            const payload = req.body;

            const ServiceResponse = await groupRepairService.update(
                company_id,
                uuid,
                master_group_repair_id,
                payload
            );
            handleServiceResponse(ServiceResponse, res);
        }
    );

    router.delete(
        "/delete/:master_group_repair_id",
        authenticateToken,
        authorizeByName("กลุ่มซ่อม", ["A"]),
        validateRequest(GetParamGroupRepairSchema),
        async (req: Request, res: Response) => {
            const { company_id } = req.token.payload;
            const { master_group_repair_id } = req.params;

            const ServiceResponse = await groupRepairService.delete(company_id, master_group_repair_id);
            handleServiceResponse(ServiceResponse, res);
        }
    );

    router.get(
        "/get/:master_group_repair_id",
        authenticateToken,
        authorizeByName("กลุ่มซ่อม", ["A"]),
        validateRequest(GetParamGroupRepairSchema),
        async (req: Request, res: Response) => {
            const { company_id } = req.token.payload;
            const { master_group_repair_id } = req.params;

            const ServiceResponse = await groupRepairService.findById(company_id, master_group_repair_id);
            handleServiceResponse(ServiceResponse, res);
        }
    );

    router.get("/get-minimal", 
        authenticateToken, 
        authorizeByName("กลุ่มซ่อม", ["A"]), 
        async (req: Request, res: Response) => {
            const companyId = req.token.company_id;
            
            const ServiceResponse = await groupRepairService.findMinimal(companyId);
            handleServiceResponse(ServiceResponse, res);
        });




    return router;
})();
