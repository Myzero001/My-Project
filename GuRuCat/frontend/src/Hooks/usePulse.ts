import { GET_PULSE } from "../api/endpoint";
import { queryOptions, useQuery } from "@tanstack/react-query";

function fetchPulse() {
    return queryOptions({
        queryKey: ["GET_PULSE"],
        queryFn: () => GET_PULSE(),
        staleTime: 10 * 1000,
        refetchInterval: 10 * 1000,
        retry: false,
    });
}

export const usePulse = () => {
    return useQuery(
        fetchPulse()
    );
};
