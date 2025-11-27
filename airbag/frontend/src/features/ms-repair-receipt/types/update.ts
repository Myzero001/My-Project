import { blobToFile } from "@/types/file";

export type repairReceiptUpdateType = {
  register: string;
  box_number: string;
  box_number_detail: string;
  repair_receipt_image_url: blobToFile[];
  repair_receipt_box_image_url: blobToFile[];

  remark?: string;
  total_price?: number;
  tax?: number;

  repair_receipt_at: string;
  estimated_date_repair_completion: string;
  expected_delivery_date: string;
};

export type repairReceiptBoxUpdateType = {
  chip_type: string;
  chip_no: string;

  tool_one_id?: string;
  tool_two_id?: string;
  tool_three_id?: string;
  for_tool_one_id?: string;
  for_tool_two_id?: string;
  for_tool_three_id?: string;

  issue_reason_id?: string;
  not_repair?: string;
  box_remark?: string;

  box_chip_image_url?: blobToFile[];
  box_before_file_url?: blobToFile[];
  box_after_file_url?: blobToFile[];
};

export type repairReceiptBoxClearByUpdateType = {
  clear_by_tool_one_id?: string;
  clear_by_tool_two_id?: string;
  clear_by_tool_three_id?: string;
};
