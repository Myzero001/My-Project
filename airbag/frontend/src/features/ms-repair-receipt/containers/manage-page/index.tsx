import { useEffect, useState } from "react";
import MasterTableFeature from "@/components/customs/display/master.main.component";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useRepairReceipt } from "@/hooks/useRepairReceipt";
import { repairReceipt } from "@/types/response/response.repair-receipt";

type dataTableType = {
  className: string;
  cells: (
    | {
        value: string | null;
        className: string;
        type?: undefined;
      }
    | {
        value: string;
        className: string;
        type: string;
      }
  )[];
  data: repairReceipt;
}[];
export default function RepairReceiptFeature() {
  const [searchText, setSearchText] = useState<string | undefined>(undefined);
  const [data, setData] = useState<dataTableType>([]);

  const headers = [
    { label: "เลขที่ใบรับซ่อม", colSpan: 1, className: "" },
    { label: "เลขที่ใบเสนอราคา", colSpan: 1, className: "" },
    { label: "ชื่อกิจการ", colSpan: 1, className: "" },
    { label: "เบอร์โทร", colSpan: 1, className: "" },
    { label: "รุ่น", colSpan: 1, className: "" },
    { label: "กล่อง", colSpan: 1, className: "" },
    { label: "ราคา", colSpan: 1, className: "" },
    { label: "สถานะ", colSpan: 1, className: "" },
    { label: "ดูเนื้อหา", colSpan: 1, className: "min-w-20" },
  ];

  const tabs = [
    {
      value: "all",
      label: "ทั้งหมด",
    },
    {
      value: "pending",
      label: "กำลังดำเนินการ",
    },
    {
      value: "success",
      label: "เสร็จสมบูรม์",
    },

    {
      value: "cancel",
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

  const { data: dataRepairReceipt, refetch: refetchRepairReceipt } =
    useRepairReceipt({
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
    refetchRepairReceipt();
  };

  useEffect(() => {
    if (dataRepairReceipt?.responseObject?.data) {
      const formattedData = dataRepairReceipt?.responseObject?.data.map(
        (item) => ({
          className: "",
          cells: [
            {
              value: item.repair_receipt_doc ?? "N/A",
              className: "text-center",
            },
            {
              value: item.master_quotation.quotation_doc,
              className: "text-center",
            },
            {
              value: item.master_quotation.master_customer?.contact_name,
              className: "text-center",
            },
            {
              value: item.master_quotation.contact_number,
              className: "text-center",
            },
            {
              value: item.master_quotation.master_brand.brand_name,
              className: "text-center",
            },
            {
              value: "-",
              className: "text-center",
            },
            {
              value: parseFloat(
                item?.master_quotation.total_price ?? "0"
              )?.toLocaleString("en-US", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              }),
              className: "text-end",
            },
            {
              value: item.repair_receipt_status,
              className: "text-center",
              type: "badge-status",
            },
          ],
          data: item,
        })
      );
      setData(formattedData);
    }
  }, [dataRepairReceipt]);

  useEffect(() => {
    if (searchText === "") {
      setSearchTextDebouce("");
      setSearchParams({ page: "1", pageSize: pageSize });
      refetchRepairReceipt();
    }
    
  }, [searchText]);

  return (
    <div>
      <div className=" p-2 ">
      <MasterTableFeature
        title="รายการรับซ่อม"
        hideTitleBtn
        inputs={[
          {
            id: "search_input",
            value: searchText ?? "",
            size: "3",
            placeholder: "ค้นหา เลขที่ใบรับซ่อม เลขที่ใบเสนอราคา ชื่อกิจการ เบอร์โทร รุ่น",
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
        totalData={dataRepairReceipt?.responseObject?.totalCount}
        onView={(data) => navigate(data.id)}
      />
      </div>
    </div>
  );
}
