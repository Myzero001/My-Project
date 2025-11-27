//customerVisit.service
import { GET_DASHBOARD_TOP_TEN_CUSTOMER, GET_DASHBOARD_QUOTATION_STATUS, GET_DASHBOARD_PRICE_ALL, GET_DASHBOARD_TOP_TEN_EMPLOYEE , GET_DASHBOARD_QUOTATION_SUMMARY } from "@/apis/endpoint.api";
import mainApi from "@/apis/main.api";
import { TypeTopTenCustomer, TypeTopTenCustomerResponse, TypePriceAll, TypeQuotationStatusAll, TypeTopTenEmployeeResponse, QuotationSummaryResponse } from "@/types/response/response.dashboardCQ";
import { APIPaginationType, APIResponseType } from "@/types/response";
export const getCustomerTopTen = async () => {
    try {
        const { data: response } = await mainApi.get<APIResponseType<TypeTopTenCustomerResponse>>(
            `${GET_DASHBOARD_TOP_TEN_CUSTOMER}`
        );
        return response;
    } catch (error) {
        console.error("Error:", error);
        throw error;
    }
};

export const getQuotationStatus = async (dateRange: string) => {
    try {
        const { data: response } = await mainApi.get<APIResponseType<TypeQuotationStatusAll[]>>(
            `${GET_DASHBOARD_QUOTATION_STATUS}?dateRange=${dateRange}`
        );
        return response;
    } catch (error) {
        console.error("Error:", error);
        throw error;
    }
};
export const getPriceAllDashboard = async () => {
    try {
        const { data: response } = await mainApi.get<APIResponseType<TypePriceAll>>(
            `${GET_DASHBOARD_PRICE_ALL}`
        );
        return response;
    } catch (error) {
        console.error("Error:", error);
        throw error;
    }
};

export const getEmployeeTopTen = async () => {
    try {
        const { data: response } = await mainApi.get<APIResponseType<TypeTopTenEmployeeResponse>>(
            `${GET_DASHBOARD_TOP_TEN_EMPLOYEE}`
        );
        return response;
    } catch (error) {
        console.error("Error:", error);
        throw error;
    }
};

export const getQuotationSummary = async (dateRange: string) => {
    try {
        const { data: response } = await mainApi.get<APIResponseType<QuotationSummaryResponse>>(
            `${GET_DASHBOARD_QUOTATION_SUMMARY}?dateRange=${dateRange}`
        );
        return response;
    } catch (error) {
        console.error("Error:", error);
        throw error;
    }
};
