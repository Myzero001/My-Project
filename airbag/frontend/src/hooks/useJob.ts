import { getJobsData } from "@/services/ms.repair.receipt"; 
import { queryOptions, useQuery } from "@tanstack/react-query";

interface UseJobsProps {
  page: string;
  pageSize: string;
  searchText: string;
  status: string;
}
function fetchJobsOptions({ page, pageSize, searchText, status }: UseJobsProps) {
  return queryOptions({
    queryKey: ["jobs", { page, pageSize, searchText, status }],
    queryFn: () => getJobsData(page, pageSize, searchText, status),
  });
}

export const useJobs = ({ page, pageSize, searchText, status }: UseJobsProps) => {
  return useQuery(
    fetchJobsOptions({
      page,
      pageSize,
      searchText,
      status,
    })
  );
};