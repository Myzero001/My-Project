import { getUserAll } from "@/services/user.service";
import { queryOptions, useQuery } from "@tanstack/react-query";

function fetchUserOptions({
    page,
    pageSize,
    searchText,
  }: {
    page: string;
    pageSize: string;
    searchText: string;
  }) {
    
    return queryOptions({
      queryKey: ["getUserAll", page, pageSize, searchText],
      queryFn: () => getUserAll(page, pageSize, searchText),
      staleTime: 10 * 1000,
      refetchInterval: 10 * 1000,
      retry: false,
    });
  }
  
  export const useUser = ({
    page = "1",
    pageSize = "10",
    searchText = "",
  }: {
    page?: string;
    pageSize?: string;
    searchText?: string;
  }) => {
   return useQuery(
     fetchUserOptions({
       page,
       pageSize,
       searchText,
     })
   );
  };
  
  
  