import { getCustomerVisit } from "@/services/customer.visit";
import { queryOptions, useQuery } from "@tanstack/react-query";


function fetchCustomerVisitOptions({
    page,
    pageSize,
    searchText,
}: {
    page: string;
    pageSize: string;
    searchText: string;
}) {
    return queryOptions({
        queryKey: ["getCustomerVisitData", page, pageSize, searchText],
        queryFn: () => getCustomerVisit(page, pageSize, searchText),
        staleTime: 10 * 1000,
        refetchInterval: 10 * 1000,
        retry: false,
        // refetchOnWindowFocus: false,
        // enabled: false,
    });
}
export const useCustomerVisit = ({
    page,
    pageSize,
    searchText,
}: {
    page: string;
    pageSize: string;
    searchText: string;
}) => {
    return useQuery(
        fetchCustomerVisitOptions({
            page,
            pageSize,
            searchText,
        })
    );
};
