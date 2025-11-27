import { getGroupRepairData } from "@/services/ms.group.repair";
import { queryOptions, useQuery } from "@tanstack/react-query";

function fetchGroupRepairOptions({
  page,
  pageSize,
  searchText,
}: {
  page: string;
  pageSize: string;
  searchText: string;
}) {
  return queryOptions({
    queryKey: ["getGroupRepairData", page, pageSize, searchText],
    queryFn: () => getGroupRepairData(page, pageSize, searchText),
    staleTime: 10 * 1000,
    refetchInterval: 10 * 1000,
    retry: false,
    // refetchOnWindowFocus: false,
    // enabled: false,
  });
}
export const useGroupRepair = ({
  page,
  pageSize,
  searchText,
}: {
  page: string;
  pageSize: string;
  searchText: string;
}) => {
  return useQuery(
    fetchGroupRepairOptions({
      page,
      pageSize,
      searchText,
    })
  );
};
