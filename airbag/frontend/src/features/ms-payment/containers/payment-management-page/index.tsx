import { useEffect, useState } from "react";
import MasterTableFeature from "@/components/customs/display/master.main.component";
import { useNavigate, useSearchParams } from "react-router-dom";
import { usePayment } from "@/hooks/usePayment";
import { PAYMENTTYPE } from "@/types/response/response.payment";
import { useToast } from "@/components/customs/alert/toast.main.component";
import DialogComponent from "@/components/customs/dialog/dialog.main.component";
import MasterSelectComponent from "@/components/customs/select/select.main.component";
// import { getAllPaymentDeliveryScheduleData } from "@/services/ms.delivery.service"; // ไม่จำเป็นต้องใช้แล้ว
import { DeliverySchedule, DeliveryScheduleSelectItem } from "@/types/response/response.delivery-schedule";
import { OPTION_PAYMENT } from "@/types/requests/request.payment";
import { useDeliveryScheduleSelect } from "@/hooks/useSelect";

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
    | {
        value: string | undefined;
        className: string;
        type?: undefined;
      }
  )[];
  data: PAYMENTTYPE;
}[];

export default function PaymentFeature() {
  const [searchText, setSearchText] = useState<string | undefined>(undefined);
  const [data, setData] = useState<dataTableType>([]);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [selectedOptionData, setSelectedOptionData] = useState<DeliverySchedule>();

  
  // --- [ลบออก] State ที่ซ้ำซ้อน ทำให้เกิดความสับสน ---
  // const [deliveryScheduleData, setDeliveryScheduleData] = useState<DeliverySchedule[]>();
  
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState<boolean>(false);

  const headers = [
    { label: "เลขที่ใบการชำระเงิน", colSpan: 1, className: "" },
    { label: "ใบส่งมอบ", colSpan: 1, className: "" },
    { label: "วันที่ส่งมอบ", colSpan: 1, className: "" },
    { label: "เลขที่ใบรับซ่อม", colSpan: 1, className: "" },
    { label: "ชื่อกิจการ", colSpan: 1, className: "" },
    { label: "จำนวนเงิน", colSpan: 1, className: "" },
    { label: "สถานะ", colSpan: 1, className: "" },
    { label: "หมายเหตุ", colSpan: 1, className: "" },
    { label: "ดูเนื้อหา", colSpan: 1, className: "min-w-20" },
  ];

  const tabs = [
    { value: "all", label: "ทั้งหมด" },
    { value: OPTION_PAYMENT.NOT_YET_PAID, label: "ยังไม่ชำระ" },
    { value: OPTION_PAYMENT.PARTIAL_PAYMENT, label: "ชำระบางส่วน" },
    { value: OPTION_PAYMENT.FULL_PAYMENT, label: "ชำระเต็มจำนวน" },
  ];

  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const { showToast } = useToast();

  const page = searchParams.get("page") ?? "1";
  const pageSize = searchParams.get("pageSize") ?? "25";
  const tab = searchParams.get("tab") ?? "all";
  const [searchTextDebouce, setSearchTextDebouce] = useState("");
  //const [tabValue, setTabValue] = useState("all");
  const [searchDeliverySchedule, setSearchDeliverySchedule] = useState("");

  const { data: dataPayment, refetch: refetchPayment } = usePayment({
    page: page,
    pageSize: pageSize,
    searchText: searchTextDebouce,
    status: tab,
  });

  const { data: dataDeliverySchedule, refetch: refetchDeliverySchedule } = useDeliveryScheduleSelect({
    searchText: searchDeliverySchedule,
  });

  const handleSearch = () => {
    searchParams.set("pageSize", pageSize ?? "25");
    searchParams.set("page", "1");
    setSearchParams({ page: "1", pageSize: pageSize });
    if (searchText) {
      setSearchTextDebouce(searchText);
    }
    refetchPayment();
  };

  const handleConfirm = async () => {
    if (!selectedOption || !selectedOptionData) {
      showToast("กรุณาระบุเลขที่ใบส่งมอบให้ครบถ้วน", false);
      return;
    }
    navigate(`/ms-payment/${selectedOptionData.id}?status=create`);
  };

  const handleCreateOpen = () => {
    setSelectedOption(null);
    setIsCreateDialogOpen(true);
  };
  
  const handleCreateClose = () => {
    setIsCreateDialogOpen(false);
  };

  const fetchDeliveryScheduleDropdown = async () => {
    const deliveryScheduleList = dataDeliverySchedule?.responseObject?.data ?? [];
    // console.log ถูกเรียกตอนนี้ ข้อมูลจะถูกต้องแล้ว
    console.log("Data for Dropdown:", deliveryScheduleList); 
    return {
      // ส่งข้อมูลที่ได้จาก Hook ไปให้ Select Component โดยตรง
      responseObject: deliveryScheduleList,
    };
  };

  const handleDeliveryScheduleSearch = (searchText: string) => {
    setSearchDeliverySchedule(searchText);
    refetchDeliverySchedule();
  };

  // --- [ลบออก] useEffect ที่ดึงข้อมูลซ้ำซ้อน ---
  // useEffect(() => {
  //   getAllPaymentDeliveryScheduleData().then((res) => {
  //     setDeliveryScheduleData(res.responseObject);
  //   });
  // }, []);

  useEffect(() => {
    if (dataPayment?.responseObject?.data) {
      const formattedData = dataPayment?.responseObject?.data.map((item) => ({
        className: "",
        cells: [
          { value: item.payment_doc ?? "N/A", className: "text-center" },
          { value: item.master_delivery_schedule.delivery_schedule_doc ?? "N/A", className: "text-center" },
          { value: item.master_delivery_schedule?.master_repair_receipt?.expected_delivery_date ?? "", className: "text-center" },
          { value: item.master_delivery_schedule.master_repair_receipt?.repair_receipt_doc, className: "text-center" },
          { value: item.master_delivery_schedule.master_repair_receipt?.master_quotation?.master_customer.contact_name, className: "text-center" },
          { value: item?.price.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 }), className: "text-end" },
          { value: item.option_payment, className: "text-center", type: "badge-payment-status" },
          { value: item?.remark, className: "text-start" },
        ],
        data: item,
      }));
      setData(formattedData);
    }
  }, [dataPayment]);

  useEffect(() => {
    if (searchText === "") {
      setSearchTextDebouce("");
      setSearchParams({ page: "1", pageSize: pageSize });
      refetchPayment();
    }
  }, [searchText]);

  return (
    <div>
      <MasterTableFeature
        title="การชำระเงิน"
        titleBtnName="ออกใบชำระเงิน"
        inputs={[
          {
            id: "search_input",
            value: searchText ?? "",
            size: "3",
            placeholder: "ค้นหา เลขที่ใบชำระเงิน เลขที่ใบส่งมอบ เลขที่ใบรับซ่อม ชือกิจการ ",
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
        totalData={dataPayment?.responseObject?.totalCount}
        onView={(data) => navigate(data.id + "?status=update")}
        onPopCreate={handleCreateOpen}
      />

      <DialogComponent
        isOpen={isCreateDialogOpen}
        onClose={handleCreateClose}
        title="ออกใบชำระเงิน"
        onConfirm={handleConfirm}
        confirmText="บันทึกข้อมูล"
        cancelText="ยกเลิก"
      >
        <div className="flex flex-col gap-3 items-left  w-full">
          <MasterSelectComponent
            onChange={(option) => {
              const value = option ? String(option.value) : null;
              setSelectedOption(value);
              
              // --- [แก้ไข] ค้นหาข้อมูลจากแหล่งข้อมูลที่ถูกต้อง (dataDeliverySchedule) ---
              const deliveryList = dataDeliverySchedule?.responseObject?.data ?? [];
              const selectedFullData = deliveryList.find(
                (item) => item.id === value
              );

              if (selectedFullData) {
                // เรามั่นใจว่าถ้าเจอข้อมูล จะเป็น Type ที่ถูกต้อง
                setSelectedOptionData(selectedFullData as DeliverySchedule);
              } else {
                setSelectedOptionData(undefined); // หากยกเลิกการเลือก ให้เคลียร์ข้อมูลด้วย
              }
            }}
            fetchDataFromGetAPI={fetchDeliveryScheduleDropdown}
            onInputChange={handleDeliveryScheduleSearch}
            valueKey="id"
            labelKey="delivery_schedule_doc"
            placeholder="กรุณาเลือก..."
            isClearable={true}
            label="เลขที่ใบส่งมอบ"
            labelOrientation="horizontal"
            classNameLabel="w-[140px] flex justify-end"
            classNameSelect="w-full"
          />
        </div>
      </DialogComponent>
    </div>
  );
}