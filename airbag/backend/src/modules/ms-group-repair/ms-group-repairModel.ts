import { commonValidations } from "@common/utils/commonValidation";
import { z } from "zod";

export type TypePayloadMasterGroupRepair = {
    group_repair_name: string;
};

export const CreateGroupRepairSchema = z.object({
    body: z.object({
        group_repair_name: z.string().max(50),
    })
});

export const UpdateGroupRepairSchema = z.object({
    body: z.object({
        master_group_repair_id: z.string().uuid(),
        group_repair_name: z.string().max(50),
    })
});

export const GetGroupRepairSchema = z.object({
    params: z.object({
        master_group_repair_id: commonValidations.uuid,
    })
});

export const GetParamGroupRepairSchema = z.object({
    params: z.object({
        master_group_repair_id: commonValidations.uuid,
    })
});