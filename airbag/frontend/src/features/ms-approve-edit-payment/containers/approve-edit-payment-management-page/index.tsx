import { useEffect, useState } from "react";
import MasterTableFeature from "@/components/customs/display/master.main.component";
import { useNavigate, useSearchParams } from "react-router-dom";
import { EDIT_STATUS_PAYMENT } from "@/types/requests/request.approve-edit-payment";
import { usePaymentEdits } from "@/hooks/usePaymentEdits";
import dayjs from "dayjs";
import { PAYMENT_EDITS } from "@/types/response/response.payment-edits";
import ApproveEditPaymentStatus from "@/components/customs/badges/approveEditPaymentStatus";

type dataTableType = {
  className: string;
  cells: (
    | {
        value: JSX.Element;
        className: string;
      }
    | {
        value: string | undefined;
        className: string;
      }
  )[];
  data: PAYMENT_EDITS;
}[];
export default function ApproveEditPaymentFeature() {
  const [searchText, setSearchText] = useState<string | undefined>(undefined);
  const [data, setData] = useState<dataTableType>([]);

  const headers = [
    { label: "วันที่ขอแก้ไข", colSpan: 1, className: " w-36" },
    { label: "เลขที่ใบการชำระเงิน", colSpan: 1, className: "" },
    { label: "ชื่อผู้ขอแก้ไข", colSpan: 1, className: "" },
    { label: "สถานะ", colSpan: 1, className: "" },
    { label: "หมายเหตุ", colSpan: 1, className: "" },
    { label: "ดูเนื้อหา", colSpan: 1, className: "w-20" },
  ];

  const tabs = [
    {
      value: "all",
      label: "ทั้งหมด",
    },
    {
      value: EDIT_STATUS_PAYMENT.PENDING,
      label: "กำลังดำเนินการ",
    },
    {
      value: EDIT_STATUS_PAYMENT.APPROVED,
      label: "อนุมัติแล้ว",
    },
    {
      value: EDIT_STATUS_PAYMENT.REJECTED,
      label: "ปฏิเสธ",
    },
    {
      value: EDIT_STATUS_PAYMENT.CANCELED,
      label: "ยกเลิก",
    },
  ];

  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const page = searchParams.get("page") ?? "1";
  const pageSize = searchParams.get("pageSize") ?? "25";
  const tab = searchParams.get("tab") ?? "all";
  const [searchTextDebouce, setSearchTextDebouce] = useState("");
  //const [tabValue, setTabValue] = useState("all");

  const { data: dataPaymentEdits, refetch: refetchPaymentEdits } =
    usePaymentEdits({
      page: page,
      pageSize: pageSize,
      searchText: searchTextDebouce,
      status: tab,
    });

  const handleSearch = () => {
    searchParams.set("pageSize", pageSize ?? "25");
    searchParams.set("page", "1");
    setSearchParams({ page: "1", pageSize: pageSize });
    if (searchText) {
      setSearchTextDebouce(searchText);
    }
    refetchPaymentEdits();
  };

  useEffect(() => {
    if (dataPaymentEdits?.responseObject?.data) {
      const formattedData = dataPaymentEdits?.responseObject?.data.map(
        (item) => ({
          className: "",
          cells: [
            {
              value: dayjs(item.created_at).format("YYYY-MM-DD HH:mm"),
              className: "text-center",
            },
            {
              value: item.master_payment.payment_doc ?? "N/A",
              className: "text-center",
            },
            {
              value:
                item.created_by_user.first_name +
                " " +
                (item.created_by_user.last_name ?? ""),
              className: "text-center",
            },
            {
              value: <ApproveEditPaymentStatus value={item.edit_status} />,
              className: "text-center",
            },
            {
              value: item?.remark,
              className: "text-center",
            },
          ],
          data: item,
        })
      );
      setData(formattedData);
    }
  }, [dataPaymentEdits]);

  useEffect(() => {
    if (searchText === "") {
      setSearchTextDebouce("");
      setSearchParams({ page: "1", pageSize: pageSize });
      refetchPaymentEdits();
    }
  }, [searchText]);

  return (
    <div>
      <MasterTableFeature
        title="การอนุมัติขอแก้ไขใบชำระเงิน"
        hideTitleBtn
        inputs={[
          {
            id: "search_input",
            value: searchText ?? "",
            size: "3",
            placeholder: "ค้นหา เลขที่ใบชำระเงิน ",
            onChange: (v) => setSearchText(v),
            onAction: handleSearch,
          },
        ]}
        tabs={tabs}
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
        totalData={dataPaymentEdits?.responseObject?.totalCount}
        onView={(data) => navigate(data.id + "?status=update")}
      />
    </div>
  );
}
