import { z } from "zod";

export type TypePayloadMasterBrandModel = {
  brandmodel_name: string;
  master_brand_id?: string;
};

export const CreateBrandModelSchema = z.object({
  body: z.object({
    brandmodel_name: z.string(),
    master_brand_id: z.string().uuid().optional(),
  }),
});

export const FindByBrandSchema = z.object({
  body: z.object({
    master_brand_id: z.string().uuid().optional(),
  }),
});
export const UpdateBrandModelSchema = z.object({
  body: z.object({
    ms_brandmodel_id: z.string().uuid(),
    brandmodel_name: z.string().max(50),
    master_brand_id: z.string().uuid().optional(),
  }),
});

export const GetParamBrandModelSchema = z.object({
  params: z.object({
    ms_brandmodel_id: z.string().uuid(),
  }),
});


export const SelectSchema = z.object({
  query: z.object({ searchText: z.string().optional() }),
  params: z.object({ brand_id: z.string() })
})