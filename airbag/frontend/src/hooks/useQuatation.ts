import { getQuotationData } from "@/services/ms.quotation.service";
import { queryOptions, useQuery } from "@tanstack/react-query";

function fetchQuatationOptions({
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
    queryKey: ["getQuotationData", page, pageSize, searchText, status],
    queryFn: () => getQuotationData(page, pageSize, searchText, status),
    // staleTime: 10 * 1000,
    // refetchInterval: 10 * 1000,
    // retry: false,
    // refetchOnWindowFocus: false,
    // enabled: false,
  });
}
export const useQuatation = ({
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
    fetchQuatationOptions({
      page,
      pageSize,
      searchText,
      status,
    })
  );
};
