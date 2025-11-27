import { useEffect, useState } from "react";
import MasterTableFeature from "@/components/customs/display/master.main.component";
import DialogComponent from "@/components/customs/dialog/dialog.main.component";
import InputAction from "@/components/customs/input/input.main.component";
import {
  postMasterToolingReason,
  updateMasterToolingReason,
  deleteMasterToolingReason,
} from "@/services/ms.tooling.reason.service";
import { useToast } from "@/components/customs/alert/toast.main.component";
import { Type_MS_TOOLING_REASON_All } from "@/types/response/response.ms-tooling-reason";
import { useSearchParams } from "react-router-dom";
// --- [1] Import hook ที่สร้างไว้ ---
import { useToolingReason } from "@/hooks/useToolingReason"; // <<<< แก้ไข path ไปยังไฟล์ hook ของคุณ

type dataTableType = {
  className: string;
  cells: (
    | { value: number; className: string }
    | { value: string; className: string }
  )[];
  data: Type_MS_TOOLING_REASON_All;
}[];

export default function ToolingReasonFeature() {
  const [searchText, setSearchText] = useState("");
  const [toolingReasonName, setToolingReasonName] = useState("");
  const [data, setData] = useState<dataTableType>([]);

  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedItem, setSelectedItem] =
    useState<Type_MS_TOOLING_REASON_All | null>(null);

  const { showToast } = useToast();

  const [searchParams, setSearchParams] = useSearchParams();
  const page = searchParams.get("page") ?? "1";
  const pageSize = searchParams.get("pageSize") ?? "25";
  const [searchTextDebounce, setSearchTextDebounce] = useState("");

  // --- [2] เรียกใช้ useToolingReason hook แทน fetchData และ useEffect แบบ manual ---
  const { 
    data: toolingReasonResponse, 
    isLoading, 
    refetch 
  } = useToolingReason({
    page: page,
    pageSize: pageSize,
    searchText: searchTextDebounce,
  });

  // --- [3] ใช้ useEffect เพื่อแปลงข้อมูลเมื่อ toolingReasonResponse เปลี่ยนแปลง ---
  useEffect(() => {
    if (toolingReasonResponse?.responseObject?.data) {
      const formattedData = toolingReasonResponse.responseObject.data.map(
        (item, index) => ({
          className: "",
          cells: [
            {
              value: (parseInt(page) - 1) * parseInt(pageSize) + index + 1,
              className: "text-center",
            },
            { value: item.tooling_reason_name, className: "text-left" },
          ],
          data: item,
        })
      );
      setData(formattedData);
    } else {
      setData([]);
    }
  }, [toolingReasonResponse, page, pageSize]);

  const headers = [
    { label: "ลำดับที่", colSpan: 1, className: "w-20 min-w-20" },
    { label: "เหตุผลการทำเครื่องมือ", colSpan: 1, className: "w-full" },
    { label: "แก้ไข", colSpan: 1, className: "min-w-14" },
    { label: "ลบ", colSpan: 1, className: "min-w-14" },
  ];

  const handleSearch = () => {
    setSearchParams({ page: "1", pageSize });
    setSearchTextDebounce(searchText);
  };
  
  useEffect(() => {
    if (searchText === "") {
      setSearchTextDebounce("");
    }
  }, [searchText]);
  
  // การจัดการ CRUD จะเรียก refetch() เพื่อดึงข้อมูลใหม่ แทนการเรียก fetchData()
  const handleConfirm = async () => {
    if (!toolingReasonName) {
      showToast("กรุณาระบุชื่อเหตุผล", false);
      return;
    }
    try {
      const response = await postMasterToolingReason({
        tooling_reason_name: toolingReasonName,
      });
      if (response.statusCode === 200) {
        setToolingReasonName("");
        handleCreateClose();
        refetch(); // <--- เรียก refetch
        showToast("สร้างรายการสำเร็จ", true);
      } else {
        showToast("ข้อมูลซ้ำ", false);
      }
    } catch {
      showToast("ไม่สามารถสร้างรายการได้", false);
    }
  };

  const handleEditConfirm = async () => {
    if (!toolingReasonName || !selectedItem) {
      showToast("กรุณาระบุข้อมูลให้ครบถ้วน", false);
      return;
    }
    try {
      const response = await updateMasterToolingReason({
        master_tooling_reason_id: selectedItem.master_tooling_reason_id,
        tooling_reason_name: toolingReasonName,
      });
      if (response.statusCode === 200) {
        showToast("อัปเดตข้อมูลสำเร็จ", true);
        setToolingReasonName("");
        handleEditClose();
        refetch(); // <--- เรียก refetch
      }
    } catch {
      showToast("ไม่สามารถอัปเดตข้อมูลได้", false);
    }
  };
  
  const handleDeleteConfirm = async () => {
    if (!selectedItem || !selectedItem.master_tooling_reason_id) {
      showToast("กรุณาเลือกรายการ", false);
      return;
    }
    try {
      const response = await deleteMasterToolingReason(
        selectedItem.master_tooling_reason_id
      );
      if (response.statusCode === 200) {
        handleDeleteClose();
        refetch(); // <--- เรียก refetch
        showToast("ลบสำเร็จ", true);
      } else {
        showToast("ลบไม่ได้เนื่องจากมีข้อมูลอยู่ในใบรับซ่อมเเล้ว", false);
      }
    } catch {
      showToast("ไม่สามารถลบรายการได้", false);
    }
  };

  //... (ส่วนของ handleOpen, handleClose เหมือนเดิม)
  const handleCreateOpen = () => { setToolingReasonName(""); setIsCreateDialogOpen(true); };
  const handleEditOpen = (item: Type_MS_TOOLING_REASON_All) => { setSelectedItem(item); setToolingReasonName(item.tooling_reason_name); setIsEditDialogOpen(true); };
  const handleDeleteOpen = (item: Type_MS_TOOLING_REASON_All) => { setSelectedItem(item); setIsDeleteDialogOpen(true); };
  const handleCreateClose = () => setIsCreateDialogOpen(false);
  const handleEditClose = () => setIsEditDialogOpen(false);
  const handleDeleteClose = () => setIsDeleteDialogOpen(false);

  return (
    <div>
      <MasterTableFeature
        title="เหตุผลการทำเครื่องมือ"
        titleBtnName="สร้างเหตุผล"
        inputs={[
          {
            id: "search_input",
            value: searchText,
            size: "3",
            placeholder: "ค้นหา เหตุผล",
            onChange: setSearchText,
            onAction: handleSearch,
          },
        ]}
        onSearch={handleSearch}
        headers={headers}
        rowData={data}
        // --- [4] ส่ง totalCount ที่ได้จาก hook ไปยัง component ---
        totalData={toolingReasonResponse?.responseObject?.totalCount || 0}
        onEdit={handleEditOpen}
        onDelete={handleDeleteOpen}
        onPopCreate={handleCreateOpen}
      />
      {/* ... (Dialogs components เหมือนเดิม) ... */}
      <DialogComponent isOpen={isCreateDialogOpen} onClose={handleCreateClose} title="สร้างเหตุผล" onConfirm={handleConfirm} confirmText="บันทึกข้อมูล" cancelText="ยกเลิก">
        <div className="flex flex-col gap-3 items-left"><InputAction id="tooling-reason-create" placeholder="ระบุชื่อเหตุผล" onChange={(e) => setToolingReasonName(e.target.value)} value={toolingReasonName} label="ชื่อเหตุผล" labelOrientation="horizontal" onAction={handleConfirm} classNameLabel="w-20 min-w-20 flex justify-end" classNameInput="w-full"/></div>
      </DialogComponent>
      <DialogComponent isOpen={isEditDialogOpen} onClose={handleEditClose} title="แก้ไขเหตุผล" onConfirm={handleEditConfirm} confirmText="บันทึกข้อมูล" cancelText="ยกเลิก">
        <div className="flex flex-col gap-3 items-left"><InputAction id="tooling-reason-edit" placeholder="ระบุชื่อเหตุผล" onChange={(e) => setToolingReasonName(e.target.value)} value={toolingReasonName} label="ชื่อเหตุผล" labelOrientation="horizontal" onAction={handleEditConfirm} classNameLabel="w-20 min-w-20 flex justify-end" classNameInput="w-full" defaultValue={toolingReasonName}/></div>
      </DialogComponent>
      <DialogComponent isOpen={isDeleteDialogOpen} onClose={handleDeleteClose} title="ยืนยันการลบ" onConfirm={handleDeleteConfirm} confirmText="ยืนยัน" cancelText="ยกเลิก">
        <p>คุณแน่ใจหรือไม่ว่าต้องการลบรายการนี้? <br/>ชื่อเหตุผล: <span className="text-red-500">{selectedItem?.tooling_reason_name}</span></p>
      </DialogComponent>
    </div>
  );
}