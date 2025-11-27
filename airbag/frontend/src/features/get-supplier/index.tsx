import { useEffect, useState } from "react";
import { TypeSupplierRepairReceiptAll } from "@/types/response/response.supplier-repair-receipt";
import { createSupplierRepairReceipt } from "@/services/supplier-repair-receipt.service";
import { getPayloadListForSupplierRepairReceipt } from "@/services/supplier-repair-receipt.service-list";
import MasterTableFeature from "@/components/customs/display/master.main.component";
import DialogComponent from "@/components/customs/dialog/dialog.main.component";
import MasterSelectComponent from "@/components/customs/select/select.main.component";
import { getSupplierDeliveryNoteDoc } from "@/services/supplier-delivery-note.service.";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useSupplierRepairReceipt } from "@/hooks/useSupplierRepairReceipt";
import { useToast } from "@/components/customs/alert/toast.main.component";
import { useSupplierDeliveryNoteSelect } from "@/hooks/useSelect";
import { SupplierDeliveryNoteSelectItem } from "@/types/response/response.supplier-delivery-note";

type dataTableType = {
    className: string;
    cells: {
        value: any;
        className: string;
    }[];
    data: TypeSupplierRepairReceiptAll;
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

export default function GetSupplierFeature() {
    const navigate = useNavigate();
    const { showToast } = useToast();

    const [data, setData] = useState<dataTableType>([]);
    const [searchText, setSearchText] = useState("");
    const [isCreateDialogOpen, setIsCreateDialogOpen] = useState<boolean>(false);
    const [selectedOption, setSelectedOption] = useState<string | null>(null);

    const [searchParams, setSearchParams] = useSearchParams();
    const page = searchParams.get("page") ?? "1";
    const pageSize = searchParams.get("pageSize") ?? "25";
    const [searchTextDebouce, setSearchTextDebouce] = useState("");
    const [searchSupplierDeliveryNote, setSearchSupplierDeliveryNote] = useState("");

    const { data: SupplierData, refetch: refetchSupplier } = useSupplierRepairReceipt({
        page: page,
        pageSize: pageSize,
        searchText: searchTextDebouce,
    });

    useEffect(() => {
        if (SupplierData?.responseObject?.data) {
            // สร้าง Map เพื่อเก็บข้อมูลรายการตามเลขที่ใบส่งซ่อมซัพพลายเออร์
            const deliveryNoteInfoMap = new Map();
            
            // วนลูปเพื่อเก็บข้อมูลจำนวนรายการทั้งหมดและจำนวนที่ติ๊ก
            SupplierData.responseObject.data.forEach((item: TypeSupplierRepairReceiptAll) => {
                const deliveryNoteDoc = item.supplier_delivery_note?.supplier_delivery_note_doc;
                
                if (deliveryNoteDoc) {
                    const itemList = item.supplier_repair_receipt_lists || [];
                    const repairItems = item.repair_items || [];
                    
                    const totalItems = Array.isArray(itemList) ? itemList.length : 0;
                    
                    const finishedItems = Array.isArray(repairItems) 
                        ? repairItems.filter(repairItem => 
                            repairItem && 'finish' in repairItem && (repairItem as any).finish === true
                          ).length 
                        : 0;
                    
                    if (!deliveryNoteInfoMap.has(deliveryNoteDoc)) {
                        deliveryNoteInfoMap.set(deliveryNoteDoc, {
                            totalItems: totalItems,
                            finishedItems: finishedItems
                        });
                    } else {
                        const existingInfo = deliveryNoteInfoMap.get(deliveryNoteDoc);
                        if (totalItems > existingInfo.totalItems) {
                            existingInfo.totalItems = totalItems;
                        }
                        if (finishedItems > existingInfo.finishedItems) {
                            existingInfo.finishedItems = finishedItems;
                        }
                        deliveryNoteInfoMap.set(deliveryNoteDoc, existingInfo);
                    }
                }
            });
            
            const formattedData = SupplierData.responseObject.data.map((item: TypeSupplierRepairReceiptAll) => {
                const deliveryNoteDoc = item.supplier_delivery_note?.supplier_delivery_note_doc;
                
                let itemCountDisplay = "-";
                if (deliveryNoteDoc && deliveryNoteInfoMap.has(deliveryNoteDoc)) {
                    const info = deliveryNoteInfoMap.get(deliveryNoteDoc);
                    itemCountDisplay = `${info.finishedItems}/${info.totalItems}`;
                }
                
                return {
                    className: "",
                    cells: [
                        { value: item.receipt_doc ?? "-", className: "text-center" },
                        { value: item.supplier_delivery_note?.supplier_delivery_note_doc ?? "-", className: "text-center" },
                        // +++ แก้ไขตรงนี้: เรียกใช้ฟังก์ชัน formatCurrency และจัดชิดขวา +++
                        { value: formatCurrency(item.supplier_delivery_note?.amount), className: "text-right" },
                        { value: formatDate(item.repair_date_supplier_repair_receipt), className: "text-center" },
                        { value: formatDate(item.created_at), className: "text-center" },
                    ],
                    data: item,
                };
            });
            
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
        { label: "เลขที่ใบรับซ่อมซับพลายเออร์", colSpan: 1, className: "w-2.5/12" },
        { label: "เลขที่ใบส่งซ่อมซับพลายเออร์", colSpan: 1, className: "w-2.5/12" },
        // +++ แก้ไขตรงนี้: เพิ่ม className เพื่อให้หัวข้อตรงกับข้อมูล +++
        { label: "จำนวนราคา", colSpan: 1, className: "w-1/12 text-right" },
        { label: "วันที่รับซ่อมซับพลายเออร์", colSpan: 1, className: "w-2/12" },
        { label: "วันที่ใบส่งซ่อมซับพลายเออร์", colSpan: 1, className: "w-2/12" },
        { label: "แก้ไข", colSpan: 1, className: "min-w-14" },
    ];

    const handleCreateOpen = () => {
        setIsCreateDialogOpen(true);
    };

    const handleCreateClose = () => {
        setIsCreateDialogOpen(false);
    };

    const handleConfirm = async () => {
        if (!selectedOption) {
            showToast("กรุณาระบุใบส่งซ่อม", false);
            return;
        }
        try {
            const response = await createSupplierRepairReceipt({
                supplier_delivery_note_id: selectedOption,
            });
    
            if (response.statusCode === 200 || response.statusCode === 201) {
                handleCreateClose();
                setSelectedOption(null);
                showToast("สร้างใบรับซ่อมซับพลายเออร์เรียบร้อยแล้ว", true);
                refetchSupplier();
    
                const newRepairReceiptId = response.responseObject?.id;
                if (newRepairReceiptId) {
                    navigate(`/get-supplier/create/${newRepairReceiptId}/${selectedOption}`);
                } else {
                    showToast("สร้างสำเร็จแต่ไม่สามารถเปิดหน้าแก้ไขได้", false);
                }
                return;
            }
        } catch (error) {
            showToast("สร้างใบรับซ่อมซับพลายเออร์ซ้ำ", false);
        } finally {
            refetchSupplier();
        }
    };    

    const handleEdit = async (rowDataFromTable: TypeSupplierRepairReceiptAll) => { 
        console.log("handleEdit called with rowDataFromTable:", rowDataFromTable);
        try {
            const originalId = rowDataFromTable.id; 

            const latestRowObject = data.find(item => item.data.id === originalId);

            if (!latestRowObject) {
                 console.error("Could not find the latest data in state for ID:", originalId);
                 showToast("ไม่พบข้อมูลล่าสุดของรายการนี้", false);
                 return;
            }

            const supplierRepairReceiptId = latestRowObject.data.id;
            const supplierDeliveryNoteId = latestRowObject.data.supplier_delivery_note?.supplier_delivery_note_id;

            console.log("Attempting to navigate with:", { supplierRepairReceiptId, supplierDeliveryNoteId });

            if (!supplierRepairReceiptId || !supplierDeliveryNoteId) {
                showToast("ไม่พบข้อมูลที่จำเป็นสำหรับใบรับซ่อม (จากข้อมูลล่าสุด)", false);
                console.error("Missing IDs in latestRowObject.data:", latestRowObject.data);
                return;
            }
            navigate(`/get-supplier/create/${supplierRepairReceiptId}/${supplierDeliveryNoteId}`);

        } catch (error) {
            console.error("Error in handleEdit:", error);
            showToast("เกิดข้อผิดพลาดในการเปิดหน้าแก้ไข", false);
        }
    };   

    const fetchDeliveryNoteDocs = async () => {
        try {
            const response = await getSupplierDeliveryNoteDoc();
            if (response.statusCode === 200 && response.responseObject?.docs) {
                return {
                    responseObject: response.responseObject.docs.map(doc => ({
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

    const { data: dataSupplierDeliveryNote, refetch: refetchSupplierDeliveryNote } = useSupplierDeliveryNoteSelect({
      searchText: searchSupplierDeliveryNote,
    });

    const fetchDataSupplierDeliveryNoteDropdown = async () => {
        const supplierDeliveryNote = dataSupplierDeliveryNote?.responseObject?.data ?? [];
        return {
        responseObject: supplierDeliveryNote.map((item: SupplierDeliveryNoteSelectItem) => ({
            supplier_delivery_note_id: item.supplier_delivery_note_id,
            supplier_delivery_note_doc: item.supplier_delivery_note_doc,
        })),
        };
    };

    const handleSupplierDeliveryNoteSearch = (searchText: string) => {
        setSearchSupplierDeliveryNote(searchText);
        refetchSupplierDeliveryNote();
    };

    return (
        <div>
            <MasterTableFeature
                title="ใบรับซ่อมซับพลายเออร์"
                titleBtnName="สร้างใบรับซ่อม Supplier"
                inputs={[
                    {
                        id: "search_input",
                        value: searchText,
                        size: "3",
                        placeholder: "ค้นหา เลขที่ใบรับซ่อมซับพลายเออร์	เลขที่ใบส่งซ่อมซับพลายเออร์",
                        onChange: setSearchText,
                        onAction: handleSearch,
                    },
                ]}
                onSearch={handleSearch}
                headers={headers}
                rowData={data}
                totalData={SupplierData?.responseObject?.totalCount}
                onEdit={handleEdit}
                onPopCreate={handleCreateOpen}
            />

            <DialogComponent
                isOpen={isCreateDialogOpen}
                onClose={handleCreateClose}
                title="สร้างใบรับซ่อม Supplier"
                onConfirm={handleConfirm}
                confirmText="บันทึกข้อมูล"
                cancelText="ยกเลิก"
            >
                <div className="flex flex-col gap-3 items-left ">
                    <div className="w-full pl-0 pr-4">
                        <MasterSelectComponent
                            onChange={(option) => {
                                const value = option ? String(option.value) : null;
                                setSelectedOption(value);
                            }}
                            fetchDataFromGetAPI={fetchDataSupplierDeliveryNoteDropdown}
                            onInputChange={handleSupplierDeliveryNoteSearch}
                            valueKey="supplier_delivery_note_id"
                            labelKey="supplier_delivery_note_doc"
                            placeholder="กรุณาเลือก..."
                            isClearable={true}
                            label="เลขที่ใบส่งซ่อม"
                            labelOrientation="horizontal"
                            classNameLabel=" flex justify-end whitespace-nowrap overflow-visible"
                            classNameSelect="w-full"
                        />
                    </div>
                </div>
            </DialogComponent>
        </div>
    );
};