import { 
    GET_DEBTORS_ALL,
} from "@/apis/endpoint.api";
import mainApi from "@/apis/main.api";
import {
    TypeDebtorListResponse
} from "@/types/response/response.debtor";

export const getDebtorsAll = async (dateRange: string): Promise<TypeDebtorListResponse> => {
    try {
        const { data: response } = await mainApi.get(
            `${GET_DEBTORS_ALL}?dateRange=${dateRange}`
        );
        return response;
    } catch (error) {
        console.error("Error fetching debtors:", error);
        throw error;
    }
};