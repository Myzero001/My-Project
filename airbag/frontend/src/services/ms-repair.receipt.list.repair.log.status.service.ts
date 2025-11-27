import { GET_REPAIR_RECEIPT_LIST_REPAIR_LOG_STATUS_BY_REPAIR_RECEIPT_ID } from "@/apis/endpoint.api";
import mainApi from "@/apis/main.api";

import { APIResponseType } from "@/types/response";
import { REPAIR_RECEIPT_LIST_REPAIR_LOG_STATUS } from "@/types/response/response.repair-receipt-list-repair-log-status";

export const getRepairReceiptListRepairLogStatusByRepairReceiptId = async (
  id: string
) => {
  try {
    const { data: response } = await mainApi.get<
      APIResponseType<REPAIR_RECEIPT_LIST_REPAIR_LOG_STATUS[]>
    >(
      GET_REPAIR_RECEIPT_LIST_REPAIR_LOG_STATUS_BY_REPAIR_RECEIPT_ID + "/" + id
    );
    return response;
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
};
