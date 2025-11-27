import { useState, useEffect } from "react";
import { TypeSupplierDeliveryNoteAll, TypeMasterSupplierIdCode } from "@/types/response/response.supplier-delivery-note";
import { getSupplierDeliveryNoteAll, createSupplierDeliveryNote, updateSupplierDeliveryNote, deleteSupplierDeliveryNote, getSupplierDeliveryNoteById } from "@/services/supplier-delivery-note.service.";
import { getAllSupplierDeliveryNoteData } from "@/services/supplier-delivery-note.service.";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/customs/alert/toast.main.component";
import MasterTableFeature from "@/components/customs/display/master.main.component";
import DialogComponent from "@/components/customs/dialog/dialog.main.component";
import InputAction from "@/components/customs/input/input.main.component";
import MasterSelectComponent from "@/components/customs/select/select.main.component";
import { useSearchParams } from "react-router-dom";
import { useSupplierDeliveryNote } from "@/hooks/useSupplierDeliveryNote";
import { DateShortTH } from "@/utils/formatDate";
import { useSupplierSelect } from "@/hooks/useSelect";
import { SupplierSelectItem } from "@/types/response/response.supplier-delivery-note";

type dataTableType = {
    className: string;
    cells: {
        value: any;
        className: string;
    }[];
    data: TypeSupplierDeliveryNoteAll;
}[];

// +++ เพิ่มฟังก์ชันสำหรับจัดรูปแบบตัวเลขเป็นสกุลเงิน +++
const formatCurrency = (amount: number | null | undefined): string => {
    // ตรวจสอบว่าเป็นตัวเลขที่ถูกต้องหรือไม่ ถ้าไม่ใช่หรือเป็น 0 ให้คืนค่าเป็น "-"
    if (typeof amount !== 'number' || amount === 0) {
      return "-";
    }
    // ใช้ toLocaleString เพื่อเพิ่ม comma และกำหนดให้มีทศนิยม 2 ตำแหน่งเสมอ
    return amount.toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
};


