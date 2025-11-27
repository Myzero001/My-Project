import { getSupplierDeliveryNoteAll } from "@/services/supplier-delivery-note.service.";
import { queryOptions, useQuery } from "@tanstack/react-query";

function fetchgetSupplierDeliveryNoteAllOptions({
    page,
    pageSize,
    searchText,
}: {
    page: string;
    pageSize: string;
    searchText: string;
}) {
    return queryOptions({
        queryKey: ["getSupplierInvoice", page, pageSize, searchText],
        queryFn: () => getSupplierDeliveryNoteAll(page, pageSize, searchText),
        staleTime: 10 * 1000,
        refetchInterval: 10 * 1000,
        retry: false,
        // refetchOnWindowFocus: false,
        // enabled: false,
    });
}
export const useSupplierDeliveryNote = ({
    page,
    pageSize,
    searchText,
}: {
    page: string;
    pageSize: string;
    searchText: string;
}) => {
    return useQuery(
        fetchgetSupplierDeliveryNoteAllOptions({
            page,
            pageSize,
            searchText,
        })
    );
};
