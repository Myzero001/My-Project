import { z } from "zod";

export enum PAYMENT_EDITS_STATUS {
  PENDING = "pending",
  APPROVED = "approved",
  REJECTED = "rejected",
  CANCELED = "canceled",
}

export type TypePayloadPaymentEdits = {
  id?: string;
  payment_id: string;
  old_data: string;
  new_data: string;
  edit_status: string;
  remark?: string;

  company_id?: string;

  created_at?: Date; // วันที่สร้างข้อมูล (รูปแบบ YYYY-MM-DD)
  created_by?: string; // ผู้สร้างข้อมูล
  updated_at?: Date; // วันที่อัปเดตข้อมูล (อาจมีหรือไม่มีก็ได้)
  updated_by?: string; // ผู้ที่อัปเดตข้อมูล (อาจมีหรือไม่มีก็ได้)
};

export const GetPaymentEditsByIdSchema = z.object({
  params: z.object({
    id: z.string(),
  }),
});

export const CreatePaymentEditsSchema = z.object({
  body: z.object({
    payment_id: z.string(),
    old_data: z.string(),
    new_data: z.string(),
    remark: z.string(),
  }),
});

export const UpdatePaymentEditsSchema = z.object({
  body: z.object({
    id: z.string(),
    old_data: z.string().optional(),
    new_data: z.string().optional(),
    remark: z.string().optional(),
    edit_status: z.string().optional(),
  }),
});

export const UpdatePaymentStatusSchema = z.object({
  body: z.object({
    id: z.string(),
    remark: z.string(),
  }),
});
