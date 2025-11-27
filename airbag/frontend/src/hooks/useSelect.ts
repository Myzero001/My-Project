import { useQuery, queryOptions } from '@tanstack/react-query';
import { searchCustomers } from "@/services/ms.customer"
import { getByBrandWithSearchText } from '@/services/ms.brandmodel';
import { selectColor } from '@/services/color.service';
import { selectTool } from '@/services/tool.service';
import { selectToolingReason } from '@/services/ms.tooling.reason.service';
import { selectRepairReceive } from '@/services/ms.repair.receipt';
import { selectDeliverySchedule } from '@/services/ms.delivery.service';
import { selectIssueReason } from '@/services/issueReason.service';
import { selectSupplier } from '@/services/supplier-delivery-note.service.';
import { selectSupplierDeliveryNote } from '@/services/supplier-delivery-note.service.';
import { selectSupplierRepairReceipt } from '@/services/send-for-a-claim.service';
import { selectSendForAClaim } from '@/services/receive-for-a-claim.service';
import { selectBrand } from '@/services/ms.brand';
import { searchRegisterData } from '@/services/search.register';
import { searchPositions } from '@/services/msPosition.service';

function fetchCustomerOptions({
    searchText,
}: {

    searchText: string;
}) {

    return queryOptions({
        queryKey: ["selectCustomer",searchText],
        queryFn: () => searchCustomers(searchText),
        staleTime: 10 * 1000,
        refetchInterval: 10 * 1000,
        retry: false,
    });
}

export const useCustomerSelect = ({
  searchText = "",
}: {
  searchText?: string;
}) => {
  return useQuery({
    queryKey: ["selectCustomer", searchText],
    queryFn: () => searchCustomers(searchText),
    staleTime: 10 * 1000,
    refetchInterval: 10 * 1000,
    retry: false,
  });
};

function fetchBrandModelOptions({
    brand_id = "",
    searchText
}: {
    brand_id?: string;
    searchText: string;
}) {

    return queryOptions({
        // เพิ่ม brand_id เข้าไปใน queryKey
        queryKey: ["selectBrandModel", brand_id, searchText],
        queryFn: () => getByBrandWithSearchText(brand_id, searchText),
        staleTime: 10 * 1000,
        refetchInterval: 10 * 1000,
        retry: false,
    });
}

export const useBrandModelSelect = ({
  brand_id = "",
  searchText = "",
}: {
  brand_id?: string;  
  searchText?: string;
}) => {
  return useQuery({
    // เพิ่ม brand_id เข้าไปใน queryKey
    queryKey: ["selectBrandModel", brand_id, searchText],
    queryFn: () => getByBrandWithSearchText(brand_id, searchText),
    staleTime: 10 * 1000,
    refetchInterval: 10 * 1000,
    retry: false,
    enabled: !!brand_id, 
  });
};

function fetchColorOptions({
    searchText,
}: {

    searchText: string;
}) {

    return queryOptions({
        queryKey: ["selectColor",searchText],
        queryFn: () => selectColor(searchText),
        staleTime: 10 * 1000,
        refetchInterval: 10 * 1000,
        retry: false,
    });
}

export const useColorSelect = ({
  searchText = "",
}: {
  searchText?: string;
}) => {
  return useQuery({
    queryKey: ["selectColor", searchText],
    queryFn: () => selectColor(searchText),
    staleTime: 10 * 1000,
    refetchInterval: 10 * 1000,
    retry: false,
  });
};

function fetchToolOptions({
    searchText,
}: {

    searchText: string;
}) {

    return queryOptions({
        queryKey: ["selectTool",searchText],
        queryFn: () => selectTool(searchText),
        staleTime: 10 * 1000,
        refetchInterval: 10 * 1000,
        retry: false,
    });
}

export const useToolSelect = ({
  searchText = "",
}: {
  searchText?: string;
}) => {
  return useQuery({
    queryKey: ["selectTool", searchText],
    queryFn: () => selectTool(searchText),
    staleTime: 10 * 1000,
    refetchInterval: 10 * 1000,
    retry: false,
  });
};

