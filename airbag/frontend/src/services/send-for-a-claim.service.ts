import { GET_SEND_FOR_A_CLAIM_ALL, GET_SEND_FOR_A_CLAIM_BY_ID, CREATE_SEND_FOR_A_CLAIM, UPDATE_SEND_FOR_A_CLAIM, DELETE_SEND_FOR_A_CLAIM,GET_SUPPLIER_REPAIR_RECEIPT_DOC,GET_SUPPLIER_REPAIR_RECEIPT_LIST_BY_ID_SRRID , SELECT_SUPPLIER_REPAIR_RECEIPT } from "@/apis/endpoint.api";
import mainApi from "@/apis/main.api";
import { PayLoadCreatSendForAClaim, PayLoadUpdateSendForAClaim } from "@/types/requests/request.send-for-a-claim";
import { TypeSendForAClaim, TypeSendForAClaimAll } from "@/types/response/response.send-for-a-claim";
import { APIPaginationType, APIResponseType } from "@/types/response";
import { SupplierRepairReceiptSelectResponse } from "@/types/response/response.supplier-repair-receipt";

export const getSendForAClaimAll = async (page: string, pageSize: string, searchText: string) => {
    try {
        const { data: response } = await mainApi.get<APIResponseType<APIPaginationType<TypeSendForAClaimAll[]>>>(
            `${GET_SEND_FOR_A_CLAIM_ALL}?page=${page}&pageSize=${pageSize}&searchText=${searchText}`
        );
        return response;
    } catch (error) {
        console.error("Error fetching  send for a claim:", error);
        throw error;
    }
};

export const createSendForAClaim = async (data: PayLoadCreatSendForAClaim) => {
    const { data: response } = await mainApi.post<APIResponseType<TypeSendForAClaimAll>>(
        CREATE_SEND_FOR_A_CLAIM,
        data
    );
    return response;
};

export const updateSendForAClaim = async (data: PayLoadUpdateSendForAClaim) => {
    const { data: response } = await mainApi.patch(
        UPDATE_SEND_FOR_A_CLAIM,
        data
    );
    return response;
};

export const deleteSendForAClaim = async (send_for_a_claim_id: string) => {
    const { data: response } = await mainApi.delete(
        `${DELETE_SEND_FOR_A_CLAIM}/${send_for_a_claim_id}`
    );
    return response;
};
export const getSendForAClaimById = async (send_for_a_claim_id: string) => {
    try {
        const { data: response } = await mainApi.get<APIResponseType<TypeSendForAClaimAll>>(
            `${GET_SEND_FOR_A_CLAIM_BY_ID}/${send_for_a_claim_id}`
        );
        return response;
    } catch (error) {
        console.error("Error fetching send for a claim by ID:", error);
        throw error;
    }
};

export const getsupplierRepairReceiptDoc = async () => {
    try {
        const { data: response } = await mainApi.get(`${GET_SUPPLIER_REPAIR_RECEIPT_DOC}`);
        return response;
    } catch (error) {
        console.error("Error fetching supplier repair receipt docs:", error);
        throw error;
    }
};

export const getSupplierRepairReceiptListBySupplierRepairReceiptID = async (id: string) => {
    try {
        const { data: response } = await mainApi.get(`${GET_SUPPLIER_REPAIR_RECEIPT_LIST_BY_ID_SRRID}/${id}`);
        return response;
    } catch (error) {
        console.error("Error fetching supplier repair receipt list by ID:", error);
        throw error;
    }
}

export const selectSupplierRepairReceipt = async (
  searchText: string = ""
): Promise<SupplierRepairReceiptSelectResponse> => {
  try {
    const query = `?searchText=${encodeURIComponent(searchText)}`;
    const { data: response } = await mainApi.get<SupplierRepairReceiptSelectResponse>(
      `${SELECT_SUPPLIER_REPAIR_RECEIPT}${query}`
    );
    return response;
  } catch (error) {
    console.error("Error searching SupplierRepairReceip:", error);
    throw error;
  }
};