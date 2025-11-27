import { GET_MS_TYPE_GROUP_ISSUEREASON } from "@/apis/endpoint.api";
import mainApi from "@/apis/main.api";


export const getMsTypeGroupIssueReason = async () => {
    try {
        const { data: response } = await mainApi.get(GET_MS_TYPE_GROUP_ISSUEREASON);
        return response;
    } catch (error) {
        console.error("Error fetching data:", error);
        throw error;
    }
};
