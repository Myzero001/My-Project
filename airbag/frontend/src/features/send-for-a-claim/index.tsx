import { useEffect, useState } from "react";
import MasterTableFeature from "@/components/customs/display/master.main.component";
import DialogComponent from "@/components/customs/dialog/dialog.main.component";
import InputAction from "@/components/customs/input/input.main.component";
import { createSendForAClaim } from "@/services/send-for-a-claim.service"
import { useToast } from "@/components/customs/alert/toast.main.component";
import { TypeSendForAClaimAll } from "@/types/response/response.send-for-a-claim";
import MasterSelectComponent from "@/components/customs/select/select.main.component";
import { TypeRepairAll } from "@/types/response/response.ms-repair";
import { getsupplierRepairReceiptDoc } from "@/services/send-for-a-claim.service";
import { useSearchParams } from "react-router-dom";
import { useSendForAClaim } from "@/hooks/useSendForAClaim";
import { useNavigate } from "react-router-dom";
import { DateShortTH } from "@/utils/formatDate";
import { useSupplierRepairReceiptSelect } from "@/hooks/useSelect";
import { SupplierRepairReceiptSelectItem } from "@/types/response/response.supplier-repair-receipt";


type dataTableType = {
    className: string;
    cells: {
        value: any;
        className: string;
    }[];
    data: TypeSendForAClaimAll;
}[];
export default function SendForAClaimFeature() {
    const navigate = useNavigate();

    const [searchText, setSearchText] = useState("");
    const [data, setData] = useState<dataTableType>([]);

    const [isCreateDialogOpen, setIsCreateDialogOpen] = useState<boolean>(false);
    const [isEditDialogOpen, setIsEditDialogOpen] = useState<boolean>(false);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState<boolean>(false);

    const [selectedItem, setSelectedItem] = useState<TypeSendForAClaimAll | null>(null);
    const [selectedOption, setSelectedOption] = useState<string | null>(null);

    const { showToast } = useToast();

    const [searchSupplierRepairReceipt, setSearchSupplierRepairReceipt] = useState("");

    const [searchParams, setSearchParams] = useSearchParams();
    const page = searchParams.get("page") ?? "1";
    const pageSize = searchParams.get("pageSize") ?? "25";
    const [searchTextDebouce, setSearchTextDebouce] = useState("");
    const { data: sendForAClaimData, refetch: refetchSendForAClaim } = useSendForAClaim({
        page: page,
        pageSize: pageSize,
        searchText: searchTextDebouce,
    });

    useEffect(() => {
        if (sendForAClaimData?.responseObject?.data) {

            const formattedData = sendForAClaimData?.responseObject?.data.map((item: TypeSendForAClaimAll, index: number) => ({
                className: "",
                cells: [
                    { value: item.send_for_a_claim_doc, className: " text-center" },
                    { value: item.supplier_repair_receipt?.receipt_doc, className: " text-center" },
                    { value: item.supplier_repair_receipt?.supplier_delivery_note.supplier_delivery_note_doc, className: " text-center" },
                    { value: item.master_supplier?.supplier_code ?? "-", className: " text-left" },
                    { value: item.claim_date ? DateShortTH(item.claim_date) : "-", className: "text-center" },
                    { value: item.due_date ? DateShortTH(item.due_date) : "-", className: " text-center" },
                ],
                data: item,
            }));
            setData(formattedData);
        }
    }, [sendForAClaimData]);

    useEffect(() => {
        if (searchText === "") {
            setSearchTextDebouce("");
            setSearchParams({ page: "1", pageSize: pageSize });
            refetchSendForAClaim();
        }
    }, [searchText]);


    const handleSearch = () => {
        searchParams.set("pageSize", pageSize ?? "25");
        searchParams.set("page", "1");
        setSearchParams({ page: "1", pageSize: pageSize });
        if (searchText) {
            setSearchTextDebouce(searchText);
        }
        refetchSendForAClaim();
    };


    const headers = [
        { label: "เลขที่ใบส่งเคลม", colSpan: 1, className: "w-[175px]" },
        { label: "เลขที่ใบรับซ่อมซับพลายเออร์", colSpan: 1, className: "w-[175px]" },
        { label: "เลขที่ใบส่งซับพลายเออร์", colSpan: 1, className: "w-[150px] " },
        { label: "ชื่อร้านค้า", colSpan: 1, className: "w-full/12 min-w-[150px]" },
        { label: "วันที่ส่งเคลม", colSpan: 1, className: "w-[180px]" },
        { label: "วันที่ครบกำหนด", colSpan: 1, className: "w-[180px]" },
        { label: "แก้ไข", colSpan: 1, className: "min-w-14" },
    ];


    //เปิด
    const handleCreateOpen = () => {
        setIsCreateDialogOpen(true);
    };


    //ปิด
    const handleCreateClose = () => {
        setIsCreateDialogOpen(false);
    };

    const handleClickToNavigate = (send_for_a_claim_id: any) => {
        navigate(`/send-for-a-claim/create`, { state: { send_for_a_claim_id } });
    };

    //ยืนยันไดอะล็อค
    const handleConfirm = async () => {
        if (!selectedOption) {
            showToast("กรุณาระบุใบรับซ่อม", false);
            return;
        }
        try {
            const response = await createSendForAClaim({
                supplier_repair_receipt_id: selectedOption
            });
            if (response.statusCode === 200) {
                showToast("สร้างรายการส่งเคลมเรียบร้อยแล้ว", true);
                setIsCreateDialogOpen(false);
                refetchSendForAClaim();
                handleClickToNavigate(response.responseObject?.send_for_a_claim_id);
            } else {
                showToast("ไม่สามารถสร้างรายการส่งเคลมได้", false);
            }
        } catch (error) {
            showToast("ไม่สามารถสร้างรายการส่งเคลมได้", false);
        }
    }

    const { data: dataSupplierRepairReceipt, refetch: refetchSupplierRepairReceipt } = useSupplierRepairReceiptSelect({
      searchText: searchSupplierRepairReceipt,
    });

    const fetchDataSupplierRepairReceiptDropdown = async () => {
        const supplierRepairReceiptList = dataSupplierRepairReceipt?.responseObject?.data ?? [];
        return {
        responseObject: supplierRepairReceiptList.map((item: SupplierRepairReceiptSelectItem) => ({
            id: item.id,
            receipt_doc: item.receipt_doc,
        })),
        };
    };

    const handleSupplierRepairReceiptSearch = (searchText: string) => {
        setSearchSupplierRepairReceipt(searchText);
        refetchSupplierRepairReceipt();
    };

    return (
        <div>
            <MasterTableFeature
                title="ใบส่งเคลม"
                titleBtnName="สร้างใบส่งเคลม"
                inputs={[
                    {
                        id: "search_input",
                        value: searchText,
                        size: "3",
                        placeholder: "ค้นหา ใบส่งเคลม ใบรับซ่อมซับพลายเออร์ ใบส่งซับพลายเออร์ ร้านค้า",
                        onChange: setSearchText,
                        onAction: handleSearch,
                    },
                ]}
                onSearch={handleSearch}
                headers={headers}
                rowData={data}
                totalData={sendForAClaimData?.responseObject?.totalCount}
                onEdit={data => handleClickToNavigate(data.send_for_a_claim_id)}
                // onDelete={handleDeleteOpen}
                onPopCreate={handleCreateOpen}
            />

            {/* สร้าง */}
            <DialogComponent
                isOpen={isCreateDialogOpen}
                onClose={handleCreateClose}
                title="สร้างใบส่งเคลม"
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
                        fetchDataFromGetAPI={fetchDataSupplierRepairReceiptDropdown}
                        onInputChange={handleSupplierRepairReceiptSearch}
                        valueKey="id"
                        labelKey="receipt_doc"
                        placeholder="กรุณาเลือก..."
                        isClearable={true}
                        label="เลขที่ใบรับซ่อมซัพพลายเออร์"
                        labelOrientation="horizontal"
                        classNameLabel=" flex justify-end text-center"
                        classNameSelect="w-full"
                    />
                </div>
            </DialogComponent>
        </div>
    )
}
