import { z } from "zod";

export type TypePayloadQuotationLogStatus = {
  quotation_id: string;
  quotation_status: string;
  remark?: string;
  company_id?: string;

  created_by: string; // ผู้สร้างข้อมูล
};

export const CreateQuotationLogStatusSchema = z.object({
  body: z.object({
    quotation_id: z.string(),
    quotation_status: z.string(),
    remark: z.string().optional(),
  }),
});

export const UpdateQuotationSchema = z.object({
  body: z.object({
    quotation_id: z.string(),
    quotation_status: z.string(),
    remark: z.string().optional(),
  }),
});

export const GetParamQuotationSchema = z.object({
  params: z.object({
    quotation_doc: z
      .string()
      .max(14, "Quotation Doc should not exceed 14 characters"),
  }),
});
