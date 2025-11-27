import { 
    GET_RECEIVE_FOR_A_CLAIM_LIST_ALL,
    CREATE_RECEIVE_FOR_A_CLAIM_LIST,
    UPDATE_RECEIVE_FOR_A_CLAIM_LIST,
    DELETE_RECEIVE_FOR_A_CLAIM_LIST,
    GET_RECEIVE_FOR_A_CLAIM_LIST_PAYLOAD
} from "@/apis/endpoint.api";
import mainApi from "@/apis/main.api";
import { PayLoadTypePayloadReceiveForAClaimList, PayLoadTypePayloadCreateReceiveForAClaimList } from "@/types/requests/request.receive_for_a_claim_list";
import { 
    ReceiveForAClaimResponse,
    SingleReceiveForAClaimResponse,
    TypeReceiveForAClaimPayload
} from "@/types/response/response.receive-for-a-claim-list";

export const getReceiveForAClaimListAll = async (page: string, pageSize: string, searchText: string) => {
    try {
        const { data: response } = await mainApi.get(
            `${GET_RECEIVE_FOR_A_CLAIM_LIST_ALL}?page=${page}&pageSize=${pageSize}&searchText=${searchText}`
        );
        return response;
    } catch (error) {
        console.error("Error fetching receive for claim lists:", error);
        throw error;
    }
};

export const getReceiveForAClaimListByReceiveForAClaimId = async (receiveForAClaimId: string) => {
    try {
        const { data: response } = await mainApi.get(
            `${GET_RECEIVE_FOR_A_CLAIM_LIST_ALL}/${receiveForAClaimId}`
        );
        return response;
    } catch (error) {
        console.error("Error fetching receive for claim lists by receive for a claim ID:", error);
        throw error;
    }
};

export const createReceiveForAClaimList = async (data: PayLoadTypePayloadCreateReceiveForAClaimList) => {
    try {
        const { data: response } = await mainApi.post(
            CREATE_RECEIVE_FOR_A_CLAIM_LIST,
            data 
        );
        return response;
    } catch (error) {
        console.error("Error creating receive for claim list:", error);
        throw error;
    }
};

export const updateReceiveForAClaimList = async (id: string, data: PayLoadTypePayloadReceiveForAClaimList) => {
    try {
        const { data: response } = await mainApi.patch(
            `${UPDATE_RECEIVE_FOR_A_CLAIM_LIST}/${id}`,
            data
        );
        return response;
    } catch (error) {
        console.error("Error updating receive for claim list:", error);
        throw error;
    }
};

export const deleteReceiveForAClaimList = async (id: string) => {
    try {
        const { data: response } = await mainApi.delete(
            `${DELETE_RECEIVE_FOR_A_CLAIM_LIST}/${id}`
        );
        return response;
    } catch (error) {
        console.error("Error deleting receive for claim list:", error);
        throw error;
    }
};

    export const getReceiveForAClaimListPayload = async (
        receiveForAClaimId: string,
        sendForAClaimId: string
    ): Promise<ReceiveForAClaimResponse> => {
        try {
            const { data: response } = await mainApi.get<ReceiveForAClaimResponse>(
                `${GET_RECEIVE_FOR_A_CLAIM_LIST_PAYLOAD}/${receiveForAClaimId}/${sendForAClaimId}`
            );
            return response;
        } catch (error) {
            console.error("Error fetching payload for receive for claim list:", error);
            throw error;
        }
    };