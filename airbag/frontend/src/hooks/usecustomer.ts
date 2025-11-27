import { getCustomerData } from "@/services/ms.customer";
import { queryOptions, useQuery } from "@tanstack/react-query";

function fetchCustomerOptions({
    page,
    pageSize,
    searchText,
  }: {
    page: string;
    pageSize: string;
    searchText: string;
  }) {
    
    return queryOptions({
      queryKey: ["getCustomer", page, pageSize, searchText],
      queryFn: () => getCustomerData(page, pageSize, searchText),
      staleTime: 10 * 1000,
      refetchInterval: 10 * 1000,
      retry: false,
    });
  }
  
  export const useCustomer = ({
    page = "1", // ตั้งค่า default
    pageSize = "10",
    searchText = "",
  }: {
    page?: string;
    pageSize?: string;
    searchText?: string;
  }) => {
    return useQuery(
        fetchCustomerOptions({
        page,
        pageSize,
        searchText,
      })
    );
  };
  