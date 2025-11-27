import { getIssueReason } from "@/services/issueReason.service";
import { queryOptions, useQuery } from "@tanstack/react-query";

function fetchIssueReasonOptions({
    page,
    pageSize,
    searchText,
}: {
    page: string;
    pageSize: string;
    searchText: string;
}) {
    return queryOptions({
        queryKey: ["getIssueReasonData", page, pageSize, searchText],
        queryFn: () => getIssueReason(page, pageSize, searchText),
        staleTime: 10 * 1000,
        refetchInterval: 10 * 1000,
        retry: false,
        // refetchOnWindowFocus: false,
        // enabled: false,
    });
}
export const useIssueReason = ({
    page,
    pageSize,
    searchText,
}: {
    page: string;
    pageSize: string;
    searchText: string;
}) => {
    return useQuery(
        fetchIssueReasonOptions({
            page,
            pageSize,
            searchText,
        })
    );
};
