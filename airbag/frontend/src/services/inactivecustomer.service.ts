import {
    GET_INACTIVE_CUSTOMERS,
} from "@/apis/endpoint.api";
import mainApi from "@/apis/main.api";
import {
    TypeInactiveCustomerListResponse,
    TypeInactiveCustomerQueryParams
} from "@/types/response/response.inactivecustomer";

export const getInactiveCustomersFiltered = async (
    params: TypeInactiveCustomerQueryParams
): Promise<TypeInactiveCustomerListResponse> => {
    try {
        const queryParams = new URLSearchParams();

        if (params.dateRange) {
            queryParams.append('dateRange', params.dateRange);
        }

        if (params.sortBy) {
            queryParams.append('sortBy', params.sortBy);
        }

        if (params.sortOrder) {
            queryParams.append('sortOrder', params.sortOrder);
        }

        if (params.customerPrefix && params.customerPrefix !== 'all') {
            queryParams.append('customerPrefix', params.customerPrefix);
        }

        if (params.minDebt !== undefined) {
            queryParams.append('minDebt', params.minDebt.toString());
        }

        if (params.maxDebt !== undefined) {
            queryParams.append('maxDebt', params.maxDebt.toString());
        }

        const queryString = queryParams.toString();
        const url = `${GET_INACTIVE_CUSTOMERS}${queryString ? `?${queryString}` : ''}`;

        const { data: response } = await mainApi.get(url);
        return response;
    } catch (error) {
        console.error("Error fetching filtered inactive customers:", error);
        throw error;
    }
};

export const getInactiveCustomersWithDebt = async (
    dateRange: string,
    minDebt: number = 0
): Promise<TypeInactiveCustomerListResponse> => {
    try {
        const { data: response } = await mainApi.get(
            `${GET_INACTIVE_CUSTOMERS}?dateRange=${dateRange}&minDebt=${minDebt}`
        );
        return response;
    } catch (error) {
        console.error("Error fetching inactive customers with debt:", error);
        throw error;
    }
};

export const getInactiveCustomerById = async (
    customerId: string,
    dateRange: string
): Promise<TypeInactiveCustomerListResponse> => {
    try {
        const { data: response } = await mainApi.get(
            `${GET_INACTIVE_CUSTOMERS}/${customerId}?dateRange=${dateRange}`
        );
        return response;
    } catch (error) {
        console.error(`Error fetching inactive customer with ID ${customerId}:`, error);
        throw error;
    }
};

export const exportInactiveCustomersToCSV = async (dateRange: string): Promise<Blob> => {
    try {
        const response = await mainApi.get(
            `${GET_INACTIVE_CUSTOMERS}/export?dateRange=${dateRange}`,
            { responseType: 'blob' }
        );
        return response.data;
    } catch (error) {
        console.error("Error exporting inactive customers to CSV:", error);
        throw error;
    }
};