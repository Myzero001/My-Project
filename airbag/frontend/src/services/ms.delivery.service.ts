import {
  GET_APPROVE_QUOTATION_ALL,
  CREATE_DELIVERY_SCEDULE,
  GET_DELIVERY_SCHEDULE_ALL,
  GET_DELIVERY_SCHEDULE_BY_ID,
  UPDATE_DELIVERY_SCEDULE,
  UPDATE_REQUEST_DELIVERY_SCEDULE,
  GET_DELIVERY_SCHEDULE_ALL_NO_PAGINATION,
  GET_DELIVERY_SCHEDULE_ALL_PAYMENT_NO_PAGINATION,
  SELECT_DELIVERY_SCHEDULE,
  GET_DELIVERY_SCHEDULE_CALENDAR,
} from "@/apis/endpoint.api";
import mainApi from "@/apis/main.api";
import { APIPaginationType, APIResponseType } from "@/types/response";
import { QUOTATION_ALL } from "@/types/response/response.quotation";
import {
  PayloadCreateDeliverySchedule,
  PayloadUpdateDeliverySchedule,
} from "@/types/requests/request.ms-delivery-schedule";
import { DeliverySchedule , DeliveryScheduleSelectResponse , DeliveryScheduleCalendar } from "@/types/response/response.delivery-schedule";

// ฟังก์ชันสำหรับดึงข้อมูลใบเสนอราคา
export const getDeliveryScheduleData = async (
  page: string,
  pageSize: string,
  searchText: string,
  status: string
) => {
  try {
    const { data: response } = await mainApi.get<
      APIResponseType<APIPaginationType<DeliverySchedule[]>>
    >(GET_DELIVERY_SCHEDULE_ALL, {
      params: {
        page: page,
        pageSize: pageSize,
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

export const getAllDeliveryScheduleData = async () => {
  try {
    const { data: response } = await mainApi.get<
      APIResponseType<DeliverySchedule[]>
    >(GET_DELIVERY_SCHEDULE_ALL_NO_PAGINATION);
    return response;
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
};

export const getApproveQuotationData = async (
  page: string,
  pageSize: string,
  searchText: string
) => {
  try {
    const { data: response } = await mainApi.get<
      APIResponseType<APIPaginationType<QUOTATION_ALL[]>>
    >(GET_APPROVE_QUOTATION_ALL, {
      params: {
        page: page,
        pageSize: pageSize,
        searchText: searchText,
      },
    });
    return response;
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
};

export const getDeliveryScheduleById = async (id: string) => {
  try {
    const { data: response } = await mainApi.get<
      APIResponseType<DeliverySchedule>
    >(GET_DELIVERY_SCHEDULE_BY_ID + "/" + id);
    return response;
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
};

export const postDeliveryScheduleData = async (
  payload: PayloadCreateDeliverySchedule
) => {
  try {
    const { data: response } = await mainApi.post<
      APIResponseType<DeliverySchedule>
    >(CREATE_DELIVERY_SCEDULE, payload);
    return response;
  } catch (error) {
    console.error("Error creating Delivery Schedule:", error); // Log the error
    throw error; // Optionally rethrow the error for further handling
  }
};

// ฟังก์ชันสำหรับอัปเดตใบเสนอราคา
export const updateDeliverySchedule = async (
  payload: PayloadUpdateDeliverySchedule
) => {
  try {
    const { data: response } = await mainApi.patch(
      UPDATE_DELIVERY_SCEDULE,
      payload
    );
    return response;
  } catch (error) {
    console.error("Error updating ", error); // Log the error
    throw error; // Optionally rethrow the error for further handling
  }
};

export const requestDelivery = async (id: string) => {
  try {
    const { data: response } = await mainApi.patch(
      UPDATE_REQUEST_DELIVERY_SCEDULE,
      {
        id,
      }
    );
    return response;
  } catch (error) {
    console.error("Error updating Delivery schedule:", error); // Log the error
    throw error; // Optionally rethrow the error for further handling
  }
};

export const getAllPaymentDeliveryScheduleData = async () => {
  try {
    const { data: response } = await mainApi.get<
      APIResponseType<DeliverySchedule[]>
    >(GET_DELIVERY_SCHEDULE_ALL_PAYMENT_NO_PAGINATION);
    return response;
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
};

export const selectDeliverySchedule = async (
  searchText: string = ""
): Promise<DeliveryScheduleSelectResponse> => {
  try {
    const query = `?searchText=${encodeURIComponent(searchText)}`;
    const { data: response } = await mainApi.get<DeliveryScheduleSelectResponse>(
      `${SELECT_DELIVERY_SCHEDULE}${query}`
    );
    return response;
  } catch (error) {
    console.error("Error searching customers:", error);
    throw error;
  }
};

export const getDeliveryScheduleForCalendar = async (
  startDate: string,
  endDate: string
) => {
  try {
    const { data: response } = await mainApi.post<
      APIResponseType<DeliveryScheduleCalendar[]>
    >(
      GET_DELIVERY_SCHEDULE_CALENDAR,
      {
        startDate: startDate,
        endDate: endDate,
      }
    );
    return response;
  } catch (error) {
    console.error("Error fetching calendar schedule:", error);
    throw error;
  }
};