import { getToolingReasonData } from "@/services/ms.tooling.reason.service";
import { queryOptions, useQuery } from "@tanstack/react-query";

function fetchToolingReasonOptions({
  page,
  pageSize,
  searchText,
}: {
  page: string;
  pageSize: string;
  searchText: string;
}) {
  return queryOptions({
    queryKey: ["getToolingReasonData", page, pageSize, searchText],
    queryFn: () => getToolingReasonData(page, pageSize, searchText),
    staleTime: 10 * 1000,
    refetchInterval: 10 * 1000,
    retry: false,
    // refetchOnWindowFocus: false,
    // enabled: false,
  });
}
export const useToolingReason = ({
  page,
  pageSize,
  searchText,
}: {
  page: string;
  pageSize: string;
  searchText: string;
}) => {
  return useQuery(
    fetchToolingReasonOptions({
      page,
      pageSize,
      searchText,
    })
  );
};
