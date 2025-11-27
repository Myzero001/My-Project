import { getPaymentData } from "@/services/ms.payment.service";
import { queryOptions, useQuery } from "@tanstack/react-query";

function fetchPaymentOptions({
  page,
  pageSize,
  searchText,
  status,
}: {
  page: string;
  pageSize: string;
  searchText: string;
  status: string;
}) {
  return queryOptions({
    queryKey: ["getPaymentData", page, pageSize, searchText, status],
    queryFn: () => getPaymentData(page, pageSize, searchText, status),
    // staleTime: 10 * 1000,
    // refetchInterval: 10 * 1000,
    // retry: false,
    // refetchOnWindowFocus: true,
    // enabled: false,
  });
}
export const usePayment = ({
  page,
  pageSize,
  searchText,
  status,
}: {
  page: string;
  pageSize: string;
  searchText: string;
  status: string;
}) => {
  return useQuery(
    fetchPaymentOptions({
      page,
      pageSize,
      searchText,
      status,
    })
  );
};
