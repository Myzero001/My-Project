import { z } from "zod";

export type TypePayloadQuotationRepair = {
  master_repair_id: string;
  quotation_id: string;
  price: number;
  created_at?: Date;
  updated_at?: Date;
};

export const CreateQuotationRepairSchema = z.object({
  body: z.object({
    quotation_id: z.string(),
    master_repair_id: z.string(),
    price: z.number().min(0),
  }),
});

export const UpdateQuotationRepairSchema = z.object({
  body: z.object({
    id: z.string(),
    quotation_id: z.string(),
    master_repair_id: z.string(),
    price: z.number().min(0),
  }),
});

// export const UpdateQuotationRepairStatusSchema = z.object({
//   body: z.object({
//     id: z.string(),
//     status: z.string(),
//   }),
// });

// export const UpdateQuotationRepairsendingSchema = z.object({
//   body: z.object({
//     id: z.string(),
//     sending_status: z.string(),
//   }),
// });

// export const UpdateQuotationRepairBarcodeSchema = z.object({
//   body: z.object({
//     id: z.string(),
//     barcode: z.string(),
//   }),
// });

export const GetParamQuotationRepairSchema = z.object({
  params: z.object({
    quotation_doc: z
      .string()
      .max(14, "Quotation Doc should not exceed 14 characters"),
  }),
});
