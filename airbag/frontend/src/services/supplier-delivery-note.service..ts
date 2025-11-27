import { GET_SUPPLIER_ALL_NO_PAGINATION, GET_SUPPLIER_DELIVERY_NOTE_ALL, GET_SUPPLIER_DELIVERY_NOTE_BY_ID, CREATE_SUPPLIER_DELIVERY_NOTE, UPDATE_SUPPLIER_DELIVERY_NOTE, DELETE_SUPPLIER_DELIVERY_NOTE, GET_REPAIR_RECIPT_SELECT, GET_SUPPLIER_DELIVERY_NOTE_DOC , SELECT_SUPPLIER , SELECT_SUPPLIER_DELIVERY_NOTE } from "@/apis/endpoint.api";
import mainApi from "@/apis/main.api";
import { PayLoadCreatSupplierDeliveryNote, PayLoadUpdateSupplierDeliveryNote } from "@/types/requests/request.supplier-delivery-note";
import { TypeSupplierDeliveryNoteAll, TypeMasterSupplierIdCode , SupplierSelectResponse , SupplierDeliveryNoteSelectResponse } from "@/types/response/response.supplier-delivery-note";
import { APIPaginationType, APIResponseType } from "@/types/response";

export const getSupplierDeliveryNoteAll = async (page: string, pageSize: string, searchText: string) => {
    try {
        const { data: response } = await mainApi.get<APIResponseType<APIPaginationType<TypeSupplierDeliveryNoteAll[]>>>(
            `${GET_SUPPLIER_DELIVERY_NOTE_ALL}?page=${page}&pageSize=${pageSize}&searchText=${searchText}`
        );
        return response;
    } catch (error) {
        console.error("Error fetching supplier invoice:", error);
        throw error;
    }
};

export const getAllSupplierDeliveryNoteData = async () => {
    try {
        const { data: response } = await mainApi.get<
            APIResponseType<TypeMasterSupplierIdCode[]>
        >(GET_SUPPLIER_ALL_NO_PAGINATION);
        return response;
    } catch (error) {
        console.error("Error:", error);
        throw error;
    }
};

export const createSupplierDeliveryNote = async (data: PayLoadCreatSupplierDeliveryNote) => {
    const { data: response } = await mainApi.post<APIResponseType<TypeSupplierDeliveryNoteAll>>(
        CREATE_SUPPLIER_DELIVERY_NOTE,
        data
    );
    return response;
};

export const updateSupplierDeliveryNote = async (data: PayLoadUpdateSupplierDeliveryNote) => {
    const { data: response } = await mainApi.patch(
        UPDATE_SUPPLIER_DELIVERY_NOTE,
        data
    );
    return response;
};

export const deleteSupplierDeliveryNote = async (supplier_id: string) => {
    const { data: response } = await mainApi.delete(
        `${DELETE_SUPPLIER_DELIVERY_NOTE}/${supplier_id}`
    );
    return response;
};
export const getSupplierDeliveryNoteById = async (supplierId: string) => {
    try {
        const { data: response } = await mainApi.get<APIResponseType<TypeSupplierDeliveryNoteAll>>(
            `${GET_SUPPLIER_DELIVERY_NOTE_BY_ID}/${supplierId}`
        );
        return response;
    } catch (error) {
        console.error("Error fetching supplier by ID:", error);
        throw error;
    }
};

export const getRepairReciptSelect = async () => {
    const { data: response } = await mainApi.get(`${GET_REPAIR_RECIPT_SELECT}`);
    return response;
};

export const getSupplierDeliveryNoteDoc = async () => {
    try {
        const { data: response } = await mainApi.get<APIResponseType<{
            docs: {
                supplier_delivery_note_id: string;
                supplier_delivery_note_doc: string;
            }[];
            totalCount: number;
        }>>(GET_SUPPLIER_DELIVERY_NOTE_DOC);
        return response;
    } catch (error) {
        console.error("Error fetching supplier delivery note docs:", error);
        throw error;
    }
};

export const selectSupplier = async (
  searchText: string = ""
): Promise<SupplierSelectResponse> => {
  try {
    const query = `?searchText=${encodeURIComponent(searchText)}`;
    const { data: response } = await mainApi.get<SupplierSelectResponse>(
      `${SELECT_SUPPLIER}${query}`
    );
    return response;
  } catch (error) {
    console.error("Error searching supplier:", error);
    throw error;
  }
};

export const selectSupplierDeliveryNote = async (
  searchText: string = ""
): Promise<SupplierDeliveryNoteSelectResponse> => {
  try {
    const query = `?searchText=${encodeURIComponent(searchText)}`;
    const { data: response } = await mainApi.get<SupplierDeliveryNoteSelectResponse>(
      `${SELECT_SUPPLIER_DELIVERY_NOTE}${query}`
    );
    return response;
  } catch (error) {
    console.error("Error searching customers:", error);
    throw error;
  }
};