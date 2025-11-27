import { repairReceiptListRepair } from "./response.repair_receipt_list_repair";
import { MS_USER_ALL } from "./response.user";

export type REPAIR_RECEIPT_LIST_REPAIR_LOG_STATUS = {
  id: string;
  repair_receipt_id: string;
  list_repair_status: string;
  created_by: string;
  created_at: string;
  updated_at: string;
  company_id: string;
  profile: MS_USER_ALL;
  repair_receipt_list_repair: repairReceiptListRepair;
};
