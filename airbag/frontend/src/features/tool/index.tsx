import { useEffect, useState } from "react";
import MasterTableFeature from "@/components/customs/display/master.main.component";
import DialogComponent from "@/components/customs/dialog/dialog.main.component";
import InputAction from "@/components/customs/input/input.main.component";
import {
  getTool,
  postTool,
  updateTool,
  deleteTool,
} from "@/services/tool.service";
import { useToast } from "@/components/customs/alert/ToastContext";
import { TypeToolAllResponse } from "@/types/response/response.tool";

import { useNavigate, useSearchParams } from "react-router-dom";
import { useTool } from "@/hooks/useTool";

type dateTableType = {
  className: string;
  cells:{
    value: any;
    className: string;
  }[]
  data: TypeToolAllResponse;
}[];


export default function MasterToolsFeature() {
  const [searchText, setSearchText] = useState("");
  const [toolsName, setToolsName] = useState("");
  // const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [data, setData] = useState<dateTableType>([]);

  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState<boolean>(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState<boolean>(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState<boolean>(false);
  const [selectedItem, setSelectedItem] = useState<TypeToolAllResponse | null>(null);
  const { showToast } = useToast();
  
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const page = searchParams.get("page") ?? "1";
  const pageSize = searchParams.get("pageSize") ?? "25";
  const [searchTextDebouce, setSearchTextDebouce] = useState("");

  
  const { data: dataTool, refetch: refetchTool } = useTool({
    page: page,
    pageSize: pageSize,
    searchText: searchTextDebouce,
  });


  //คงเหลือ ค้นหา
  
  useEffect(() => {
    //@ts-ignore
    if (dataTool?.responseObject?.data) {
      // 1. แปลง page และ pageSize ให้เป็นตัวเลข
      const pageNumber = parseInt(page, 10) || 1;
      const pageSizeNumber = parseInt(pageSize, 10) || 25;
      // 2. คำนวณลำดับเริ่มต้นของข้อมูลในหน้านั้น
      const startIndex = (pageNumber - 1) * pageSizeNumber;
      //@ts-ignore
      const formattedData = dataTool.responseObject.data.map(
        (item: TypeToolAllResponse, index: number) => ({
          className: "",
          cells: [
            // 3. คำนวณลำดับที่ให้ถูกต้องและต่อเนื่องกัน
            { value: startIndex + index + 1, className: "text-center" },
            { value: item.tool, className: "text-left" },
          ],
          data: item,
        })
      );
      setData(formattedData);
    }
}, [dataTool, page, pageSize]);
  
  useEffect(() => {
    if (searchText === "") {
      setSearchTextDebouce(searchText);
      refetchTool();
    }
  }, [searchText]);

  const headers = [
    { label: "ลำดับที่", colSpan: 1, className: "w-20 min-w-20" },
    { label: "เครื่องมือ", colSpan: 1, className: "w-full" },
    { label: "แก้ไข", colSpan: 1, className: "min-w-14" },
    { label: "ลบ", colSpan: 1, className: "min-w-14" },
  ];

  //handle
  const handleSearch = () => {
    setSearchTextDebouce(searchText);
    refetchTool();
  };

  //เปิด
  const handleCreateOpen = () => {
    setToolsName("");
    setIsCreateDialogOpen(true);
  };
  const handleEditOpen = (item: TypeToolAllResponse) => {
    setSelectedItem(item);
    setToolsName(item.tool);
    setIsEditDialogOpen(true);
  };
  const handleDeleteOpen = (item: TypeToolAllResponse) => {
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
    if (!toolsName) {
      showToast("กรุณาระบุเครื่องมือ", false);
      return;
    }
    try {
      const response = await postTool({
        tool: toolsName,
      });

      if (response.statusCode === 200) {
        setToolsName("");
        handleCreateClose();
        showToast("สร้างรายการเครื่องมือเรียบร้อยแล้ว", true);
        refetchTool();
      } else {
        showToast("รายการเครื่องมือนี้มีอยู่แล้ว", false);
      }
    } catch {
      showToast("ไม่สามารถสร้างรายการเครื่องมือได้", false);
    }
  };

  const handleEditConfirm = async () => {
    if (!toolsName) {
      showToast("กรุณาระบุชื่อเครื่องมือ", false);
      return;
    }
    if (!selectedItem) {
      showToast("กรุณาระบุชื่อเครื่องมือ", false);
      return;
    }

    try {
      const response = await updateTool(selectedItem.tool_id, {
        tool: toolsName,
      });

      if (response.statusCode === 200) {
        showToast("แก้ไขรายการเครื่องมือเรียบร้อยแล้ว", true);
        setToolsName("");
        setIsEditDialogOpen(false);
        refetchTool();
      } else {
        showToast("ข้อมูลนี้มีอยู่แล้ว", false);
      }
    } catch (error) {
      showToast("ไม่สามารถแก้ไขรายการเครื่องมือได้", false);
      console.error(error); // Log the error for debugging
    }
  };
  const handleDeleteConfirm = async () => {
    if (!selectedItem || !selectedItem.tool_id) {
      showToast("กรุณาระบุรายการเครื่องมือที่ต้องการลบ", false);
      return;
    }

    try {
      const response = await deleteTool(selectedItem.tool_id);

      if (response.statusCode === 200) {
        showToast("ลบรายการเครื่องมือเรียบร้อยแล้ว", true);
        setIsDeleteDialogOpen(false);
        refetchTool();
      }
      else if (response.statusCode === 400) {
        if(response.message === "tool in Repair Receipt"){
          showToast("ไม่สามารถลบรายการเครื่องมือได้ เนื่องจากมีใบรับซ่อมอยู่", false);
        }else {
          showToast("ไม่สามารถลบรายการเครื่องมือได้", false);
        }
      }
      else {
        showToast("ไม่สามารถลบรายการเครื่องมือได้", false);
      }
    } catch (error) {
      showToast("ไม่สามารถลบรายการเครื่องมือได้", false);
    }
  };

  
    
  

  return (
    <div>
      <MasterTableFeature
        title="เครื่องมือ"
        titleBtnName="สร้างเครื่องมือ"
        inputs={[
          {
            id: "search_input",
            value: searchText,
            size: "3",
            placeholder: "ค้นหา เครื่องมือ",
            onChange: setSearchText,
            onAction: handleSearch,
          },
        ]}
        onSearch={handleSearch}
        headers={headers}
        rowData={data}
        totalData={dataTool?.responseObject?.totalCount}
        onEdit={handleEditOpen}
        onDelete={handleDeleteOpen}
        onPopCreate={handleCreateOpen}
      />

      {/* สร้าง */}
      <DialogComponent
        isOpen={isCreateDialogOpen}
        onClose={handleCreateClose}
        title="สร้างเครื่องมือ"
        onConfirm={handleConfirm}
        confirmText="บันทึกข้อมูล"
        cancelText="ยกเลิก"
      >
        <div className="flex flex-col gap-3 items-left">
          <InputAction
            id="issue-reason-create"
            placeholder="ระบุเครื่องมือ"
            onChange={(e) => setToolsName(e.target.value)}
            value={toolsName}
            label="เครื่องมือ"
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
        title="แก้ไขเครื่องมือ"
        
        onConfirm={handleEditConfirm}
        confirmText="บันทึกข้อมูล"
        cancelText="ยกเลิก"
      >
        <div className="flex flex-col gap-3 items-left">
          <InputAction
            id="issue-reason-edit"
            placeholder={toolsName ? toolsName : "ระบุเครื่องมือ"}
            defaultValue={toolsName}
            onChange={(e) => setToolsName(e.target.value)}
            value={toolsName}
            label="เครื่องมือ"
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
          เครื่องมือ :{" "}
          <span className="text-red-500">{selectedItem?.tool} </span>
        </p>
      </DialogComponent>
     
    </div>
    
  )
}
