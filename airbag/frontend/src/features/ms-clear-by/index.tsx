import { useEffect, useState } from "react";
import MasterTableFeature from "@/components/customs/display/master.main.component";
import DialogComponent from "@/components/customs/dialog/dialog.main.component";
import InputAction from "@/components/customs/input/input.main.component";
import {
  
  postClearby,
  updateClearby,
  deleteClearby,
} from "@/services/ms.clearby";
import { useToast } from "@/components/customs/alert/toast.main.component";
import { Type_MS_CLEAR_BY_ALL } from "@/types/response/response.ms-clear-by";
import { useSearchParams } from "react-router-dom";
import { useClearBy } from "@/hooks/useClearby";
import { STATUS_CODES } from "http";

type dataTableType = {
  className: string;
  cells: {
    value: any;
    className: string;
  }[];
  data: Type_MS_CLEAR_BY_ALL;
}[];

export default function MasterClearByFeature() {
  const [searchText, setSearchText] = useState("");
  const [clearbyName, setClearbyName] = useState("");
  const [data, setData] = useState<dataTableType>([]);

  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<Type_MS_CLEAR_BY_ALL | null>(
    null
  );

  const { showToast } = useToast();
  const [searchParams, setSearchParams] = useSearchParams();
  const page = searchParams.get("page") ?? "1";
  const pageSize = searchParams.get("pageSize") ?? "25";
  const [searchTextDebounce, setSearchTextDebounce] = useState("");

   const { data: dataClearby, refetch: refetchClearby } = useClearBy({
      page: page,
      pageSize: pageSize,
      searchText: searchTextDebounce,
    });
  

    useEffect(() => {
    //@ts-ignore
    if (dataClearby?.responseObject?.data && Array.isArray(dataClearby.responseObject.data)) {
        
        // 1. แปลง page และ pageSize เป็นตัวเลข
        const pageNumber = parseInt(page, 10) || 1;
        const pageSizeNumber = parseInt(pageSize, 10) || 25;
        // 2. คำนวณลำดับเริ่มต้นของหน้านั้นๆ
        const startIndex = (pageNumber - 1) * pageSizeNumber;
        //@ts-ignore
        const formattedData = dataClearby.responseObject.data.map(
          (item: Type_MS_CLEAR_BY_ALL, index: number) => ({
            className: "",
            cells: [
              // 3. แก้ไขการคำนวณลำดับที่
              { value: startIndex + index + 1, className: "text-center" },
              { value: item.clear_by_name, className: "text-left" },
            ],
            data: item,
          })
        );
        setData(formattedData);
    
    } else {
        // หากไม่มีข้อมูล ให้เคลียร์ตาราง
        setData([]);
    }
}, [dataClearby, page, pageSize]);
    
    
    



  const headers = [
    { label: "ลำดับที่", colSpan: 1, className: "w-20 min-w-20" },
    { label: "บุคคลแก้ไขปัญหากล่อง", colSpan: 1, className: "w-full" },
    { label: "แก้ไข", colSpan: 1, className: "min-w-14" },
    { label: "ลบ", colSpan: 1, className: "min-w-14" },
  ];

  const handleSearch = () => {
    searchParams.set("pageSize", pageSize ?? "25");
    searchParams.set("page", "1");
    setSearchParams({ page: "1", pageSize });
    if (searchText) {
      setSearchTextDebounce(searchText);
    }
  };

  const handleCreateOpen = () => {
    setClearbyName("");
    setIsCreateDialogOpen(true);
  };

  const handleEditOpen = (item: Type_MS_CLEAR_BY_ALL) => {
    setSelectedItem(item);
    setClearbyName(item.clear_by_name);
    setIsEditDialogOpen(true);
  };

  const handleDeleteOpen = (item: Type_MS_CLEAR_BY_ALL) => {
    setSelectedItem(item);
    setIsDeleteDialogOpen(true);
  };

  const handleCreateClose = () => setIsCreateDialogOpen(false);
  const handleEditClose = () => setIsEditDialogOpen(false);
  const handleDeleteClose = () => setIsDeleteDialogOpen(false);

  const handleConfirm = async () => {
      if (!clearbyName) {
        showToast("กรุณาระบุชื่อเหตุผล", false);
        return;
      }
      try {
        const response = await postClearby({
          clear_by_name: clearbyName ,
        });
        if (response.statusCode === 200) {
          setClearbyName("");
          handleCreateClose();
          refetchClearby();
          showToast("สร้างรายการสำเร็จ", true);
        } else {
          showToast("ข้อมูลซ้ำ", false);
        }
      } catch {
        showToast("ไม่สามารถสร้างรายการได้", false);
      }
    };

    const handleEditConfirm = async () => {
        if (!clearbyName || !selectedItem) {
          showToast("กรุณาระบุข้อมูลให้ครบถ้วน", false);
          return;
        }
        try {
          const response = await updateClearby({
            clear_by_id: selectedItem.clear_by_id,
            clear_by_name: clearbyName,
          });
          if (response.statusCode === 200) {
            showToast("อัปเดตข้อมูลสำเร็จ", true);
            setClearbyName("");
            handleEditClose();
            refetchClearby();
          }
        } catch {
          showToast("ไม่สามารถอัปเดตข้อมูลได้", false);
        }
      };

      const handleDeleteConfirm = async () => {
          if (!selectedItem || !selectedItem.clear_by_id) {
            showToast("กรุณาเลือกรายการ", false);
            return;
          }
          
          
            
          try {
            const response = await deleteClearby(
              selectedItem.clear_by_id
            );
            if (response.statusCode === 200) {
              handleDeleteClose();
              refetchClearby();
              showToast("ลบรายการสำเร็จ", true);
            } 
            else if (response.statusCode === 400) {
              if(response.message === "Clearby in Repair Receipt"){
                showToast("ไม่สามารถลบรายการได้ เนื่องจากมีใบเสนอราคาอยู่", false);
              }
              else {
                showToast("ไม่สามารถลบรายการได้", false);
              }
            }
            else {
              showToast("ลบไม่ได้", false);
            }
          } catch {
            showToast("ไม่สามารถลบรายการได้", false);
          }
        };

        useEffect(() => {
            if (searchText === "") {
              setSearchTextDebounce("");
              setSearchParams({ page: "1", pageSize });
              refetchClearby();
            }
          }, [searchText]);


          return (
            <div>
              <MasterTableFeature
                title="บุคคลแก้ไขปัญหากล่อง"
                titleBtnName="สร้างบุคคล"
                inputs={[
                  {
                    id: "search_input",
                    value: searchText,
                    size: "3",
                    placeholder: "ค้นหา บุลคลแก้ไขปัญหากล่อง",
                    onChange: setSearchText,
                    onAction: handleSearch,
                  },
                ]}
                onSearch={handleSearch}
                headers={headers}
                rowData={data}
                // @ts-ignore
                totalData={dataClearby?.responseObject?.totalCount}
                onEdit={handleEditOpen}
                onDelete={handleDeleteOpen}
                onPopCreate={handleCreateOpen}
              />
        
              {/* สร้าง */}
              <DialogComponent
                isOpen={isCreateDialogOpen}
                onClose={handleCreateClose}
                title="สร้างบุคคลแก้ไขปัญหากล่อง"
                onConfirm={handleConfirm}
                confirmText="บันทึกข้อมูล"
                cancelText="ยกเลิก"
              >
                <div className="flex flex-col gap-3 items-left">
                  <InputAction
                    id="issue-reason-create"
                    placeholder="ชื่อบุคคลแก้ไขปัญหากล่อง"
                    onChange={(e) => setClearbyName(e.target.value)}
                    value={clearbyName}
                    label="ชื่อบุคคล"
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
                title="แก้ไขบุคคลแก้ไขปัญหากล่อง"
                onConfirm={handleEditConfirm}
                confirmText="บันทึกข้อมูล"
                cancelText="ยกเลิก"
              >
                <div className="flex flex-col gap-3 items-left">
                  <InputAction
                    id="issue-reason-edit"
                    placeholder={clearbyName ? clearbyName : "ClearBy Name"}
                    defaultValue={clearbyName}
                    onChange={(e) => setClearbyName(e.target.value)}
                    value={clearbyName}
                    label="ชื่อบุคคล"
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
                 ชื่อบุคคลแก้ไขปัญหากล่อง : <span className="text-red-500">{selectedItem?.clear_by_name} </span>
                </p>
              </DialogComponent>
            </div>
          );
        }