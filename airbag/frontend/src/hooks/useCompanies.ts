import { getMsCompanies } from "../services/ms.companies";
import { queryOptions, useQuery } from "@tanstack/react-query";

function fetchCompaniesOptions({
    page,
    pageSize,
    searchText,
  }: {
    page: string;
    pageSize: string;
    searchText: string;
  }) {
    
    return queryOptions({
      queryKey: ["getMsCompanies", page, pageSize, searchText],
      queryFn: () => getMsCompanies(page, pageSize, searchText),
      staleTime: 10 * 1000,
      refetchInterval: 10 * 1000,
      retry: false,
    });
  }
  
  export const useCompanies = ({
    page = "1", // ตั้งค่า default
    pageSize = "10",
    searchText = "",
  }: {
    page?: string;
    pageSize?: string;
    searchText?: string;
  }) => {
    return useQuery(
        fetchCompaniesOptions({
        page,
        pageSize,
        searchText,
      })
    );
  };