function fetchToolingReasonOptions({
    searchText,
}: {

    searchText: string;
}) {

    return queryOptions({
        queryKey: ["selectToolingReason",searchText],
        queryFn: () => selectToolingReason(searchText),
        staleTime: 10 * 1000,
        refetchInterval: 10 * 1000,
        retry: false,
    });
}

export const useToolingReasonSelect = ({
  searchText = "",
}: {
  searchText?: string;
}) => {
  return useQuery({
    queryKey: ["selectToolingReason", searchText],
    queryFn: () => selectToolingReason(searchText),
    staleTime: 10 * 1000,
    refetchInterval: 10 * 1000,
    retry: false,
  });
};

//RepiarReceipt
function fetchRepairReceiptOptions({
    searchText,
}: {

    searchText: string;
}) {

    return queryOptions({
        queryKey: ["selectRepairReceipt",searchText],
        queryFn: () => selectRepairReceive(searchText),
        staleTime: 10 * 1000,
        refetchInterval: 10 * 1000,
        retry: false,
    });
}

export const useRepairReceiptSelect = ({
  searchText = "",
}: {
  searchText?: string;
}) => {
  return useQuery({
    queryKey: ["selectRepairReceipt", searchText],
    queryFn: () => selectRepairReceive(searchText),
    staleTime: 10 * 1000,
    refetchInterval: 10 * 1000,
    retry: false,
  });
};

//Delivery-schedule
function fetchDeliveryScheduleOptions({
    searchText,
}: {

    searchText: string;
}) {

    return queryOptions({
        queryKey: ["selectDeliverySchedule",searchText],
        queryFn: () => selectDeliverySchedule(searchText),
        staleTime: 10 * 1000,
        refetchInterval: 10 * 1000,
        retry: false,
    });
}

export const useDeliveryScheduleSelect = ({
  searchText = "",
}: {
  searchText?: string;
}) => {
  return useQuery({
    queryKey: ["selectDeliverySchedule", searchText],
    queryFn: () => selectDeliverySchedule(searchText),
    staleTime: 10 * 1000,
    refetchInterval: 10 * 1000,
    retry: false,
  });
};

//Issue Reason
function fetchIssueReasonOptions({
    searchText,
}: {

    searchText: string;
}) {

    return queryOptions({
        queryKey: ["selectIssueReason",searchText],
        queryFn: () => selectIssueReason(searchText),
        staleTime: 10 * 1000,
        refetchInterval: 10 * 1000,
        retry: false,
    });
}

export const useIssueReasonSelect = ({
  searchText = "",
}: {
  searchText?: string;
}) => {
  return useQuery({
    queryKey: ["selectIssueReason", searchText],
    queryFn: () => selectIssueReason(searchText),
    staleTime: 10 * 1000,
    refetchInterval: 10 * 1000,
    retry: false,
  });
};

//Supplier
function fetchSupplierOptions({
    searchText,
}: {

    searchText: string;
}) {

    return queryOptions({
        queryKey: ["selectSupplier",searchText],
        queryFn: () => selectSupplier(searchText),
        staleTime: 10 * 1000,
        refetchInterval: 10 * 1000,
        retry: false,
    });
}

export const useSupplierSelect = ({
  searchText = "",
}: {
  searchText?: string;
}) => {
  return useQuery({
    queryKey: ["selectSupplier", searchText],
    queryFn: () => selectSupplier(searchText),
    staleTime: 10 * 1000,
    refetchInterval: 10 * 1000,
    retry: false,
  });
};

//SupplierDeliveryNote
function fetchSupplierDeliveryNoteOptions({
    searchText,
}: {

    searchText: string;
}) {

    return queryOptions({
        queryKey: ["selectSupplierDeliveryNote",searchText],
        queryFn: () => selectSupplierDeliveryNote(searchText),
        staleTime: 10 * 1000,
        refetchInterval: 10 * 1000,
        retry: false,
    });
}

export const useSupplierDeliveryNoteSelect = ({
  searchText = "",
}: {
  searchText?: string;
}) => {
  return useQuery({
    queryKey: ["selectSupplierDeliveryNote", searchText],
    queryFn: () => selectSupplierDeliveryNote(searchText),
    staleTime: 10 * 1000,
    refetchInterval: 10 * 1000,
    retry: false,
  });
};

