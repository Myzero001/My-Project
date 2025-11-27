// ms_positionModel.ts
import { commonValidations } from "@common/utils/commonValidation";
import { z } from "zod";

export type TypePayloadMasterPosition = {
    position_name: string
};

export const CreateMsPositionSchema = z.object({
    body: z.object({
        position_name: z.string().max(50)
    })
});

export const UpdateMsPositionSchema = z.object({
    body: z.object({
        position_id: commonValidations.uuid,
        position_name: z.string().max(50)
    })
});

export const GetMsPositionSchema = z.object({
    body: z.object({
        position_id: commonValidations.uuid,
    })
});

export const GetParamMsPositionSchema = z.object({
    params: z.object({
        position_id: commonValidations.uuid
    })
});

export const SelectSchema = z.object({
  query: z.object({ searchText: z.string().optional() })
})