import { 
    GET_SUPPLIER_REPAIR_RECEIPT_ALL, 
    GET_SUPPLIER_REPAIR_RECEIPT_BY_ID, 
    CREATE_SUPPLIER_REPAIR_RECEIPT, 
    UPDATE_SUPPLIER_REPAIR_RECEIPT, 
    DELETE_SUPPLIER_REPAIR_RECEIPT,
    GET_PAYLOAD_FOR_SUPPLIER_REPAIR_RECEIPT
} from "@/apis/endpoint.api";
import mainApi from "@/apis/main.api";
import { 
    PayLoadCreatSupplierRepairReceipt, 
    PayLoadUpdateSupplierRepairReceipt 
} from "@/types/requests/request.supplier-repair-receipt";
import { 
    TypeSupplierRepairReceiptAll,
    TypeSupplierRepairReceiptPayLoad 
} from "@/types/response/response.supplier-repair-receipt";
import { APIPaginationType, APIResponseType } from "@/types/response";

export const getSupplierRepairReceiptAll = async (page: string, pageSize: string, searchText: string) => {
    try {
        const { data: response } = await mainApi.get<APIResponseType<APIPaginationType<TypeSupplierRepairReceiptAll[]>>>(
            `${GET_SUPPLIER_REPAIR_RECEIPT_ALL}?page=${page}&pageSize=${pageSize}&searchText=${searchText}`
        );

        return response;
    } catch (error) {
        console.error("Error fetching supplier repair receipt:", error);
        throw error;
    }
};


export const createSupplierRepairReceipt = async (data: PayLoadCreatSupplierRepairReceipt) => {
    try {
        const { data: response } = await mainApi.post<APIResponseType<TypeSupplierRepairReceiptAll>>(
            CREATE_SUPPLIER_REPAIR_RECEIPT,
            data
        );
        return response;
    } catch (error) {
        console.error("Error creating supplier repair receipt:", error);
        throw error;
    }
};

export const updateSupplierRepairReceipt = async (data: PayLoadUpdateSupplierRepairReceipt) => {
    const { data: response } = await mainApi.patch(
        UPDATE_SUPPLIER_REPAIR_RECEIPT,
        data
    );
    return response;
};

export const deleteSupplierRepairReceipt = async (id: string) => {
    const { data: response } = await mainApi.delete(
        `${DELETE_SUPPLIER_REPAIR_RECEIPT}/${id}`
    );
    return response;
};

export const getSupplierRepairReceiptById = async (id: string) => {
    try {
        const { data: response } = await mainApi.get<APIResponseType<TypeSupplierRepairReceiptAll>>(
            `${GET_SUPPLIER_REPAIR_RECEIPT_BY_ID}/${id}`
        );
        return response;
    } catch (error) {
        console.error("Error fetching supplier repair receipt by ID:", error);
        throw error;
    }
};

export const getPayloadForSupplierRepairReceipt = async (id: string) => {
    try {
        const { data: response } = await mainApi.get<APIResponseType<TypeSupplierRepairReceiptPayLoad>>(
            `${GET_PAYLOAD_FOR_SUPPLIER_REPAIR_RECEIPT}/${id}`
        );
        return response;
    } catch (error) {
        console.error("Error fetching payload for supplier repair receipt:", error);
        throw error;
    }
};