import { GET_MS_SUPPLIER_ALL, CREATE_MS_SUPPLIER, UPDATE_MS_SUPPLIER, GET_MS_SUPPLIER_BY_ID, DELETE_MS_SUPPLIER,GET_SUPPLIER_ALL_NO_PAGINATION } from "@/apis/endpoint.api";
import mainApi from "@/apis/main.api";
import { PayLoadCreateMSSupplier, PayLoadUpdateMSSupplier } from "@/types/requests/request.ms-supplier";
import { TypeMasterSupplierAll } from "@/types/response/response.ms-supplier";
import { APIPaginationType, APIResponseType } from "@/types/response";

export const getMSSupplierall = async (page: string, pageSize: string, searchText: string) => {
    try {
        const { data: response } = await mainApi.get<APIResponseType<APIPaginationType<TypeMasterSupplierAll[]>>>(
            `${GET_MS_SUPPLIER_ALL}?page=${page}&pageSize=${pageSize}&searchText=${searchText}`
        );
        return response;
    } catch (error) {
        console.error("Error fetching master supplier:", error);
        throw error;
    }
};

export const createMSSupplier = async (data: PayLoadCreateMSSupplier) => {
    const { data: response } = await mainApi.post<APIResponseType<TypeMasterSupplierAll>>(
        CREATE_MS_SUPPLIER,
        data
    );
    return response;
};

export const updateMSSupplier = async (data: PayLoadUpdateMSSupplier) => {
    const { data: response } = await mainApi.patch(
        UPDATE_MS_SUPPLIER,
        data
    );
    return response;
};

export const deleteMSSupplier = async (supplier_id: string) => {
    const { data: response } = await mainApi.delete(
        `${DELETE_MS_SUPPLIER}/${supplier_id}`
    );
    return response;
};
export const getMSSupplierById = async (supplierId: string) => {
    try {
        const { data: response } = await mainApi.get<APIResponseType<TypeMasterSupplierAll>>(
            `${GET_MS_SUPPLIER_BY_ID}/${supplierId}`
        );
        return response;
    } catch (error) {
        console.error("Error fetching supplier by ID:", error);
        throw error;
    }
};

export const getAllSupplierData = async () => {
    try {
        const { data: response } = await mainApi.get<APIResponseType<TypeMasterSupplierAll[]>>(
            GET_SUPPLIER_ALL_NO_PAGINATION
        );
        return response;
    } catch (error) {
        console.error("Error:", error);
        throw error;
    }
}
