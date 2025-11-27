import { getMSSupplierall } from "@/services/ms.Supplier";
import { queryOptions, useQuery } from "@tanstack/react-query";

function fetchSupplierOptions({
    page,
    pageSize,
    searchText,
}: {
    page: string;
    pageSize: string;
    searchText: string;
}) {
    return queryOptions({
        queryKey: ["getMSSupplierall", page, pageSize, searchText],
        queryFn: () => getMSSupplierall(page, pageSize, searchText),
        staleTime: 10 * 1000,
        refetchInterval: 10 * 1000,
        retry: false,
        // refetchOnWindowFocus: false,
        // enabled: false,
    });
}
export const useSupplier = ({
    page,
    pageSize,
    searchText,
}: {
    page: string;
    pageSize: string;
    searchText: string;
}) => {
    return useQuery(
        fetchSupplierOptions({
            page,
            pageSize,
            searchText,
        })
    );
};
