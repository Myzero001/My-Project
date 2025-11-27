import { getRepairReceiptData } from "@/services/ms.repair.receipt";
import { queryOptions, useQuery } from "@tanstack/react-query";

function fetchRepairReceiptOptions({
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
    queryKey: ["getRepairReceiptData", page, pageSize, searchText, status],
    queryFn: () => getRepairReceiptData(page, pageSize, searchText, status),
    // staleTime: 10 * 1000,
    // refetchInterval: 10 * 1000,
    // retry: false,
    // refetchOnWindowFocus: false,
    // enabled: false,
  });
}
export const useRepairReceipt = ({
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
    fetchRepairReceiptOptions({
      page,
      pageSize,
      searchText,
      status,
    })
  );
};
