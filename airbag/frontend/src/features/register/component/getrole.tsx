import mainApi from "@/apis/main.api";
import {Get_ALL_ROLE} from "@/apis/endpoint.api";
export const getUserRoleAll = async () => {
    try {
        const { data: response } = await mainApi.get(Get_ALL_ROLE);
        return response;
    } catch (error) {
        console.error("Error:", error);
        throw error;
    }
}
   