export type RequestUpdateRepairReceipt = {
  id: string;
  register: string;
  box_number: string;
  box_number_detail: string;
  repair_receipt_image_url: string;
  repair_receipt_box_image_url: string;
  responsible_by?: string;
  repair_receipt_at: string;
  estimated_date_repair_completion: string;
  expected_delivery_date: string;

  remark: string;

  total_price?: number;
  tax?: number;
};

export type RequestUpdateRepairReceiptBox = {
  id: string;

  box_chip_image_url?: string;
  box_before_file_url?: string;
  box_after_file_url?: string;

  chip_type?: string;
  chip_no?: string;

  tool_one_id?: string;
  for_tool_one_id?: string;

  tool_two_id?: string;
  for_tool_two_id?: string;

  tool_three_id?: string;
  for_tool_three_id?: string;

  issue_reason_id?: string;
  not_repair?: string;

  box_remark?: string;
};
export type RequestUpdateRepairReceiptBoxCleayby = {
  id: string;

  clear_by_tool_one_id?: string;
  clear_by_tool_two_id?: string;
  clear_by_tool_three_id?: string;
};
