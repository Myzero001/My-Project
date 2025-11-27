//customerVisit.service
import { GET_VISIT_CUSTOMER_ALL, CREATE_VISIT_CUSTOMER, UPDATE_VISIT_CUSTOMER, DELETE_VISIT_CUSTOMER, GET_VISIT_CUSTOMER_BY_ID } from "@/apis/endpoint.api";
import mainApi from "@/apis/main.api";
import { PayLoadCreateCustomerVisit, PayLoadUpdateCustomerVisit } from "@/types/requests/request.customer-visit";
import { CustomerVisitResponse, TypeCustomerVisitAll } from "@/types/response/response.customer-visit";
import { APIPaginationType, APIResponseType } from "@/types/response";

export const getCustomerVisit = async (
    page: string,
    pageSize: string,
    searchText: string
) => {
    try {
        const { data: response } = await mainApi.get<APIResponseType<APIPaginationType<TypeCustomerVisitAll[]>>>(
            `${GET_VISIT_CUSTOMER_ALL}?page=${page}&pageSize=${pageSize}&searchText=${searchText}`
        );
        return response;
    } catch (error) {
        console.error("Error:", error);
        throw error;
    }
}


export const createCustomerVisit = async (data: PayLoadCreateCustomerVisit) => {
    try {
        const { data: response } = await mainApi.post<APIResponseType<TypeCustomerVisitAll>>(
            CREATE_VISIT_CUSTOMER,
            data
        );

        return response;
    } catch (error) {
        console.error("Error:", error);
        throw error;
    }
};
//
export const updateCustomerVisit = async (data: PayLoadUpdateCustomerVisit) => {
    try {
        const { data: response } = await mainApi.patch<CustomerVisitResponse>(
            UPDATE_VISIT_CUSTOMER,
            data
        );
        return response;
    } catch (error) {
        console.error("Error:", error);
        throw error;
    }
};


export const deleteCustomerVisit = async (customer_visit_id: string) => {
    try {
        const encodedIssueReasonId = encodeURIComponent(customer_visit_id);
        const response = await mainApi.delete<CustomerVisitResponse>(
            `${DELETE_VISIT_CUSTOMER}/${encodedIssueReasonId}`
        );

        return response.data; // คืนค่าข้อมูลที่ตอบกลับจากเซิร์ฟเวอร์
    } catch (error) {
        console.error("Error:", error);
        throw error;
    }
};

export const getCustomerVisitById = async (customer_visit_id: string) => {
    const { data: response } = await mainApi.get<APIResponseType<TypeCustomerVisitAll>>(
        `${GET_VISIT_CUSTOMER_BY_ID}/${customer_visit_id}`
    );
    return response;
};
