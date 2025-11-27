import { GET_SEND_FOR_A_CLAIM_LIST_BY_CLAIM_ID, GET_SEND_FOR_A_CLAIM_LIST_BY_CLAIM_LIST_ID, CREATE_SEND_FOR_A_CLAIM_LIST, UPDATE_SEND_FOR_A_CLAIM_LIST, DELETE_SEND_FOR_A_CLAIM_LIST,CUD_SEND_FOR_A_CLAIM_LIST } from "@/apis/endpoint.api";
import mainApi from "@/apis/main.api";
import { PayLoadCreatSendForAClaimList, PayLoadUpdateSendForAClaimList ,PayloadSubmit } from "@/types/requests/request.send-for-a-claim-list";
import { TypeSupplierDeliveryNoteList, TypeSupplierDeliveryNoteListAll } from "@/types/response/response.send-for-a-claim-list";
import { APIPaginationType, APIResponseType } from "@/types/response";
import { claimResponse } from "@/types/response/response.send-for-a-claim";

export const getSendForAClaimListAll = async () => {
    try {
        const { data: response } = await mainApi.get(`${GET_SEND_FOR_A_CLAIM_LIST_BY_CLAIM_ID}`);
        return response;
    } catch (error) {
        console.error("Error fetching send for a claim list:", error);
        throw error;
    }
};

export const createSendForAClaimList = async (data: PayLoadCreatSendForAClaimList) => {
    const { data: response } = await mainApi.post<APIResponseType<TypeSupplierDeliveryNoteListAll>>(
        CREATE_SEND_FOR_A_CLAIM_LIST,
        data
    );
    return response;
};

export const updateSendForAClaimList = async (data: PayLoadUpdateSendForAClaimList) => {
    const { data: response } = await mainApi.patch(
        UPDATE_SEND_FOR_A_CLAIM_LIST,
        data
    );
    return response;
};

export const deleteSendForAClaimList = async (send_for_a_claim_list_id: string) => {
    const { data: response } = await mainApi.delete(
        `${DELETE_SEND_FOR_A_CLAIM_LIST}/${send_for_a_claim_list_id}`
    );
    return response;
};
export const getSendForAClaimListById = async (send_for_a_claim_list_id: string) => {
    try {
        const { data: response } = await mainApi.get<APIResponseType<TypeSupplierDeliveryNoteListAll>>(
            `${GET_SEND_FOR_A_CLAIM_LIST_BY_CLAIM_LIST_ID}/${send_for_a_claim_list_id}`
        );
        return response;
    } catch (error) {
        console.error("Error fetching send for a claim list by ID:", error);
        throw error;
    }
};

export const submitSendForAClaimList = async (data: PayloadSubmit) => {
    const { data: response } = await mainApi.post<claimResponse>(
        CUD_SEND_FOR_A_CLAIM_LIST,
        data
    );
    return response;
};
