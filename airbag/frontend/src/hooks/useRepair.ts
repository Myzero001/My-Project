import { get_ms_repair_all } from "@/services/msRepir.service";
import { queryOptions, useQuery } from "@tanstack/react-query";


function fetchRepairOptions({
    page,
    pageSize,
    searchText,
}: {
    page: string;
    pageSize: string;
    searchText: string;
}) {
    return queryOptions({
        queryKey: ["get_ms_repair_all", page, pageSize, searchText],
        queryFn: () => get_ms_repair_all(page, pageSize, searchText),
        staleTime: 10 * 1000,
        refetchInterval: 10 * 1000,
        retry: false,
        // refetchOnWindowFocus: false,
        // enabled: false,
    });
}
export const useRepair = ({
    page,
    pageSize,
    searchText,
}: {
    page: string;
    pageSize: string;
    searchText: string;
}) => {
    return useQuery(
        fetchRepairOptions({
            page,
            pageSize,
            searchText,
        })
    );
};
