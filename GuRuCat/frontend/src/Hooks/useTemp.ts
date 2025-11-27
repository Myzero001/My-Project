import { GET_TEMP } from "../api/endpoint";
import { queryOptions, useQuery } from "@tanstack/react-query";

function fetchTemp() {
    return queryOptions({
        queryKey: ["GET_TEMP"],
        queryFn: () => GET_TEMP(),
        staleTime: 10 * 1000,
        refetchInterval: 10 * 1000,
        retry: false,
    });
}

export const useTemp = () => {
    return useQuery(
        fetchTemp()
    );
};
