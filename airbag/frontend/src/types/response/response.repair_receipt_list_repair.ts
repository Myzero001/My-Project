export type repairReceiptListRepair = {
  id: string;
  quotation_id: string;
  master_repair_receipt_id: string;
  master_repair_id: string;
  price: number;
  status: string;
  sending_status: string;
  barcode: string;
  created_at: string;
  updated_at: string;
  company_id: string;
  master_repair: {
    master_repair_id: string;
    master_repair_name: string;
  };
  master_repair_name?: string;

  is_active: boolean;
};
