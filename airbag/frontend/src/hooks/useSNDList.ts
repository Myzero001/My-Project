import { getSupplierDeliveryNoteListAll } from "@/services/supplier-delivery-note-list.service";
import { queryOptions, useQuery } from "@tanstack/react-query";

function fetchSDNListOptions({
    page,
    pageSize,
    searchText,
    supplier_delivery_note_id,
}: {
    page: string;
    pageSize: string;
    searchText: string;
    supplier_delivery_note_id: string;
}) {
    return queryOptions({
        queryKey: ["getSupplierDeliveryNoteListAll", page, pageSize, searchText, supplier_delivery_note_id],
        queryFn: () => getSupplierDeliveryNoteListAll(page, pageSize, searchText, supplier_delivery_note_id),
        // staleTime: 10 * 1000,
        // refetchInterval: 10 * 1000,
        // retry: false,
        // refetchOnWindowFocus: false,
        // enabled: false,
    });
}
export const useSDNList = ({
    page,
    pageSize,
    searchText,
    supplier_delivery_note_id,
}: {
    page: string;
    pageSize: string;
    searchText: string;
    supplier_delivery_note_id: string;
}) => {
    return useQuery(
        fetchSDNListOptions({
            page,
            pageSize,
            searchText,
            supplier_delivery_note_id
        })
    );
};
