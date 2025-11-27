import { commonValidations } from "@common/utils/commonValidation";
import { z } from "zod";

export type TypePayloadMasterClearBy = {
    clear_by_name:string;
};
export const CreateCelarBySchema = z.object({
    body:z.object({
        clear_by_name:z.string().max(50),
    })
});

export const UpdateCelarBySchema = z.object({
    body:z.object({
        clear_by_id:z.string().uuid(),
        clear_by_name:z.string().max(50),
    })
});

export const GetClearBySchema = z.object({
    params:z.object({
        clear_by_id:commonValidations.uuid
    })
})

export const GetParamClearBySchema = z.object({
    params:z.object({
        clear_by_id:commonValidations.uuid
    })
});

export const SelectSchema = z.object({
  query: z.object({ searchText: z.string().optional() })
})