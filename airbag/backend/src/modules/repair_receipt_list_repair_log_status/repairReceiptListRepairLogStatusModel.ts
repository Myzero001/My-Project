import { z } from "zod";

export type TypePayloadRepairReceiptListRepairLogStatus = {
  repair_receipt_list_repair_id: string;
  list_repair_status: string;
  company_id?: string;

  created_by: string; // ผู้สร้างข้อมูล
};

export const CreateRepairReceiptListRepairLogStatusSchema = z.object({
  body: z.object({
    repair_receipt_list_repair_id: z.string(),
    list_repair_status: z.string(),
  }),
});