//SupplierRepairReceipt
function fetchSupplierRepairReceiptOptions({
    searchText,
}: {

    searchText: string;
}) {

    return queryOptions({
        queryKey: ["selectSupplierRepairReceipt",searchText],
        queryFn: () => selectSupplierRepairReceipt(searchText),
        staleTime: 10 * 1000,
        refetchInterval: 10 * 1000,
        retry: false,
    });
}

export const useSupplierRepairReceiptSelect = ({
  searchText = "",
}: {
  searchText?: string;
}) => {
  return useQuery({
    queryKey: ["selectSupplierRepairReceipt", searchText],
    queryFn: () => selectSupplierRepairReceipt(searchText),
    staleTime: 10 * 1000,
    refetchInterval: 10 * 1000,
    retry: false,
  });
};

//SendForACalim
function fetchSendForACalimClaimOptions({
    searchText,
}: {

    searchText: string;
}) {

    return queryOptions({
        queryKey: ["selectSendForACalimClaim",searchText],
        queryFn: () => selectSendForAClaim(searchText),
        staleTime: 10 * 1000,
        refetchInterval: 10 * 1000,
        retry: false,
    });
}

export const useSendForACalimClaimSelect = ({
  searchText = "",
}: {
  searchText?: string;
}) => {
  return useQuery({
    queryKey: ["selectSendForACalimClaim", searchText],
    queryFn: () => selectSendForAClaim(searchText),
    staleTime: 10 * 1000,
    refetchInterval: 10 * 1000,
    retry: false,
  });
};

//BrandModel
function fetchBrandModelOnlySearchOptions({
    searchText,
}: {

    searchText: string;
}) {

    return queryOptions({
        queryKey: ["selectBrandModelOnlySearch",searchText],
        queryFn: () => selectBrand(searchText),
        staleTime: 10 * 1000,
        refetchInterval: 10 * 1000,
        retry: false,
    });
}

export const useSelectBrand = ({
  searchText = "",
}: {
  searchText?: string;
}) => {
  return useQuery({
    queryKey: ["selectBrandModelOnlySearch", searchText],
    queryFn: () => selectBrand(searchText),
    staleTime: 10 * 1000,
    refetchInterval: 10 * 1000,
    retry: false,
  });
};

function fetchSearchRegisterOptions({
    page,
    pageSize,
    search,
}: {
    page: number;
    pageSize: number;
    search: string;
}) {
    return queryOptions({
        queryKey: ["searchRegister", { page, pageSize, search }],
        queryFn: () => searchRegisterData(page, pageSize, search),
        retry: false,
    });
}

// Custom Hook useSearchRegisterData (ส่วนที่ต้องแก้ไข)
export const useSearchRegisterData = ({
  page = 1,
  pageSize = 10,
  search = "",
  enabled = true, // << ค่า default
}: {
  page: number;
  pageSize: number;
  search?: string;
  enabled?: boolean; // ***** เพิ่ม Type ของ enabled เข้าไปตรงนี้ *****
}) => {
  return useQuery({
    queryKey: ["searchRegister", { page, pageSize, search }],
    queryFn: () => searchRegisterData(page, pageSize, search),
    retry: false,
    enabled: enabled, // << ส่งค่า enabled ที่รับเข้ามาไปให้ useQuery
  });
};

function fetchPositionOptions({
    searchText,
}: {

    searchText: string;
}) {

    return queryOptions({
        queryKey: ["selectPosition",searchText],
        queryFn: () => searchPositions(searchText),
        staleTime: 10 * 1000,
        refetchInterval: 10 * 1000,
        retry: false,
    });
}

export const usePositionSelect = ({
  searchText = "",
}: {
  searchText?: string;
}) => {
  return useQuery({
    queryKey: ["selectPosition", searchText],
    queryFn: () => searchPositions(searchText),
    staleTime: 10 * 1000,
    refetchInterval: 10 * 1000,
    retry: false,
  });
};