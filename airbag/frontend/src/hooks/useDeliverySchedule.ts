import { getDeliveryScheduleData , getDeliveryScheduleForCalendar, } from "@/services/ms.delivery.service";
import { queryOptions, useQuery } from "@tanstack/react-query";

function fetchDeliveryScheduleOptions({
  page,
  pageSize,
  searchText,
  status,
}: {
  page: string;
  pageSize: string;
  searchText: string;
  status: string;
}) {
  return queryOptions({
    queryKey: ["getDeliveryScheduleData", page, pageSize, searchText, status],
    queryFn: () => getDeliveryScheduleData(page, pageSize, searchText, status),
    // staleTime: 10 * 1000,
    // refetchInterval: 10 * 1000,
    // retry: false,
    // refetchOnWindowFocus: false,
    // enabled: false,
  });
}
export const useDeliverySchedule = ({
  page,
  pageSize,
  searchText,
  status,
}: {
  page: string;
  pageSize: string;
  searchText: string;
  status: string;
}) => {
  return useQuery(
    fetchDeliveryScheduleOptions({
      page,
      pageSize,
      searchText,
      status,
    })
  );
};

interface CalendarParams {
  startDate: string;
  endDate: string;
}

function fetchDeliveryScheduleCalendarOptions({
  startDate,
  endDate,
}: CalendarParams) {
  return queryOptions({
    queryKey: ["getDeliveryScheduleForCalendar", startDate, endDate],
    queryFn: () => getDeliveryScheduleForCalendar(startDate, endDate),
    enabled: !!startDate && !!endDate,
  });
}

export const useDeliveryScheduleCalendar = ({
  startDate,
  endDate,
}: CalendarParams) => {
  return useQuery(
    fetchDeliveryScheduleCalendarOptions({
      startDate,
      endDate,
    })
  );
};