import { useEffect, useState } from "react";
import MasterTableFeature from "@/components/customs/display/master.main.component";
import { useNavigate, useSearchParams } from "react-router-dom";
import { QUOTATION_ALL } from "@/types/response/response.quotation";
import dayjs from "dayjs";
import { useApproveQuotation } from "@/hooks/useApproveQuotation";
import { FaCheckCircle } from "react-icons/fa";
import { AiFillCloseCircle } from "react-icons/ai";
import DialogApproveQuotation from "../../components/dialogApproveQuotation";
import DialogRejectQuotation from "../../components/dialogRejectQuotation";
import { QUOTATION_STATUS } from "@/types/quotationStatus";

type dataTableType = {
  className: string;
  cells: (
    | {
        value: string | null;
        className: string;
        type?: undefined;
      }
    | {
        value: string | null;
        className: string;
        type: string;
      }
    | {
        value: JSX.Element;
        className: string;
        type?: undefined;
      }
  )[];
  data: QUOTATION_ALL;
}[];
export default function ApproveQuotationPage() {
  const [searchText, setSearchText] = useState<string | undefined>(undefined);
  const [data, setData] = useState<dataTableType>([]);

  const [isOpenApproveQuotation, setIsOpenApproveQuotation] =
    useState<boolean>(false);
  const [isOpenRejectQuotation, setIsOpenRejectQuotation] =
    useState<boolean>(false);
  const [activeQuotation, setActiveQuotation] = useState<QUOTATION_ALL>();

  const headers = [
    { label: "เลขที่ใบเสนอราคา", colSpan: 1, className: "" },
    { label: "รหัสลูกค้า", colSpan: 1, className: "" },
    { label: "ชื่อกิจการ", colSpan: 1, className: "" },
    { label: "วันเสนอราคา", colSpan: 1, className: "" },
    { label: "นัดหมายถอด", colSpan: 1, className: "" },
    { label: "ราคา", colSpan: 1, className: "" },
    { label: "รถ", colSpan: 1, className: "" },
    { label: "สถานะ", colSpan: 1, className: "" },
    { label: "อนุมัติ", colSpan: 1, className: "min-w-14" },
    { label: "ไม่อนุมัติ", colSpan: 1, className: "min-w-14" },
    { label: "ดูเนื้อหา", colSpan: 1, className: "min-w-20" },
  ];

  const tabs = [
    {
      value: "all",
      label: "ทั้งหมด",
    },
    {
      value: "waiting_for_approve",
      label: "รอการอนุมัติ",
    },
    {
      value: "approved",
      label: "อนุมัติ",
    },
    {
      value: "reject_approve",
      label: "ปฏิเสธอนุมัติ",
    },
  ];

  

  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const page = searchParams.get("page") ?? "1";
  const pageSize = searchParams.get("pageSize") ?? "25";
  const tab = searchParams.get("tab") ?? "waiting_for_approve";
  const [searchTextDebouce, setSearchTextDebouce] = useState("");
  //const [tabValue, setTabValue] = useState(tabs[1].value);

  const { data: dataQuatations, refetch: refetchQuatations } =
    useApproveQuotation({
      page: page,
      pageSize: pageSize,
      searchText: searchTextDebouce,
      status: tab,
    });

  const handleApproveQuotation = (data: QUOTATION_ALL) => {
    setActiveQuotation(data);
    setIsOpenApproveQuotation(true);
  };

  const handleRejectQuotation = (data: QUOTATION_ALL) => {
    setActiveQuotation(data);
    setIsOpenRejectQuotation(true);
  };

  const handleSearch = () => {
    searchParams.set("pageSize", pageSize ?? "25");
    searchParams.set("page", "1");
    setSearchParams({ page: "1", pageSize: pageSize });
    if (searchText) {
      setSearchTextDebouce(searchText);
    }
    refetchQuatations();
  };

  const onConfirmApproveQuotation = () => {
    setIsOpenApproveQuotation(false);
    setIsOpenRejectQuotation(false);
    refetchQuatations();
  };

  useEffect(() => {
    if (dataQuatations?.responseObject?.data) {
      const formattedData = dataQuatations?.responseObject?.data.map(
        (item) => ({
          className: "",
          cells: [
            { value: item.quotation_doc ?? "N/A", className: "text-center" },
            {
              value: item.master_customer?.customer_code,
              className: "text-center",
            },
            {
              value: item.master_customer.contact_name,
              className: "text-center",
            },
            {
              value: dayjs(item.created_at).format("YYYY-MM-DD") ?? "-",
              className: "text-center",
            },
            { value: item.appointment_date ?? "-", className: "text-center" },
            {
              value: item.total_price ?? "0",
              className: "text-center",
            },
            {
              value: item?.master_brand?.brand_name ?? "-",
              className: "text-center",
            },
            {
              value: item.quotation_status,
              className: "text-center",
              type: "badge-quotation-status",
            },
            {
              value: (
                <div className=" flex justify-center">
                  <FaCheckCircle
                    color="green"
                    className={` bg-transparent   ${
                      item.quotation_status ===
                      QUOTATION_STATUS.WAITING_FOR_APPROVE
                        ? "cursor-pointer"
                        : "opacity-40"
                    }`}
                    size={28}
                    onClick={() => {
                      if (
                        item.quotation_status ===
                        QUOTATION_STATUS.WAITING_FOR_APPROVE
                      ) {
                        handleApproveQuotation(item);
                      }
                    }}
                  />
                </div>
              ),
              className: "text-center",
            },
            {
              value: (
                <div className=" flex justify-center">
                  <AiFillCloseCircle
                    color="red"
                    className={` bg-transparent  ${
                      item.quotation_status ===
                      QUOTATION_STATUS.WAITING_FOR_APPROVE
                        ? "cursor-pointer"
                        : "opacity-40"
                    }`}
                    size={30}
                    onClick={() => {
                      if (
                        item.quotation_status ===
                        QUOTATION_STATUS.WAITING_FOR_APPROVE
                      ) {
                        handleRejectQuotation(item);
                      }
                    }}
                  />
                </div>
              ),
              className: "text-center",
            },
          ],
          data: item,
        })
      );
      setData(formattedData);
    }
  }, [dataQuatations]);

  useEffect(() => {
    if (searchText === "") {
      setSearchTextDebouce("");
      setSearchParams({ page: "1", pageSize: pageSize });
      refetchQuatations();
    }
  }, [searchText]);

  return (
    <div>
      <div className=" p-2 ">
      <MasterTableFeature
        title="อนุมัติ"
        hideTitleBtn
        inputs={[
          {
            id: "search_input",
            value: searchText ?? "",
            size: "3",
            placeholder: "ค้นหา เลขที่ใบเสนอราคา หรือ รหัส หรือ ชื่อลูกค้า",
            onChange: (v) => setSearchText(v),
            onAction: handleSearch,
          },
        ]}
        tabs={tabs}
        defaultValueTab={tabs[1].value}
        onTabsValueChange={(newTabValue) => {
            setSearchParams({
              tab: newTabValue,
              page: "1",
              pageSize: pageSize,
            });
          }}
        onSearch={handleSearch}
        headers={headers}
        rowData={data}
        totalData={dataQuatations?.responseObject?.totalCount}
        onView={(data) => navigate(data.quotation_id)}
      />
      </div>

      <DialogApproveQuotation
        data={activeQuotation}
        isOpen={isOpenApproveQuotation}
        onClose={() => setIsOpenApproveQuotation(false)}
        onConfirm={onConfirmApproveQuotation}
      />
      <DialogRejectQuotation
        data={activeQuotation}
        isOpen={isOpenRejectQuotation}
        onClose={() => setIsOpenRejectQuotation(false)}
        onConfirm={onConfirmApproveQuotation}
      />
    </div>
  );
}