const SupplierDeliveryNoteFeatures = () => {
    const [data, setData] = useState<dataTableType>([]);
    const [searchText, setSearchText] = useState("");

    const [isCreateDialogOpen, setIsCreateDialogOpen] = useState<boolean>(false);
    const [isEditDialogOpen, setIsEditDialogOpen] = useState<boolean>(false);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState<boolean>(false);
    const [selectedItem, setSelectedItem] = useState<TypeSupplierDeliveryNoteAll | null>(null);
    const { showToast } = useToast();

    const [selectedOption, setSelectedOption] = useState<string | null>(null);
    const [supplierData, setSupplierData] = useState<TypeMasterSupplierIdCode[]>();
    const [searchSupplier, setSearchSupplier] = useState("");


    const navigate = useNavigate();


    const [searchParams, setSearchParams] = useSearchParams();
    const page = searchParams.get("page") ?? "1";
    const pageSize = searchParams.get("pageSize") ?? "25";
    const [searchTextDebouce, setSearchTextDebouce] = useState("");
    const { data: SupplierData, refetch: refetchSupplier } = useSupplierDeliveryNote({
        page: page,
        pageSize: pageSize,
        searchText: searchTextDebouce,
    });
    useEffect(() => {
        if (SupplierData?.responseObject?.data) {
            const formattedData = SupplierData?.responseObject?.data.map((item: TypeSupplierDeliveryNoteAll, index: number) => ({
                className: "",
                cells: [
                    // { value: (parseInt(page) - 1) * parseInt(pageSize) + index + 1, className: "text-center" },
                    { value: item.supplier_delivery_note_doc ?? "-", className: "text-center" },
                    { value: item.master_supplier?.supplier_code ?? "-", className: "text-left" },
                    { value: item.date_of_submission ? DateShortTH(item.date_of_submission) : "-", className: "text-center" },
                    { value: item.due_date ? DateShortTH(item.due_date) : "-", className: "text-center" },
                    {
                        // +++ แก้ไขตรงนี้: เรียกใช้ฟังก์ชัน formatCurrency +++
                        value: formatCurrency(item.amount),
                        className: "text-right"
                    },
                    { value: item.status ?? "-", className: "text-center",type:"badge-status" },
                ],
                data: item,
            }));
            setData(formattedData);
        }
    }, [SupplierData]);
    useEffect(() => {
        if (searchText === "") {
            setSearchTextDebouce("");
            setSearchParams({ page: "1", pageSize: pageSize });
            refetchSupplier();
        }
    }, [searchText]);


    const handleSearch = () => {
        searchParams.set("pageSize", pageSize ?? "25");
        searchParams.set("page", "1");
        setSearchParams({ page: "1", pageSize: pageSize });
        if (searchText) {
            setSearchTextDebouce(searchText);
        }
        refetchSupplier();
    };

    const headers = [
        { label: "ใบส่งซัพพลายเออร์", colSpan: 1, className: "w-2/12" },
        { label: "รหัสร้านค้า", colSpan: 1, className: "w-2/12" },
        { label: "วันที่ส่ง", colSpan: 1, className: "w-2/12" },
        { label: "วันที่ครบกำหนด", colSpan: 1, className: "w-2/12" },
        { label: "จำนวนเงิน", colSpan: 1, className: "w-2/12" },
        { label: "สถานะ", colSpan: 1, className: "w-2/12" },
        { label: "ดูเนื้อหา", colSpan: 1, className: "min-w-20" },
        // { label: "แก้ไข", colSpan: 1, className: "min-w-14" },
        // { label: "ลบ", colSpan: 1, className: "min-w-14" },
    ];

    const handleClickToNavigate = (SND_ID: any) => {
        navigate(`/supplier-delivery-note/menu`, { state: { SND_ID } });
    };

    //ยืนยันไดอะล็อค
    const handleConfirm = async () => {
        if (!selectedOption) {
            showToast("กรุณาระบุรหัสร้านค้า", false);
            return;
        }
        try {
            const response = await createSupplierDeliveryNote({
                supplier_id: selectedOption,
            });

            if (response.statusCode === 200 && response.responseObject) {
                const SND_id = response.responseObject?.supplier_delivery_note_id;
                handleCreateClose();
                setSelectedOption(null);
                showToast("สร้างใบส่งซัพพลายเออร์เรียบร้อยแล้ว", true);
                refetchSupplier();
                // handleClickToNavigate(SND_id);
                navigate(response.responseObject?.supplier_delivery_note_id);
            } else {
                showToast("ไม่สามารถสร้างใบส่งซัพพลายเออร์ได้", false);
            }
        } catch {
            showToast("ไม่สามารถสร้างใบส่งซัพพลายเออร์ได้", false);
        }
    };


    //เปิด
    const handleCreateOpen = () => {
        setIsCreateDialogOpen(true);
    };

    const handleCreateClose = () => {
        setIsCreateDialogOpen(false);
    };

    const { data: dataSupplier, refetch: refetchSelectSupplier } = useSupplierSelect({
      searchText: searchSupplier,
    });

    const fetchDataSupplierDropdown = async () => {
        const supplier = dataSupplier?.responseObject?.data ?? [];
        return {
        responseObject: supplier.map((item: SupplierSelectItem) => ({
            supplier_id: item.supplier_id,
            supplier_code: item.supplier_code,
        })),
        };
    };

    const handleSupplierSearch = (searchText: string) => {
        setSearchSupplier(searchText);
        refetchSelectSupplier();
    };

    useEffect(() => {
        getAllSupplierDeliveryNoteData().then((res) => {
            setSupplierData(res.responseObject);
        });
    }, []);

    return (
        <div>
            <MasterTableFeature
                title="ใบส่งซับพลายเออร์"
                titleBtnName="สร้างใบส่งซับพลายเออร์"
                inputs={[
                    {
                        id: "search_input",
                        value: searchText,
                        size: "3",
                        placeholder: "ค้นหา ใบส่งซับพลายเออร์ รหัสร้านค้า",
                        onChange: setSearchText,
                        onAction: handleSearch,
                    },
                ]}
                onSearch={handleSearch}
                headers={headers}
                rowData={data}
                totalData={SupplierData?.responseObject?.totalCount}
                // onEdit={handleEditOpen}
                onView={data => navigate(data.supplier_delivery_note_id)}

                // onDelete={handleClickToNavigate}
                onPopCreate={handleCreateOpen}
            />
            <DialogComponent
                isOpen={isCreateDialogOpen}
                onClose={handleCreateClose}
                title="สร้างใบส่งซับพลายเออร์"
                onConfirm={handleConfirm}
                confirmText="บันทึกข้อมูล"
                cancelText="ยกเลิก"
            >
                <div className="flex flex-col gap-3 items-left">
                    <MasterSelectComponent
                        onChange={(option) => {
                            const value = option ? String(option.value) : null;
                            setSelectedOption(value);
                        }}
                        fetchDataFromGetAPI={fetchDataSupplierDropdown}
                        onInputChange={handleSupplierSearch}
                        valueKey="supplier_id"
                        labelKey="supplier_code"
                        placeholder="กรุณาเลือก..."
                        isClearable={true}
                        label="รหัสร้านค้า"
                        labelOrientation="horizontal"
                        classNameLabel="w-20 min-w-20 flex justify-end"
                        classNameSelect="w-full"
                    />
                </div>
            </DialogComponent>

        </div>

    );
};

export default SupplierDeliveryNoteFeatures;