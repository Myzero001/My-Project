import { useEffect, useState } from "react";
import MasterTableFeature from "@/components/customs/display/master.main.component";
import DialogComponent from "@/components/customs/dialog/dialog.main.component";
import { useToast } from "@/components/customs/alert/toast.main.component";
import MasterSelectComponent from "@/components/customs/select/select.main.component";

import { getAllCustomerData, searchCustomers, postCustomerData, createCustomerWithRequiredFields, } from "@/services/ms.customer";
import {
  deleteQuotation,
  postQuotationData,
} from "@/services/ms.quotation.service";
import { useQuatation } from "@/hooks/useQuatation";
import { useCustomerSelect } from "@/hooks/useSelect";
import { useNavigate, useSearchParams } from "react-router-dom";
import { QUOTATION_ALL } from "@/types/response/response.quotation";
import { MS_CUSTOMER_ALL, CustomerSelectItem } from "@/types/response/response.ms_customer";
import dayjs from "dayjs";
import { Table, Button } from "@radix-ui/themes";
import Buttons from "@/components/customs/button/button.main.component";
import InputAction from "@/components/customs/input/input.main.component";


type NewCustomerData = {
  customer_code: string;
  customer_prefix: string;
  customer_name: string;
  contact_name: string;
  contact_number: string;
};

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
  )[];
  data: QUOTATION_ALL;
}[];
export default function QuotationPage() {
  // const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [searchText, setSearchText] = useState<string | undefined>(undefined);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [selectedOptionData, setSelectedOptionData] =
    useState<MS_CUSTOMER_ALL>();
  const [customersData, setCustomersData] = useState<MS_CUSTOMER_ALL[]>();
  const [data, setData] = useState<dataTableType>([]);

  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState<boolean>(false);

  const [activeQuotation, setActiveQuotation] = useState<QUOTATION_ALL>();
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState<boolean>(false);
  const [searchCustomer, setSearchCustomer] = useState("");

  const [isCreateCustomerDialogOpen, setIsCreateCustomerDialogOpen] = useState<boolean>(false);
  const [newCustomerData, setNewCustomerData] = useState<NewCustomerData>({
    customer_code: "",
    customer_prefix: "",
    customer_name: "",
    contact_name: "",
    contact_number: "",
  });

  const handleCreateCustomerClose = () => {
    setIsCreateCustomerDialogOpen(false);
    // Reset form เมื่อปิด
    setNewCustomerData({
      customer_code: "",
      customer_prefix: "",
      customer_name: "",
      contact_name: "",
      contact_number: "",
    });
  };
  // const handleCreateCustomerConfirm = async () => {
  //   // ตรวจสอบข้อมูลเบื้องต้น
  //   if (!newCustomerData.customer_code || !newCustomerData.customer_name || !newCustomerData.contact_number) {
  //       showToast("กรุณากรอกรหัสลูกค้า, ชื่อลูกค้า และเบอร์โทร", false);
  //       return;
  //   }
  //   try {
  //       // เรียกใช้ service ที่คุณสร้างไว้สำหรับสร้างลูกค้า
  //       const response = await postCustomerData(newCustomerData);
  //       if (response.statusCode === 200) {
  //           showToast("สร้างลูกค้าใหม่สำเร็จ", true);
  //           const createdCustomer = response.responseObject;

  //           handleCreateCustomerClose(); // ปิด Dialog สร้างลูกค้า

  //           // Refetch ข้อมูลลูกค้าใน dropdown เพื่อให้มีข้อมูลล่าสุด
  //           await refetchCustomer();

  //           // อัปเดต State ของฟอร์มหลัก (สร้างใบเสนอราคา)
  //           // ให้ข้อมูลลูกค้าที่เพิ่งสร้างถูกเลือกโดยอัตโนมัติ
  //           setSelectedOption(createdCustomer.customer_id);
  //           setSelectedOptionData(createdCustomer);

  //       } else {
  //           showToast(`สร้างลูกค้าไม่สำเร็จ: ${response.message}`, false);
  //       }
  //   } catch (error) {
  //       showToast("เกิดข้อผิดพลาดในการสร้างลูกค้า", false);
  //   }
  //   useEffect(() => {
  //     getAllCustomerData().then((res) => {
  //       setCustomersData(res.responseObject);
  //     });
  //   }, [dataCustomer]);
  // };
  const proceedToCreateQuotation = async (customerData: MS_CUSTOMER_ALL) => {
    try {
      handleCreateClose();

      const response = await postQuotationData({
        customer_id: customerData.customer_id,
        addr_map: customerData.addr_map ?? "",
        addr_number: customerData.addr_number ?? "",
        addr_alley: customerData.addr_alley ?? "",
        addr_street: customerData.addr_street ?? "",
        addr_subdistrict: customerData.addr_subdistrict ?? "",
        addr_district: customerData.addr_district ?? "",
        addr_province: customerData.addr_province ?? "",
        addr_postcode: customerData.addr_postcode ?? "",
        customer_name: customerData.customer_name ?? "",
        position: customerData.customer_position ?? "",
        contact_number: customerData.contact_number ?? "",
        line_id: customerData.line_id ?? "",
      });

      if (response.statusCode === 200) {
        showToast("สร้างใบเสนอราคาเรียบร้อยแล้ว", true);
        await refetchQuatations();

        navigate(`/quotation/${response.responseObject?.quotation_id}`);

      } else {
        showToast(`ไม่สามารถสร้างใบเสนอราคาได้: ${response.message}`, false);
      }
    } catch (error) {
      console.error("Error in proceedToCreateQuotation:", error);
      showToast("เกิดข้อผิดพลาดในการสร้างใบเสนอราคา", false);
    }
  };

  const handleCreateCustomerConfirm = async () => {
    if (!newCustomerData.customer_code || !newCustomerData.customer_prefix || !newCustomerData.customer_name || !newCustomerData.contact_name || !newCustomerData.contact_number) {
      showToast("กรุณากรอกข้อมูลลูกค้าใหม่ให้ครบถ้วน", false);
      return;
    }

    try {
      const response = await createCustomerWithRequiredFields(newCustomerData);
      if (response.statusCode === 201) {
        handleCreateCustomerClose();
        const newFullCustomerData = response.responseObject;
        await proceedToCreateQuotation(newFullCustomerData);

      } else {
        showToast(`สร้างลูกค้าไม่สำเร็จ: ${response.message}`, false);
      }
    } catch (error) {
      console.error("An unexpected error occurred during customer creation:", error);
      showToast("เกิดข้อผิดพลาดที่ไม่คาดคิดในการสร้างลูกค้า", false);
    }
  };

  const handleNewCustomerInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setNewCustomerData(prev => ({ ...prev, [id]: value }));
  }

  const handleCreateCustomerOpen = () => {
    setIsCreateCustomerDialogOpen(true);
  };


  const headers = [
    { label: "เลขที่ใบเสนอราคา", colSpan: 1, className: "" },
    { label: "รหัสลูกค้า", colSpan: 1, className: "" },
    { label: "ชื่อลูกค้า", colSpan: 1, className: "" },
    { label: "วันเสนอราคา", colSpan: 1, className: "" },
    { label: "นัดหมายถอด", colSpan: 1, className: "" },
    { label: "รถ", colSpan: 1, className: "" },
    { label: "สถานะ", colSpan: 1, className: "" },
    { label: "ดูเนื้อหา", colSpan: 1, className: "min-w-20" },
    { label: "ลบ", colSpan: 1, className: "min-w-14" },
  ];

  const tabs = [
    {
      value: "all",
      label: "ทั้งหมด",
    },
    {
      value: "pending",
      label: "รอดำเนินการ",
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
    {
      value: "close_deal",
      label: "ปิดดีล",
    },
    {
      value: "cancel",
      label: "ยกเลิก",
    },
  ];

  const { showToast } = useToast();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const page = searchParams.get("page") ?? "1";
  const pageSize = searchParams.get("pageSize") ?? "25";
  const [searchTextDebouce, setSearchTextDebouce] = useState("");
  const [tabValue, setTabValue] = useState("all");

  const goToTab = searchParams.get("tab") || "all"; // ค่าเริ่มต้นคือ "all"
  useEffect(() => {
    setTabValue(goToTab);
  }, [goToTab]);

  const { data: dataQuatations, refetch: refetchQuatations } = useQuatation({
    page: page,
    pageSize: pageSize,
    searchText: searchTextDebouce,
    status: tabValue,
  });


  const handleConfirm = async () => {
    if (!selectedOption || !selectedOptionData) {
      showToast("กรุณาระบุรหัสลูกค้าให้ครบถ้วน", false);
      return;
    }
    try {
      const response = await postQuotationData({
        customer_id: selectedOption,
        addr_map: selectedOptionData.addr_map ?? "",
        addr_number: selectedOptionData.addr_number ?? "",
        addr_alley: selectedOptionData.addr_alley ?? "",
        addr_street: selectedOptionData.addr_street ?? "",
        addr_subdistrict: selectedOptionData.addr_subdistrict ?? "",
        addr_district: selectedOptionData.addr_district ?? "",
        addr_province: selectedOptionData.addr_province ?? "",
        addr_postcode: selectedOptionData.addr_postcode ?? "",
        customer_name: selectedOptionData.customer_name ?? "",
        position: selectedOptionData.customer_position ?? "",
        contact_number: selectedOptionData.contact_number ?? "",
        line_id: selectedOptionData.line_id ?? "",
      });
      if (response.statusCode === 200) {
        setSelectedOption(null);
        handleCreateClose();
        showToast("สร้างใบเสนอราคาเรียบร้อยแล้ว", true);
        navigate(`/quotation/${response.responseObject?.quotation_id}`);
      } else {
        if (response.message == "Issue Reason already exists") {
          showToast("ใบเสนอราคานี้มีอยู่แล้ว", false);
        } else {
          showToast("ไม่สามารถสร้างใบเสนอราคาได้", false);
        }
      }
    } catch {
      showToast("ไม่สามารถสร้างใบเสนอราคาได้", false);
    }
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

  const handleDelete = (data: QUOTATION_ALL) => {
    setActiveQuotation(data);
    setIsDeleteDialogOpen(true);
  };
  const handleDeleteClose = () => {
    setIsDeleteDialogOpen(false);
  };

  const handleDeleteConfirm = () => {
    if (activeQuotation?.quotation_id) {
      deleteQuotation(activeQuotation?.quotation_id)
        .then(() => {
          refetchQuatations();
          showToast("ลบใบเสนอราคาสำเร็จ", true);
        })
        .catch(() => {
          showToast("ลบใบเสนอราคาไม่สำเร็จ", false);
        });
    }
  };

  // Dialog Create
  const handleCreateOpen = () => {
    setSelectedOption(null);
    setIsCreateDialogOpen(true);
  };
  const handleCreateClose = () => {
    setIsCreateDialogOpen(false);
  };

  const prefixOptions = [
    { id: "บจก.", name: "บจก." },
    { id: "หจก.", name: "หจก." },
    { id: "บมจ.", name: "บมจ." },
    { id: "ร้านค้า", name: "ร้านค้า" },
    { id: "นามบุคคล", name: "นามบุคคล" },
  ];

  const fetchPrefixOptions = async () => {
    return {
      success: true,
      message: "OK",
      responseObject: prefixOptions,
      statusCode: 200,
    };
  };

  useEffect(() => {
    if (dataQuatations?.responseObject?.data) {
      const formattedData = dataQuatations?.responseObject?.data.map((item) => ({
        className: "",
        cells: [
          { value: item.quotation_doc ?? "N/A", className: "text-center" },
          {
            value: item.master_customer?.customer_code,
            className: "text-center",
          },
          {
            value: item.master_customer?.customer_name ?? "",
            className: "text-center",
          },
          {
            value: item.created_at ? dayjs(item.created_at).format("DD/MM/YYYY") : "-",
            className: "text-center",
          },
          {
            value: item.appointment_date ? dayjs(item.appointment_date).format("DD/MM/YYYY") : "-",
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
        ],
        data: item,
      }));
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

  useEffect(() => {
    getAllCustomerData().then((res) => {
      setCustomersData(res.responseObject);
    });
  }, []);

  const { data: dataCustomer, refetch: refetchCustomer } = useCustomerSelect({
    searchText: searchCustomer,
  });

  const fetchDataCustomerDropdown = async () => {
    const customerList = dataCustomer?.responseObject?.data ?? [];
    return {
      responseObject: customerList.map((item: CustomerSelectItem) => ({
        customer_id: item.customer_id,
        customer_code: item.customer_code,
      })),
    };
  };

  const handleCustomerSearch = (searchText: string) => {
    setSearchCustomer(searchText);
    refetchCustomer();
  };

  return (
    <div>
      <div className=" p-2 ">
        <MasterTableFeature
          title="ใบเสนอราคา"
          titleBtnName="สร้างใบเสนอราคา"
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
          defaultValueTab={goToTab}
          onTabsValueChange={(newTabValue) => {
            const newParams = {
              tab: newTabValue,
              page: "1",
              pageSize: pageSize,
            };
            setSearchParams(newParams);
          }}
          onSearch={handleSearch}
          headers={headers}
          rowData={data}
          totalData={dataQuatations?.responseObject?.totalCount}
          // onEdit={handleEdit}
          onDelete={handleDelete}
          onPopCreate={handleCreateOpen}
          onView={(data) => navigate(data.quotation_id)}
        />
      </div>

      <DialogComponent
        isOpen={isCreateDialogOpen}
        onClose={handleCreateClose}
        title="สร้างใบเสนอราคา"
        onConfirm={handleConfirm}
        confirmText="บันทึกข้อมูล"
        cancelText="ยกเลิก"
      >
        <div className="flex flex-col gap-4 pt-4"> {/* เพิ่ม pt-4 ให้มีระยะห่างจาก Title */}

          {/* จัดกลุ่ม Input และปุ่มให้อยู่ด้วยกัน */}
          <div className="flex items-center gap-2">
            <MasterSelectComponent
              // Label และ Input อยู่ใน Component เดียวกันแล้ว
              label="รหัสลูกค้า"
              labelOrientation="horizontal"
              classNameLabel="w-20 min-w-20 flex justify-end"
              classNameSelect="w-full" // ให้ Select กว้างเต็มพื้นที่ที่เหลือ

              key={selectedOption}
              value={selectedOption ? { value: selectedOption, label: selectedOptionData?.customer_code } : null}
              onChange={(option) => {
                const value = option ? String(option.value) : null;
                setSelectedOption(value);
                const customer = customersData?.find(
                  (c) => c.customer_id === value
                );
                setSelectedOptionData(customer || undefined);
              }}
              fetchDataFromGetAPI={fetchDataCustomerDropdown}
              onInputChange={handleCustomerSearch}
              valueKey="customer_id"
              labelKey="customer_code"
              placeholder="กรุณาเลือก..."
              isClearable={true}
            />

            {/* ปุ่มสร้างลูกค้า วางไว้ต่อท้าย ทำให้ดูเป็นส่วนเสริมของ Input */}
            <button
              type="button"
              onClick={handleCreateCustomerOpen}
              className="inline-flex items-center justify-center rounded bg-blue-500 px-3 py-1.5 text-xs font-medium text-white hover:bg-blue-600 whitespace-nowrap" // ปรับ Padding และเพิ่ม whitespace-nowrap
            >
              + สร้างลูกค้า
            </button>
          </div>


        </div>
      </DialogComponent>
      {/* เพิ่ม: Dialog สร้างลูกค้าใหม่ */}
      <DialogComponent
        isOpen={isCreateCustomerDialogOpen}
        onClose={handleCreateCustomerClose}
        title="สร้างลูกค้าใหม่"
        onConfirm={handleCreateCustomerConfirm}
        confirmText="บันทึกและสร้างใบเสนอราคา"
        cancelText="ยกเลิก"
      >
        <div className="flex flex-col gap-3 pt-4 pb-4">
          <InputAction
            id="customer_code"
            label="รหัสลูกค้า"
            placeholder="รหัสลูกค้า"
            value={newCustomerData.customer_code}
            onChange={handleNewCustomerInputChange}
            labelOrientation="horizontal"
            classNameLabel="w-24 min-w-24 flex justify-end"
            classNameInput="w-full"
            require="true"
          />
          <MasterSelectComponent
            id="customer_prefix"
            label="คำนำหน้า"
            require="true"
            placeholder="กรุณาเลือก..."
            labelOrientation="horizontal"
            classNameLabel="w-24 min-w-24 flex justify-end"
            classNameSelect="w-full"
            fetchDataFromGetAPI={fetchPrefixOptions}
            valueKey="id"  
            labelKey="name" 
            isClearable={true}
            value={
              newCustomerData.customer_prefix
                ? {
                    value: newCustomerData.customer_prefix,
                    label: newCustomerData.customer_prefix,
                  }
                : null
            }
            onChange={(option) => {
              const value = option ? String(option.value) : "";
              setNewCustomerData((prev) => ({
                ...prev,
                customer_prefix: value,
              }));
            }}
          />

          <InputAction
            id="customer_name"
            label="ชื่อลูกค้า"
            placeholder="ชื่อลูกค้า"
            value={newCustomerData.customer_name}
            onChange={handleNewCustomerInputChange}
            labelOrientation="horizontal"
            classNameLabel="w-24 min-w-24 flex justify-end"
            classNameInput="w-full"
            require="true"
          />
          <InputAction
            id="contact_name"
            label="ชื่อผู้ติดต่อ"
            placeholder="ชื่อผู้ติดต่อ"
            value={newCustomerData.contact_name}
            onChange={handleNewCustomerInputChange}
            labelOrientation="horizontal"
            classNameLabel="w-24 min-w-24 flex justify-end"
            classNameInput="w-full"
            require="true"
          />
          <InputAction
            id="contact_number"
            label="เบอร์โทร"
            placeholder="เบอร์โทร"
            value={newCustomerData.contact_number}
            onChange={handleNewCustomerInputChange}
            labelOrientation="horizontal"
            classNameLabel="w-24 min-w-24 flex justify-end"
            classNameInput="w-full"
            require="true"
          />
        </div>
      </DialogComponent>

      <DialogComponent
        isOpen={isDeleteDialogOpen}
        onClose={handleDeleteClose}
        title="ยืนยันการลบ"
        onConfirm={handleDeleteConfirm}
        confirmText="ยืนยัน"
        cancelText="ยกเลิก"
      >
        <p>
          คุณแน่ใจหรือไม่ว่าต้องการลบใบเสนอราคานี้? <br />
          เลขที่ใบเสนอราคา:{" "}
          <span className="text-red-500">{activeQuotation?.quotation_doc}</span>
        </p>
      </DialogComponent>
    </div>
  );
}