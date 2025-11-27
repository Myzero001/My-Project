import { useState, useEffect } from "react";
//import { MS_CUSTOMER_ALL } from "@/types/response/respon.ms_customer";
// import {
//   postCustomerData
// } from "@/services/ms.customer";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useToast } from "@/components/customs/alert/toast.main.component";
import MasterTableFeature from "@/components/customs/display/master.main.component";
import DialogComponent from "@/components/customs/dialog/dialog.main.component";
import InputAction from "@/components/customs/input/input.main.component";
// import MasterSelectComponent from "@/components/customs/select/select.main.component";
import {MS_USER_ALL , MS_USER_ALL_RESPONSE} from "@/types/response/response.user";
//import {typeCustomerResponse} from "@/types/response/respon.ms_customer";
import { useUser } from "@/hooks/useUser";
import {Type_USER_ALLresponse,Type_USER_All} from "@/types/response/response.user";

type dateTableType = {
  className: string;
  cells:{
    value: any;
    className: string;
  }[]
  data: MS_USER_ALL; //ตรงนี้
}[];

const UserFeature = () => {
  const [data, setData] = useState<dateTableType>([]);
  const [searchText, setSearchText] = useState("");

  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState<boolean>(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState<boolean>(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState<boolean>(false);
  const [selectedItem, setSelectedItem] = useState<MS_USER_ALL| null>(
    null
  );
  const { showToast } = useToast();


  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const page = searchParams.get("page") ?? "1";
  const pageSize = searchParams.get("pageSize") ?? "25";
  const [searchTextDebouce, setSearchTextDebouce] = useState("");

  const { data: dataUser, refetch: refetchUser } = useUser({
    page: page,
    pageSize: pageSize,
    searchText: searchTextDebouce,
  });
  

  const [createMasterCustomerCodeName, setCreateMasterCustomerCodeName] =
    useState("");
  //const [customer_code, setCustomerCode] = useState("");

  const headers = [
    { label: "ลำดับ", colSpan: 1, className: "w-20 min-w-20" },
    { label: "รหัสพนักงาน", colSpan: 1, className: "w-2/12" },
    { label: "ชื่อ", colSpan: 1, className: "w-3/12" },
    { label: "ตำแหน่ง", colSpan: 1, className: "w-3/12" },
    { label: "เบอร์โทร", colSpan: 1, className: "w-3/12" },
    { label: "แก้ไข", colSpan: 1, className: "min-w-14" },
    
   
    
  ];
  useEffect(() => {
    if (dataUser?.responseObject?.data) {
      // 1. แปลง page และ pageSize เป็นตัวเลข
      const currentPage = parseInt(page, 10);
      const currentPageSize = parseInt(pageSize, 10);

      // 2. คำนวณลำดับเริ่มต้นของหน้าปัจจุบัน
      const startIndex = (currentPage - 1) * currentPageSize;

      const formattedData = dataUser.responseObject.data.map(
        (item: MS_USER_ALL, index: number) => ({
          className: "",
          cells: [
            // 3. คำนวณลำดับที่ที่ถูกต้อง
            { value: startIndex + index + 1, className: "text-center" },
            { value: item.employee_code, className: "text-left" },
            {
              value:
                item.first_name +
                " " +
                (item.last_name ? " " + item.last_name : ""),
              className: "text-left",
            },
            { value: item.position, className: "text-left" },
            { value: item.phone_number, className: "text-left" },
          ],
          data: item,
        })
      );
      setData(formattedData);
    } else {
      setData([]); // หากไม่มีข้อมูล ให้ตั้งค่าเป็น array ว่าง
    }
    // เพิ่ม page และ pageSize ใน dependency array
  }, [dataUser, page, pageSize]);
  
  

  useEffect(() => {
    if (searchText === "") {
      setSearchTextDebouce(searchText);
      refetchUser();
    }
  }, [searchText]);

  


//   const handleClickToNavigate = (
//     customer_code: any,
//     created_at: any,
//     customer_id: any
//   ) => {
//     navigate(`/ms-customer/create`, {
//       state: { customer_code, created_at, customer_id },
//     });
//   };

  

  const handleSearch = () => {
    setSearchTextDebouce(searchText);
    refetchUser();
  };

  //ยืนยันไดอะล็อค
//   const handleConfirm = async () => {
//     if (!createMasterCustomerCodeName) {
//       showToast("กรุณาระบุรหัสร้านค้า", false);
//       return;
//     }
//     try {
//       const response = await postCustomerData({
//         customer_code: createMasterCustomerCodeName,
//       });

//       if (response.statusCode === 200) {
//         setCreateMasterCustomerCodeName("");
//         handleCreateClose();
//         showToast("สร้างรหัสร้านค้าเรียบร้อยแล้ว", true);
//         refetchCustomer();
//         handleClickToNavigate(
//           createMasterCustomerCodeName,
//           response.responseObject?.created_at,
//           response.responseObject?.customer_id
//         );
//       } else {
//         showToast("รหัสร้านค้านี้มีอยู่แล้ว", false);
//       }
//     } catch {
//       showToast("ไม่สามารถสร้างรหัสร้านค้าได้", false);
//     }
//   };

  //เปิด
  const handleCreateOpen = () => {
    navigate(`/create/user`);
    setCreateMasterCustomerCodeName("");
    setIsCreateDialogOpen(true);
  };

  const handleCreateClose = () => {
    setIsCreateDialogOpen(false);
  }
  const handleClickToNavigate = (
    employee_id: any,
    
    
  ) =>{
    navigate(`/edit/user`, {
      state:{ employee_id}
    })
  }


  const handleEditOpen = (item: Type_USER_ALLresponse) => {
    setSelectedItem(item);
    setCreateMasterCustomerCodeName(item.employee_id);
    setIsEditDialogOpen(true);
    handleClickToNavigate(
      item.employee_id
    )
  }



  return (
    <div>
      <MasterTableFeature
        title="พนักงาน"
        titleBtnName="สร้างพนักงาน"
        inputs={[
          {
            id: "search_input",
            value: searchText,
            size: "3",
            placeholder: "ค้นหา ชื่อพนักงาน รหัสพนักงาน ",
            onChange: setSearchText,
            onAction: handleSearch,
          },
        ]}
        onSearch={handleSearch}
        headers={headers}
        rowData={data}
        totalData={dataUser?.responseObject?.totalCount}
        onEdit={handleEditOpen}
        onPopCreate={handleCreateOpen}
      />
      
    </div>
  );
};

export default UserFeature;