//issueReason.service
import {
  CREATE_ISSUE_REASONS,
  DELETE_ISSUE_REASONS,
  GET_ISSUE_REASONS_ALL,
  GET_ISSUE_REASONS_ALL_NO_PAGINATION,
  SELECET_ISSUE_REASONS,
  UPDATE_ISSUE_REASONS,
} from "@/apis/endpoint.api";
import mainApi from "@/apis/main.api";
import {
  PayLoadCreateIssueReason,
  PayLoadUpdateIssueReason,
} from "@/types/requests/request.issueReason";
import {
  APIResponseType,
  IssueReasonResponse,
  TypeIssueReason,
  IssueReasonSelectResponse
} from "@/types/response/response.issueReason";

// export const getIssueReason = async (page: number, pageSize: number, searchText: string) => {
//     const {data: response} = await mainApi.get(
//         `${GET_ISSUE_REASONS_ALL}?page=${page}&pageSize=${pageSize}`
//     );
//     return response;
// };
export const getIssueReason = async (
  page: string,
  pageSize: string,
  searchText: string
) => {
  try {
    const { data: response } = await mainApi.get<IssueReasonResponse>(
      `${GET_ISSUE_REASONS_ALL}?page=${page}&pageSize=${pageSize}&searchText=${searchText}`
    );
    return response;
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
};

export const getAllIssueReasonData = async () => {
  try {
    const { data: response } = await mainApi.get<
      APIResponseType<TypeIssueReason[]>
    >(GET_ISSUE_REASONS_ALL_NO_PAGINATION);
    return response;
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
};

export const postIssueReason = async (data: PayLoadCreateIssueReason) => {
  const { data: response } = await mainApi.post<IssueReasonResponse>(
    CREATE_ISSUE_REASONS,
    data
  );
  return response;
};
//
export const updateIssueReason = async (data: PayLoadUpdateIssueReason) => {
  const { data: response } = await mainApi.patch<IssueReasonResponse>(
    UPDATE_ISSUE_REASONS,
    data
  );
  return response;
};

export const deleteIssueReason = async (issue_reason_id: string) => {
  const encodedIssueReasonId = encodeURIComponent(issue_reason_id); //-----------------
  const response = await mainApi.delete<IssueReasonResponse>(
    // `http://localhost:8081/issueReason/delete/${issue_reason_id}`
    `${DELETE_ISSUE_REASONS}/${encodedIssueReasonId}`
  );

  return response.data; // คืนค่าข้อมูลที่ตอบกลับจากเซิร์ฟเวอร์
};

// export const searchIssueReason = async (searchText: string) => {
//     try{
//         const response = await mainApi.get(`/issueReason/search/${searchText}`);
//         return response.data;}
//     catch (error) {
//         console.error("error ",error);
//         throw error;
//     }
//     }

export const selectIssueReason = async (
  searchText: string = ""
): Promise<IssueReasonSelectResponse> => {
  try {
    const query = `?searchText=${encodeURIComponent(searchText)}`;
    const { data: response } = await mainApi.get<IssueReasonSelectResponse>(
      `${SELECET_ISSUE_REASONS}${query}`
    );
    return response;
  } catch (error) {
    console.error("Error searching customers:", error);
    throw error;
  }
};