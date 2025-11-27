import { getSupplierRepairReceiptAll } from "@/services/supplier-repair-receipt.service";
import { queryOptions, useQuery } from "@tanstack/react-query";

function fetchGetSupplierRepairReceiptAllOptions({
    page,
    pageSize,
    searchText,
}: {
    page: string;
    pageSize: string;
    searchText: string;
}) {
    return queryOptions({
        queryKey: ["getSupplierRepairReceipt", page, pageSize, searchText],
        queryFn: () => getSupplierRepairReceiptAll(page, pageSize, searchText),
        staleTime: 10 * 1000,
        refetchInterval: 10 * 1000,
        retry: false,
        // refetchOnWindowFocus: false,
        // enabled: false,
    });
}

export const useSupplierRepairReceipt = ({
    page,
    pageSize,
    searchText,
}: {
    page: string;
    pageSize: string;
    searchText: string;
}) => {
    return useQuery(
        fetchGetSupplierRepairReceiptAllOptions({
            page,
            pageSize,
            searchText,
        })
    );
};