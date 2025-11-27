import { 
    GET_RECEIVE_FOR_A_CLAIM_ALL,
    GET_RECEIVE_FOR_A_CLAIM_BY_ID,
    CREATE_RECEIVE_FOR_A_CLAIM,
    UPDATE_RECEIVE_FOR_A_CLAIM,
    DELETE_RECEIVE_FOR_A_CLAIM,
    GET_SEND_FOR_A_CLAIM_DOC,
    GET_RECEIVE_FOR_A_CLAIM_Pay_Load_For_Receive_For_A_Claim_List_ALL,
    SELECT_SEND_FOR_A_CLAIM,
} from "@/apis/endpoint.api";
import mainApi from "@/apis/main.api";
import { 
    PayLoadUpdateClaimDate,
    PayLoadCreateReceiveForAClaim,
 } from "@/types/requests/request.receive_for_a_claim";
import { 
    ReceiveForAClaimResponse, 
    SingleReceiveForAClaimResponse,
    TypeReceiveForAClaimPayload,
    SendForAClaimDocResponse,
    ReceiveForAClaimSelectResponse,
} from "@/types/response/response.receive-for-a-claim";

export const getReceiveForAClaimAll = async (page: string, pageSize: string, searchText: string): Promise<ReceiveForAClaimResponse> => {
    try {
        const { data: response } = await mainApi.get(
            `${GET_RECEIVE_FOR_A_CLAIM_ALL}?page=${page}&pageSize=${pageSize}&searchText=${searchText}`
        );
        return response;
    } catch (error) {
        console.error("Error fetching receive for a claim:", error);
        throw error;
    }
};

export const getReceiveForAClaimById = async (receive_for_a_claim_id: string): Promise<SingleReceiveForAClaimResponse> => {
    try {
        const { data: response } = await mainApi.get(
            `${GET_RECEIVE_FOR_A_CLAIM_BY_ID}/${receive_for_a_claim_id}`
        );
        return response;
    } catch (error) {
        console.error("Error fetching receive for a claim by ID:", error);
        throw error;
    }
};

export const createReceiveForAClaim = async (send_for_a_claim_id: string): Promise<SingleReceiveForAClaimResponse> => {
    try {
        const payload: PayLoadCreateReceiveForAClaim = {
            send_for_a_claim_id
        };
        
        const { data: response } = await mainApi.post(
            CREATE_RECEIVE_FOR_A_CLAIM,
            payload
        );
        return response;
    } catch (error) {
        console.error("Error creating receive for a claim:", error);
        throw error;
    }
};

export const updateReceiveForAClaim = async (data: PayLoadUpdateClaimDate): Promise<SingleReceiveForAClaimResponse> => {
    const { data: response } = await mainApi.patch(
        UPDATE_RECEIVE_FOR_A_CLAIM,
        data
    );
    return response;
};

export const deleteReceiveForAClaim = async (receive_for_a_claim_id: string): Promise<SingleReceiveForAClaimResponse> => {
    const { data: response } = await mainApi.delete(
        `${DELETE_RECEIVE_FOR_A_CLAIM}/${receive_for_a_claim_id}`
    );
    return response;
};

export const getPayLoadForReceiveForAClaim = async (page: string, pageSize: string, searchText: string): Promise<ReceiveForAClaimResponse> => {
    try {
        const { data: response } = await mainApi.get<ReceiveForAClaimResponse>(
            `${GET_RECEIVE_FOR_A_CLAIM_Pay_Load_For_Receive_For_A_Claim_List_ALL}?page=${page}&pageSize=${pageSize}&searchText=${searchText}`
        );
        return response;
    } catch (error) {
        console.error("Error fetching payload for receive for a claim:", error);
        throw error;
    }
};

export const getSendForClaimDocs = async (): Promise<SendForAClaimDocResponse> => {
    try {
        const { data: response } = await mainApi.get<SendForAClaimDocResponse>(
            GET_SEND_FOR_A_CLAIM_DOC
        );
        return response;
    } catch (error) {
        console.error("Error fetching send for claim documents:", error);
        throw error;
    }
};

export const updateReceiveForAClaimDate = async (receiveForAClaimId: string, data: { claim_date: string }): Promise<SingleReceiveForAClaimResponse> => {
    const { data: response } = await mainApi.patch(
        `${UPDATE_RECEIVE_FOR_A_CLAIM}/${receiveForAClaimId}`,
        data
    );
    return response;
};

export const selectSendForAClaim = async (
  searchText: string = ""
): Promise<ReceiveForAClaimSelectResponse> => {
  try {
    const query = `?searchText=${encodeURIComponent(searchText)}`;
    const { data: response } = await mainApi.get<ReceiveForAClaimSelectResponse>(
      `${SELECT_SEND_FOR_A_CLAIM}${query}`
    );
    return response;
  } catch (error) {
    console.error("Error searching SendForAClaim:", error);
    throw error;
  }
};