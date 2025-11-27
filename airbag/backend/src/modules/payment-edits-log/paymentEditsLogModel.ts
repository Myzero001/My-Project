import { z } from "zod";

export type TypePayloadPaymentEditsLog = {
  payment_edit_id: string;
  payment_id: string;
  old_data: string;
  new_data: string;
  edit_status: string;
  company_id?: string;
  remark?: string;

  created_at?: Date; // วันที่สร้างข้อมูล (รูปแบบ YYYY-MM-DD)
  created_by?: string; // ผู้สร้างข้อมูล
  updated_at?: Date; // วันที่อัปเดตข้อมูล (อาจมีหรือไม่มีก็ได้)
  updated_by?: string; // ผู้ที่อัปเดตข้อมูล (อาจมีหรือไม่มีก็ได้)
};

export const CreatePayloadPaymentEditsLogSchema = z.object({
  body: z.object({
    payment_edit_id: z.string(),
    payment_id: z.string(),
    old_data: z.string(),
    new_data: z.string(),
    edit_status: z.string().optional(),
    remark: z.string().optional(),
  }),
});
