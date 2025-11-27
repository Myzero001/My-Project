import { useState, useEffect } from "react";

import { postCustomerData } from "@/services/ms.customer";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useToast } from "@/components/customs/alert/toast.main.component";
import MasterTableFeature from "@/components/customs/display/master.main.component";
import DialogComponent from "@/components/customs/dialog/dialog.main.component";
import InputAction from "@/components/customs/input/input.main.component";
// import MasterSelectComponent from "@/components/customs/select/select.main.component";
import { TypeCustomerAllresponse } from "@/types/response/response.ms_customer";
//import {typeCustomerResponse} from "@/types/response/respon.ms_customer";
import { useCustomer } from "@/hooks/usecustomer";
import { useLocalProfileData } from "@/zustand/useProfile";
import { permissionMap } from "@/utils/permissionMap";

type dateTableType = {
  className: string;
  cells: {
    value: any;
    className: string;
  }[];
  data: TypeCustomerAllresponse; //ตรงนี้
}[];

const CustomerFeature = () => {
  const [data, setData] = useState<dateTableType>([]);
  const [searchText, setSearchText] = useState("");

  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState<boolean>(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState<boolean>(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState<boolean>(false);
  const [selectedItem, setSelectedItem] =
    useState<TypeCustomerAllresponse | null>(null);

  const [openDialogImages, setOpenDialogImages] = useState<boolean>(false);
  const { showToast } = useToast();

  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const page = searchParams.get("page") ?? "1";
  const pageSize = searchParams.get("pageSize") ?? "25";
  const [searchTextDebouce, setSearchTextDebouce] = useState("");

  const { data: dataCustomer, refetch: refetchCustomer } = useCustomer({
    page: page,
    pageSize: pageSize,
    searchText: searchTextDebouce,
  });

  const [createMasterCustomerCodeName, setCreateMasterCustomerCodeName] =
    useState("");
  //const [customer_code, setCustomerCode] = useState("");

  const headers = [
    { label: "ลำดับที่", colSpan: 1, className: "w-20 min-w-20" },
    { label: "รหัสลูกค้า", colSpan: 1, className: "w-2/12" },
    { label: "ชื่อลูกค้า", colSpan: 1, className: "w-3/12" },
    { label: "ชื่อกิจการ", colSpan: 1, className: "w-3/12" },
    { label: "วันที่", colSpan: 1, className: "w-2/12" },
    { label: "เบอร์โทร", colSpan: 1, className: "w-3/12" },
    { label: "แก้ไข", colSpan: 1, className: "min-w-14" },
    //{ label: "ภาพอู่", colSpan: 1, className: "min-w-14" },
    //{ label: "ลบ", colSpan: 1, className: "min-w-14" },
  ];
  useEffect(() => {
    if (dataCustomer?.responseObject?.data) {
      // 1. แปลง page และ pageSize ที่เป็น string ให้เป็นตัวเลข
      const pageNumber = parseInt(page, 10) || 1;
      const pageSizeNumber = parseInt(pageSize, 10) || 25;

      // 2. คำนวณลำดับเริ่มต้นของหน้านั้นๆ (เช่น หน้า 2 ที่มี 25 รายการต่อหน้า จะเริ่มที่ 25)
      const startIndex = (pageNumber - 1) * pageSizeNumber;

      const formattedData = dataCustomer.responseObject.data.map(
        (item: TypeCustomerAllresponse, index: number) => ({
          className: "",
          cells: [
            // 3. นำ startIndex มาบวกกับ index ของแถวปัจจุบัน + 1 เพื่อให้ได้ลำดับที่ถูกต้อง
            { value: startIndex + index + 1, className: "text-center" },
            { value: item.customer_code, className: "text-center" },
            { value: item.customer_name, className: "text-center" },
            { value: item.contact_name, className: "text-center" },
            {
              value: item.created_at
                ? new Date(item.created_at).toLocaleString("th-TH", {
                    timeZone: "Asia/Bangkok",
                    year: "numeric",
                    month: "2-digit",
                    day: "2-digit",
                    hour: "2-digit",
                    minute: "2-digit",
                    second: "2-digit",
                  })
                : "ไม่พบข้อมูลเวลา",
              className: "text-center",
            },
            { value: item.contact_number, className: "text-center" },
          ],
          data: item,
        })
      );
      setData(formattedData);
    }
  }, [dataCustomer, page, pageSize]);

  useEffect(() => {
    if (searchText === "") {
      setSearchTextDebouce(searchText);
      refetchCustomer();
    }
  }, [searchText]);

  const handleClickToNavigate = (
    customer_code: any,
    created_at: any,
    customer_id: any
  ) => {
    navigate(`/ms-customer/create`, {
      state: { customer_code, created_at, customer_id },
    });
  };

  const handleSearch = () => {
    setSearchTextDebouce(searchText);
    refetchCustomer();
    // console.log("Search:", { searchText });
  };

  //ยืนยันไดอะล็อค
  const handleConfirm = async () => {
    if (!createMasterCustomerCodeName) {
      showToast("กรุณาระบุรหัสร้านค้า", false);
      return;
    }
    try {
      const response = await postCustomerData({
        customer_code: createMasterCustomerCodeName,
      });

      if (response.statusCode === 200) {
        setCreateMasterCustomerCodeName("");
        handleCreateClose();
        showToast("สร้างรหัสร้านค้าเรียบร้อยแล้ว", true);
        refetchCustomer();
        handleClickToNavigate(
          createMasterCustomerCodeName,
          response.responseObject?.created_at,
          response.responseObject?.customer_id
        );
      } else {
        if (response.message === "Customer name already taken") {
          showToast("รหัสร้านค้านี้มีอยู่แล้ว", false);
        } else {
          showToast(response.message, false);
        }
      }
    } catch {
      showToast("ไม่สามารถสร้างรหัสร้านค้าได้", false);
    }
  };
  const handleopenimg = () => {
    setOpenDialogImages(true);
  };

  //เปิด
  const handleCreateOpen = () => {
    setCreateMasterCustomerCodeName("");
    setIsCreateDialogOpen(true);
  };
  const handleEditOpen = (item: TypeCustomerAllresponse) => {
    setSelectedItem(item);
    setCreateMasterCustomerCodeName(item.customer_code);
    setIsEditDialogOpen(true);
    handleClickToNavigate(
      item.customer_code,
      item.created_at,
      item.customer_id
    );
  };
  //ปิด
  const handleCreateClose = () => {
    setIsCreateDialogOpen(false);
  };

  const { profile } = useLocalProfileData();

  const [disableFieldsPermission, setDisableFieldsPermission] = useState(false);

  const checkPermission = () => {
    if (profile && profile.role?.role_name) {
      if (permissionMap["ลูกค้า"][profile.role?.role_name] !== "A") {
        setDisableFieldsPermission(true);
        return true;
      }
    }
  };

  useEffect(() => {
    checkPermission();
  }, [profile]);

  return (
    <div>
      <div className=" p-2 ">
      <MasterTableFeature
        title="ลูกค้า"
        hideTitleBtn={disableFieldsPermission}
        titleBtnName={"สร้างรหัสลูกค้า"}
        inputs={[
          {
            id: "search_input",
            value: searchText,
            size: "3",
            placeholder: "ค้นหา รหัสลูกค้า ชื่อลูกค้า ชื่อกิจการ เบอร์โทร",
            onChange: setSearchText,
            onAction: handleSearch,
          },
        ]}
        onSearch={handleSearch}
        headers={headers}
        rowData={data}
        totalData={dataCustomer?.responseObject?.totalCount}
        onEdit={handleEditOpen}
        //onView={handleopenimg}
        onPopCreate={handleCreateOpen}
      />
      </div>
      <DialogComponent
        isOpen={isCreateDialogOpen}
        onClose={handleCreateClose}
        title="สร้างลูกค้า"
        onConfirm={handleConfirm}
        confirmText="บันทึกข้อมูล"
        cancelText="ยกเลิก"
      >
        <div className="flex flex-col gap-3 items-left">
          <InputAction
            id="issue-reason-create"
            placeholder="ระบุรหัสลูกค้า"
            onChange={(e) => setCreateMasterCustomerCodeName(e.target.value)}
            label="รหัสลูกค้า"
            value={createMasterCustomerCodeName}
            labelOrientation="horizontal"
            onAction={handleConfirm}
            classNameLabel="w-20 min-w-20 flex justify-end"
            classNameInput="w-full"
          />
        </div>
      </DialogComponent>
    </div>
  );
};

export default CustomerFeature;
