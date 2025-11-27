import {
  GET_QUOTATION_ALL,
  CREATE_QUOTATION,
  UPDATE_QUOTATION,
  DELETE_QUOTATION,
  GET_QUOTATION_BY_ID,
  GET_APPROVE_QUOTATION_ALL,
  UPDATE_APPROVE_QUOTATION,
  UPDATE_REQUEST_APPROVE_QUOTATION,
  UPDATE_REJECT_QUOTATION,
  GET_QUOTATION_DOCS,
  GET_QUOTATION_RESPONSIBLE_BY,
  UPDATE_CLOSE_DEAL_QUOTATION,
  UPDATE_REQUEST_EDIT_QUOTATION,
  GET_QUOTATION_CALENDAR_REMOVAL,
  UPDATE_CANCEL_QUOTATION,
  GET_QUOTATION_CALENDAR_REMOVALS,
} from "@/apis/endpoint.api";
import mainApi from "@/apis/main.api";
import {
  PayLoadCreateQuotation,
  RequestCreateQuotation,
} from "../types/requests/request.quotation";
import { APIPaginationType, APIResponseType } from "@/types/response";
import { QUOTATION_ALL } from "@/types/response/response.quotation";

// ฟังก์ชันสำหรับดึงข้อมูลใบเสนอราคา
export const getQuotationData = async (
  page: string,
  pageSize: string,
  searchText?: string,
  status?: string
) => {
  try {
    const { data: response } = await mainApi.get<
      APIResponseType<APIPaginationType<QUOTATION_ALL[]>>
    >(GET_QUOTATION_ALL, {
      params: {
        page: String(page),
        pageSize: String(pageSize),
        searchText: searchText,
        status: status,
      },
    });
    return response;
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
};

export const getApproveQuotationData = async (
  page: string,
  pageSize: string,
  searchText: string,
  status: string
) => {
  try {
    const { data: response } = await mainApi.get<
      APIResponseType<APIPaginationType<QUOTATION_ALL[]>>
    >(GET_APPROVE_QUOTATION_ALL, {
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

export const getQuotationById = async (id: string) => {
  try {
    const { data: response } = await mainApi.get<
      APIResponseType<QUOTATION_ALL>
    >(GET_QUOTATION_BY_ID + "/" + id);
    return response;
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
};

// ฟังก์ชันสำหรับสร้างใบเสนอราคา
export const postQuotationData = async (payload: PayLoadCreateQuotation) => {
  try {
    const { data: response } = await mainApi.post<
      APIResponseType<QUOTATION_ALL>
    >(CREATE_QUOTATION, payload);
    // console.log("API Response:", response);
    return response;
  } catch (error) {
    console.error("Error creating quotation:", error); // Log the error
    throw error; // Optionally rethrow the error for further handling
  }
};

// ฟังก์ชันสำหรับอัปเดตใบเสนอราคา
export const updateQuotation = async (
  quotation_id: string,
  payload: RequestCreateQuotation
) => {
  try {
    const { data: response } = await mainApi.patch(
      `${UPDATE_QUOTATION}/${quotation_id}`,
      payload
    );
    return response;
  } catch (error) {
    console.error("Error updating quotation:", error); // Log the error
    throw error; // Optionally rethrow the error for further handling
  }
};

export const requestApproveQuotation = async (quotation_id: string) => {
  try {
    const { data: response } = await mainApi.patch(
      UPDATE_REQUEST_APPROVE_QUOTATION,
      {
        quotation_id,
      }
    );
    return response;
  } catch (error) {
    console.error("Error updating quotation:", error); // Log the error
    throw error; // Optionally rethrow the error for further handling
  }
};

export const requestEditQuotation = async (
  quotation_id: string,
  remark: string
) => {
  try {
    const { data: response } = await mainApi.patch(
      UPDATE_REQUEST_EDIT_QUOTATION,
      {
        quotation_id,
        remark: remark,
      }
    );
    return response;
  } catch (error) {
    console.error("Error updating quotation:", error); // Log the error
    throw error; // Optionally rethrow the error for further handling
  }
};

export const requestCloseDealQuotation = async (
  quotation_id: string,
  repair_summary: string
) => {
  try {
    const { data: response } = await mainApi.patch(
      UPDATE_CLOSE_DEAL_QUOTATION,
      {
        quotation_id,
        repair_summary,
      }
    );
    return response;
  } catch (error) {
    console.error("Error updating quotation:", error); // Log the error
    throw error; // Optionally rethrow the error for further handling
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

export const rejectQuotation = async (quotation_id: string, remark: string) => {
  try {
    const { data: response } = await mainApi.patch(UPDATE_REJECT_QUOTATION, {
      quotation_id,
      approval_notes: remark,
    });
    return response;
  } catch (error) {
    console.error("Error updating quotation:", error); // Log the error
    throw error; // Optionally rethrow the error for further handling
  }
};

export const cancelQuotation = async (quotation_id: string, remark: string) => {
  try {
    const { data: response } = await mainApi.patch(UPDATE_CANCEL_QUOTATION, {
      quotation_id,
      remark: remark,
    });
    return response;
  } catch (error) {
    console.error("Error cancel quotation:", error); // Log the error
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

// ฟังก์ชันสำหรับดึง QuotationDoc และ QuotationId
export const getQuotationDoc = async () => {
  try {
    const { data: response } = await mainApi.get<
      APIResponseType<{ quotation_id: string; quotation_doc: string }[]>
    >(GET_QUOTATION_DOCS);

    if (response.success) {
      const quotationDocs = response.responseObject?.map((item) => ({
        quotationId: item.quotation_id,
        quotationDoc: item.quotation_doc,
      }));

      return {
        success: true,
        message: response.message,
        data: quotationDocs,
        statusCode: response.statusCode,
      };
    } else {
      console.error("Error in API response:", response.message);
      throw new Error(response.message);
    }
  } catch (error) {
    console.error("Error fetching quotation docs:", error);
    throw error;
  }
};

// ฟังก์ชันสำหรับดึงข้อมูล responsible_by โดยเลือกจาก quotation_doc
export const getQuotationResponsible_by = async (quotation_doc: string) => {
  try {
    const url = `${GET_QUOTATION_RESPONSIBLE_BY}/${quotation_doc}`;
    const { data: response } = await mainApi.get<
      APIResponseType<
        {
          responsible_by: string;
          responsible_by_profile: {
            username: string;
            first_name: string;
            last_name: string | null;
          };
        }[]
      >
    >(url);

    // ดึงข้อมูล username จาก responseObject
    const responsibleData = response.responseObject?.map((item) => ({
      responsible_by: item.responsible_by,
      username: item.responsible_by_profile.username,
      first_name: item.responsible_by_profile.first_name,
      last_name: item.responsible_by_profile.last_name,
    }));
    return responsibleData;
  } catch (error) {
    console.error("Error fetching responsible_by:", error);
    throw error;
  }
};

// ฟังก์ชันสำหรับดึงข้อมูลปฏิทินนัดหมายถอด
export const getCalendarRemovalDetails = async (id: string) => {
  try {
    const url = `${GET_QUOTATION_CALENDAR_REMOVAL}/${id}`;
    const { data: response } = await mainApi.get(url);

    if (response.success) {

      return {
        success: true,
        message: response.message,
        data: response.responseObject,
        statusCode: response.statusCode,
      };
    } else {
      console.error("Error in API response:", response.message);
      throw new Error(response.message);
    }
  } catch (error) {
    console.error("Error fetching calendar removal details:", error);
    throw error;
  }
};

export const getCalendarRemovalsByDateRange = async (startDate: string, endDate: string) => {
  try {
    const url = GET_QUOTATION_CALENDAR_REMOVALS;
    
    const { data: response } = await mainApi.post(url, { startDate, endDate });

    if (response.success) {
      return {
        success: true,
        message: response.message,
        data: response.responseObject,
        statusCode: response.statusCode,
      };
    } else {
      console.error("Error in API response:", response.message);
      throw new Error(response.message);
    }
  } catch (error) {
    console.error("Error fetching calendar removals by date range:", error);
    throw error;
  }
};
