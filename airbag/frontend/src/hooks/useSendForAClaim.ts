import { getSendForAClaimAll } from "@/services/send-for-a-claim.service";
import { queryOptions, useQuery } from "@tanstack/react-query";


function fetchSendForAClaimOptions({
    page,
    pageSize,
    searchText,
}: {
    page: string;
    pageSize: string;
    searchText: string;
}) {
    return queryOptions({
        queryKey: ["getSendForAClaimAll", page, pageSize, searchText],
        queryFn: () => getSendForAClaimAll(page, pageSize, searchText),
        staleTime: 10 * 1000,
        refetchInterval: 10 * 1000,
        retry: false,
        // refetchOnWindowFocus: false,
        // enabled: false,
    });
}
export const useSendForAClaim = ({
    page,
    pageSize,
    searchText,
}: {
    page: string;
    pageSize: string;
    searchText: string;
}) => {
    return useQuery(
        fetchSendForAClaimOptions({
            page,
            pageSize,
            searchText,
        })
    );
};
