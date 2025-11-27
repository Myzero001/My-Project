import { commonValidations } from "@common/utils/commonValidation";
import { z } from "zod";

export type TypePayloadMasterBrand = {
    brand_name: string;
};

export const CreateBrandSchema = z.object({
    body: z.object({
        brand_name: z.string().max(50),
    })
});

export const UpdateBrandSchema = z.object({
    body: z.object({
        master_brand_id: z.string().uuid(),
        brand_name: z.string().max(50),
    })
});

export const GetBrandSchema = z.object({
    params: z.object({
        master_brand_id: commonValidations.uuid,
    })
});

export const GetParamBrandSchema = z.object({
    params: z.object({
        master_brand_id: commonValidations.uuid,
    })
});

export const SelectSchema = z.object({
  query: z.object({ searchText: z.string().optional() })
})