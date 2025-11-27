import { commonValidations } from "@common/utils/commonValidation";
import { z } from "zod"


export type TypePayloadMasterRepair = {
    master_repair_name: string;
    master_group_repair_id: string
};
export const CreateRepairSchema = z.object({
    body: z.object({
        master_repair_name: z.string().max(50),
        master_group_repair_id: z.string().uuid().optional(),
    })
});

export const UpdateRepairSchema = z.object({
    body: z.object({
        master_repair_id: commonValidations.uuid,
        master_repair_name: z.string().max(50),
        master_group_repair_id: z.string().uuid().optional(),
    })
});

export const GetRepairSchema = z.object({
    params: z.object({
        master_repair_id: commonValidations.uuid,
    })
});

export const GetParamRepairSchema = z.object({
    params: z.object({
        master_repair_id: commonValidations.uuid,
    })
});