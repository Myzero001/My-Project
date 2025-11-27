import { z } from "zod";

export enum REPAIR_RECEIPT_LIST_REPAIR_STATUS {
  PENDING = "pending",
  SUCCESS = "success",
}

export type TypePayloadRepairReceiptListRepair = {
  quotation_id: string;
  master_repair_id: string;
  master_repair_receipt_id: string;
  price: number;
  status: string;
  sending_status?: string;
  barcode: string;
  created_at?: Date;
  updated_at?: Date;
  status_date?: string;
  status_by?: string;
  company_id?: string;
  is_active?: boolean;
};

export const CreateRepairReceiptListRepairSchema = z.object({
  body: z.object({
    quotation_id: z.string(),
    master_repair_id: z.string(),
    master_repair_receipt_id: z.string(),
    price: z.number().min(0),
    status: z.string(),
  }),
});

export const UpdateRepairReceiptListRepairSchema = z.object({
  body: z.object({
    id: z.string(),
    quotation_id: z.string(),
    master_repair_id: z.string(),
    master_repair_receipt_id: z.string(),
    price: z.number().min(0),
  }),
});

export const UpdateRepairReceiptListRepairStatusSchema = z.object({
  body: z.object({
    id: z.string(),
    status: z.string(),
  }),
});

export const UpdateRepairReceiptListRepairsendingSchema = z.object({
  body: z.object({
    id: z.string(),
    sending_status: z.string(),
  }),
});

export const UpdateRepairReceiptListRepairBarcodeSchema = z.object({
  body: z.object({
    id: z.string(),
    barcode: z.string(),
  }),
});

export const UpdateRepairReceiptListRepairStatusIsActiveSchema = z.object({
  body: z.object({
    id: z.string(),
    is_active: z.boolean(),
  }),
});

export const DeleteRepairReceiptListRepairBarcodeSchema = z.object({
  body: z.object({
    ids: z.string(),
  }),
});

export const GetParamRepairReceiptListRepairSchema = z.object({
  params: z.object({
    quotation_doc: z
      .string()
      .max(14, "Quotation Doc should not exceed 14 characters"),
  }),
});
