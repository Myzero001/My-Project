import { getPayLoadForReceiveForAClaim } from "@/services/receive-for-a-claim.service";
import { queryOptions, useQuery } from "@tanstack/react-query";

function fetchPositionOptions({
    page,
    pageSize,
    searchText,
}: {
    page: string;
    pageSize: string;
    searchText: string;
}) {
    return queryOptions({
        queryKey: ["getPayLoadForReceiveForAClaim", page, pageSize, searchText],
        queryFn: () => getPayLoadForReceiveForAClaim(page, pageSize, searchText),
        staleTime: 10 * 1000,
        refetchInterval: 10 * 1000,
        retry: false,
        // refetchOnWindowFocus: false,
        // enabled: false,
    });
}
export const useReceiveAClaim = ({
    page,
    pageSize,
    searchText,
}: {
    page: string;
    pageSize: string;
    searchText: string;
}) => {
    return useQuery(
        fetchPositionOptions({
            page,
            pageSize,
            searchText,
        })
    );
};
