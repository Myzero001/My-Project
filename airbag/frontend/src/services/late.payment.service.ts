import {
  GET_LATE_PAYMENTS
} from "@/apis/endpoint.api";
import mainApi from "@/apis/main.api";
import {
  TypeLatePaymentResponse,
} from "@/types/response/response.late-payment";

export const getLatePayments = async (
  page: string,
  pageSize: string,
  searchText: string
) => {
  try {
    const { data: response } = await mainApi.get<TypeLatePaymentResponse>(
      `${GET_LATE_PAYMENTS}?page=${page}&pageSize=${pageSize}&searchText=${searchText}`
    );
    return response;
  } catch (error) {
    console.error("Error fetching late payments:", error);
    throw error;
  }
};
