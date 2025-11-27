import { useEffect, useState } from "react";
import MasterTableFeature from "@/components/customs/display/master.main.component";
import DialogComponent from "@/components/customs/dialog/dialog.main.component";
import InputAction from "@/components/customs/input/input.main.component";
import { getAllCustomerData } from "@/services/ms.customer";
import { getCustomerVisit, createCustomerVisit, updateCustomerVisit, deleteCustomerVisit, getCustomerVisitById } from "@/services/customer.visit"
import { useToast } from "@/components/customs/alert/toast.main.component";
import { TypeCustomerVisitAll } from "@/types/response/response.customer-visit";
import { useNavigate } from "react-router-dom";
import { useSearchParams } from "react-router-dom";
import { useCustomerVisit } from "@/hooks/useCustomerVisit";
import MasterSelectComponent from "@/components/customs/select/select.main.component";
import dayjs from "dayjs";
import { MS_CUSTOMER_ALL, CustomerSelectItem } from "@/types/response/response.ms_customer";
import { DateShortTH } from "@/utils/formatDate";
import { useCustomerSelect } from "@/hooks/useSelect";

// import "dayjs/locale/th";
// dayjs.locale("th");
type dataTableType = {
    className: string;
    cells: {
        value: any;
        className: string;
    }[];
    data: TypeCustomerVisitAll;
}[];
export default function CustomerVisitiFeature() {
    const [searchText, setSearchText] = useState("");

    // const [positionName, setPositionName] = useState("");
    const [data, setData] = useState<dataTableType>([]);

    const [isCreateDialogOpen, setIsCreateDialogOpen] = useState<boolean>(false);
    const [isEditDialogOpen, setIsEditDialogOpen] = useState<boolean>(false);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState<boolean>(false);
    const [selectedItem, setSelectedItem] = useState<TypeCustomerVisitAll | null>(null);

    const [selectedOption, setSelectedOption] = useState<string | null>(null);
    const [selectedOptionData, setSelectedOptionData] = useState<MS_CUSTOMER_ALL>();
    const [customersData, setCustomersData] = useState<MS_CUSTOMER_ALL[]>();


    const navigate = useNavigate();
    const { showToast } = useToast();

    const [searchParams, setSearchParams] = useSearchParams();
    const page = searchParams.get("page") ?? "1";
    const pageSize = searchParams.get("pageSize") ?? "25";
    const [searchTextDebouce, setSearchTextDebouce] = useState("");
    const [searchCustomer, setSearchCustomer] = useState("");
    const { data: CustomerVisitData, refetch: refetchCustomerVisitData } = useCustomerVisit({
        page: page,
        pageSize: pageSize,
        searchText: searchTextDebouce,
    });

    useEffect(() => {
        getAllCustomerData().then((res) => {
            setCustomersData(res.responseObject);
        });
    }, []);

    useEffect(() => {
        if (CustomerVisitData?.responseObject?.data) {
            const formattedData = CustomerVisitData?.responseObject?.data.map((item: TypeCustomerVisitAll, index: number) => {
                const addrNum = item.addr_number === null || item.addr_number === "" ? "-" : item.addr_number;
                const addrAlley = item.addr_alley === null || item.addr_alley === "" ? "-" : item.addr_alley;
                const addrStreet = item.addr_street === null || item.addr_street === "" ? "-" : item.addr_street;
                const addrSubdistrict = item.addr_subdistrict === null || item.addr_subdistrict === "" ? "-" : item.addr_subdistrict;
                const addrDistrict = item.addr_district === null || item.addr_district === "" ? "-" : item.addr_district;
                const addrProvince = item.addr_province === null || item.addr_province === "" ? "-" : item.addr_province;
                const addrPostcode = item.addr_postcode === null || item.addr_postcode === "" ? "-" : item.addr_postcode;
                const fullAddress = `เลขที่ ${addrNum} ซอย${addrAlley} ถนน${addrStreet} ต.${addrSubdistrict} อ.${addrDistrict} จ.${addrProvince} ${addrPostcode}`;
                // const nextDate = item.next_date ? dayjs(item.next_date).format("DD/MM/YYYY") : "-";
                // const nextDate = item.next_date ? dayjs(item.next_date).format("YYYY-MM-DD") : "-";
                const cusName = item.customer_name ? item.customer_name : "-";
                return {
                    className: "",
                    cells: [
                        { value: item.customer_visit_doc, className: "text-center" },
                        { value: item.customer_code, className: "text-left" },
                        { value: cusName, className: "text-left" },
                        { value: item.date_go ? DateShortTH(new Date(item.date_go)) : "-", className: "text-center" },
                        { value: item.next_date ? DateShortTH(new Date(item.next_date)) : "-", className: "text-center" },
                        { value: fullAddress, className: "text-left" }, // เพิ่มที่อยู่ในรูปแบบเต็ม
                    ],
                    data: item,
                };
            });
            setData(formattedData);
        }
    }, [CustomerVisitData]);
    useEffect(() => {
        if (searchText === "") {
            setSearchTextDebouce("");
            setSearchParams({ page: "1", pageSize: pageSize });
            refetchCustomerVisitData();
        }
    }, [searchText]);


    const handleSearch = () => {
        searchParams.set("pageSize", pageSize ?? "25");
        searchParams.set("page", "1");
        setSearchParams({ page: "1", pageSize: pageSize });
        if (searchText) {
            setSearchTextDebouce(searchText);
        }
        refetchCustomerVisitData();
    };


    const headers = [
        { label: "เลขที่เอกสาร", colSpan: 1, className: "w-2/12 min-w-14" },
        { label: "รหัสลูกค้า", colSpan: 1, className: "w-2/12 min-w-20" },
        { label: "ชื่อกิจการ", colSpan: 1, className: "w-2/12" },
        { label: "วันที่ไป", colSpan: 1, className: "w-2/12" },
        { label: "วันนัดถัดไป", colSpan: 1, className: "w-2/12" },
        { label: "ที่อยู่", colSpan: 1, className: "w-full" },
        { label: "แก้ไข", colSpan: 1, className: "min-w-14" },
        // { label: "ลบ", colSpan: 1, className: "min-w-14" },
    ];

    //handle


    const handleClickToNavigate = (customer_visit_id: any) => {
        navigate(`/visiting-customers/create`, { state: { customer_visit_id } });
    };



    //เปิด
    const handleCreateOpen = () => {
        setIsCreateDialogOpen(true);
    };
    const handleEditOpen = (item: TypeCustomerVisitAll) => {
        setSelectedItem(item);
        setIsEditDialogOpen(true);
        handleClickToNavigate(item.customer_visit_id);
    };
    const handleDeleteOpen = (item: TypeCustomerVisitAll) => {
        setSelectedItem(item);
        setIsDeleteDialogOpen(true);
    }


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
    const handleConfirm = async () => {
        if (!selectedOption || !selectedOptionData) {
            showToast("กรุณาระบุรหัสลูกค้าให้ครบถ้วน", false);
            return;
        }
        try {
            const response = await createCustomerVisit({
                customer_id: selectedOption,
            });

            if (response.statusCode === 200) {
                setSelectedOption(null);
                handleCreateClose();
                showToast("สร้างรายการเยี่ยมลูกค้าเรียบร้อยแล้ว", true);

                const customerVisitId = response.responseObject?.customer_visit_id;
                if (customerVisitId) {
                    handleClickToNavigate(customerVisitId);
                } else {
                    console.error("customer_visit_id is missing in responseObject");
                    showToast("ไม่สามารถสร้างรายการเยี่ยมลูกค้าได้: ไม่มี customer_visit_id", false);
                }
            } else {
                showToast("ไม่สามารถสร้างรายการเยี่ยมลูกค้าได้: " + response.message, false);
            }
        } catch (error) {
            console.error("Error while creating customer visit:", error);
            showToast("ไม่สามารถสร้างรายการเยี่ยมลูกค้าได้", false);
        }
    };


    const handleEditConfirm = async () => {
        if (!selectedOption) {
            showToast("กรุณาระบุรหัสลูกค้า", false);
            return;
        }
        try {
            const response = await updateCustomerVisit({
                customer_visit_id: selectedOption,
            });

            if (response.statusCode === 200) {
                const CusVisitId = response.responseObject?.customer_visit_id; // เข้าถึง customer_visit_id จากรายการแรกใน data
                showToast("แก้ไขรายการตำแหน่งเรียบร้อยแล้ว", true);
                setIsEditDialogOpen(false);
                refetchCustomerVisitData();
                handleClickToNavigate(CusVisitId);
            } else {
                if (response.message === "Position already taken") {
                    showToast("รายการตำแหน่งนี้มีอยู่แล้ว", false);
                }
            }
        } catch {
            showToast("ไม่สามารถแก้ไขรายการเยี่ยมลูกค้าได้", false);
        }
    };
    const handleDeleteConfirm = async () => {
        if (!selectedItem || !selectedItem.customer_visit_id) {
            showToast("กรุณาระบุรายการเยี่ยมลูกค้าที่ต้องการลบ", false);
            return;
        }

        try {
            const response = await deleteCustomerVisit(selectedItem.customer_visit_id);

            if (response.statusCode === 200) {
                showToast("ลบรายการเยี่ยมลูกค้าเรียบร้อยแล้ว", true);
                setIsDeleteDialogOpen(false);
                refetchCustomerVisitData();
            } else {
                showToast("ไม่สามารถลบรายการเยี่ยมลูกค้าได้", false);
            }
        } catch (error) {
            showToast("ไม่สามารถลบรายการเยี่ยมลูกค้าได้", false);
        }
    };

    const { data: dataCustomer, refetch: refetchCustomer } = useCustomerSelect({
          searchText: searchCustomer,
        });
    
      const fetchDataCustomerDropdown = async () => {
        const customerList = dataCustomer?.responseObject?.data ?? [];
        return {
          responseObject: customerList.map((item: CustomerSelectItem) => ({
            customer_id: item.customer_id,
            customer_code: item.customer_code,
          })),
        };
      };
    
      const handleCustomerSearch = (searchText: string) => {
        setSearchCustomer(searchText);
        refetchCustomer();
      };

    return (
        <div>
            <div className=" p-2 ">
            <MasterTableFeature
                title="เยี่ยมลูกค้า"
                titleBtnName="สร้างรายการเยี่ยมลูกค้า"
                inputs={[
                    {
                        id: "search_input",
                        value: searchText,
                        size: "3",
                        placeholder: "ค้นหา เลขที่เอกสาร รหัสลูกค้า ชื่อกิจการ",
                        onChange: setSearchText,
                        onAction: handleSearch,
                    },
                ]}
                onSearch={handleSearch}
                headers={headers}
                rowData={data}
                totalData={CustomerVisitData?.responseObject?.totalCount}
                onEdit={handleEditOpen}
                // onDelete={handleDeleteOpen}
                onPopCreate={handleCreateOpen}
            />
            </div>

            {/* สร้าง */}
            <DialogComponent
                isOpen={isCreateDialogOpen}
                onClose={handleCreateClose}
                title="สร้างรายการเยียมลูกค้า"
                onConfirm={handleConfirm}
                confirmText="บันทึกข้อมูล"
                cancelText="ยกเลิก"
            >
                <div className="flex flex-col gap-3 items-left">
                    {/* <InputAction
                        id="position-create"
                        placeholder="ระบุตำแหน่ง"
                        onChange={(e) => setPositionName(e.target.value)}
                        label="ชื่อตำแหน่ง"
                        labelOrientation="horizontal"
                        onAction={handleConfirm}
                        classNameLabel="w-20 min-w-20 flex justify-end"
                        classNameInput="w-full"
                    /> */}
                    <MasterSelectComponent
                        onChange={(option) => {
                            const value = option ? String(option.value) : null;
                            setSelectedOption(value);
                            const customer = customersData?.filter(
                                (customer) => customer.customer_id === value
                            );
                            if (customer && customer?.length > 0) {
                                setSelectedOptionData(customer[0]);
                            }
                        }}
                        //fetchDataFromGetAPI={getAllCustomerData}
                        fetchDataFromGetAPI={fetchDataCustomerDropdown}
                        onInputChange={handleCustomerSearch}
                        valueKey="customer_id"
                        labelKey="customer_code"
                        placeholder="กรุณาเลือก..."
                        isClearable={true}
                        label="รหัสลูกค้า"
                        labelOrientation="horizontal"
                        classNameLabel="w-20 min-w-20 flex justify-end"
                        classNameSelect="w-full"
                    />
                </div>
            </DialogComponent>

            {/* แก้ไข */}
            <DialogComponent
                isOpen={isEditDialogOpen}
                onClose={handleEditClose}
                title="แก้ไขรายการเยี่ยมลูกค้า"
                onConfirm={handleEditConfirm}
                confirmText="บันทึกข้อมูล"
                cancelText="ยกเลิก"
            >
                <div className="flex flex-col gap-3 items-left">
                    {/* <InputAction
                        id="customer-visit-edit"
                        defaultValue={positionName ? positionName : "ระบุเยี่ยมลูกค้า"}
                        onChange={(e) => setPositionName(e.target.value)}
                        label="รหัสลูกค้า"
                        labelOrientation="horizontal"
                        onAction={handleEditConfirm}
                        classNameLabel="w-20 min-w-20 flex justify-end"
                        classNameInput="w-full"
                    /> */}

                </div>
            </DialogComponent>

            {/* ลบ */}
            {/* <DialogComponent
                isOpen={isDeleteDialogOpen}
                onClose={handleDeleteClose}
                title="ยืนยันการลบ"
                onConfirm={handleDeleteConfirm}
                confirmText="ยืนยัน"
                cancelText="ยกเลิก"
            >
                <p>คุณแน่ใจหรือไม่ว่าต้องการลบรายการนี้? <br />
                    ชื่อตำแหน่ง : <span className="text-red-500">{selectedItem?.customer_code} </span></p>
            </DialogComponent> */}
        </div>
    )
}
