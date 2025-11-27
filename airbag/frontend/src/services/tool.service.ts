import {
  CREATE_TOOL,
  GET_TOOL_ALL,
  DELETE_TOOL,
  UPDATE_TOOL,
  SEARCH_TOOL,
  GET_TOOL_ALL_NO_PAGINATION,
  SELECT_TOOL,
} from "@/apis/endpoint.api";
import mainApi from "@/apis/main.api";
import { PayLoadCreateTool } from "@/types/requests/request.tool";
import { APIResponseType } from "@/types/response";
import { ToolResponse, TypeTool , ToolSelectItem , ToolSelectResponse} from "@/types/response/response.tool";

export const getTool = async (
  page: string,
  pageSize: string,
  searchText: string
) => {
  //console.log(`getTool params:`, { page, pageSize, searchText }); // เพิ่ม log
  try {
    const { data: response } = await mainApi.get<ToolResponse>(GET_TOOL_ALL, {
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

export const getAllToolsData = async () => {
  try {
    const { data: response } = await mainApi.get<APIResponseType<TypeTool[]>>(
      GET_TOOL_ALL_NO_PAGINATION
    );
    return response;
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
};

export const postTool = async (data: PayLoadCreateTool) => {
  const { data: response } = await mainApi.post<ToolResponse>(
    CREATE_TOOL,
    data
  );
  return response;
};

export const deleteTool = async (tool_id: string) => {
  const { data: response } = await mainApi.delete<ToolResponse>(
    `${DELETE_TOOL}/${tool_id}`
  );
  return response;
};

export const updateTool = async (tool_id: string, data: { tool: string }) => {
  const { data: response } = await mainApi.patch<ToolResponse>(
    `${UPDATE_TOOL}/${tool_id}`, // ใช้ tool_id ใน URL
    data // ส่งค่า tool ใน payload
  );
  return response;
};

export const searchTool = async (searchText: string) => {
  try {
    const response = await mainApi.get(`${SEARCH_TOOL}/${searchText}`);
    return response.data; // ส่งกลับข้อมูลที่ค้นพบ
  } catch (error) {
    console.error("Error searching tool:", error);
    throw error; // ส่งต่อข้อผิดพลาด
  }
};

export const selectTool = async (
  searchText: string = ""
): Promise<ToolSelectResponse> => {
  try {
    const query = `?searchText=${encodeURIComponent(searchText)}`;
    const { data: response } = await mainApi.get<ToolSelectResponse>(
      `${SELECT_TOOL}${query}`
    );
    return response;
  } catch (error) {
    console.error("Error searching tool:", error);
    throw error;
  }
};