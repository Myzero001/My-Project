import { useEffect, useState } from "react";
import MasterTableFeature from "@/components/customs/display/master.main.component";
import DialogComponent from "@/components/customs/dialog/dialog.main.component";
import InputAction from "@/components/customs/input/input.main.component";
import {
  postMsCompanies,
  updateMsCompanies,
  deleteMsCompanies,
} from "@/services/ms.companies";
import RadioMainComponent from "@/features/ms-companies/components/radiocompenent";
import { useToast } from "@/components/customs/alert/ToastContext";
import { Type_MS_Companies_Response } from "@/types/response/response.ms-companies";
import { useNavigate, useSearchParams } from "react-router-dom";

import { useCompanies } from "@/hooks/useCompanies";
import { set } from "date-fns";


type dateTableType = {
  className: string;
  cells: {
    value: any;
    className: string;
  }[];
  data: Type_MS_Companies_Response; //ตรงนี้
}[];

export default function MasterCompaniesFeature() {
  const [searchText, setSearchText] = useState("");
  const [companysName, setCompanysName] = useState("");
  //const [companyaddress, setCompanyaddress] = useState("");
  const [company_code, setCompany_code] = useState("");
  const [tax_status, setTax_status] = useState<string>("");
  const [tel_number, setTel_number] = useState("");
  const [addr_number, setAddr_number] = useState("");
  const [addr_alley, setAddr_alley] = useState("");
  const [addr_street, setAddr_street] = useState("");
  const [addr_subdistrict, setAddr_subdistrict] = useState("");
  const [addr_district, setAddr_district] = useState("");
  const [addr_province, setAddr_province] = useState("");
  const [addr_postcode, setAddr_postcode] = useState("");
  const [company_tin, setCompany_tin] = useState("");
  const [data, setData] = useState<dateTableType>([]);
  const [promtpay_id, setPromtpay_id] = useState("");

  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState<boolean>(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState<boolean>(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState<boolean>(false);
  const [selectedItem, setSelectedItem] =
    useState<Type_MS_Companies_Response | null>(null);

  const { showToast } = useToast();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const page = searchParams.get("page") ?? "1";
  const pageSize = searchParams.get("pageSize") ?? "25";
  const [searchTextDebouce, setSearchTextDebouce] = useState("");
  //คงเหลือ ค้นหา

  const { data: dataCompanies, refetch: refetchCompanies } = useCompanies({
    page: page,
    pageSize: pageSize,
    searchText: searchTextDebouce,
  });

  useEffect(() => {
    //@ts-ignore
    if (dataCompanies?.responseObject?.data) {
      // 1. แปลง page และ pageSize เป็นตัวเลข (เผื่อเป็น string)
      const currentPage = parseInt(page, 10);
      const currentPageSize = parseInt(pageSize, 10);

      // 2. คำนวณลำดับเริ่มต้นของหน้าปัจจุบัน
      const startIndex = (currentPage - 1) * currentPageSize;
      //@ts-ignore
      const formattedData = dataCompanies.responseObject.data.map(
        (item: Type_MS_Companies_Response, index: number) => ({
          className: "",
          cells: [
            // 3. คำนวณลำดับที่ที่ถูกต้อง
            { value: startIndex + index + 1, className: "text-center" },
            { value: item.company_code, className: "text-left" },
            { value: item.company_name, className: "text-left" },
            {
              value:
                (item.addr_alley || "") +
                " " +
                (item.addr_number || "") +
                " " +
                (item.addr_street || "") +
                " " +
                (item.addr_subdistrict || "") +
                " " +
                (item.addr_district || "") +
                " " +
                (item.addr_province || "") +
                " " +
                (item.addr_postcode || ""),
              className: "text-left",
            },
          ],
          data: item,
        })
      );
      setData(formattedData);
    } else {
      setData([]); // ตั้งค่าว่างหากไม่มีข้อมูล
    }
    // เพิ่ม page และ pageSize ใน dependency array เพื่อให้ useEffect ทำงานใหม่เมื่อมีการเปลี่ยนหน้า
  }, [dataCompanies, page, pageSize]);

  const headers = [
    { label: "ลำดับที่", colSpan: 1, className: "w-20 min-w-20" },
    { label: "รหัสสาขา", colSpan: 1, className: "w-3/12 min-w-20" },
    { label: "ชื่อสาขา", colSpan: 1, className: "w-3/12" },
    { label: "ที่อยู่", colSpan: 1, className: "w-6/12" },
    { label: "แก้ไข", colSpan: 1, className: "min-w-14" },
    { label: "ลบ", colSpan: 1, className: "min-w-14" },
  ];

  //handle
  useEffect(() => {
    if (searchText === "") {
      setSearchTextDebouce(searchText);
      refetchCompanies();
    }
  }, [searchText]);

  const handleSearch = () => {
    setSearchTextDebouce(searchText);
    refetchCompanies();
  };



  //เปิด
  const handleCreateOpen = () => {
    setCompanysName("");
    setAddr_number("");
    setAddr_alley("");
    setAddr_street("");
    setAddr_subdistrict("");
    setAddr_district("");
    setAddr_province("");
    setAddr_postcode("");
    setCompany_code("");
    setTax_status("false");
    setTel_number("");
    setIsCreateDialogOpen(true);
    setCompany_tin("");
    setPromtpay_id("");
  };
  const handleEditOpen = (item: Type_MS_Companies_Response) => {
    setSelectedItem(item);
    setCompanysName(item.company_name ?? "");
    setCompany_code(item.company_code ?? "");
    setTel_number(item.tel_number ?? "");
    setAddr_number(item.addr_number ?? "");
    setAddr_alley(item.addr_alley ?? "");
    setAddr_street(item.addr_street ?? "");
    setAddr_subdistrict(item.addr_subdistrict ?? "");
    setAddr_district(item.addr_district ?? "");
    setAddr_province(item.addr_province ?? "");
    setAddr_postcode(item.addr_postcode ?? "");
    setTax_status(item.tax_status ?? "");
    setCompany_tin(item.company_tin ?? "");
    setPromtpay_id(item.promtpay_id ?? "");
    setIsEditDialogOpen(true);
  };
  const handleDeleteOpen = (item: Type_MS_Companies_Response) => {
    setSelectedItem(item);
    setIsDeleteDialogOpen(true);
  };

  //ปิด
  const handleCreateClose = () => {
    setIsCreateDialogOpen(false);
    setCompanysName("");
    setAddr_number("");
    setAddr_alley("");
    setAddr_street("");
    setAddr_subdistrict("");
    setAddr_district("");
    setAddr_province("");
    setAddr_postcode("");
    setCompany_code("");
    setTax_status("");
    setTel_number("");
    setCompany_tin("");
    setPromtpay_id("");
  };
  const handleEditClose = () => {
    setIsEditDialogOpen(false);
  };
  const handleDeleteClose = () => {
    setIsDeleteDialogOpen(false);
  };

  //ยืนยันไดอะล็อค
  const handleConfirm = async () => {
    if (!company_code) {
      showToast("กรุณาระบุรหัสสาขา", false);
      return;
    }

    if (!companysName) {
      showToast("กรุณาระบุชื่อสาขา", false);
      return;
    }

    


    try {
      const response = await postMsCompanies({
        company_name: companysName,
        company_code: company_code,
        tax_status: tax_status,
        tel_number: tel_number,
        addr_number: addr_number,
        addr_alley: addr_alley,
        addr_street: addr_street,
        addr_subdistrict: addr_subdistrict,
        addr_district: addr_district,
        addr_province: addr_province,
        addr_postcode: addr_postcode,
        company_tin: company_tin,
        promtpay_id: promtpay_id
      });

      if (response.statusCode === 200) {
        handleCreateClose();
        showToast("สร้างรายการชื่อสาขาเรียบร้อยแล้ว", true);
        refetchCompanies();
      } else {
        showToast("เกิดข้อผิดพลาดในการสร้างข้อมูล", false);
      }
    } catch (error) {
      showToast("ไม่สามารถสร้างรายการชื่อสาขาได้", false);
    }
  };

  const handleEditConfirm = async () => {
    if (!companysName) {
      showToast("กรุณาระบุชื่อชื่อสาขา", false);

      return;
    }
    if (!selectedItem) {
      showToast("กรุณาระบุชื่อชื่อสาขา", false);
      return;
    }
    if (!company_code) {
      showToast("กรุณาระบุรหัสสาขา", false);
    }
    

    try {
      const response = await updateMsCompanies(selectedItem.company_id, {
        company_name: companysName,
        company_code: company_code,
        tax_status: tax_status,
        tel_number: tel_number,
        addr_number: addr_number,
        addr_alley: addr_alley,
        addr_street: addr_street,
        addr_subdistrict: addr_subdistrict,
        addr_district: addr_district,
        addr_province: addr_province,
        addr_postcode: addr_postcode, 
        company_tin: company_tin,
        promtpay_id: promtpay_id
      });

      if (response.statusCode === 200) {
        showToast("แก้ไขรายการชื่อสาขาเรียบร้อยแล้ว", true);
        setCompanysName("");

        setIsEditDialogOpen(false);
        refetchCompanies();
        setCompany_code("");
      } else {
        showToast("ข้อมูลนี้มีอยู่แล้ว", false);
        //showToast(`${response.message}`, false);
      }
    } catch (error) {
      showToast("ไม่สามารถแก้ไขรายการชื่อสาขาได้", false);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!selectedItem || !selectedItem.company_name) {
      showToast("กรุณาระบุรายการชื่อสาขาที่ต้องการลบ", false);
      return;
    }

    try {
      const response = await deleteMsCompanies(selectedItem.company_id);

      if (response.statusCode === 200) {
        showToast("ลบรายการชื่อสาขาเรียบร้อยแล้ว", true);
        setIsDeleteDialogOpen(false);
        refetchCompanies();
      } else {
        showToast("ไม่สามารถลบรายการชื่อสาขาได้", false);
      }
    } catch (error) {
      showToast("ไม่สามารถลบรายการชื่อสาขาได้", false);
    }
  };

  return (
    <div>
      <MasterTableFeature
        title="สาขา"
        titleBtnName="สร้างสาขา"
        inputs={[
          {
            id: "search_input",
            value: searchText,
            size: "3",
            placeholder: "ค้นหา ชื่อสาขา รหัสสาขา",
            onChange: setSearchText,
            onAction: handleSearch,
          },
        ]}
        onSearch={handleSearch}
        headers={headers}
        rowData={data}
        totalData={dataCompanies?.responseObject?.totalCount}
        onEdit={handleEditOpen}
        onDelete={handleDeleteOpen}
        onPopCreate={handleCreateOpen}
      />

      {/* สร้าง */}
      <DialogComponent
        isOpen={isCreateDialogOpen}
        onClose={handleCreateClose}
        title="สร้างสาขา"
        onConfirm={handleConfirm}
        confirmText="บันทึกข้อมูล"
        cancelText="ยกเลิก"
      >
        <div className="flex flex-col gap-3 items-left">
          <InputAction
            id="company_code"
            placeholder="ระบุรหัสสาขา"
            onChange={(e) => setCompany_code(e.target.value)}
            value={company_code}
            label="รหัสสาขา"
            labelOrientation="horizontal"
            onAction={handleConfirm}
            classNameLabel="w-20 min-w-20 flex justify-end"
            classNameInput="w-full"
            nextFields={{down: "company_tin"}}
          />
          <InputAction
          id="company_tin"
          placeholder="เลขประจําตัวผู้เสียภาษี"
          onChange={(e) => setCompany_tin(e.target.value)}
          value={company_tin}
          label="เลขประจําตัว"
          labelOrientation="horizontal"
          onAction={handleConfirm}
          classNameLabel="w-20 min-w-20 flex justify-end"
          classNameInput="w-full"
          maxLength={13}
          nextFields={{up: "company_code", down: "issue-reason-create"}}
        />
        </div>
        <div className="flex flex-col gap-3 items-left">
          <InputAction
            id="issue-reason-create"
            placeholder="ระบุสาขา"
            onChange={(e) => setCompanysName(e.target.value)}
            value={companysName}
            label="ชื่อสาขา"
            labelOrientation="horizontal"
            onAction={handleConfirm}
            classNameLabel="w-20 min-w-20 flex justify-end"
            classNameInput="w-full"
            nextFields={{up: "company_tin", down: "เลขที่"}}
          />
        </div>

        <div className="flex flex-col gap-3 items-left">
          <InputAction
            id="เลขที่"
            placeholder="เลขที่"
            onChange={(e) => setAddr_number(e.target.value)}
            value={addr_number}
            label="ที่อยู่"
            labelOrientation="horizontal"
            onAction={handleConfirm}
            classNameLabel="w-20 min-w-20 flex justify-end"
            classNameInput="w-full"
            nextFields={{up: "issue-reason-create", down: "ซอย"}}
          />
          <InputAction
            id="ซอย"
            placeholder="ซอย"
            onChange={(e) => setAddr_alley(e.target.value)}
            value={addr_alley}
            label="ซอย"
            labelOrientation="horizontal"
            onAction={handleConfirm}
            classNameLabel="w-20 min-w-20 flex justify-end"
            classNameInput="w-full"
            nextFields={{up: "เลขที่", down: "ถนน"}}
          />
          <InputAction
            id="ถนน"
            placeholder="ถนน"
            onChange={(e) => setAddr_street(e.target.value)}
            value={addr_street}
            label="ถนน"
            labelOrientation="horizontal"
            onAction={handleConfirm}
            classNameLabel="w-20 min-w-20 flex justify-end"
            classNameInput="w-full"
            nextFields={{up: "ซอย", down: "ตำบล"}}
          />
          <InputAction
            id="ตำบล"
            placeholder="ตำบล"
            onChange={(e) => setAddr_subdistrict(e.target.value)}
            value={addr_subdistrict}
            label="ตำบล"
            labelOrientation="horizontal"
            onAction={handleConfirm}
            classNameLabel="w-20 min-w-20 flex justify-end"
            classNameInput="w-full"
            nextFields={{up: "ถนน", down: "อำเภอ"}}
          />
          <InputAction
            id="อำเภอ"
            placeholder="อำเภอ"
            onChange={(e) => setAddr_district(e.target.value)}
            value={addr_district}
            label="อำเภอ"
            labelOrientation="horizontal"
            onAction={handleConfirm}
            classNameLabel="w-20 min-w-20 flex justify-end"
            classNameInput="w-full"
            nextFields={{up: "ตำบล", down: "จังหวัด"}}
          />
          <InputAction
            id="จังหวัด"
            placeholder="จังหวัด"
            onChange={(e) => setAddr_province(e.target.value)}
            value={addr_province}
            label="จังหวัด"
            labelOrientation="horizontal"
            onAction={handleConfirm}
            classNameLabel="w-20 min-w-20 flex justify-end"
            classNameInput="w-full"
            nextFields={{up: "อำเภอ", down: "รหัสไปรษณีย์"}}
          />
          <InputAction
            id="รหัสไปรษณีย์"
            placeholder="รหัสไปรษณีย์"
            onChange={(e) => {
              const value = e.target.value.replace(/\D/g, ""); // กรองเฉพาะตัวเลข
              setAddr_postcode(value);
            }}
            value={addr_postcode}
            label="รหัสไปรษณีย์"
            labelOrientation="horizontal"
            onAction={handleConfirm}
            classNameLabel="w-30 min-w-30 flex justify-end whitespace-nowrap" 
            classNameInput="w-full"
            type="text"
            maxLength={5}
            nextFields={{up: "จังหวัด", down: "phone"}}
          />
        </div>
        <div className="flex flex-col gap-3 items-left">
          <InputAction
            id="phone"
            placeholder="เบอร์โทร"
            onChange={(e) => {
              const value = e.target.value.replace(/\D/g, ""); // กรองเฉพาะตัวเลข
              if (value.length <= 10) setTel_number(value);
            }}
            value={tel_number}
            label="เบอร์โทร"
            labelOrientation="horizontal"
            classNameLabel="w-20 min-w-20 flex justify-end"
            classNameInput="w-full"
            type="text"
            maxLength={10}
            nextFields={{up: "รหัสไปรษณีย์", down: "พร้อมเพย์"}}
          />
           <InputAction
            id="พร้อมเพย์"
            placeholder="พร้อมเพย์"
            onChange={(e) => {
              const value = e.target.value.replace(/\D/g, ""); // กรองเฉพาะตัวเลข
              setPromtpay_id(value);
            }}
            value={promtpay_id}
            label="พร้อมเพย์"
            labelOrientation="horizontal"
            classNameLabel="w-20 min-w-20 flex justify-end"
            classNameInput="w-full"
            type="text"
            maxLength={13}
            nextFields={{up: "phone", down: "price_tax"}}
          />
        
        </div>
        

        <div className="flex mb-3 gap-3 items-left">
      <RadioMainComponent
        id="price_tax"
        labelName="ราคารวมภาษี"
        value="false"
        selectedValue={tax_status} // ใช้ค่า taxStatus
        onSelectedChange={(value) => setTax_status(value)} // อัพเดต state
        name="tax-option"
        nextFields={{up: "พร้อมเพย์", down: "price"}}
      />
      <RadioMainComponent
        id="price"
        labelName="ราคาไม่รวมภาษี"
        value="true"
        selectedValue={tax_status} // ใช้ค่า taxStatus
        onSelectedChange={(value) => setTax_status(value)} // อัพเดต state
        name="tax-option"
        nextFields={{up: "price_tax"}}
      />
    </div>
      </DialogComponent>

      {/* แก้ไข */}
      <DialogComponent
        isOpen={isEditDialogOpen}
        onClose={handleEditClose}
        title="แก้ไขสาขา"
        onConfirm={handleEditConfirm}
        confirmText="บันทึกข้อมูล"
        cancelText="ยกเลิก"
      >
        <div className="flex flex-col gap-3 items-left">
          <InputAction
            id="รหัสสาขา"
            placeholder={selectedItem ? selectedItem.company_code : "ระบุสาขา"}
            onChange={(e) => setCompany_code(e.target.value)}
            value={company_code}
            label="รหัสสาขา"
            labelOrientation="horizontal"
            defaultValue={selectedItem ? selectedItem.company_code : ""}
            onAction={handleEditConfirm}
            classNameLabel="w-20 min-w-20 flex justify-end"
            classNameInput="w-full"
            nextFields={{down: "company_tin"}}
          />
           <InputAction
          id="company_tin"
          placeholder="เลขประจําตัวผู้เสียภาษี"
          onChange={(e) => setCompany_tin(e.target.value)}
          value={company_tin}
          label="เลขประจําตัว"
          labelOrientation="horizontal"
          onAction={handleConfirm}
          classNameLabel="w-20 min-w-20 flex justify-end"
          classNameInput="w-full"
          maxLength={13}
          nextFields={{up: "รหัสสาขา", down: "company_name"}}
        />
        </div>

        <div className="flex flex-col gap-3 items-left">
          <InputAction
            id="company_name"
            placeholder={selectedItem ? selectedItem.company_name : "ระบุสาขา"}
            onChange={(e) => setCompanysName(e.target.value)}
            value={companysName}
            label="สาขา"
            labelOrientation="horizontal"
            defaultValue={selectedItem ? selectedItem.company_name : ""}
            onAction={handleEditConfirm}
            classNameLabel="w-20 min-w-20 flex justify-end"
            classNameInput="w-full"
            nextFields={{up: "company_tin", down: "เลขที่"}}
          />
        </div>

        <div>
          <div className="flex flex-col gap-3 items-left">
            <InputAction
              id="เลขที่"
              placeholder="เลขที่"
              onChange={(e) => setAddr_number(e.target.value)}
              value={addr_number}
              label="ที่อยู่"
              labelOrientation="horizontal"
              onAction={handleConfirm}
              classNameLabel="w-20 min-w-20 flex justify-end"
              classNameInput="w-full"
              nextFields={{up: "company_name", down: "ซอย"}}
            />
            <InputAction
              id="ซอย"
              placeholder="ซอย"
              onChange={(e) => setAddr_alley(e.target.value)}
              value={addr_alley}
              label="ซอย"
              labelOrientation="horizontal"
              onAction={handleConfirm}
              classNameLabel="w-20 min-w-20 flex justify-end"
              classNameInput="w-full"
              nextFields={{up: "เลขที่", down: "ถนน"}}
            />
            <InputAction
              id="ถนน"
              placeholder="ถนน"
              onChange={(e) => setAddr_street(e.target.value)}
              value={addr_street}
              label="ถนน"
              labelOrientation="horizontal"
              onAction={handleConfirm}
              classNameLabel="w-20 min-w-20 flex justify-end"
              classNameInput="w-full"
              nextFields={{up: "ซอย", down: "ตำบล"}}
            />
            <InputAction
              id="ตำบล"
              placeholder="ตำบล"
              onChange={(e) => setAddr_subdistrict(e.target.value)}
              value={addr_subdistrict}
              label="ตำบล"
              labelOrientation="horizontal"
              onAction={handleConfirm}
              classNameLabel="w-20 min-w-20 flex justify-end"
              classNameInput="w-full"
              nextFields={{up: "ถนน", down: "อำเภอ"}}
            />
            <InputAction
              id="อำเภอ"
              placeholder="อำเภอ"
              onChange={(e) => setAddr_district(e.target.value)}
              value={addr_district}
              label="อำเภอ"
              labelOrientation="horizontal"
              onAction={handleConfirm}
              classNameLabel="w-20 min-w-20 flex justify-end"
              classNameInput="w-full"
              nextFields={{up: "ตำบล", down: "จังหวัด"}}
            />
            <InputAction
              id="จังหวัด"
              placeholder="จังหวัด"
              onChange={(e) => setAddr_province(e.target.value)}
              value={addr_province}
              label="จังหวัด"
              labelOrientation="horizontal"
              onAction={handleConfirm}
              classNameLabel="w-20 min-w-20 flex justify-end"
              classNameInput="w-full"
              nextFields={{up: "อำเภอ", down: "รหัสไปรษณีย์"}}
            />
            <InputAction
              id="รหัสไปรษณีย์"
              placeholder="รหัสไปรษณีย์"
              onChange={(e) => {
                const value = e.target.value.replace(/\D/g, ""); // กรองเฉพาะตัวเลข
                setAddr_postcode(value);
              }}
              value={addr_postcode}
              label="รหัสไปรษณีย์"
              labelOrientation="horizontal"
              onAction={handleConfirm}
              classNameLabel="w-30 min-w-30 flex justify-end whitespace-nowrap" 
              classNameInput="w-full"
              maxLength={5}
              nextFields={{up: "จังหวัด", down: "phone"}}
            />
          </div>
        </div>
        <div className="flex flex-col gap-3 items-left">
          <InputAction
            id="phone"
            placeholder="เบอร์โทร"
            onChange={(e) => {
              const value = e.target.value.replace(/\D/g, ""); // กรองเฉพาะตัวเลข
              if (value.length <= 10) setTel_number(value);
            }}
            value={tel_number}
            label="เบอร์โทร"
            labelOrientation="horizontal"
            onAction={() => {
              if (tel_number.length < 10) {
                alert("กรุณาระบุเบอร์โทรให้ครบ 10 หลัก");
                return;
              }
              handleConfirm();
            }}
            classNameLabel="w-20 min-w-20 flex justify-end"
            classNameInput="w-full"
            type="text"
            maxLength={10}
            nextFields={{up: "รหัสไปรษณีย์", down: "พร้อมเพย์"}}
          />
           <InputAction
            id="พร้อมเพย์"
            placeholder="พร้อมเพย์"
            onChange={(e) => {
              const value = e.target.value.replace(/\D/g, ""); // กรองเฉพาะตัวเลข
              setPromtpay_id(value);
            }}
            value={promtpay_id}
            label="พร้อมเพย์"
            labelOrientation="horizontal"
            classNameLabel="w-20 min-w-20 flex justify-end"
            classNameInput="w-full"
            type="text"
            maxLength={13}
            nextFields={{up: "phone", down: "price_tax"}}
          />
        </div>

        <div className="flex mb-3 gap-3 items-left">
        <RadioMainComponent
        id="price_tax"
        labelName="ราคารวมภาษี"
        value="false"
        selectedValue={tax_status} // ใช้ค่า taxStatus
        onSelectedChange={(value) => setTax_status(value)} // อัพเดต state
        name="tax-option"
        nextFields={{up: "พร้อมเพย์", down: "price"}}
      />
      <RadioMainComponent
        id="price"
        labelName="ราคาไม่รวมภาษี"
        value="true"
        selectedValue={tax_status} // ใช้ค่า taxStatus
        onSelectedChange={(value) => setTax_status(value)} // อัพเดต state
        name="tax-option"
        nextFields={{up: "price_tax"}}
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
          ชื่อสาขา :{" "}
          <span className="text-red-500">{selectedItem?.company_name} </span>
        </p>
      </DialogComponent>
    </div>
  );
}
