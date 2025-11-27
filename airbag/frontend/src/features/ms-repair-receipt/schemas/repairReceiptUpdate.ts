import { z, ZodType } from "zod"; // Add new import
import {
  repairReceiptBoxClearByUpdateType,
  repairReceiptBoxUpdateType,
  repairReceiptUpdateType,
} from "../types/update";

// @ts-ignore
export const RepairReceiptCreateSchema: ZodType<repairReceiptUpdateType> =
  z.object({
    register: z.string().min(1, { message: "กรุณาระบุทะเบียน" }),
    box_number: z.string().min(1, { message: "กรุณาระบุเบอร์กล่อง" }),
    box_number_detail: z
      .string()
      .min(1, { message: "กรุณาระบุรายละเอียดเบอร์กล่อง" }),
    repair_receipt_image_url: z.array(z.any().optional()),
    repair_receipt_box_image_url: z.array(z.any().optional()),
    remark: z.string().optional(),
    total_price: z.number().optional(),
    tax: z.number().optional(),
    repair_receipt_at: z
      .string()
      .regex(/^\d{4}-\d{2}-\d{2}$/, "Invalid date format (YYYY-MM-DD)"),
    estimated_date_repair_completion: z
      .string()
      .regex(/^\d{4}-\d{2}-\d{2}$/, "Invalid date format (YYYY-MM-DD)"),
    expected_delivery_date: z
      .string()
      .regex(/^\d{4}-\d{2}-\d{2}$/, "Invalid date format (YYYY-MM-DD)"),
  });

// @ts-ignore
export const RepairReceiptBoxUpdateSchema: ZodType<repairReceiptBoxUpdateType> =
  z.object({
    chip_type: z.string().min(1, { message: "กรุณาระบุ chip type" }),
    chip_no: z.string().min(1, { message: "กรุณาระบุ chip no" }),

    tool_one_id: z.string().optional(),
    tool_two_id: z.string().optional(),
    tool_three_id: z.string().optional(),
    for_tool_one_id: z.string().optional(),
    for_tool_two_id: z.string().optional(),
    for_tool_three_id: z.string().optional(),

    issue_reason_id: z.string().optional(),
    not_repair: z.string().optional(),
    box_remark: z.string().optional(),

    box_chip_image_url: z.array(z.any().optional()),
    box_before_file_url: z.array(z.any().optional()),
    box_after_file_url: z.array(z.any().optional()),
  });

export const RepairReceiptBoxClearByUpdateType: ZodType<repairReceiptBoxClearByUpdateType> =
  z.object({
    clear_by_tool_one_id: z.string().optional(),
    clear_by_tool_two_id: z.string().optional(),
    clear_by_tool_three_id: z.string().optional(),
  });
