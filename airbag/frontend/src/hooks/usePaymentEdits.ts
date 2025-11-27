import { getPaymentEditsData } from "@/services/ms.payment.service";
import { queryOptions, useQuery } from "@tanstack/react-query";

function fetchPaymentEditsOptions({
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
    queryKey: ["getPaymentEditsData", page, pageSize, searchText, status],
    queryFn: () => getPaymentEditsData(page, pageSize, searchText, status),
    // staleTime: 10 * 1000,
    // refetchInterval: 10 * 1000,
    // retry: false,
    // refetchOnWindowFocus: true,
    // enabled: false,
  });
}
export const usePaymentEdits = ({
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
    fetchPaymentEditsOptions({
      page,
      pageSize,
      searchText,
      status,
    })
  );
};
