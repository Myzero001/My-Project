import { useEffect, useState, useMemo } from "react"; // --- MODIFIED: เพิ่ม useMemo ---
import MasterTableFeature from "@/components/customs/display/master.main.component";
import { useNavigate, useSearchParams } from "react-router-dom";
import { repairReceipt } from "@/types/response/response.repair-receipt";
import DialogComponent from "@/components/customs/dialog/dialog.main.component";
import MasterSelectComponent from "@/components/customs/select/select.main.component";
import { getAllRepairReceiptByNotDeliveryData } from "@/services/ms.repair.receipt";
import { useToast } from "@/components/customs/alert/toast.main.component";
import { postDeliveryScheduleData } from "@/services/ms.delivery.service";
import { useDeliverySchedule } from "@/hooks/useDeliverySchedule";
import { DeliverySchedule } from "@/types/response/response.delivery-schedule";
import { useLocalProfileData } from "@/zustand/useProfile";
import { permissionMap } from "@/utils/permissionMap";
import { useRepairReceiptSelect } from "@/hooks/useSelect";
import { RepairReceiptSelectItem } from "@/types/response/response.repair-receipt";

type dataTableType = {
  className: string;
  cells: {
    value: any;
    className: string;
  }[];
  data: DeliverySchedule;
}[];

