import { commonValidations } from "@common/utils/commonValidation";
import { z } from "zod";

export type TypePayloadMasterToolingReason = {
    tooling_reason_name: string;
};

export const CreateToolingReasonSchema = z.object({
    body: z.object({
        tooling_reason_name: z.string().max(50),
    })
});

export const UpdateToolingReasonSchema = z.object({
    body: z.object({
        master_tooling_reason_id: z.string().uuid(),
        tooling_reason_name: z.string().max(50),
    })
});

export const GetToolingReasonSchema = z.object({
    params: z.object({
        master_tooling_reason_id: commonValidations.uuid,
    })
});

export const GetParamToolingReasonSchema = z.object({
    params: z.object({
        master_tooling_reason_id: commonValidations.uuid,
    })
});

export const SelectSchema = z.object({
  query: z.object({ searchText: z.string().optional() })
})