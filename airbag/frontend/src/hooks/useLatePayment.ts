import { getLatePayments } from "@/services/late.payment.service";
import { queryOptions, useQuery } from "@tanstack/react-query";

function fetchLatePaymentOptions({
    page,
    pageSize,
    searchText,
}: {
    page: string;
    pageSize: string;
    searchText: string;
}) {
    return queryOptions({
        queryKey: ["getLatePayment", page, pageSize, searchText],
        queryFn: () => getLatePayments(page, pageSize, searchText),
        staleTime: 10 * 1000,
        //refetchInterval: 10 * 1000,
        retry: false,
        // refetchOnWindowFocus: false,
        // enabled: false,
    });
}

export const useLatePayment = ({
    page,
    pageSize,
    searchText,
}: {
    page: string;
    pageSize: string;
    searchText: string;
}) => {
    return useQuery(
        fetchLatePaymentOptions({
            page,
            pageSize,
            searchText,
        })
    );
};

