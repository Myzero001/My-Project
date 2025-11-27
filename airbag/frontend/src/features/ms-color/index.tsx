import { useEffect, useState } from "react";
import MasterTableFeature from "@/components/customs/display/master.main.component";
import DialogComponent from "@/components/customs/dialog/dialog.main.component";
import InputAction from "@/components/customs/input/input.main.component";
import { getQuotationData } from "@/services/ms.quotation.service.ts";
import {

  postColor,
  updateColor,
  deleteColor,
} from "@/services/color.service";
import { useToast } from "@/components/customs/alert/ToastContext";
import { TypeColorAllResponse } from "@/types/response/response.color";

//
import { useNavigate, useSearchParams } from "react-router-dom";
import { useColor } from "@/hooks/useColor";

type dateTableType = {
  className: string;
  cells: {
    value: any;
    className: string;
  }[];
  data: TypeColorAllResponse; //ตรงนี้
}[];

//
export default function MasterColorsFeature() {
  const [searchText, setSearchText] = useState("");
  const [colorsName, setColorsName] = useState("");
  // const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [data, setData] = useState<dateTableType>([]);

  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState<boolean>(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState<boolean>(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState<boolean>(false);
  const [selectedItem, setSelectedItem] = useState<TypeColorAllResponse | null>(null);

  const { showToast } = useToast();
  //
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const page = searchParams.get("page") ?? "1";
  const pageSize = searchParams.get("pageSize") ?? "25";
  const [searchTextDebouce, setSearchTextDebouce] = useState("");

  const [allQuotation, setAllQuotation] = useState<any[]>([]);
  const [quotation, setQuotation] = useState<any[]>([]);

  const { data: dataColor, refetch: refetchColor } = useColor({
    page: page,
    pageSize: pageSize,
    searchText: searchTextDebouce,
  });

 

  useEffect(() => {
    // @ts-ignore
    if (dataColor?.responseObject?.data) {
      const pageNumber = parseInt(page, 10) || 1;
      const pageSizeNumber = parseInt(pageSize, 10) || 25;

      // 2. คำนวณลำดับเริ่มต้นของหน้านั้นๆ
      // เช่น หน้า 1: (1-1)*25 = 0
      // หน้า 2: (2-1)*25 = 25
      const startIndex = (pageNumber - 1) * pageSizeNumber;
      // @ts-ignore
      const formattedData = dataColor.responseObject.data.map(
        (item: TypeColorAllResponse, index: number) => ({
          className: "",
          cells: [
            { value: startIndex + index + 1, className: "text-center" }, 
            { value: item.color_name, className: "text-left" },
          ],
          data: item,
        })
      );
      setData(formattedData);
    }
}, [dataColor, page, pageSize]); 


  //
  const headers = [
    { label: "ลำดับที่", colSpan: 1, className: "w-20 min-w-20" },
    { label: "สี", colSpan: 1, className: "w-full" },
    { label: "แก้ไข", colSpan: 1, className: "min-w-14" },
    { label: "ลบ", colSpan: 1, className: "min-w-14" },
  ];

  useEffect(() => {
    if (searchText === "") {
      setSearchTextDebouce(searchText);
      refetchColor();
    }
  }, [searchText]);

  //handle
  const handleSearch = () => {
    setSearchTextDebouce(searchText);
    refetchColor();
  };

  // const handleEdit = (id: any) => {
  //   console.log("Edit:", id);
  // };

  // const handleDelete = (id: any) => {
  //   console.log("Delete:", id);
  // };

  //เปิด
  const handleCreateOpen = () => {
    setColorsName("");
    setIsCreateDialogOpen(true);
  };
  const handleEditOpen = (item: TypeColorAllResponse) => {
    setSelectedItem(item);
    setColorsName(item.color_name);
    setIsEditDialogOpen(true);
  };
  const handleDeleteOpen = (item: TypeColorAllResponse) => {
    setSelectedItem(item);
    setIsDeleteDialogOpen(true);
    
  };

  //ปิด
  const handleCreateClose = () => {
    setIsCreateDialogOpen(false);
  };
  const handleEditClose = () => {
    setIsEditDialogOpen(false);
  };
  const handleDeleteClose = () => {
    setIsDeleteDialogOpen(false);
  };

  //ยืนยันไดอะล็อค
  const handleConfirm = async () => {
    if (!colorsName) {
      showToast("กรุณาระบุสี", false);
      return;
    }
    try {
      const response = await postColor({
        color_name: colorsName, // ใช้ชื่อ field ที่ตรงกับ type
      });

      if (response.statusCode === 200) {
        setColorsName("");
        handleCreateClose();
        showToast("สร้างรายการสีเรียบร้อยแล้ว", true);
        refetchColor();
      } else {
        showToast("รายการสีนี้มีอยู่แล้ว", false);
      }
    } catch {
      showToast("ไม่สามารถสร้างรายการสีได้", false);
    }
  };

  const handleEditConfirm = async () => {
    if (!colorsName) {
      showToast("กรุณาระบุชื่อสี", false);
      return;
    }
    if (!selectedItem) {
      showToast("กรุณาระบุชื่อสี", false);
      return;
    }

    try {
      const response = await updateColor(selectedItem.color_id, {
        color_name: colorsName,
      });

      if (response.statusCode === 200) {
        showToast("แก้ไขรายการสีเรียบร้อยแล้ว", true);
        setColorsName("");
        setIsEditDialogOpen(false);
        refetchColor();
      } else {
        showToast("ข้อมูลนี้มีอยู่แล้ว", false);
      }
    } catch (error) {
      showToast("ไม่สามารถแก้ไขรายการสีได้", false);
      console.error(error); // Log the error for debugging
    }
  };
  const handleDeleteConfirm = async () => {
    if (!selectedItem || !selectedItem.color_name) {
      showToast("กรุณาระบุรายการสีที่ต้องการลบ", false);
      return;
    }
    

    try {
      const response = await deleteColor(selectedItem.color_id);

      if (response.statusCode === 200) {
        showToast("ลบรายการสีเรียบร้อยแล้ว", true);
        setIsDeleteDialogOpen(false);
        refetchColor();
      } 
      else if (response.statusCode === 400) {
        if(response.message === "Color in quotation"){
          showToast("ไม่สามารถลบรายการสีได้ เนื่องจากมีใบเสนอราคาอยู่", false);
        }
        else {
          showToast("ไม่สามารถลบรายการสีได้", false);
        }
      }
      else {
        showToast("ไม่สามารถลบรายการสีได้", false);
      }
    } catch (error) {
      showToast("ไม่สามารถลบรายการสีได้", false);
    }
  };

  return (
    <div>
      <MasterTableFeature
        title="สี"
        titleBtnName="สร้างสี"
        inputs={[
          {
            id: "search_input",
            value: searchText,
            size: "3",
            placeholder: "ค้นหา สี",
            onChange: setSearchText,
            onAction: handleSearch,
          },
        ]}
        onSearch={handleSearch}
        headers={headers}
        rowData={data}
        totalData={dataColor?.responseObject?.totalCount}
        onEdit={handleEditOpen}
        onDelete={handleDeleteOpen}
        onPopCreate={handleCreateOpen}
      />

      {/* สร้าง */}
      <DialogComponent
        isOpen={isCreateDialogOpen}
        onClose={handleCreateClose}
        title="สร้างสี"
        onConfirm={handleConfirm}
        confirmText="บันทึกข้อมูล"
        cancelText="ยกเลิก"
      >
        <div className="flex flex-col gap-3 items-left">
          <InputAction
            id="issue-reason-create"
            placeholder="ระบุสี"
            onChange={(e) => setColorsName(e.target.value)}
            value={colorsName}
            label="สี"
            labelOrientation="horizontal"
            onAction={handleConfirm}
            classNameLabel="w-20 min-w-20 flex justify-end"
            classNameInput="w-full"
          />
        </div>
      </DialogComponent>

      {/* แก้ไข */}
      <DialogComponent
        isOpen={isEditDialogOpen}
        onClose={handleEditClose}
        title="แก้ไขสี"
        onConfirm={handleEditConfirm}
        confirmText="บันทึกข้อมูล"
        cancelText="ยกเลิก"
      >
        <div className="flex flex-col gap-3 items-left">
          <InputAction
            id="issue-reason-edit"
            placeholder={colorsName ? colorsName : "ระบุสี"}
            defaultValue={colorsName}
            onChange={(e) => setColorsName(e.target.value)}
            value={colorsName}
            label="สี"
            labelOrientation="horizontal"
            onAction={handleEditConfirm}
            classNameLabel="w-20 min-w-20 flex justify-end"
            classNameInput="w-full"
          />
        </div>
      </DialogComponent>

      {/* ลบ */}
      <DialogComponent
        isOpen={isDeleteDialogOpen}
        onClose={handleDeleteClose}
        title="ยืนยันการลบ"
        onConfirm={handleDeleteConfirm}
        confirmText="ยืนยัน"
        cancelText="ยกเลิก"
      >
        <p>
          คุณแน่ใจหรือไม่ว่าต้องการลบรายการนี้? <br />
          สี : <span className="text-red-500">{selectedItem?.color_name} </span>
        </p>
      </DialogComponent>
    </div>
  );
}