export default function DeliveryScheduleFeature() {
  const [searchText, setSearchText] = useState<string | undefined>(undefined);
  const [data, setData] = useState<dataTableType>([]);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [repairDatas, setRepairDatas] = useState<repairReceipt[]>();
  const [selectedOptionData, setSelectedOptionData] = useState<any>();
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState<boolean>(false);
  const [searchRepairReceipt, setSearchRepairReceipt] = useState("");

  const headers = [
    { label: "เลขที่ใบส่งมอบ", colSpan: 1, className: "" },
    { label: "วันที่ใบส่งมอบ", colSpan: 1, className: "" },
    { label: "เลขที่ใบรับซ่อม", colSpan: 1, className: "" },
    { label: "ชื่อกิจการ", colSpan: 1, className: "" },
    { label: "รายละเอียด", colSpan: 1, className: "" },
    { label: "ยอดเงิน", colSpan: 1, className: "" },
    { label: "เบอร์โทร", colSpan: 1, className: "" },
    { label: "สถานะ", colSpan: 1, className: "" },
    { label: "ดูเนื้อหา", colSpan: 1, className: "min-w-20" },
  ];

  const tabs = [
    { value: "all", label: "ทั้งหมด" },
    { value: "pending", label: "กำลังดำเนินการ" },
    { value: "success", label: "เสร็จสมบูรม์" },
  ];

  const { showToast } = useToast();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const page = searchParams.get("page") ?? "1";
  const pageSize = searchParams.get("pageSize") ?? "25";
  const tab = searchParams.get("tab") ?? "all";
  const [searchTextDebouce, setSearchTextDebouce] = useState("");
  //const [tabValue, setTabValue] = useState("all");

  const { data: dataDeliverySchedule, refetch: refetchDeliverySchedule } =
    useDeliverySchedule({
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
    refetchDeliverySchedule();
  };

  const handleConfirm = async () => {
    if (!selectedOption || !selectedOptionData) {
      showToast("กรุณาระบุเลขที่ใบรับซ่อมให้ครบถ้วน", false);
      return;
    }
    postDeliveryScheduleData({
      repair_receipt_id: selectedOption,
    })
      .then((response) => {
        if (response.success) {
          setSelectedOption(null);
          handleCreateClose();

          if (response.statusCode === 409) {
            showToast("บิลใบส่งมอบนี้มีอยู่แล้ว", false);
          } else {
            showToast("สร้างบิลใบส่งมอบเรียบร้อยแล้ว", true);
            refetchDeliverySchedule(); // --- ADDED: เพื่อให้ข้อมูลตารางอัพเดททันที ---
            navigate(`/delivery-schedule/${response.responseObject?.id}`);
          }
        } else {
          showToast("ไม่สามารถสร้างบิลใบส่งมอบได้", false);
        }
      })
      .catch(() => {
        showToast("ไม่สามารถสร้างบิลใบส่งมอบได้", false);
      });
  };

  const handleCreateOpen = () => {
    setSelectedOption(null);
    setIsCreateDialogOpen(true);
  };
  const handleCreateClose = () => {
    setIsCreateDialogOpen(false);
  };

  useEffect(() => {
    if (dataDeliverySchedule?.responseObject?.data) {
      const formattedData = dataDeliverySchedule?.responseObject?.data.map(
        (item) => ({
          className: "",
          cells: [
            {
              value: item?.delivery_schedule_doc ?? "",
              className: "text-center",
            },
            {
              value: item.master_repair_receipt?.expected_delivery_date ?? "",
              className: "text-center",
            },
            {
              value: item.master_repair_receipt?.repair_receipt_doc,
              className: "text-center",
            },
            {
              value:
                item.master_repair_receipt?.master_quotation?.master_customer
                  .contact_name,
              className: "text-center",
            },
            {
              value:
                item.master_repair_receipt?.master_quotation?.master_brandmodel
                  .brandmodel_name +
                " / " +
                item.master_repair_receipt?.master_quotation?.master_brand
                  .brand_name +
                " / " +
                item.master_repair_receipt?.master_quotation?.master_color
                  .color_name,
              className: "text-center",
            },
            {
              value: item?.master_repair_receipt?.total_price?.toLocaleString(
                "en-US",
                {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                }
              ),
              className: "text-end",
            },
            {
              value: item.contact_number,
              className: "text-center",
            },
            {
              value: item.status,
              className: "text-center",
              type: "badge-status",
            },
          ],
          data: item,
        })
      );
      setData(formattedData);
    }
  }, [dataDeliverySchedule]);

  useEffect(() => {
    if (searchText === "") {
      setSearchTextDebouce("");
      setSearchParams({ page: "1", pageSize: pageSize });
      refetchDeliverySchedule();
    }
  }, [searchText]);

  // useEffect นี้อาจจะไม่จำเป็นแล้ว หาก `useRepairReceiptSelect` ทำหน้าที่แทนได้สมบูรณ์
  useEffect(() => {
    getAllRepairReceiptByNotDeliveryData().then((res) => {
      setRepairDatas(res.responseObject);
    });
  }, []);

  const { profile } = useLocalProfileData();

  const [disableFieldsPermission, setDisableFieldsPermission] =
    useState<boolean>(false);

  const checkPermission = () => {
    if (profile && profile.role?.role_name) {
      if (permissionMap["บิลใบส่งมอบ"][profile.role?.role_name] !== "A") {
        setDisableFieldsPermission(true);
        return true;
      }
    }
  };

  useEffect(() => {
    checkPermission();
  }, [profile]);

  const { data: dataRepairReceipt, refetch: refetchRepairReceipt } =
    useRepairReceiptSelect({
      searchText: searchRepairReceipt,
    });

  // --- ADDED ---
  // สร้าง Set ของ ID ใบรับซ่อมที่มีใบส่งมอบแล้ว
  // useMemo จะช่วยให้การคำนวณนี้เกิดขึ้นเฉพาะเมื่อ dataDeliverySchedule เปลี่ยนแปลง
  const existingRepairReceiptIds = useMemo(() => {
    if (!dataDeliverySchedule?.responseObject?.data) {
      return new Set<string>(); // คืนค่า Set ว่างถ้าไม่มีข้อมูล
    }
    // ดึง id ของ master_repair_receipt จากแต่ละ delivery schedule มาสร้างเป็น Set
    return new Set(
      dataDeliverySchedule.responseObject.data.map(
        (delivery) => delivery.master_repair_receipt.id
      )
    );
  }, [dataDeliverySchedule]);

  // --- MODIFIED ---
  const fetchDataRepairReceiptDropdown = async () => {
    const repairReceiptList = dataRepairReceipt?.responseObject?.data ?? [];
    
    // กรองรายการใบรับซ่อม โดยเอาเฉพาะรายการที่ ID ยังไม่มีอยู่ใน Set ของ existingRepairReceiptIds
    const filteredList = repairReceiptList.filter(
      (item: RepairReceiptSelectItem) => !existingRepairReceiptIds.has(item.id)
    );

    return {
      responseObject: filteredList.map((item: RepairReceiptSelectItem) => ({
        id: item.id,
        repair_receipt_doc: item.repair_receipt_doc,
      })),
    };
  };

  const handleRepairReceiptSearch = (searchText: string) => {
    setSearchRepairReceipt(searchText);
    refetchRepairReceipt();
  };

  return (
    <div>
      <MasterTableFeature
        title="บิลใบส่งมอบ"
        hideTitleBtn={disableFieldsPermission}
        titleBtnName="ออกบิลใบส่งมอบ"
        inputs={[
          {
            id: "search_input",
            value: searchText ?? "",
            size: "3",
            placeholder:
              "ค้นหา เลขที่ใบส่งมอบ เลขที่ใบรับซ่อม ชือกิจการ ",
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
        totalData={dataDeliverySchedule?.responseObject?.totalCount}
        onView={(data) => navigate(data.id)}
        onPopCreate={handleCreateOpen}
      />

      <DialogComponent
        isOpen={isCreateDialogOpen}
        onClose={handleCreateClose}
        title="ออกบิลใบส่งมอบ"
        onConfirm={handleConfirm}
        confirmText="บันทึกข้อมูล"
        cancelText="ยกเลิก"
      >
        <div className="flex flex-col gap-3 items-left  w-full">
          <MasterSelectComponent
            onChange={(option) => {
              const value = option ? String(option.value) : null;
              setSelectedOption(value);
              // ส่วนนี้ยังคงไว้เผื่อต้องใช้ข้อมูลทั้งหมดของ repair receipt
              const res = repairDatas?.filter((item) => item.id === value);
              if (res && res?.length > 0) {
                setSelectedOptionData(res[0]);
              } else {
                setSelectedOptionData(null); // เคลียร์ค่าเมื่อไม่มีตัวเลือก
              }
            }}
            fetchDataFromGetAPI={fetchDataRepairReceiptDropdown}
            onInputChange={handleRepairReceiptSearch}
            valueKey="id"
            labelKey="repair_receipt_doc"
            placeholder="กรุณาเลือก..."
            isClearable={true}
            label="เลขที่ใบรับซ่อม"
            labelOrientation="horizontal"
            classNameLabel="w-[140px] flex justify-end"
            classNameSelect="w-full"
          />
        </div>
      </DialogComponent>
    </div>
  );
}