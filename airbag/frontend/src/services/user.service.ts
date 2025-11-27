import {
  GET_USER_ALL,
  POST_REGISTER,
  UPDATE_USER,
  GET_USERNAME,
  GET_USER_PROFILE,Get_ALL_ROLE,
  GET_USER_ID,
} from "@/apis/endpoint.api";
import mainApi from "@/apis/main.api";
import { MS_USER_ALL , MS_USER_ALL_RESPONSE } from "@/types/response/response.user";
import { APIResponseType } from "@/types/response";
import { RequestCreateUser } from "@/types/requests/request.user";

export type  MS_ROLE = {
  role_name: string;
}

interface UserWithId {
  employee_id: string;
  username: string;
}

interface UsernamesResponse {
  success: boolean;
  message: string;
  responseObject: UserWithId[] ;
  statusCode: number;
}

export const getUserAll = async (page: string, pageSize: string, searchText: string) => {
  try{
    const {data:response} = await mainApi.get<MS_USER_ALL_RESPONSE>(
      `${GET_USER_ALL}?page=${page}&pageSize=${pageSize}&searchText=${searchText}`
    );
    return response;
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
}

export const getAllUserData = async () => {
  try {
    const { data: response } = await mainApi.get<
      APIResponseType<MS_USER_ALL[]>
    >(GET_USER_ALL);
    return response;
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
};

export const postRegister = async (payload: RequestCreateUser) => {
  try{
    const response = await mainApi.post(POST_REGISTER,payload);
    return response;
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
};
export const updateUser = async (
  employee_ID: string,
  payload: RequestCreateUser
) => {
  try {
    const { data: response } = await mainApi.patch(
      `${UPDATE_USER}/${employee_ID}`,
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

// ดึงข้อมูล usernames ทั้งหมด
export const getUsernames = async () => {
  try {
    const { data: response } = await mainApi.get(GET_USERNAME);
    if (response.success) {
      return response.responseObject; // คืนค่า responseObject ทั้งหมด
    } else {
      throw new Error(response.message);
    }
  } catch (error) {
    console.error("Error fetching usernames:", error);
    throw error;
  }
};

export const getUserByID = async (employee_id: string) => {
  try {
    const response = await mainApi.get(`${GET_USER_ALL}/${employee_id}`);
    return response.data;
  } catch (error) {
    console.error("Error deleting brand model:", error);
    throw error;
  }
};

export const getUserProfie = async () => {
  try {
    const response = await mainApi.get<APIResponseType<MS_USER_ALL>>(
      `${GET_USER_PROFILE}`
    );
    return response.data;
  } catch (error) {
    console.error("Error deleting brand model:", error);
    throw error;
  }
};



export const getRole = async (role_id: string) => {
  try {
    const { data: response } = await mainApi.get<APIResponseType<MS_USER_ALL>>(
      `${Get_ALL_ROLE}/${role_id}`
    );
    return response?.responseObject.role.role_name ?? ''; // ดึง role_name โดยตรงจาก responseObject
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
};

export const getUsernamesAndIds = async (): Promise<UserWithId[]> => {
  try {
    const { data: response }: { data: UsernamesResponse } = await mainApi.get(GET_USER_ID);
    if (response.success && response.responseObject) {
      return response.responseObject;
    } else {
      console.error("Error fetching usernames and IDs:", response.message);
      throw new Error(response.message || "Failed to fetch usernames and IDs");
    }
  } catch (error) {
    console.error("Error in getUsernamesAndIds service:", error);
    throw error;
  }
};