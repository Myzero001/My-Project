import { getClearbyData } from "@/services/ms.clearby.ts";
import { queryOptions, useQuery } from "@tanstack/react-query";

function fetchClearByOptions({
  page,
  pageSize,
  searchText,
}: {
  page: string;
  pageSize: string;
  searchText: string;
}) {
  return queryOptions({
    queryKey: ["getClearbyData", page, pageSize, searchText],
    queryFn: () => getClearbyData(page, pageSize, searchText),
    staleTime: 10 * 1000,
    refetchInterval: 10 * 1000,
    retry: false,
    // refetchOnWindowFocus: false,
    // enabled: false,
  });
}
export const useClearBy= ({
  page,
  pageSize,
  searchText,
}: {
  page: string;
  pageSize: string;
  searchText: string;
}) => {
  return useQuery(
    fetchClearByOptions({
      page,
      pageSize,
      searchText,
    })
  );
};
