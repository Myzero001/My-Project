import { getMasterPosition } from "@/services/msPosition.service";
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
        queryKey: ["getMasterPosition", page, pageSize, searchText],
        queryFn: () => getMasterPosition(page, pageSize, searchText),
        staleTime: 10 * 1000,
        refetchInterval: 10 * 1000,
        retry: false,
        // refetchOnWindowFocus: false,
        // enabled: false,
    });
}
export const usePosition = ({
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
