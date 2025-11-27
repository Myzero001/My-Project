import { useEffect, useState } from "react";
import MasterTableFeature from "@/components/customs/display/master.main.component";
import DialogComponent from "@/components/customs/dialog/dialog.main.component";
import InputAction from "@/components/customs/input/input.main.component";
import {
  postMasterBrand,
  updateMasterBrand,
  deleteMasterBrand,
} from "@/services/ms.brand";
import { useToast } from "@/components/customs/alert/toast.main.component";
import { Type_MS_BRAND_All } from "@/types/response/response.ms-brand";
import { useBrand } from "@/hooks/useBrand";
import { useSearchParams } from "react-router-dom";

type dataTableType = {
  className: string;
  cells: (
    | {
      value: number;
      className: string;
    }
    | {
      value: string;
      className: string;
    }
  )[];
  data: Type_MS_BRAND_All;
}[];

export default function BrandFeature() {
  const [searchText, setSearchText] = useState("");
  const [brandName, setBrandName] = useState("");
  const [data, setData] = useState<dataTableType>([]);

  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<Type_MS_BRAND_All | null>(
    null
  );

  const { showToast } = useToast();

  const [searchParams, setSearchParams] = useSearchParams();
  const page = searchParams.get("page") ?? "1";
  const pageSize = searchParams.get("pageSize") ?? "25";
  const [searchTextDebouce, setSearchTextDebouce] = useState("");

  const { data: dataBrand, refetch: refetchBrand } = useBrand({
    page: page,
    pageSize: pageSize,
    searchText: searchTextDebouce,
  });

  const headers = [
    { label: "ลำดับที่", colSpan: 1, className: "w-20 min-w-20" },
    { label: "ชื่อแบรนด์", colSpan: 1, className: "w-full" },
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
    refetchBrand();
  };

  const handleCreateOpen = () => {
    setBrandName("");
    setIsCreateDialogOpen(true);
  };

  const handleEditOpen = (item: Type_MS_BRAND_All) => {
    setSelectedItem(item);
    setBrandName(item.brand_name);
    setIsEditDialogOpen(true);
  };

  const handleDeleteOpen = (item: Type_MS_BRAND_All) => {
    setSelectedItem(item);
    setIsDeleteDialogOpen(true);
  };

  const handleCreateClose = () => {
    setIsCreateDialogOpen(false);
  };

  const handleEditClose = () => {
    setIsEditDialogOpen(false);
  };

  const handleDeleteClose = () => {
    setIsDeleteDialogOpen(false);
  };

  const handleConfirm = async () => {
    if (!brandName) {
      showToast("กรุณาระบุชื่อแบรนด์", false);
      return;
    }
    try {
      const response = await postMasterBrand({ brand_name: brandName });
      if (response.statusCode === 200) {
        setBrandName("");
        handleCreateClose();
        showToast("สร้างแบรนด์เรียบร้อยแล้ว", true);
        refetchBrand();
      } else {
        showToast("แบรนด์นี้มีอยู่แล้ว", false);
      }
    } catch {
      showToast("ไม่สามารถสร้างแบรนด์ได้", false);
    }
  };

  const handleEditConfirm = async () => {
    if (!brandName || !selectedItem) {
      showToast("กรุณาระบุชื่อแบรนด์", false);
      return;
    }
    try {
      const response = await updateMasterBrand({
        master_brand_id: selectedItem.master_brand_id,
        brand_name: brandName,
      });
      if (response.statusCode === 200) {
        showToast("แก้ไขแบรนด์เรียบร้อยแล้ว", true);
        setBrandName("");
        handleEditClose();
        refetchBrand();
      } else {
        showToast("ข้อมูลนี้มีอยู่แล้ว", false);
      }
    } catch {
      showToast("ไม่สามารถแก้ไขแบรนด์ได้", false);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!selectedItem || !selectedItem.master_brand_id) {
      showToast("กรุณาระบุแบรนด์ที่ต้องการลบ", false);
      return;
    }
    try {
      const response = await deleteMasterBrand(selectedItem.master_brand_id);
      if (response.statusCode === 200) {
        showToast("ลบแบรนด์เรียบร้อยแล้ว", true);
        handleDeleteClose();
        refetchBrand();
      }
      else if (response.statusCode === 400) {
        showToast("ไม่สามารถลบได้ มีรายการรุ่นรถอยู่ในแบรนด์นี้", false);
      } else {
        showToast("ไม่สามารถลบแบรนด์ได้", false);
      }
    } catch {
      showToast("ไม่สามารถลบแบรนด์ได้", false);
    }
  };

  useEffect(() => {
    // console.log("dataQuatations", dataBrand);
    if (dataBrand?.responseObject?.data) {
      const formattedData = dataBrand?.responseObject?.data.map(
        (item, index: number) => ({
          className: "",
          cells: [
            {
              value: (parseInt(page) - 1) * parseInt(pageSize) + index + 1,
              className: "text-center",
            },
            { value: item.brand_name, className: "text-left" },
          ],
          data: item,
        })
      );

      setData(formattedData);
    }
  }, [dataBrand]);

  useEffect(() => {
    if (searchText === "") {
      setSearchTextDebouce(searchText);
      refetchBrand();
    }
  }, [searchText]);

  useEffect(() => {
    if (searchText === "") {
      setSearchTextDebouce("");
      setSearchParams({ page: "1", pageSize: pageSize });
      refetchBrand();
    }
  }, [searchText]);

  return (
    <div>
      <MasterTableFeature
        title="แบรนด์"
        titleBtnName="สร้างแบรนด์"
        inputs={[
          {
            id: "search_input",
            value: searchText,
            size: "3",
            placeholder: "ค้นหา แบรนด์",
            onChange: setSearchText,
            onAction: handleSearch,
          },
        ]}
        onSearch={handleSearch}
        headers={headers}
        rowData={data}
        totalData={dataBrand?.responseObject?.totalCount}
        onEdit={handleEditOpen}
        onDelete={handleDeleteOpen}
        onPopCreate={handleCreateOpen}
      />

      <DialogComponent
        isOpen={isCreateDialogOpen}
        onClose={handleCreateClose}
        title="สร้างแบรนด์"
        onConfirm={handleConfirm}
        confirmText="บันทึกข้อมูล"
        cancelText="ยกเลิก"
      >
        <div className="flex flex-col gap-3 items-left">
          <InputAction
            id="brand-create"
            placeholder="ระบุชื่อแบรนด์"
            onChange={(e) => setBrandName(e.target.value)}
            value={brandName}
            label="ชื่อแบรนด์"
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
        title="แก้ไขแบรนด์"
        onConfirm={handleEditConfirm}
        confirmText="บันทึกข้อมูล"
        cancelText="ยกเลิก"
      >
        <div className="flex flex-col gap-3 items-left">
          <InputAction
            id="brand-edit"
            placeholder={"ระบุชื่อแบรนด์"}
            onChange={(e) => setBrandName(e.target.value)}
            value={brandName}
            label="ชื่อแบรนด์"
            labelOrientation="horizontal"
            onAction={handleEditConfirm}
            classNameLabel="w-20 min-w-20 flex justify-end"
            classNameInput="w-full"
            defaultValue={brandName}
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
          คุณแน่ใจหรือไม่ว่าต้องการลบแบรนด์นี้? <br />
          ชื่อแบรนด์:{" "}
          <span className="text-red-500">{selectedItem?.brand_name}</span>
        </p>
      </DialogComponent>
    </div>
  );
}
