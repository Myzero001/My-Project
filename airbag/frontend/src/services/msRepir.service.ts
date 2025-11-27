import {
  GET_MS_REPAIR_ALL,
  CREATE_MS_REPAIR,
  UPDATE_MS_REPAIR,
  DELETE_MS_REPAIR,
  GET_MS_GROUP_REPAIR_SELECT,
  GET_MS_REPAIR_ALL_NO_PAGINATION,
  GET_MS_REPAIR_NAME,
  GET_MS_REPAIR_BY_ID
} from "@/apis/endpoint.api";
import mainApi from "@/apis/main.api";
import {
  PayLoadCreateRepair,
  PayLoadUpdateRepair,
} from "@/types/requests/request.ms-repair";
import { APIResponseType } from "@/types/response";
import { RepairResponse, TypeRepair } from "@/types/response/response.ms-repair";

export const getAllRepairData = async () => {
  try {
    const { data: response } = await mainApi.get<
      APIResponseType<TypeRepair[]>
    >(GET_MS_REPAIR_ALL_NO_PAGINATION);
    return response;
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
};

export const get_ms_repair_all = async (page: string, pageSize: string, searchText: string) => {
    // const { data: response } = await mainApi.get(
    //     `${GET_MS_REPAIR_ALL}?page=${page}&pageSize=${pageSize}`
    try {
        const { data: response } = await mainApi.get<RepairResponse>(
            `${GET_MS_REPAIR_ALL}?page=${page}&pageSize=${pageSize}&searchText=${searchText}`
        );
        return response;
    } catch (error) {
        console.error("Error fetching master repair:", error);
        throw error;
    }
    // return response;
};

export const create_ms_repair = async (data: PayLoadCreateRepair) => {
  const { data: response } = await mainApi.post<RepairResponse>(
    CREATE_MS_REPAIR,
    data
  );
  return response;
};

export const update_ms_repair = async (data: PayLoadUpdateRepair) => {
  const { data: response } = await mainApi.patch<RepairResponse>(
    UPDATE_MS_REPAIR,
    data
  );
  return response;
};

export const delete_ms_repair = async (master_repair_id: string) => {
  const encodedRepairId = encodeURIComponent(master_repair_id); // Encode the master_repairId
  const response = await mainApi.delete<RepairResponse>(
    `${DELETE_MS_REPAIR}/${encodedRepairId}`
  );
  return response.data;
};

export const getMasterGroupRepairSelect = async () => {
  const { data: response } = await mainApi.get(`${GET_MS_GROUP_REPAIR_SELECT}`);
  return response;
};

export const get_ms_repair_names = async (page: string, pageSize: string, searchText: string) => {
  // const { data: response } = await mainApi.get(
  //     `${GET_MS_REPAIR_ALL}?page=${page}&pageSize=${pageSize}`
  try {
      const { data: response } = await mainApi.get<RepairResponse>(
          `${GET_MS_REPAIR_NAME}?page=${page}&pageSize=${pageSize}&searchText=${searchText}`
      );
      return response;
  } catch (error) {
      console.error("Error fetching master repair:", error);
      throw error;
  }
  // return response;
};

export const get_ms_repair_by_id = async (ms_repair_id: string) => {
  const encodedRepairId = encodeURIComponent(ms_repair_id); 
  const { data: response } = await mainApi.get<RepairResponse>(
    `${GET_MS_REPAIR_BY_ID}/${encodedRepairId}`
  );
  return response;
}