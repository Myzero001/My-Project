import {
  GET_MS_TOOLING_REASON,
  CREATE_MS_TOOLING_REASON,
  UPDATE_MS_TOOLING_REASON,
  DELETE_MS_TOOLING_REASON,
  GET_MS_TOOLING_REASON_NO_PAGINATION,
  SELECT_TOOLING_REASON,
} from "@/apis/endpoint.api";
import mainApi from "@/apis/main.api";
import { PayLoadCreate_MS_TOOLING_REASON } from "@/types/requests/request.ms-tooling-reason";
import {
  Type_MS_TOOLING_REASON_All,
  MS_TOOLING_REASON_Response,
  ToolingReasonSelectResponse,
} from "@/types/response/response.ms-tooling-reason";
import { APIPaginationType, APIResponseType } from "@/types/response";

export const getToolingReasonData = async (
  page: string,
  pageSize: string,
  searchText: string
) => {
  try {
    const { data: response } = await mainApi.get<
      APIResponseType<APIPaginationType<Type_MS_TOOLING_REASON_All[]>>
    >(GET_MS_TOOLING_REASON, {
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

export const getAllRoolingReasonData = async () => {
  try {
    const { data: response } = await mainApi.get<
      APIResponseType<Type_MS_TOOLING_REASON_All[]>
    >(GET_MS_TOOLING_REASON_NO_PAGINATION);
    return response;
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
};

export const postMasterToolingReason = async (
  data: PayLoadCreate_MS_TOOLING_REASON
) => {
  const { data: response } = await mainApi.post<MS_TOOLING_REASON_Response>(
    CREATE_MS_TOOLING_REASON,
    data
  );
  return response;
};

export const updateMasterToolingReason = async (data: {
  master_tooling_reason_id: string;
  tooling_reason_name: string;
}) => {
  const { data: response } = await mainApi.patch<MS_TOOLING_REASON_Response>(
    UPDATE_MS_TOOLING_REASON,
    data
  );
  return response;
};

export const deleteMasterToolingReason = async (
  master_tooling_reason_id: string
) => {
  const { data: response } = await mainApi.delete<MS_TOOLING_REASON_Response>(
    `${DELETE_MS_TOOLING_REASON}/${master_tooling_reason_id}`
  );
  return response;
};

export const selectToolingReason = async (
  searchText: string = ""
): Promise<ToolingReasonSelectResponse> => {
  try {
    const query = `?searchText=${encodeURIComponent(searchText)}`;
    const { data: response } = await mainApi.get<ToolingReasonSelectResponse>(
      `${SELECT_TOOLING_REASON}${query}`
    );
    return response;
  } catch (error) {
    console.error("Error searching tool:", error);
    throw error;
  }
};