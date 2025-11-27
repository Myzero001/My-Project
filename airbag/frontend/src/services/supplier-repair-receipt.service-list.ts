// --- START OF FILE supplier-repair-receipt.service-list.ts ---

import {
    GET_SUPPLIER_REPAIR_RECEIPT_LIST_ALL,
    GET_SUPPLIER_REPAIR_RECEIPT_LIST_BY_ID,
    CREATE_SUPPLIER_REPAIR_RECEIPT_LIST,
    UPDATE_SUPPLIER_REPAIR_RECEIPT_LIST,
    DELETE_SUPPLIER_REPAIR_RECEIPT_LIST,
    UPDATE_FINISH_STATUS_SUPPLIER_REPAIR_RECEIPT_LIST,
    GET_PAYLOAD_LIST_SUPPLIER_REPAIR_RECEIPT,
    UPDATE_SUPPLIER_REPAIR_RECEIPT,
} from "@/apis/endpoint.api";
import mainApi from "@/apis/main.api";
import {
    CreateSupplierRepairReceiptListRequest,
    UpdateSupplierRepairReceiptListRequest,
    UpdateFinishStatusRequest,
    UpdateRepairDateRequest,
} from "@/types/requests/request.supplier-repair-receipt-list";
import {
    SupplierRepairReceiptListResponse,
    SupplierRepairReceiptListsResponse,
    PayloadListResponse
} from "@/types/response/response.supplier-repair-receipt-list";
import { APIResponseType } from "@/types/response";

export const getSupplierRepairReceiptListAll = async (page: string, pageSize: string, searchText: string) => {
    try {
        const { data: response } = await mainApi.get<SupplierRepairReceiptListsResponse>(
            `${GET_SUPPLIER_REPAIR_RECEIPT_LIST_ALL}?page=${page}&pageSize=${pageSize}&searchText=${searchText}`
        );
        return response;
    } catch (error) {
        console.error("Error fetching supplier repair receipt list:", error);
        throw error;
    }
};

export const createSupplierRepairReceiptList = async (data: CreateSupplierRepairReceiptListRequest) => {
    try {
        const { data: response } = await mainApi.post<SupplierRepairReceiptListResponse>(
            CREATE_SUPPLIER_REPAIR_RECEIPT_LIST,
            data
        );
        return response;
    } catch (error) {
        console.error("Error creating supplier repair receipt list:", error);
        throw error;
    }
};

export const updateSupplierRepairReceiptList = async (id: string, data: Partial<UpdateSupplierRepairReceiptListRequest>) => {
    try {
        // Assuming PATCH endpoint uses ID in URL
        const { data: response } = await mainApi.patch<SupplierRepairReceiptListResponse>(
             `${UPDATE_SUPPLIER_REPAIR_RECEIPT_LIST}/${id}`, // Assuming endpoint takes ID
            data
        );
        return response;
    } catch (error) {
        console.error("Error updating supplier repair receipt list:", error);
        throw error;
    }
};


export const deleteSupplierRepairReceiptList = async (id: string) => {
    try {
        const { data: response } = await mainApi.delete<SupplierRepairReceiptListResponse>(
            `${DELETE_SUPPLIER_REPAIR_RECEIPT_LIST}/${id}`
        );
        return response;
    } catch (error) {
        console.error("Error deleting supplier repair receipt list:", error);
        throw error;
    }
};

export const getSupplierRepairReceiptListById = async (id: string) => {
    try {
        const { data: response } = await mainApi.get<SupplierRepairReceiptListResponse>(
            `${GET_SUPPLIER_REPAIR_RECEIPT_LIST_BY_ID}/${id}`
        );
        return response;
    } catch (error) {
        console.error("Error fetching supplier repair receipt list by ID:", error);
        throw error;
    }
};

export const updateFinishStatus = async (
    supplierRepairReceiptListsId: string,
    data: UpdateFinishStatusRequest
) => {
    try {
        const { data: response } = await mainApi.patch<APIResponseType<any>>(
            `${UPDATE_FINISH_STATUS_SUPPLIER_REPAIR_RECEIPT_LIST}/${supplierRepairReceiptListsId}`,
            data
        );
        return response;
    } catch (error) {
        console.error("Error updating finish status:", error);
        throw error;
    }
};

export const getPayloadListForSupplierRepairReceipt = async (
    supplier_repair_receipt_id: string,
    supplier_delivery_note_id?: string
) => {
    try {
        if (!supplier_repair_receipt_id || !supplier_delivery_note_id) {
            throw new Error("supplier_repair_receipt_id and supplier_delivery_note_id are required");
        }

        const endpoint = `${GET_PAYLOAD_LIST_SUPPLIER_REPAIR_RECEIPT}/${supplier_repair_receipt_id}/${supplier_delivery_note_id}`;

        const { data: response } = await mainApi.get<APIResponseType<PayloadListResponse[]>>(endpoint);

        return response;
    } catch (error) {
        console.error("Error fetching payload list for supplier repair receipt:", error);
        throw error;
    }
};

export const updateRepairDate = async (data: UpdateRepairDateRequest) => {
    try {
        const { data: response } = await mainApi.patch<SupplierRepairReceiptListResponse>(
            UPDATE_SUPPLIER_REPAIR_RECEIPT,
            data
        );
        return response;
    } catch (error) {
        console.error("Error updating repair date - Full error:", error);
        throw error;
    }
};