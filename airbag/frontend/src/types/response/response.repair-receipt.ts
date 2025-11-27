import { QUOTATION_ALL } from "./response.quotation";

export type repairReceipt = {
  id: string;
  repair_receipt_doc: string;
  repair_receipt_status: string;
  register?: string;
  box_number?: string;
  box_number_detail?: string;
  estimated_date_repair_completion?: string;
  expected_delivery_date?: string;

  repair_receipt_at?: string;
  repair_receipt_image_url?: string;
  repair_receipt_box_image_url?: string;

  chip_type?: string;
  chip_no?: string;

  box_chip_image_url?: string;
  box_before_file_url?: string;
  box_after_file_url?: string;
  clear_by_tool_one_id?: string;
  clear_by_tool_three_id?: string;
  clear_by_tool_two_id?: string;
  for_tool_one_id?: string;
  for_tool_three_id?: string;
  for_tool_two_id?: string;
  tool_one_id?: string;
  tool_two_id?: string;
  tool_three_id?: string;

  remark?: string;
  box_remark?: string;

  total_price?: number;
  tax?: number;

  quotation_id: string;
  company_id: string;

  not_repair?: string;
  issue_reason_id?: string;

  master_quotation: QUOTATION_ALL;
  master_issue_reason: QUOTATION_ALL;
  master_clear_by_one: QUOTATION_ALL;
  master_clear_by_two: QUOTATION_ALL;
  master_clear_by_three: QUOTATION_ALL;
  master_tool_one: QUOTATION_ALL;
  master_tool_two: QUOTATION_ALL;
  master_tool_three: QUOTATION_ALL;
  master_tooling_reason_one: QUOTATION_ALL;
  master_tooling_reason_two: QUOTATION_ALL;
  master_tooling_reason_three: QUOTATION_ALL;

  created_at?: string;
  created_by?: string;
  updated_at?: string;
  updated_by?: string;
};

export type repairReceiptForJob = {
  repair_receipt_doc: string;
  register: string;
  contact_name: string;
  brandmodel_name: string;
  deal_closed_date?: string | null;
  estimated_date_repair_completion: string;
  quotation_status: string;
};

export type TypeRepairReceiptDoc = {
  id: string;
  repair_receipt_doc: string;
};

export type TypeRepairReceiptDocResponse = {
  success: boolean;
  message: string;
  responseObject: TypeRepairReceiptDoc[];
  statusCode: number;
};

export type RepairReceiptSelectItem = {
  id: string;
  repair_receipt_doc: string;
};
  
export type RepairReceiptSelectResponse = {
  success: boolean;
  message: string;
  responseObject: {
    data: RepairReceiptSelectItem[];
  };
  statusCode: number;
};