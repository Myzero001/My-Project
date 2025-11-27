import { GET_SDN_LIST, CREATE_SND_LIST, UPDATE_SDN_LIST, DELETE_SDN_LIST, GET_BY_SDN_AND_RR_ID_SELECT, CUD_SDN_LIST } from "@/apis/endpoint.api";
import mainApi from "@/apis/main.api";
import { PayLoadCreatSupplierDeliveryNoteList, PayLoadSummitSupplierDeliveryNoteList, PayLoadUpdateSupplierDeliveryNoteList } from "@/types/requests/request.supplier-delivery-note-list";
import { TypeSupplierDeliveryNoteListAll, TypeSDNandRRidSelect, TypeSDNandRRidSelectAll } from "@/types/response/response.supplier-delivery-note-list";
import { SDNResponse } from "@/types/response/response.supplier-delivery-note"
import { APIPaginationType, APIResponseType } from "@/types/response";

export const getSupplierDeliveryNoteListAll = async (page: string, pageSize: string, searchText: string, supplier_delivery_note_id: string) => {
    try {
        const { data: response } = await mainApi.get<APIResponseType<APIPaginationType<TypeSupplierDeliveryNoteListAll[]>>>(
            `${GET_SDN_LIST}/${supplier_delivery_note_id}?page=${page}&pageSize=${pageSize}&searchText=${searchText}`
        );
        return response;
    } catch (error) {
        console.error("Error fetching supplier delivery note list:", error);
        throw error;
    }
};


export const createSupplierDeliveryNoteList = async (data: PayLoadCreatSupplierDeliveryNoteList) => {
    const { data: response } = await mainApi.post<APIResponseType<TypeSupplierDeliveryNoteListAll>>(
        CREATE_SND_LIST,
        data
    );
    return response;
};

export const updateSupplierDeliveryNoteList = async (data: PayLoadUpdateSupplierDeliveryNoteList) => {
    const { data: response } = await mainApi.patch(
        UPDATE_SDN_LIST,
        data
    );
    return response;
};

export const deleteSupplierDeliveryNoteList = async (supplier_delivery_note_repair_receipt_list_id: string) => {
    const { data: response } = await mainApi.delete(
        `${DELETE_SDN_LIST}/${supplier_delivery_note_repair_receipt_list_id}`
    );
    return response;
};

export const submitSupplierDeliveryNoteList = async (data: PayLoadSummitSupplierDeliveryNoteList) => {
    const { data: response } = await mainApi.post<SDNResponse>(
        CUD_SDN_LIST,
        data
    );
    return response;
};

export const getBySDNandRRidSelect = async (
    repair_receipt_id: string,
    supplier_delivery_note_id?: string,
): Promise<APIResponseType<TypeSDNandRRidSelect[]>> => {
    try {
        const { data: response } = await mainApi.get<APIResponseType<TypeSDNandRRidSelect[]>>(
            `${GET_BY_SDN_AND_RR_ID_SELECT}/${repair_receipt_id}`
        );
        return response;
    } catch (error) {
        console.error("Error fetching repair receipt data:", error);
        throw error;
    }
};


