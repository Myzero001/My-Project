import { getBrandModelData } from "@/services/ms.brandmodel";
import { queryOptions, useQuery } from "@tanstack/react-query";

function fetchBrandModelOptions({
  page,
  pageSize,
  searchText,
}: {
  page: string;
  pageSize: string;
  searchText: string;
}) {
  return queryOptions({
    queryKey: ["getBrandModelData", page, pageSize, searchText],
    queryFn: () => getBrandModelData(page, pageSize, searchText),
    staleTime: 10 * 1000,
    refetchInterval: 10 * 1000,
    retry: false,
    // refetchOnWindowFocus: false,
    // enabled: false,
  });
}
export const useBrandModel = ({
  page,
  pageSize,
  searchText,
}: {
  page: string;
  pageSize: string;
  searchText: string;
}) => {
  return useQuery(
    fetchBrandModelOptions({
      page,
      pageSize,
      searchText,
    })
  );
};
