export interface PayLoadUpdateCheckedBox {
  id: string;
  statusDate: string;
}

export interface PayLoadUpdateUnCheckBox {
  id: string;
}
export interface PayLoadUpdateIsActiveStatus {
  id: string;
  is_active: boolean;
}

export interface PayLoadCreateRepairReceiptListRepair {
  quotation_id: string;
  master_repair_id: string;
  master_repair_receipt_id: string;
  price: number;
  status: string;
}
