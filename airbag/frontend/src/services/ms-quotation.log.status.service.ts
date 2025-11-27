import { GET_QUOTATION_LOG_STATUS_BY_QUOTATION_ID } from "@/apis/endpoint.api";
import mainApi from "@/apis/main.api";

import { APIResponseType } from "@/types/response";
import { QUOTATION_LOG_STATUS } from "@/types/response/response.quotation-log-status";

export const getQuotationLogStatusByQuotationId = async (id: string) => {
  try {
    const { data: response } = await mainApi.get<
      APIResponseType<QUOTATION_LOG_STATUS[]>
    >(GET_QUOTATION_LOG_STATUS_BY_QUOTATION_ID + "/" + id);
    return response;
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
};
