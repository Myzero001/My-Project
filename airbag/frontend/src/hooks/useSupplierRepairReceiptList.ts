import { getSupplierRepairReceiptListAll } from "@/services/supplier-repair-receipt.service-list";
import { queryOptions, useQuery } from "@tanstack/react-query";

function fetchGetSupplierRepairReceiptListAllOptions({
    page,
    pageSize,
    searchText,
}: {
    page: string;
    pageSize: string;
    searchText: string;
}) {
    return queryOptions({
        queryKey: ["getSupplierRepairReceiptList", page, pageSize, searchText],
        queryFn: () => getSupplierRepairReceiptListAll(page, pageSize, searchText),
        staleTime: 10 * 1000,
        refetchInterval: 10 * 1000,
        retry: false,
        // refetchOnWindowFocus: false,
        // enabled: false,
    });
}

export const useSupplierRepairReceiptList = ({
    page,
    pageSize,
    searchText,
}: {
    page: string;
    pageSize: string;
    searchText: string;
}) => {
    return useQuery(
        fetchGetSupplierRepairReceiptListAllOptions({
            page,
            pageSize,
            searchText,
        })
    );
};