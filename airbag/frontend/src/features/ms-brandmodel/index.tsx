import { useState, useEffect } from "react";
import MasterTableFeature from "@/components/customs/display/master.main.component";
import DialogComponent from "@/components/customs/dialog/dialog.main.component";
import InputAction from "@/components/customs/input/input.main.component";
import MasterSelectComponent from "@/components/customs/select/select.main.component";
import {
  postMasterBrandModel,
  updateMasterBrandModel,
  deleteMasterBrandModel,
  getMsTypeMsBRANDS,
} from "@/services/ms.brandmodel";

import { useToast } from "@/components/customs/alert/toast.main.component";
import { Type_MS_BRANDMODEL_All } from "@/types/response/response.ms-brandmodel";
import { useSearchParams } from "react-router-dom";
import { useBrandModel } from "@/hooks/useBrandModel";
import { getByBrandWithSearchText } from "@/services/ms.brandmodel";
import { useSelectBrand } from "@/hooks/useSelect";
import { BrandModelSelectItem } from "@/types/response/response.ms-brandmodel";
import { BrandSelectItem } from "@/types/response/response.ms-brand";
import { OptionType } from "@/components/customs/select/select.main.component";


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
  data: Type_MS_BRANDMODEL_All;
}[];

export default function MasterBrandModelFeature() {
  const [searchText, setSearchText] = useState("");
  const [brandModelName, setBrandModelName] = useState("");
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [data, setData] = useState<dataTableType>([]);

  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState<boolean>(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState<boolean>(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState<boolean>(false);
  const [selectedItem, setSelectedItem] =
    useState<Type_MS_BRANDMODEL_All | null>(null);

  const { showToast } = useToast();

  const [searchBrandModelSelectOnly, setSearchBrandModelSelectOnly] = useState("");

  const [searchParams, setSearchParams] = useSearchParams();
  const page = searchParams.get("page") ?? "1";
  const pageSize = searchParams.get("pageSize") ?? "25";
  const [searchTextDebouce, setSearchTextDebouce] = useState("");
  const [selectedBrandOption, setSelectedBrandOption] = useState<OptionType | null>(null);

  const { data: dataBrandModel, refetch: refetchBrandModel } = useBrandModel({
    page: page,
    pageSize: pageSize,
    searchText: searchTextDebouce,
  });

  const headers = [
    { label: "ลำดับที่", colSpan: 1, className: "w-20 min-w-20" },
    { label: "แบรนด์", colSpan: 1, className: "w-3/12" },
    { label: "รุ่นรถ", colSpan: 1, className: "w-full" },
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
    refetchBrandModel();
  };

  const handleConfirm = async () => {
    if (!brandModelName || !selectedBrandOption) { 
      showToast("กรุณาระบุแบรนด์เเละรุ่นรถให้ครบถ้วน", false);
      return;
    }
    try {
      const response = await postMasterBrandModel({
        brandmodel_name: brandModelName,
        master_brand_id: String(selectedBrandOption.value),
      });

      if (response.statusCode === 200) {
        setBrandModelName("");
        setSelectedBrandOption(null);
        handleCreateClose();
        showToast("สร้างรุ่นรถเรียบร้อยแล้ว", true);
        refetchBrandModel();
      } else {
        if (response.statusCode === 400) {
          showToast("รายการรุ่นรถนี้มีอยู่แล้ว", false);
        }
      }
    } catch {
      showToast("ไม่สามารถสร้างรายการรุ่นรถได้", false);
    }
  };

  const handleEditConfirm = async () => {
    if (!brandModelName || !selectedBrandOption || !selectedItem) {
      showToast("กรุณาระบุแบรนด์และรุ่นรถให้ครบถ้วน", false);
      return;
    }
    try {
      const response = await updateMasterBrandModel({
        ms_brandmodel_id: selectedItem.ms_brandmodel_id,
        brandmodel_name: brandModelName,
        master_brand_id: String(selectedBrandOption.value), 
      });
      
      if (response.statusCode === 200) {
        showToast("แก้ไขรุ่นรถเรียบร้อยแล้ว", true);
        handleEditClose();
        refetchBrandModel();
      } else {
        showToast("ข้อมูลนี้มีอยู่แล้ว", false);
      }
    } catch {
      showToast("ไม่สามารถแก้ไขรุ่นรถได้", false);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!selectedItem) {
      showToast("กรุณาระบุรุ่นรถที่ต้องการลบ", false);
      return;
    }
    try {
      const response = await deleteMasterBrandModel(
        selectedItem.ms_brandmodel_id
      );
      if (response.statusCode === 200) {
        showToast("ลบรุ่นรถเรียบร้อยแล้ว", true);
        handleDeleteClose();
        refetchBrandModel();
      }
      else if (response.statusCode === 400) {
        showToast("ไม่สามารถลบรุ่นรถได้ รุ่นรถนี้มีอยู่ในใบเสนอราคา", false);
      }
      else {
        showToast("ไม่สามารถลบรุ่นรถได้", false);
      }
    } catch {
      showToast("ไม่สามารถลบรุ่นรถได้", false);
    }
  };

  const handleCreateOpen = () => {
    setBrandModelName("");
    setSelectedBrandOption(null);
    setIsCreateDialogOpen(true);
  };

  const handleEditOpen = (item: Type_MS_BRANDMODEL_All) => {
    setSelectedItem(item);
    setBrandModelName(item.brandmodel_name);
    setSelectedBrandOption(item.master_brand ? {
      value: item.master_brand.master_brand_id,
      label: item.master_brand.brand_name,
    } : null);
    setIsEditDialogOpen(true);
  };

  const handleDeleteOpen = (item: Type_MS_BRANDMODEL_All) => {
    setSelectedItem(item);
    setIsDeleteDialogOpen(true);
  };

  const handleCreateClose = () => setIsCreateDialogOpen(false);
  const handleEditClose = () => setIsEditDialogOpen(false);
  const handleDeleteClose = () => setIsDeleteDialogOpen(false);

  useEffect(() => {
    // console.log("dataBrandModel", dataBrandModel);
    if (dataBrandModel?.responseObject?.data) {
      const formattedData = dataBrandModel?.responseObject?.data.map(
        (item, index: number) => ({
          className: "",
          cells: [
            {
              value: (parseInt(page) - 1) * parseInt(pageSize) + index + 1,
              className: "text-center",
            },
            {
              value: item.master_brand?.brand_name || "N/A",
              className: "text-left",
            }, // แสดงเฉพาะชื่อแบรนด์
            {
              value: item.brandmodel_name,
              className: "text-left",
            },
          ],
          data: item,
        })
      );
      setData(formattedData);
    }
  }, [dataBrandModel]);

  useEffect(() => {
    if (searchText === "") {
      setSearchTextDebouce(searchText);
      refetchBrandModel();
    }
  }, [searchText]);

  useEffect(() => {
    if (searchText === "") {
      setSearchTextDebouce("");
      setSearchParams({ page: "1", pageSize: pageSize });
      refetchBrandModel();
    }
  }, [searchText]);

  const { data: dataBrandModelSelectOnly, refetch: refetchBrandModelSelectOnly } = useSelectBrand({
      searchText: searchBrandModelSelectOnly,
    });

  const fetchDataBrandDropdown = async () => {
    const BrandModelSelectOnlyList = dataBrandModelSelectOnly?.responseObject?.data ?? [];
    return {
      responseObject: BrandModelSelectOnlyList.map((item: BrandSelectItem) => ({
        master_brand_id: item.master_brand_id,
        brand_name: item.brand_name,
      })),
    };
  };

  const handleBrandSearch = (searchText: string) => {
    setSearchBrandModelSelectOnly(searchText);
    refetchBrandModelSelectOnly();
  };

  return (
    <div>
      <MasterTableFeature
        title="รุ่นรถ"
        titleBtnName="สร้างรุ่นรถ"
        inputs={[
          {
            id: "search_input",
            value: searchText,
            size: "3",
            placeholder: "ค้นหา แบรนด์ รุ่นรถ",
            onChange: setSearchText,
            onAction: handleSearch,
          },
        ]}
        onSearch={handleSearch}
        headers={headers}
        rowData={data}
        totalData={dataBrandModel?.responseObject?.totalCount}
        onEdit={handleEditOpen}
        onDelete={handleDeleteOpen}
        onPopCreate={handleCreateOpen}
      />

      <DialogComponent
        isOpen={isCreateDialogOpen}
        onClose={handleCreateClose}
        title="สร้างรุ่นรถ"
        onConfirm={handleConfirm}
        confirmText="บันทึกข้อมูล"
        cancelText="ยกเลิก"
      >
        <div className="flex flex-col gap-3 items-left">
          <MasterSelectComponent
            id="select"
            value={selectedBrandOption}
            onChange={(option) => setSelectedBrandOption(option)}
            fetchDataFromGetAPI={fetchDataBrandDropdown}
            onInputChange={handleBrandSearch}
            valueKey="master_brand_id"
            labelKey="brand_name"
            placeholder="กรุณาเลือก..."
            isClearable
            label="แบรนด์"
            labelOrientation="horizontal"
            classNameLabel="w-20 min-w-20 flex justify-end"
            classNameSelect="w-full"
            nextFields={{down: "brandmodel-create"}}
          />
          <InputAction
            id="brandmodel-create"
            placeholder="ระบุรุ่นรถ"
            onChange={(e) => setBrandModelName(e.target.value)}
            value={brandModelName}
            label="ชื่อรุ่นรถ"
            labelOrientation="horizontal"
            onAction={handleConfirm}
            classNameLabel="w-20 min-w-20 flex justify-end"
            classNameInput="w-full"
            nextFields={{up: "select"}}
          />
        </div>
      </DialogComponent>

      <DialogComponent
        isOpen={isEditDialogOpen}
        onClose={handleEditClose}
        title="แก้ไขรุ่นรถ"
        onConfirm={handleEditConfirm}
        confirmText="บันทึกข้อมูล"
        cancelText="ยกเลิก"
      >
        <div className="flex flex-col gap-3 items-left">
          <MasterSelectComponent
            id="select"
            value={selectedBrandOption}
            onChange={(option) => setSelectedBrandOption(option)}
            fetchDataFromGetAPI={fetchDataBrandDropdown}
            onInputChange={handleBrandSearch}
            valueKey="master_brand_id"
            labelKey="brand_name"
            placeholder={
              selectedItem?.master_brand?.brand_name || "กรุณาเลือก..."
            }
            isClearable={true}
            label="แบรนด์"
            labelOrientation="horizontal"
            classNameLabel="w-20 min-w-20 flex justify-end"
            classNameSelect="w-full"
            defaultValue={
              selectedItem?.master_brand
                ? {
                  value: selectedItem.master_brand.master_brand_id,
                  label: selectedItem.master_brand.brand_name,
                }
                : null
            }
            nextFields={{down: "brandmodel-edit"}}
          />
          <InputAction
            id="brandmodel-edit"
            placeholder="ระบุรุ่นรถ"
            onChange={(e) => setBrandModelName(e.target.value)}
            value={brandModelName}
            label="ชื่อรุ่นรถ"
            labelOrientation="horizontal"
            onAction={handleEditConfirm}
            classNameLabel="w-20 min-w-20 flex justify-end"
            classNameInput="w-full"
            defaultValue={brandModelName}
            nextFields={{up: "select"}}
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
          คุณแน่ใจหรือไม่ว่าต้องการลบรุ่นรถนี้? <br />
          ชื่อรุ่นรถ:{" "}
          <span className="text-red-500">{selectedItem?.brandmodel_name}</span>
        </p>
      </DialogComponent>
    </div>
  );
}
