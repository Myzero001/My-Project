import { z } from "zod";
import { commonValidations } from "@common/utils/commonValidation";

export enum REPAIR_RECEIPT_STATUS {
  PENDING = "pending",
  SUCCESS = "success",
  CANCEL = "cancel",
}

export type TypePayloadRepairReceipt = {
  id?: string;
  repair_receipt_doc: string;
  repair_receipt_status: string;
  repair_receipt_at: string;
  estimated_date_repair_completion: string;
  expected_delivery_date: string;
  register?: string;
  box_number?: string;
  box_number_detail?: string;

  repair_receipt_image_url?: string;
  repair_receipt_box_image_url?: string;

  box_chip_image_url?: string;
  box_before_file_url?: string;
  box_after_file_url?: string;

  chip_type?: string;
  chip_no?: string;

  tool_one_id?: string;
  for_tool_one_id?: string;
  clear_by_tool_one_id?: string;

  tool_two_id?: string;
  for_tool_two_id?: string;
  clear_by_tool_two_id?: string;

  tool_three_id?: string;
  for_tool_three_id?: string;
  clear_by_tool_three_id?: string;

  issue_reason_id?: string;
  company_id?: string;
  not_repair?: string;

  remark?: string;
  box_remark?: string;

  total_price?: number;
  tax?: number;

  quotation_id: string;
  responsible_by?: string;

  created_at?: Date; // วันที่สร้างข้อมูล (รูปแบบ YYYY-MM-DD)
  created_by?: string; // ผู้สร้างข้อมูล
  updated_at?: Date; // วันที่อัปเดตข้อมูล (อาจมีหรือไม่มีก็ได้)
  updated_by?: string; // ผู้ที่อัปเดตข้อมูล (อาจมีหรือไม่มีก็ได้)
};

export const CreateRepairReceiptSchema = z.object({
  body: z.object({
    repair_receipt_status: z.string().optional(),
    register: z.string().optional(),
    box_number: z.string().optional(),
    box_number_detail: z.string().optional(),

    repair_receipt_image_url: z.string().optional(),
    box_before_file_url: z.string().optional(),
    box_after_file_url: z.string().optional(),

    chip_type: z.string().optional(),
    chip_no: z.string().optional(),

    quotation_id: z.string(),
    tool_id: z.string().optional(),
    issue_reason_id: z.string().optional(),

    remark: z.string().optional(),
    box_remark: z.string().optional(),
    total_price: z.string().optional(),
  }),
});

// Schema สำหรับการอัปเดต RepairReceipt
export const UpdateRepairReceiptSchema = z.object({
  body: z.object({
    id: z.string(),
    repair_receipt_status: z.string().optional(),
    register: z.string().optional(),
    box_number: z.string().optional(),
    box_number_detail: z.string().optional(),

    repair_receipt_image_url: z.string().optional(),
    box_before_file_url: z.string().optional(),
    box_after_file_url: z.string().optional(),

    chip_type: z.string().optional(),
    chip_no: z.string().optional(),

    tool_one_id: z.string().optional(),
    tool_two_id: z.string().optional(),
    tool_three_id: z.string().optional(),
    for_tool_one_id: z.string().optional(),
    for_tool_two_id: z.string().optional(),
    for_tool_three_id: z.string().optional(),
    clear_by_tool_one_id: z.string().optional(),
    clear_by_tool_two_id: z.string().optional(),
    clear_by_tool_three_id: z.string().optional(),

    issue_reason_id: z.string().optional(),

    remark: z.string().optional(),
    box_remark: z.string().optional(),
    total_price: z.number().optional(),
    tax: z.number().optional(),
  }),
});

export const UpdateStatusRepairReceiptSchema = z.object({
  body: z.object({
    id: z.string(),
  }),
});

export const deleteRepairReceiptSchema = z.object({
  params: z.object({
    id: z.string(),
  }),
});

export interface RepairDocItem {
  id: string;
  repair_receipt_doc: string;
}

export const SelectSchema = z.object({
  query: z.object({ searchText: z.string().optional() })
})