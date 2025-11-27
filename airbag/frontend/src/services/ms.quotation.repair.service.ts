import { GET_QUOTATION_REPAIR_BY_QUOTATION_ID } from "@/apis/endpoint.api";
import mainApi from "@/apis/main.api";
import { APIResponseType } from "@/types/response";
import { quotationRepair } from "@/types/response/response.quotation_repair";

export const getQuotationRepairByQuotationId = async (id: string) => {
  try {
    const { data: response } = await mainApi.get<
      APIResponseType<quotationRepair>
    >(GET_QUOTATION_REPAIR_BY_QUOTATION_ID + "/" + id);
    return response;
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
};
