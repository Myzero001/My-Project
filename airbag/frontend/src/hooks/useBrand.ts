import { getBrandData } from "@/services/ms.brand";
import { queryOptions, useQuery } from "@tanstack/react-query";

function fetchBrandOptions({
  page,
  pageSize,
  searchText,
}: {
  page: string;
  pageSize: string;
  searchText: string;
}) {
  return queryOptions({
    queryKey: ["getBrandData", page, pageSize, searchText],
    queryFn: () => getBrandData(page, pageSize, searchText),
    staleTime: 10 * 1000,
    refetchInterval: 10 * 1000,
    retry: false,
    // refetchOnWindowFocus: false,
    // enabled: false,
  });
}
export const useBrand = ({
  page,
  pageSize,
  searchText,
}: {
  page: string;
  pageSize: string;
  searchText: string;
}) => {
  return useQuery(
    fetchBrandOptions({
      page,
      pageSize,
      searchText,
    })
  );
};
