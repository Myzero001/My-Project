import { useEffect, useState } from "react";
import MasterTableFeature from "@/components/customs/display/master.main.component";
import DialogComponent from "@/components/customs/dialog/dialog.main.component";
import InputAction from "@/components/customs/input/input.main.component";
import {
  getGroupRepairData,
  postMasterGroupRepair,
  updateMasterGroupRepair,
  deleteMasterGroupRepair,
} from "@/services/ms.group.repair";
import { useToast } from "@/components/customs/alert/toast.main.component";
import { Type_MS_GROUP_REPAIR_All } from "@/types/response/response.ms-group-repair";
import { useSearchParams } from "react-router-dom";
import { useGroupRepair } from "@/hooks/useGroupRepair";

type dataTableType = {
  className: string;
  cells: {
    value: any;
    className: string;
  }[];
  data: Type_MS_GROUP_REPAIR_All;
}[];

export default function GroupRepairFeature() {
  const [searchText, setSearchText] = useState("");
  const [groupRepairName, setGroupRepairName] = useState("");
  const [data, setData] = useState<dataTableType>([]);

  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedItem, setSelectedItem] =
    useState<Type_MS_GROUP_REPAIR_All | null>(null);

  const { showToast } = useToast();


  const [searchParams, setSearchParams] = useSearchParams();
  const page = searchParams.get("page") ?? "1";
  const pageSize = searchParams.get("pageSize") ?? "25";
  const [searchTextDebouce, setSearchTextDebouce] = useState("");


  const { data: dataGroupRepair, refetch: refetchGroupRepair } = useGroupRepair({
    page: page,
    pageSize: pageSize,
    searchText: searchTextDebouce,
  });

  const headers = [
    { label: "ลำดับที่", colSpan: 1, className: "w-20 min-w-20" },
    { label: "รายการกลุ่มซ่อม", colSpan: 1, className: "w-full" },
    { label: "แก้ไข", colSpan: 1, className: "min-w-14" },
    { label: "ลบ", colSpan: 1, className: "min-w-14" },
  ];

  const handleSearch = () => {
    searchParams.set("pageSize", pageSize ?? "25");
    searchParams.set("page", "1");
    setSearchParams({ page: "1", pageSize: pageSize });
    if (searchText) {
      setSearchTextDebouce(searchText);
    }
    refetchGroupRepair();
  };

  const handleCreateOpen = () => {
    setGroupRepairName("");
    setIsCreateDialogOpen(true);
  };

  const handleEditOpen = (item: Type_MS_GROUP_REPAIR_All) => {
    setSelectedItem(item);
    setGroupRepairName(item.group_repair_name);
    setIsEditDialogOpen(true);
  };

  const handleDeleteOpen = (item: Type_MS_GROUP_REPAIR_All) => {
    setSelectedItem(item);
    setIsDeleteDialogOpen(true);
  };

  const handleCreateClose = () => setIsCreateDialogOpen(false);
  const handleEditClose = () => setIsEditDialogOpen(false);
  const handleDeleteClose = () => setIsDeleteDialogOpen(false);

  const handleConfirm = async () => {
    if (!groupRepairName) {
      showToast("กรุณาระบุชื่อกลุ่มซ่อม", false);
      return;
    }
    try {
      const response = await postMasterGroupRepair({
        group_repair_name: groupRepairName,
      });
      if (response.statusCode === 200) {
        setGroupRepairName("");
        handleCreateClose();
        refetchGroupRepair();
        showToast("สร้างรายการสำเร็จ", true);
      } else {
        showToast("ข้อมูลซ้ำ", false);
      }
    } catch {
      showToast("ไม่สามารถสร้างรายการได้", false);
    }
  };

  const handleEditConfirm = async () => {
    if (!groupRepairName || !selectedItem) {
      showToast("กรุณาระบุข้อมูลให้ครบถ้วน", false);
      return;
    }
    try {
      const response = await updateMasterGroupRepair({
        master_group_repair_id: selectedItem.master_group_repair_id,
        group_repair_name: groupRepairName,
      });
      if (response.statusCode === 200) {
        showToast("อัปเดตข้อมูลสำเร็จ", true);
        setGroupRepairName("");
        handleEditClose();
        refetchGroupRepair();
      }
    } catch {
      showToast("ไม่สามารถอัปเดตข้อมูลได้", false);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!selectedItem || !selectedItem.master_group_repair_id) {
      showToast("กรุณาเลือกรายการ", false);
      return;
    }
    try {
      const response = await deleteMasterGroupRepair(
        selectedItem.master_group_repair_id
      );
      if (response.statusCode === 200) {
        handleDeleteClose();
        refetchGroupRepair();
        showToast("ลบสำเร็จ", true);
      }
      else if (response.statusCode === 400) {
        showToast("ไม่สามารถลบได้ มีรายการซ่อมอยู่ในกลุ่มซ่อมนี้", false);
      }
      else {
        showToast("ลบไม่ได้", false);
      }
    } catch {
      showToast("ไม่สามารถลบรายการได้", false);
    }
  };

  useEffect(() => {
    // console.log("dataGroupRepair", dataGroupRepair);
    if (dataGroupRepair?.responseObject?.data) {
      const formattedData = dataGroupRepair?.responseObject?.data.map((item, index: number) => ({
        className: "",
        cells: [
          {
            value: (parseInt(page) - 1) * parseInt(pageSize) + index + 1,
            className: "text-center"
          },
          { value: item.group_repair_name, className: "text-left" }
        ],
        data: item,
      }));
      setData(formattedData);
    }
  }, [dataGroupRepair]);

  useEffect(() => {
    if (searchText === "") {
      setSearchTextDebouce("");
      setSearchParams({ page: "1", pageSize: pageSize });
      refetchGroupRepair();
    }
  }, [searchText]);

  return (
    <div>
      <MasterTableFeature
        title="กลุ่มซ่อม"
        titleBtnName="สร้างกลุ่มซ่อม"
        inputs={[
          {
            id: "search_input",
            value: searchText,
            size: "3",
            placeholder: "ค้นหา กลุ่มซ่อม",
            onChange: setSearchText,
            onAction: handleSearch,
          },
        ]}
        onSearch={handleSearch}
        headers={headers}
        rowData={data}
        totalData={dataGroupRepair?.responseObject?.totalCount}
        onEdit={handleEditOpen}
        onDelete={handleDeleteOpen}
        onPopCreate={handleCreateOpen}
      />

      <DialogComponent
        isOpen={isCreateDialogOpen}
        onClose={handleCreateClose}
        title="สร้างกลุ่มซ่อม"
        onConfirm={handleConfirm}
        confirmText="บันทึกข้อมูล"
        cancelText="ยกเลิก"
      >
        <div className="flex flex-col gap-3 items-left">
          <InputAction
            id="group-repair-create"
            placeholder="ระบุชื่อกลุ่มซ่อม"
            onChange={(e) => setGroupRepairName(e.target.value)}
            value={groupRepairName}
            label="ชื่อกลุ่มซ่อม"
            labelOrientation="horizontal"
            onAction={handleConfirm}
            classNameLabel="w-20 min-w-20 flex justify-end"
            classNameInput="w-full"
          />
        </div>
      </DialogComponent>

      <DialogComponent
        isOpen={isEditDialogOpen}
        onClose={handleEditClose}
        title="แก้ไขกลุ่มซ่อม"
        onConfirm={handleEditConfirm}
        confirmText="บันทึกข้อมูล"
        cancelText="ยกเลิก"
      >
        <div className="flex flex-col gap-3 items-left">
          <InputAction
            id="group-repair-edit"
            placeholder="ระบุชื่อกลุ่มซ่อม"
            onChange={(e) => setGroupRepairName(e.target.value)}
            value={groupRepairName}
            label="ชื่อกลุ่มซ่อม"
            labelOrientation="horizontal"
            onAction={handleEditConfirm}
            classNameLabel="w-20 min-w-20 flex justify-end"
            classNameInput="w-full"
            defaultValue={groupRepairName}
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
          คุณแน่ใจหรือไม่ว่าต้องการลบรายการนี้? <br />
          ชื่อกลุ่มซ่อม:{" "}
          <span className="text-red-500">
            {selectedItem?.group_repair_name}
          </span>
        </p>
      </DialogComponent>
      {/* Test */}
    </div>
  );
}
