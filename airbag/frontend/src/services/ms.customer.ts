import {
  GET_CUSTOMER_ALL,
  CREATE_CUSTOMER,
  UPDATE_CUSTOMER,
  DELETE_CUSTOMER,
  GET_CUSTOMER_ALL_NO_PAGINATION,
  API_CUSTOMER_SELECT,
  CREATE_CUSTOMER_REQUIRE,
} from "@/apis/endpoint.api";
import mainApi from "@/apis/main.api";
import { CustomerResponse } from "@/types/response/response.ms_customer";
import { MS_CUSTOMER_ALL, CustomerSelectResponse, CreateCustomerSuccessResponse, } from "@/types/response/response.ms_customer";
import { APIResponseType } from "@/types/response";
import { PayLoadCreateCustomer, RequestCreateCustomer, RequestCreateCustomerWithRequiredFields, } from "@/types/requests/request.ms-customer";

export type CustomerSelectionItem = {
  customer_id: string;
  customer_code: string;
};

export const getCustomerData = async (page: string, pageSize: string, searchText: string) => {
  try {

    // ใช้รูปแบบการส่งพารามิเตอร์ที่ถูกต้อง
    const { data: response } = await mainApi.get<CustomerResponse>(
      `${GET_CUSTOMER_ALL}?page=${page}&pageSize=${pageSize}&searchText=${searchText}`
    );
    //console.log("API Response:", response);
    return response;
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
};

export const createCustomerWithRequiredFields = async (
  payload: RequestCreateCustomerWithRequiredFields
): Promise<CreateCustomerSuccessResponse> => {
  try {
    const { data: response } = await mainApi.post<CreateCustomerSuccessResponse>(
      CREATE_CUSTOMER_REQUIRE,
      payload
    );
    return response;
  } catch (error) {
    console.error("Error creating customer with required fields:", error);
    throw error;
  }
};

export const getAllCustomerData = async () => {
  try {
    const { data: response } = await mainApi.get<APIResponseType<MS_CUSTOMER_ALL[]>>(
      GET_CUSTOMER_ALL_NO_PAGINATION
    );
    return response;
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
}

export type CustomerSelectItem = {
  customer_id: string;
  customer_code: string;
};

export const searchCustomers = async (
  searchText: string = ""
): Promise<CustomerSelectResponse> => {
  try {
    const query = `?searchText=${encodeURIComponent(searchText)}`;
    const { data: response } = await mainApi.get<CustomerSelectResponse>(
      `${API_CUSTOMER_SELECT}${query}`
    );
    return response;
  } catch (error) {
    console.error("Error searching customers:", error);
    throw error;
  }
};


export const postCustomerData = async (payload: PayLoadCreateCustomer) => {
  try {
    const { data: response } = await mainApi.post(
      `${CREATE_CUSTOMER}`,
      payload
    );
    return response;
  } catch (error) {
    // Check for specific error response from backend
    console.error("Error creating customer:", error); // Log the error
    throw error; // Optionally rethrow the error for further handling
  }
};


export const updateCustomer = async (
  customer_id: string,
  payload: RequestCreateCustomer
) => {
  try {

    const { data: response } = await mainApi.patch(
      `${UPDATE_CUSTOMER}/${customer_id}`,
      payload
    );
    return response;
  } catch (error: any) {
    if (error.response) {
      console.error("API Error Response:", error.response.data);
    } else {
      console.error("Error:", error.message);
    }
    throw error;
  }
};


// export const deleteCustomer = async (customer_id: string) => {
//   try {
//     const response = await mainApi.delete(`${DELETE_CUSTOMER}/${customer_id}`);
//     return response.data;
//   } catch (error) {
//     console.error("Error deleting brand model:", error);
//     throw error;
//   }
// };

export const searchCustomer = async (customer_id: string) => {
  try {
    const response = await mainApi.get(`${GET_CUSTOMER_ALL}/${customer_id}`);
    return response.data;
  } catch (error) {
    console.error("Error deleting brand model:", error);
    throw error;
  }
};

export const getCustomerByID = async (customer_id: string) => {
  try {
    const response = await mainApi.get(`${GET_CUSTOMER_ALL}/${customer_id}`);
    return response.data;
  } catch (error) {
    console.error("Error deleting brand model:", error);
    throw error;
  }
};
export const deleteCustomer = async (customer_id: string) => {
  const { data: response } = await mainApi.delete(
    `${DELETE_CUSTOMER}/${customer_id}`
  );
  return response;
};