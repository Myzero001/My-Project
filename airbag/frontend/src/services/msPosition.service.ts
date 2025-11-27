import { CREATE_MS_POSITION, DELETE_MS_POSITION, GET_MS_POSITION_ALL, UPDATE_MS_POSITION , SELECT_POSITION } from "@/apis/endpoint.api";
import mainApi from "@/apis/main.api";
import { PayLoadCreate_MS_POSITION } from "@/types/requests/request.ms_position";
import { MasterPositionResponse, PositionSelectResponse } from "@/types/response/response.ms_position";
export const getMasterPosition = async (page: string, pageSize: string, searchText: string) => {

    // const { data: response } = await mainApi.get(
    //     `${GET_MS_POSITION_ALL}?page=${page}&pageSize=${pageSize}`
    // );
    // return response;
    try {
        const { data: response } = await mainApi.get<MasterPositionResponse>(
            `${GET_MS_POSITION_ALL}?page=${page}&pageSize=${pageSize}&searchText=${searchText}`
        );
        return response;
    } catch (error) {
        console.error("Error fetching master position:", error);
        throw error;
    }
};
export const postMasterPosition = async (data: PayLoadCreate_MS_POSITION) => {
    const { data: response } = await mainApi.post<MasterPositionResponse>(
        CREATE_MS_POSITION,
        data
    );
    return response;
};
export const updateMasterPosition = async (data: { position_id: string; position_name: string }) => {
    const { data: response } = await mainApi.patch<MasterPositionResponse>(
        UPDATE_MS_POSITION,
        data
    );
    return response;
};
export const deleteMasterPosition = async (position_id: string) => {
    const encodedIssueReasonId = encodeURIComponent(position_id);
    const { data: response } = await mainApi.delete<MasterPositionResponse>(
        `${DELETE_MS_POSITION}/${encodedIssueReasonId}`
    );
    return response;
}

export const searchPositions = async (
  searchText: string = ""
): Promise<PositionSelectResponse> => {
  try {
    const query = `?searchText=${encodeURIComponent(searchText)}`;
    const { data: response } = await mainApi.get<PositionSelectResponse>(
      `${SELECT_POSITION}${query}`
    );
    return response;
  } catch (error) {
    console.error("Error searching customers:", error);
    throw error;
  }
};