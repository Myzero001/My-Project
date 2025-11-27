import {
  GET_PAYMENT_ALL,
  GET_PAYMENT_BY_ID,
  UPDATE_PAYMENT,
  DELETE_PAYMENT,
  CREATE_PAYMENT,
  GET_PAYMENT_BY_REPAIR_RECEIPT_ID,
  UPDATE_PAYMENT_EDITS,
  CREATE_PAYMENT_EDITS,
  GET_PAYMENT_EDITS_BY_PAYMENT_ID,
  GET_PAYMENT_EDITS_ALL,
  GET_PAYMENT_EDITS_BY_ID,
  UPDATE_APPROVE_PAYMENT_EDITS,
  UPDATE_CANCEL_PAYMENT_EDITS,
  GET_PAYMENT_EDITS_LOG,
  UPDATE_REJECT_PAYMENT_EDITS,
} from "@/apis/endpoint.api";
import mainApi from "@/apis/main.api";

import { APIPaginationType, APIResponseType } from "@/types/response";
import { PAYMENTTYPE } from "@/types/response/response.payment";
import {
  PayloadCreatePayment,
  PayloadUpdatePayment,
} from "@/types/requests/request.payment";
import {
  PAYMENT_EDITS,
  PAYMENT_EDITS_LOG,
} from "@/types/response/response.payment-edits";

export const getPaymentData = async (
  page: string,
  pageSize: string,
  searchText: string,
  status: string
) => {
  try {
    const { data: response } = await mainApi.get<
      APIResponseType<APIPaginationType<PAYMENTTYPE[]>>
    >(GET_PAYMENT_ALL, {
      params: {
        page: page,
        pageSize: pageSize,
        searchText: searchText,
        status,
      },
    });
    return response;
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
};

export const getPaymentEditsData = async (
  page: string,
  pageSize: string,
  searchText: string,
  status: string
) => {
  try {
    const { data: response } = await mainApi.get<
      APIResponseType<APIPaginationType<PAYMENT_EDITS[]>>
    >(GET_PAYMENT_EDITS_ALL, {
      params: {
        page: page,
        pageSize: pageSize,
        searchText: searchText,
        status,
      },
    });
    return response;
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
};

export const getPaymentById = async (id: string) => {
  try {
    const { data: response } = await mainApi.get<APIResponseType<PAYMENTTYPE>>(
      GET_PAYMENT_BY_ID + "/" + id
    );
    return response;
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
};

export const getPaymentEditsById = async (id: string) => {
  try {
    const { data: response } = await mainApi.get<
      APIResponseType<PAYMENT_EDITS>
    >(GET_PAYMENT_EDITS_BY_ID + "/" + id);
    return response;
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
};

export const getPaymentEditsByPaymentId = async (id: string) => {
  try {
    const { data: response } = await mainApi.get<
      APIResponseType<PAYMENT_EDITS[]>
    >(GET_PAYMENT_EDITS_BY_PAYMENT_ID + "/" + id);
    return response;
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
};

export const getPaymentByRepairReceiptId = async (id: string) => {
  try {
    const { data: response } = await mainApi.get<
      APIResponseType<PAYMENTTYPE[]>
    >(GET_PAYMENT_BY_REPAIR_RECEIPT_ID + "/" + id);
    return response;
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
};

export const getPaymentEditsLog = async (id: string) => {
  try {
    const { data: response } = await mainApi.get<
      APIResponseType<PAYMENT_EDITS[]>
    >(GET_PAYMENT_EDITS_LOG + "/" + id);
    return response;
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
};

export const postPayment = async (payload: PayloadCreatePayment) => {
  try {
    const { data: response } = await mainApi.post<APIResponseType<PAYMENTTYPE>>(
      CREATE_PAYMENT,
      payload
    );
    return response;
  } catch (error) {
    console.error("Error creating Payment:", error); // Log the error
    throw error; // Optionally rethrow the error for further handling
  }
};

export const updatePayment = async (payload: PayloadUpdatePayment) => {
  try {
    const { data: response } = await mainApi.patch(UPDATE_PAYMENT, payload);
    return response;
  } catch (error) {
    console.error("Error updating payment:", error);
    throw error;
  }
};

export const postRequestEditPayment = async (
  payment_id: string,
  remark: string,
  old_data: string,
  new_data: string
) => {
  try {
    const { data: response } = await mainApi.post(CREATE_PAYMENT_EDITS, {
      payment_id,
      remark: remark,
      old_data: old_data,
      new_data: new_data,
    });
    return response;
  } catch (error) {
    console.error("Error updating :", error); // Log the error
    throw error; // Optionally rethrow the error for further handling
  }
};
export const updateRequestEditPayment = async (
  id: string,
  remark: string,
  old_data: string,
  new_data: string
) => {
  try {
    const { data: response } = await mainApi.patch(UPDATE_PAYMENT_EDITS, {
      id,
      remark: remark,
      old_data: old_data,
      new_data: new_data,
    });
    return response;
  } catch (error) {
    console.error("Error updating :", error); // Log the error
    throw error; // Optionally rethrow the error for further handling
  }
};

export const deletePayment = async (id: string) => {
  try {
    const response = await mainApi.delete(`${DELETE_PAYMENT}/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error deleting :", error);
    throw error;
  }
};

export const approvePaymentEdits = async (id: string, remark: string) => {
  try {
    const { data: response } = await mainApi.patch(
      UPDATE_APPROVE_PAYMENT_EDITS,
      {
        id,
        remark,
      }
    );
    return response;
  } catch (error) {
    console.error("Error updating :", error); // Log the error
    throw error; // Optionally rethrow the error for further handling
  }
};
export const cancelPaymentEdits = async (id: string, remark: string) => {
  try {
    const { data: response } = await mainApi.patch(
      UPDATE_CANCEL_PAYMENT_EDITS,
      {
        id,
        remark,
      }
    );
    return response;
  } catch (error) {
    console.error("Error updating :", error); // Log the error
    throw error; // Optionally rethrow the error for further handling
  }
};
export const rejectPaymentEdits = async (id: string, remark: string) => {
  try {
    const { data: response } = await mainApi.patch(
      UPDATE_REJECT_PAYMENT_EDITS,
      {
        id,
        remark,
      }
    );
    return response;
  } catch (error) {
    console.error("Error updating :", error); // Log the error
    throw error; // Optionally rethrow the error for further handling
  }
};
