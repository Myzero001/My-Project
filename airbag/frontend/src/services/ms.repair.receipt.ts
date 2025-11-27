import {
  GET_QUOTATION_ALL,
  DELETE_QUOTATION,
  UPDATE_APPROVE_QUOTATION,
  GET_REPAIR_RECEIVE_ALL,
  GET_REPAIR_RECEIVE_BY_ID,
  UPDATE_REPAIR_RECEIVE,
  SET_REPAIR_RECEIPT_FINISH,
  GET_REPAIR_RECEIPT_BY_FINISH,
  SET_REPAIR_RECEIPT_UNFINISH,
  UPDATE_REPAIR_RECEIVE_STATUS_CANCEL,
  GET_REPAIR_RECEIVE_ALL_NO_PAGINATION,
  GET_REPAIR_RECEIVE__NOT_DELIVERY_NO_PAGINATION,
  UPDATE_REPAIR_RECEIVE_BOX,
  UPDATE_REPAIR_RECEIVE_BOX_CLEAR_BY,
  GET_REPAIR_RECEIPT_DOC,
  SELECT_REPAIR_RECEIVE,
  GET_REPAIR_RECEIVE_JOB,
} from "@/apis/endpoint.api";
import mainApi from "@/apis/main.api";
import { APIPaginationType, APIResponseType } from "@/types/response";
import { repairReceipt, TypeRepairReceiptDocResponse, RepairReceiptSelectResponse, } from "@/types/response/response.repair-receipt";
import {
  RequestUpdateRepairReceipt,
  RequestUpdateRepairReceiptBox,
  RequestUpdateRepairReceiptBoxCleayby,
} from "@/types/requests/request.repair-receipt";
import { GET_REPAIR_RECEIPT_FOR_JOB } from "@/apis/endpoint.api";
import { repairReceiptForJob } from "@/types/response/response.repair-receipt";

