import { useState, useEffect } from "react";
import MasterTableFeature from "@/components/customs/display/master.main.component";
import DialogComponent from "@/components/customs/dialog/dialog.main.component";
import InputAction from "@/components/customs/input/input.main.component";
import MasterSelectComponent from "@/components/customs/select/select.main.component";
import { getMsTypeGroupIssueReason } from "@/services/select_msTypeIssueReasonGroup";
import {
  getIssueReason,
  postIssueReason,
  updateIssueReason,
  deleteIssueReason,
} from "@/services/issueReason.service";
import { useToast } from "@/components/customs/alert/toast.main.component";
import { TypeIssueReasonAll } from "@/types/response/response.issueReason";
import { useIssueReason } from "@/hooks/useIssueReason";
import { useSearchParams } from "react-router-dom";
import { OptionType } from "@/components/customs/select/select.main.component";


type dataTableType = {
  className: string;
  cells: {
    value: any;
    className: string;
  }[];
  data: TypeIssueReasonAll;
}[];
export default function MasterIssueReasonFeature() {
  // const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [issueReasonName, setIssueReasonName] = useState("");
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [data, setData] = useState<dataTableType>([]);

  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState<boolean>(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState<boolean>(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState<boolean>(false);
  const [selectedItem, setSelectedItem] = useState<TypeIssueReasonAll | null>(
    null
  );
  const [selectedIssueGroupOption, setSelectedIssueGroupOption] = useState<OptionType | null>(null);

  const { showToast } = useToast();


  const [searchParams, setSearchParams] = useSearchParams();
  const page = searchParams.get("page") ?? "1";
  const pageSize = searchParams.get("pageSize") ?? "25";
  const [searchTextDebouce, setSearchTextDebouce] = useState("");
  const { data: issueReasonData, refetch: refetchIssueReason } = useIssueReason({
    page: page,
    pageSize: pageSize,
    searchText: searchTextDebouce,
  });
  useEffect(() => {
    // console.log("issueReasonData", issueReasonData);
    if (issueReasonData?.responseObject?.data) {
      const formattedData = issueReasonData?.responseObject?.data.map((item, index) => ({
        className: "",
        cells: [
          {value: (parseInt(page) - 1) * parseInt(pageSize) + index + 1,className: "text-center"},
          { value: item.type_issue_group.type_issue_group_name, className: "text-left" },
          { value: item.issue_reason_name, className: "text-left" },
        ],
        data: item,
      }));
      setData(formattedData);
    }
  }, [issueReasonData]);
  useEffect(() => {
    if (searchText === "") {
      setSearchTextDebouce("");
      setSearchParams({ page: "1", pageSize: pageSize });
      refetchIssueReason();
    }
  }, [searchText]);


  const handleSearch = () => {
    searchParams.set("pageSize", pageSize ?? "25");
    searchParams.set("page", "1");
    setSearchParams({ page: "1", pageSize: pageSize });
    if (searchText) {
      setSearchTextDebouce(searchText);
    }
    refetchIssueReason();
  };


  const handleEdit = (id: any) => {
    //console.log("Edit:", id);
  };

  const handleDelete = (id: any) => {
    //console.log("Delete:", id);
  };

  //ยืนยันไดอะล็อค
  const handleConfirm = async () => {
    // เช็ค state ใหม่
    if (!issueReasonName || !selectedIssueGroupOption) {
        showToast("กรุณาระบุกลุ่มสาเหตุและรายการสาเหตุให้ครบถ้วน", false);
        return;
    }
    try {
        const response = await postIssueReason({
            issue_reason_name: issueReasonName,
            // ดึง value ออกจาก object
            type_issue_group_id: String(selectedIssueGroupOption.value),
        });

        if (response.statusCode === 200) {
            setIssueReasonName("");
            setSelectedIssueGroupOption(null); // << Reset state ใหม่
            handleCreateClose();
            showToast("สร้างรายการสาเหตุเรียบร้อยแล้ว", true);
            refetchIssueReason();
        } else {
        if (response.message == "Issue Reason already exists") {
          showToast("รายการสาเหตุนี้มีอยู่แล้ว", false);
        }
      }
    } catch {
      showToast("ไม่สามารถสร้างรายการสาเหตุได้", false);
    }
  };
  const handleEditConfirm = async () => {
    // เช็ค state ใหม่
    if (!issueReasonName || !selectedIssueGroupOption || !selectedItem) {
        showToast("กรุณาระบุกลุ่มสาเหตุและรายการสาเหตุให้ครบถ้วน", false);
        return;
    }
    try {
        const response = await updateIssueReason({
            issue_reason_id: selectedItem.issue_reason_id,
            issue_reason_name: issueReasonName,
            // ดึงค่า value ใหม่ล่าสุดจาก state
            type_issue_group_id: String(selectedIssueGroupOption.value),
        });

        if (response.statusCode === 200) {
            showToast("แก้ไขรายการสาเหตุเรียบร้อยแล้ว", true);
            handleEditClose(); // << เรียกใช้ฟังก์ชันปิดเพื่อ reset state
            refetchIssueReason();
        } else {
        if (response.message === "Issue Reason already exists") {
          showToast("ข้อมูลนี้มีอยู่แล้ว", false);
        } else {
          showToast("ไม่สามารถแก้ไขรายการสาเหตุได้", false);
        }
      }
    } catch {
      showToast("ไม่สามารถแก้ไขรายการสาเหตุได้", false);
    }
  };
  const handleDeleteConfirm = async () => {
    if (!selectedItem || !selectedItem.issue_reason_id) {
      showToast("กรุณาระบุรายการสาเหตุที่ต้องการลบ", false);
      return;
    }

    try {
      const response = await deleteIssueReason(selectedItem.issue_reason_id); // ส่ง issue_reason_id ที่ถูกต้อง

      if (response.statusCode === 200) {
        showToast("ลบรายการสาเหตุเรียบร้อยแล้ว", true);
        setIsDeleteDialogOpen(false);  // ปิด Dialog ลบ
        refetchIssueReason();  // รีเฟรชรายการ
      } else {
        showToast("ไม่สามารถลบรายการสาเหตุได้", false);
      }
    } catch (error) {
      showToast("ไม่สามารถลบรายการสาเหตุได้", false);
    }
  };

  //เปิด
  const handleCreateOpen = () => {
    setIssueReasonName("");
    setSelectedIssueGroupOption(null); // << Reset state ใหม่
    setIsCreateDialogOpen(true);
  };
  const handleEditOpen = (item: TypeIssueReasonAll) => {
    setSelectedItem(item);
    setIssueReasonName(item.issue_reason_name);
    // สร้าง object ที่ถูกต้องสำหรับ state ใหม่
    setSelectedIssueGroupOption(item.type_issue_group ? {
        value: item.type_issue_group.type_issue_group_id,
        label: item.type_issue_group.type_issue_group_name,
    } : null);
    setIsEditDialogOpen(true);
 };
  const handleDeleteOpen = (item: TypeIssueReasonAll) => {
    setSelectedItem(item);
    setIsDeleteDialogOpen(true);
  };

  //ปิด
  const handleCreateClose = () => {
    setIsCreateDialogOpen(false);
  };
  const handleEditClose = () => {
    setIsEditDialogOpen(false);
    setSelectedItem(null);
    setIssueReasonName("");
    setSelectedIssueGroupOption(null);
};
  const handleDeleteClose = () => {
    setIsDeleteDialogOpen(false);
  };

  const headers = [
    { label: "ลำดับที่", colSpan: 1, className: "w-20 min-w-20" },
    { label: "กลุ่มสาเหตุ", colSpan: 1, className: "w-5/12" },
    { label: "สาเหตุ", colSpan: 1, className: "w-full" },
    { label: "แก้ไข", colSpan: 1, className: "min-w-14" },
    { label: "ลบ", colSpan: 1, className: "min-w-14" },
  ];

  return (
    <div>
      <MasterTableFeature
        title="สาเหตุ"
        titleBtnName="สร้างสาเหตุ"
        inputs={[
          {
            id: "search_input",
            value: searchText,
            size: "3",
            placeholder: "ค้นหา กลุ่มสาเหตุ สาเหตุ",
            onChange: setSearchText,
            onAction: handleSearch,
          },
        ]}
        onSearch={handleSearch}
        headers={headers}
        rowData={data}
        totalData={issueReasonData?.responseObject?.totalCount}
        onEdit={handleEditOpen}
        onDelete={handleDeleteOpen}
        onPopCreate={handleCreateOpen}
      />

      {/* สร้าง */}
      <DialogComponent
        isOpen={isCreateDialogOpen}
        onClose={handleCreateClose}
        title="สร้างสาเหตุ"
        onConfirm={handleConfirm}
        confirmText="บันทึกข้อมูล"
        cancelText="ยกเลิก"
      >
        <div className="flex flex-col gap-3 items-left">
          <MasterSelectComponent
            id="select"
            value={selectedIssueGroupOption}
            onChange={(option) => setSelectedIssueGroupOption(option)}
            fetchDataFromGetAPI={getMsTypeGroupIssueReason}
            valueKey="type_issue_group_id"
            labelKey="type_issue_group_name"
            placeholder="กรุณาเลือก..."
            isClearable={true}
            label="กลุ่มสาเหตุ"
            labelOrientation="horizontal"
            classNameLabel="w-20 min-w-20 flex justify-end"
            classNameSelect="w-full"
            nextFields={{down: "issue-reason-create"}}
          />
          <InputAction
            id="issue-reason-create"
            placeholder="ระบุสาเหตุ"
            onChange={(e) => setIssueReasonName(e.target.value)}
            value={issueReasonName}
            label="ชื่อสาเหตุ"
            labelOrientation="horizontal"
            onAction={handleConfirm}
            classNameLabel="w-20 min-w-20 flex justify-end"
            classNameInput="w-full"
            nextFields={{up: "select"}}
          />
        </div>
      </DialogComponent>


      {/* แก้ไข */}
      <DialogComponent
        isOpen={isEditDialogOpen}
        onClose={handleEditClose}
        title="แก้ไขสาเหตุ"
        onConfirm={handleEditConfirm}
        confirmText="บันทึกข้อมูล"
        cancelText="ยกเลิก"
      >
        <div className="flex flex-col gap-3 items-left">
          <MasterSelectComponent
            id="select"
            value={selectedIssueGroupOption}
            onChange={(option) => setSelectedIssueGroupOption(option)}
            fetchDataFromGetAPI={getMsTypeGroupIssueReason}
            valueKey="type_issue_group_id"
            labelKey="type_issue_group_name"
            placeholder={
              selectedItem
                ? selectedItem.type_issue_group.type_issue_group_name
                : "กรุณาเลือก..."
            }
            isClearable={true}
            label="กลุ่มสาเหตุ"
            labelOrientation="horizontal"
            classNameLabel="w-20 min-w-20 flex justify-end"
            classNameSelect="w-full"
            defaultValue={
              selectedItem?.type_issue_group
                ? {
                  value: selectedItem.type_issue_group.type_issue_group_id,
                  label: selectedItem.type_issue_group.type_issue_group_name,
                }
                : null
            }
            nextFields={{down: "issue-reason-edit"}}
          />
          <InputAction
            id="issue-reason-edit"
            defaultValue={issueReasonName} // ถ้าไม่มีค่า issueReasonName ให้ใช้ placeholder
            onChange={(e) => setIssueReasonName(e.target.value)}
            placeholder="ระบุสาเหตุ"
            label="ชื่อสาเหตุ"
            value={issueReasonName}
            labelOrientation="horizontal"
            onAction={handleEditConfirm}
            classNameLabel="w-20 min-w-20 flex justify-end"
            classNameInput="w-full"
            nextFields={{up: "select"}}
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
          กลุ่มสาเหตุ :{" "}
          <span className="text-red-500">
            {selectedItem?.type_issue_group.type_issue_group_name}
          </span>
          <br />
          ชื่อสาเหตุ :{" "}
          <span className="text-red-500">
            {selectedItem?.issue_reason_name}{" "}
          </span>
        </p>
      </DialogComponent>
    </div>
  );
}

