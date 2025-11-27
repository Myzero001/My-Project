import {
  CRETE_REPAIR_RECEIPT_LIST_REPAIR,
  GET_REPAIR_RECEIPT_LIST_REPAIR_BY_REPAIR_RECEIPT_ID,
  GET_REPAIR_RECEIPT_LIST_REPAIR_BY_REPAIR_RECEIPT_ID_ACTIVE,
  UPDATE_REPAIR_RECEIPT_CHECKED_BOX_STATUS,
  UPDATE_REPAIR_RECEIPT_IS_ACTIVE_STATUS,
  UPDATE_REPAIR_RECEIPT_UNCHECK_BOX_STATUS,
} from "@/apis/endpoint.api";
import {
  PayLoadCreateRepairReceiptListRepair,
  PayLoadUpdateCheckedBox,
  PayLoadUpdateIsActiveStatus,
  PayLoadUpdateUnCheckBox,
} from "@/types/requests/request.repair.receipt.list.repair";
import mainApi from "@/apis/main.api";
import { MS_REPAIR_RECEIPT_LIST_REPAIR_Response } from "@/types/response/response.repair.receipt.list.repair";
import { APIResponseType } from "@/types/response";
import { repairReceiptListRepair } from "@/types/response/response.repair_receipt_list_repair";

export const getRepairReceiptListRepairByRepairReceiptId = async (
  id: string
) => {
  try {
    const { data: response } = await mainApi.get<
      APIResponseType<repairReceiptListRepair[]>
    >(GET_REPAIR_RECEIPT_LIST_REPAIR_BY_REPAIR_RECEIPT_ID + "/" + id);
    return response;
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
};
export const getRepairReceiptListRepairByRepairReceiptIdActive = async (
  id: string
) => {
  try {
    const { data: response } = await mainApi.get<
      APIResponseType<repairReceiptListRepair[]>
    >(GET_REPAIR_RECEIPT_LIST_REPAIR_BY_REPAIR_RECEIPT_ID_ACTIVE + "/" + id);
    return response;
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
};



export const createRepairReceiptListRepair = async (
  payload: PayLoadCreateRepairReceiptListRepair
) => {
  try {
    const { data: response } = await mainApi.post(
      CRETE_REPAIR_RECEIPT_LIST_REPAIR,
      payload
    );
    return response;
  } catch (error) {
    console.error("Error updating checked box status:", error);
    throw error;
  }
};

export const updateRepairReceiptIsActiveStatus = async (
  payload: PayLoadUpdateIsActiveStatus
) => {
  try {
    const { data: response } = await mainApi.patch<APIResponseType<null>>(
      UPDATE_REPAIR_RECEIPT_IS_ACTIVE_STATUS,
      payload
    );
    return response;
  } catch (error) {
    console.error("Error updating checked box status:", error);
    throw error;
  }
};

// อัปเดตสถานะ Checked Box
export const updateRepairReceiptCheckedBoxStatus = async (
  payload: PayLoadUpdateCheckedBox
) => {
  try {
    const { data: response } =
      await mainApi.patch<MS_REPAIR_RECEIPT_LIST_REPAIR_Response>(
        UPDATE_REPAIR_RECEIPT_CHECKED_BOX_STATUS,
        payload
      );
    if (response.success) {
      return response.responseObject; // คืนค่า responseObject
    } else {
      throw new Error(response.message);
    }
  } catch (error) {
    console.error("Error updating checked box status:", error);
    throw error;
  }
};

// อัปเดตสถานะ Unchecked Box
export const updateRepairReceiptUncheckedBoxStatus = async (
  payload: PayLoadUpdateUnCheckBox
) => {
  try {
    const { data: response } =
      await mainApi.patch<MS_REPAIR_RECEIPT_LIST_REPAIR_Response>(
        UPDATE_REPAIR_RECEIPT_UNCHECK_BOX_STATUS,
        payload
      );
    if (response.success) {
      return response.responseObject; // คืนค่า responseObject
    } else {
      throw new Error(response.message);
    }
  } catch (error) {
    console.error("Error updating unchecked box status:", error);
    throw error;
  }
};
