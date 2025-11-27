import { getTool } from "@/services/tool.service";
import { queryOptions, useQuery } from "@tanstack/react-query";

function fetchtoolOptions({
    page,
    pageSize,
    searchText,
  }: {
    page: string;
    pageSize: string;
    searchText: string;
  }) {
    
    return queryOptions({
      queryKey: ["getTool", page, pageSize, searchText],
      queryFn: () => getTool(page, pageSize, searchText),
      staleTime: 10 * 1000,
      refetchInterval: 10 * 1000,
      retry: false,
    });
  }
  
  export const useTool = ({
    page = "1", // ตั้งค่า default
    pageSize = "10",
    searchText = "",
  }: {
    page?: string;
    pageSize?: string;
    searchText?: string;
  }) => {
    return useQuery(
      fetchtoolOptions({
        page,
        pageSize,
        searchText,
      })
    );
  };
  