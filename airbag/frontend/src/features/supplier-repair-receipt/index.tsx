import { useState, useEffect } from "react";
import { TypeSupplierRepairReceiptAll } from "@/types/response/response.supplier-repair-receipt";
import { createSupplierRepairReceipt } from "@/services/supplier-repair-receipt.service";
import { getPayloadListForSupplierRepairReceipt } from "@/services/supplier-repair-receipt.service-list";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/customs/alert/toast.main.component";
import MasterTableFeature from "@/components/customs/display/master.main.component";
import DialogComponent from "@/components/customs/dialog/dialog.main.component";
import MasterSelectComponent from "@/components/customs/select/select.main.component";
import { getSupplierDeliveryNoteDoc } from "@/services/supplier-delivery-note.service.";
import { useSearchParams } from "react-router-dom";
import { useSupplierRepairReceipt } from "@/hooks/useSupplierRepairReceipt";
import { PayloadListResponse } from "@/types/response/response.supplier-repair-receipt-list";

type dataTableType = {
    className: string;
    cells: {
        value: any;
        className: string;
    }[];
    data: TypeSupplierRepairReceiptAll;
}[];

const SupplierRepairReceiptFeatures = () => {
    const [data, setData] = useState<dataTableType>([]);
    const [searchText, setSearchText] = useState("");
    const [isCreateDialogOpen, setIsCreateDialogOpen] = useState<boolean>(false);
    const [selectedOption, setSelectedOption] = useState<string | null>(null);
    const { showToast } = useToast();
    const navigate = useNavigate();

    const [searchParams, setSearchParams] = useSearchParams();
    const page = searchParams.get("page") ?? "1";
    const pageSize = searchParams.get("pageSize") ?? "25";
    const [searchTextDebouce, setSearchTextDebouce] = useState("");

    const { data: SupplierData, refetch: refetchSupplier } = useSupplierRepairReceipt({
        page: page,
        pageSize: pageSize,
        searchText: searchTextDebouce,
    });

    useEffect(() => {
        if (SupplierData?.responseObject?.data) {
            const formattedData = SupplierData?.responseObject?.data.map((item: TypeSupplierRepairReceiptAll) => ({
                className: "",
                cells: [
                    { value: item.receipt_doc ?? "-", className: "text-center" },
                    { value: item.master_supplier?.supplier_code ?? "-", className: "text-left" },
                    { value: formatDate(item.repair_date_supplier_repair_receipt), className: "text-center" },
                    { value: item.supplier_delivery_note?.supplier_delivery_note_doc ?? "-", className: "text-center" },
                    { value: item.status ?? "-", className: "text-center", type: "badge-status" },
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
        { label: "เลขที่ใบรับซ่อม", colSpan: 1, className: "w-2/12" },
        { label: "รหัสร้านค้า", colSpan: 1, className: "w-2/12" },
        { label: "วันที่รับซ่อม", colSpan: 1, className: "w-3/12" },
        { label: "เลขที่ใบส่งซ่อม", colSpan: 1, className: "w-3/12" },
        { label: "สถานะ", colSpan: 1, className: "w-2/12" },
        { label: "ดูเนื้อหา", colSpan: 1, className: "min-w-20" },
    ];

    const handleConfirm = async () => {
        if (!selectedOption) {
            showToast("กรุณาระบุใบส่งซ่อม", false);
            return;
        }
        try {
            const response = await createSupplierRepairReceipt({
                supplier_delivery_note_id: selectedOption,
            });
            showToast("สร้างใบรับซ่อมซับพลายเออร์เรียบร้อยแล้ว", true);
    
            if (response.statusCode === 200 && response.responseObject) {
                handleCreateClose();
                setSelectedOption(null);
                showToast("สร้างใบรับซ่อมซับพลายเออร์เรียบร้อยแล้ว", true);
                refetchSupplier();
                navigate(response.responseObject?.id);
                return;
            }
        } catch (error) {
            showToast("สร้างใบรับซ่อมซับพลายเออร์ซ้ำ", false);
        } finally {
            refetchSupplier();
        }
    };

    const handleCreateOpen = () => {
        setIsCreateDialogOpen(true);
    };

    const handleCreateClose = () => {
        setIsCreateDialogOpen(false);
    };

    const handleViewContent = async (rowData: PayloadListResponse) => {
        try {
            const supplierRepairReceiptId = rowData.receipt_doc;
            
            if (!supplierRepairReceiptId) {
                showToast("ไม่พบข้อมูลใบรับซ่อมซับพลายเออร์", false);
                return;
            }

            const payloadResponse = await getPayloadListForSupplierRepairReceipt(supplierRepairReceiptId);
            
            if (payloadResponse.statusCode === 200) {
                navigate(`/supplier-repair-receipt-form/${supplierRepairReceiptId}?page=${page}&pageSize=${pageSize}`);
            } else {
                showToast("ไม่สามารถดึงข้อมูลได้", false);
            }
        } catch (error) {
            console.error("Error fetching payload data:", error);
            showToast("เกิดข้อผิดพลาดในการดึงข้อมูล", false);
        }
    };

    const fetchDeliveryNoteDocs = async () => {
        try {
            const response = await getSupplierDeliveryNoteDoc();
            if (response.statusCode === 200 && response.responseObject?.docs) {
                return {
                    responseObject: response.responseObject?.docs.map(doc => ({
                        value: doc.supplier_delivery_note_id,
                        label: doc.supplier_delivery_note_doc
                    })),
                    statusCode: 200,
                    message: ""
                };
            }
            return {
                responseObject: [],
                statusCode: 200,
                message: ""
            };
        } catch (error) {
            console.error("Error fetching delivery note docs:", error);
            return {
                responseObject: [],
                statusCode: 500,
                message: "Error fetching delivery note docs"
            };
        }
    };

    const formatDate = (date: Date | undefined | null): string => {
        if (!date) return "-";
        const dateObj = new Date(date);
        if (isNaN(dateObj.getTime())) return "-";
        
        const day = dateObj.getDate().toString().padStart(2, '0');
        const month = (dateObj.getMonth() + 1).toString().padStart(2, '0');
        const year = dateObj.getFullYear();
        
        return `${day}/${month}/${year}`;
    };

    return (
        <div>
            <MasterTableFeature
                title="ใบรับซ่อมซับพลายเออร์"
                titleBtnName="สร้าใบรับซ่อมซับพลายเออร์"
                inputs={[
                    {
                        id: "search_input",
                        value: searchText,
                        size: "3",
                        placeholder: "ค้นหา ใบรับซ่อมซับพลายเออร์",
                        onChange: setSearchText,
                        onAction: handleSearch,
                    },
                ]}
                onSearch={handleSearch}
                headers={headers}
                rowData={data}
                totalData={SupplierData?.responseObject?.totalCount}
                onView={handleViewContent}
                onPopCreate={handleCreateOpen}
            />
            <DialogComponent
                isOpen={isCreateDialogOpen}
                onClose={handleCreateClose}
                title="สร้างใบรับซ่อมซับพลายเออร์"
                onConfirm={handleConfirm}
                confirmText="บันทึกข้อมูล"
                cancelText="ยกเลิก"
            >
                <div className="flex flex-col gap-3 items-left w-[400px]">
                    <div className="w-full pl-0 pr-4">
                        <MasterSelectComponent
                            onChange={(option) => {
                                const value = option ? String(option.value) : null;
                                setSelectedOption(value);
                            }}
                            fetchDataFromGetAPI={fetchDeliveryNoteDocs}
                            valueKey="value"
                            labelKey="label"
                            placeholder="กรุณาเลือก..."
                            isClearable={true}
                            label="เลขที่ใบส่งซ่อม"
                            labelOrientation="horizontal"
                            classNameLabel="w-40 min-w-40 flex justify-end whitespace-nowrap overflow-visible"
                            classNameSelect="w-full"
                        />
                    </div>
                </div>
            </DialogComponent>
        </div>
    );
};

export default SupplierRepairReceiptFeatures;