export const getRepairReceiptData = async (
  page: string,
  pageSize: string,
  searchText: string,
  status: string
) => {
  try {
    const { data: response } = await mainApi.get<
      APIResponseType<APIPaginationType<repairReceipt[]>>
    >(GET_REPAIR_RECEIVE_ALL, {
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

export const getAllRepairReceiptData = async () => {
  try {
    const { data: response } = await mainApi.get<
      APIResponseType<repairReceipt[]>
    >(GET_REPAIR_RECEIVE_ALL_NO_PAGINATION);
    return response;
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
};

export const getAllRepairReceiptByNotDeliveryData = async () => {
  try {
    const { data: response } = await mainApi.get<
      APIResponseType<repairReceipt[]>
    >(GET_REPAIR_RECEIVE__NOT_DELIVERY_NO_PAGINATION);
    return response;
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
};

export const getRepairReceiptById = async (id: string) => {
  try {
    const { data: response } = await mainApi.get<
      APIResponseType<repairReceipt>
    >(GET_REPAIR_RECEIVE_BY_ID + "/" + id);
    return response;
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
};

export const updateRepairReceipt = async (
  payload: RequestUpdateRepairReceipt
) => {
  try {
    const { data: response } = await mainApi.patch(
      UPDATE_REPAIR_RECEIVE,
      payload
    );
    return response;
  } catch (error) {
    console.error("Error updating Repair Receipt:", error); // Log the error
    throw error; // Optionally rethrow the error for further handling
  }
};

export const updateRepairReceiptBox = async (
  payload: RequestUpdateRepairReceiptBox
) => {
  try {
    const { data: response } = await mainApi.patch(
      UPDATE_REPAIR_RECEIVE_BOX,
      payload
    );
    return response;
  } catch (error) {
    console.error("Error updating Repair Receipt:", error); // Log the error
    throw error; // Optionally rethrow the error for further handling
  }
};

export const updateRepairReceiptBoxClearBy = async (
  payload: RequestUpdateRepairReceiptBoxCleayby
) => {
  try {
    const { data: response } = await mainApi.patch(
      UPDATE_REPAIR_RECEIVE_BOX_CLEAR_BY,
      payload
    );
    return response;
  } catch (error) {
    console.error("Error updating Repair Receipt:", error); // Log the error
    throw error; // Optionally rethrow the error for further handling
  }
};

export const cancelRepairReceipt = async (id: string) => {
  try {
    const response = await mainApi.patch(UPDATE_REPAIR_RECEIVE_STATUS_CANCEL, {
      id,
    });
    return response.data;
  } catch (error) {
    console.error("Error canceling repair receipt:", error);
    throw error;
  }
};

export const approveQuotation = async (
  quotation_id: string,
  remark: string
) => {
  try {
    const { data: response } = await mainApi.patch(UPDATE_APPROVE_QUOTATION, {
      quotation_id,
      approval_notes: remark,
    });
    return response;
  } catch (error) {
    console.error("Error updating quotation:", error); // Log the error
    throw error; // Optionally rethrow the error for further handling
  }
};

// ฟังก์ชันสำหรับลบใบเสนอราคา
export const deleteQuotation = async (id: string) => {
  try {
    const response = await mainApi.delete(`${DELETE_QUOTATION}/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error deleting quotation:", error);
    throw error;
  }
};



export const getRepairReceiptDataForJob = async (id: string) => {
  try {
    const { data: response } = await mainApi.get<
      APIResponseType<repairReceiptForJob>
    >(`${GET_REPAIR_RECEIPT_FOR_JOB}/${id}`);
    return response;
  } catch (error) {
    console.error("Error fetching Repair Receipt for Job:", error);
    throw error;
  }
};

export const setRepairReceiptFinish = async (id: string) => {
  try {
    const { data: response } = await mainApi.patch<
      APIResponseType<{ finish: boolean }>
    >(`${SET_REPAIR_RECEIPT_FINISH}/${id}`);
    return response;
  } catch (error) {
    console.error("Error setting Repair Receipt finish status to true:", error);
    throw error;
  }
};

export const setRepairReceiptUnFinish = async (id: string) => {
  try {
    const { data: response } = await mainApi.patch<
      APIResponseType<{ finish: boolean }>
    >(`${SET_REPAIR_RECEIPT_UNFINISH}/${id}`);
    return response;
  } catch (error) {
    console.error(
      "Error setting Repair Receipt finish status to false:",
      error
    );
    throw error;
  }
};

export const getRepairReceiptsByFinishStatus = async (
  id: string,
  isFinished: boolean
) => {
  try {
    const { data: response } = await mainApi.get<
      APIResponseType<repairReceiptForJob>
    >(`${GET_REPAIR_RECEIPT_BY_FINISH}/${id}`, {
      params: {
        finish: isFinished,
      },
    });
    return response;
  } catch (error) {
    console.error("Error fetching Repair Receipt by finish status:", error);
    throw error;
  }
};

export const fetchRepairReceiptsByStatus = async (
  id: string,
  status: string
) => {
  try {
    // กรณี status เป็น "all" ให้ดึงข้อมูลจาก getRepairReceiptDataForJob แทน
    if (status === "all") {
      const response = await getRepairReceiptDataForJob(id);
      return response;
    }

    const isFinished =
      status === "success" ? true : status === "pending" ? false : null;

    if (isFinished === null) {
      // แทนที่จะ throw error ให้ดึงข้อมูลทั้งหมดแทน
      const response = await getRepairReceiptDataForJob(id);
      return response;
    }

    const response = await getRepairReceiptsByFinishStatus(id, isFinished);
    return response;
  } catch (error) {
    console.error("Error fetching repair receipt by status:", error);
    throw error;
  }
};

export const searchRepairReceipts = async (
  page: string,
  pageSize: string,
  searchText: string
) => {
  try {
    const { data: response } = await mainApi.get<
      APIResponseType<APIPaginationType<repairReceipt[]>>
    >(GET_REPAIR_RECEIVE_ALL, {
      params: {
        page: page,
        pageSize: pageSize,
        searchText: searchText,
      },
    });
    return response;
  } catch (error) {
    console.error("Error searching Repair Receipts:", error);
    throw error;
  }
};

export const getAllRepairReceiptDocID = async () => {
  try {
      const { data: response } = await mainApi.get<TypeRepairReceiptDocResponse>(
          GET_REPAIR_RECEIPT_DOC
      );
      return response;
  } catch (error) {
      console.error("Error fetching repair receipt docs:", error);
      throw error;
  }
};

export const selectRepairReceive = async (
  searchText: string = ""
): Promise<RepairReceiptSelectResponse> => {
  try {
    const query = `?searchText=${encodeURIComponent(searchText)}`;
    const { data: response } = await mainApi.get<RepairReceiptSelectResponse>(
      `${SELECT_REPAIR_RECEIVE}${query}`
    );
    return response;
  } catch (error) {
    console.error("Error searching customers:", error);
    throw error;
  }
};

export const getJobsData = async (
  page: string,
  pageSize: string,
  searchText: string,
  status: string
) => {
  try {
    const params = {
      page,
      pageSize,
      searchText,
      status,
    };

    const query = new URLSearchParams(params).toString();

    const { data: response } = await mainApi.get<
      APIResponseType<APIPaginationType<any[]>>
    >(`${GET_REPAIR_RECEIVE_JOB}?${query}`); 

    return response;

  } catch (error) {
    console.error("Error fetching jobs data:", error);
    throw error;
  }
};