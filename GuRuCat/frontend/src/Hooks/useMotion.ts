import { GET_MOTION } from "../api/endpoint";
import { queryOptions, useQuery } from "@tanstack/react-query";

function fetchMotion() {
    return queryOptions({
        queryKey: ["GET_MOTION"],
        queryFn: () => GET_MOTION(),
        staleTime: 10 * 1000,
        refetchInterval: 10 * 1000,
        retry: false,
    });
}

export const useMotion = () => {
    return useQuery(
        fetchMotion()
    );
};
