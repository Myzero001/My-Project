import { getApproveQuotationData } from "@/services/ms.quotation.service";
import { queryOptions, useQuery } from "@tanstack/react-query";

function fetchApproveQuatationOptions({
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
    queryKey: ["getApproveQuotationData", page, pageSize, searchText, status],
    queryFn: () => getApproveQuotationData(page, pageSize, searchText, status),
    // staleTime: 10 * 1000,
    // refetchInterval: 10 * 1000,
    // retry: false,
    // refetchOnWindowFocus: true,
    // enabled: false,
  });
}
export const useApproveQuotation = ({
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
    fetchApproveQuatationOptions({
      page,
      pageSize,
      searchText,
      status,
    })
  );
};
