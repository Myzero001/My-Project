import { CREATE_MS_GROUP_REPAIR, GET_MS_GROUP_REPAIR, UPDATE_MS_GROUP_REPAIR, DELETE_MS_GROUP_REPAIR } from "@/apis/endpoint.api";
import mainApi from "@/apis/main.api";
import { PayLoadCreate_MS_GROUP_REPAIR } from "@/types/requests/request.ms-group-repair";
import { MS_GROUP_REPAIR_Response, Type_MS_GROUP_REPAIR_All } from "@/types/response/response.ms-group-repair";
import { APIPaginationType, APIResponseType } from "@/types/response";

export const getGroupRepairData = async (
    page: string,
    pageSize: string,
    searchText: string
  ) => {
    try {
      const { data: response } = await mainApi.get<
        APIResponseType<APIPaginationType<Type_MS_GROUP_REPAIR_All[]>>
      >(GET_MS_GROUP_REPAIR, {
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

export const postMasterGroupRepair = async (data: PayLoadCreate_MS_GROUP_REPAIR) => {
    const { data: response } = await mainApi.post<MS_GROUP_REPAIR_Response>(
        CREATE_MS_GROUP_REPAIR,
        data
    );
    return response;
};

export const updateMasterGroupRepair = async (data: { master_group_repair_id: string; group_repair_name: string }) => {
    const { data: response } = await mainApi.patch<MS_GROUP_REPAIR_Response>(
        UPDATE_MS_GROUP_REPAIR,
        data
    );
    return response;
};

export const deleteMasterGroupRepair = async (master_group_repair_id: string) => {
    const { data: response } = await mainApi.delete<MS_GROUP_REPAIR_Response>(
        `${DELETE_MS_GROUP_REPAIR}/${master_group_repair_id}`
    );
    return response;
};
