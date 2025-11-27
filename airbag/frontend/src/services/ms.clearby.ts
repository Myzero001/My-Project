import {
  Get_MS_CLEAR_BY,
  CREATE_MS_CLEAR_BY,
  UPDATE_MS_CLEAR_BY,
  DELETE_MS_CLEAR_BY,
  Get_MS_CLEAR_BY_NO_PAGINATION,
} from "@/apis/endpoint.api";
import mainApi from "@/apis/main.api";
import { PayLoadCreate_MS_CLEAR_BY } from "@/types/requests/request.ms-clearby";
import {
  Type_MS_CLEAR_BY_ALL,
  MS_CLEAR_BY_Response,
} from "@/types/response/response.ms-clear-by";
import { APIResponseType } from "@/types/response";

export const getClearbyData = async (
  page: string,
  pageSize: string,
  searchText: string
) => {
  try {
    const { data: response } = await mainApi.get<Type_MS_CLEAR_BY_ALL>(
      `${Get_MS_CLEAR_BY}?page=${page}&pageSize=${pageSize}&searchText=${searchText}`
    );
    return response;
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
};

export const getAllClearbyData = async () => {
  try {
    const { data: response } = await mainApi.get<
      APIResponseType<Type_MS_CLEAR_BY_ALL[]>
    >(Get_MS_CLEAR_BY_NO_PAGINATION);
    return response;
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
};

export const postClearby = async (data: PayLoadCreate_MS_CLEAR_BY) => {
  const { data: response } = await mainApi.post<MS_CLEAR_BY_Response>(
    CREATE_MS_CLEAR_BY,
    data
  );
  return response;
};

export const updateClearby = async (data: {
  clear_by_id: string;
  clear_by_name: string;
}) => {
  const { data: response } = await mainApi.patch<MS_CLEAR_BY_Response>(
    UPDATE_MS_CLEAR_BY,
    data
  );
  return response;
};

export const deleteClearby = async (clear_by_id: string) => {
  const { data: response } = await mainApi.delete<MS_CLEAR_BY_Response>(
    `${DELETE_MS_CLEAR_BY}/${clear_by_id}`
  );
  return response;
};
