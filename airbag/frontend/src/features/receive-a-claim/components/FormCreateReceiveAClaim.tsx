import React, { useState, useEffect } from "react";
import dayjs from 'dayjs';
import SupplierComponent from "@/components/customs/display/master.supplier.components";
import { useParams, useNavigate } from "react-router-dom";
import { useToast } from "@/components/customs/alert/toast.main.component";
import { 
    getReceiveForAClaimListPayload,
    updateReceiveForAClaimList,
    createReceiveForAClaimList,
    deleteReceiveForAClaimList,
} from "@/services/receive-for-a-claim.service-list";
import { updateReceiveForAClaimDate } from "@/services/receive-for-a-claim.service";
import { TypeReceiveForAClaimPayload, SendForClaimItem } from "@/types/response/response.receive-for-a-claim-list";
import { BoxLoadingData } from "@/components/customs/boxLoading/BoxLoadingData";
import { updateReceiveForAClaim } from "@/services/receive-for-a-claim.service";
import { deleteReceiveForAClaim } from "@/services/receive-for-a-claim.service";
import DialogComponent from "@/components/customs/dialog/dialog.main.component";
import { PayLoadTypePayloadCreateReceiveForAClaimList } from "@/types/requests/request.receive_for_a_claim_list";

const FormCreateGetSupplier = () => {
    const { receiveForAClaimId, sendForAClaimId } = useParams();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [payloadData, setPayloadData] = useState<TypeReceiveForAClaimPayload | null>(null);
    const [rowData, setRowData] = useState<any[]>([]);
    const [receiveListIdMap, setReceiveListIdMap] = useState<Map<string, string | null>>(new Map());
    const { showToast } = useToast();
    
    // เพิ่ม state สำหรับการเก็บสถานะการติ๊กเช็คบ็อกซ์
    const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set());
    const [savedItems, setSavedItems] = useState<Set<string>>(new Set());
    const [pendingChanges, setPendingChanges] = useState<Map<string, boolean>>(new Map());
    const [isSubmitting, setIsSubmitting] = useState(false);
    // เพิ่ม state สำหรับวันที่รับเคลม
    const [claimDate, setClaimDate] = useState<string>("");
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const navigate = useNavigate();
    

    const headers = [
        { label: "รายการ", colSpan: 1, className: "w-5/12" },
        { label: "เลขที่ใบรับซ่อม", colSpan: 1, className: "w-3/12" },
        { label: "เลขที่ใบรับเคลม", colSpan: 1, className: "w-3/12" },
    ];

    const fetchData = async () => {
        if (!receiveForAClaimId || !sendForAClaimId) {
            setError("ไม่พบข้อมูล ID ที่ต้องการ");
            setLoading(false);
            return;
        }

        try {
            setLoading(true);
            const response = await getReceiveForAClaimListPayload(
                receiveForAClaimId,
                sendForAClaimId
            );

            if (response.success && response.responseObject.length > 0) {
                const payload = response.responseObject[0];
                setPayloadData(payload);

                if (payload.claim_date) {
                     try {
                        const dateParts = payload.claim_date.split('/');
                        if (dateParts.length === 3) {
                            const day = dateParts[0].padStart(2, '0');
                            const month = dateParts[1].padStart(2, '0');
                            let year = dateParts[2];
                            const yearNum = parseInt(year);
                            if (yearNum > 2400) year = (yearNum - 543).toString();
                            const formattedDate = `${year}-${month}-${day}`;
                            setClaimDate(formattedDate);
                        } else { setClaimDate(payload.claim_date); }
                    } catch (error) {
                        setClaimDate(payload.claim_date);
                    }
                } else {
                    setClaimDate("");
                }

                const initialSelectedItems = new Set<string>();
                const initialReceiveListIdMap = new Map<string, string | null>();
                const initialSavedItems = new Set<string>();

                payload.send_for_claim_items.forEach((item: SendForClaimItem) => {
                    const sendId = item.send_for_a_claim_list_id;
                    const receiveListItem = item.receive_for_a_claim_list;
                    const receiveId = receiveListItem?.receive_for_a_claim_list_id || null;

                    initialReceiveListIdMap.set(sendId, receiveId);

                    if (receiveId) {
                        initialSavedItems.add(sendId); // This item has an existing receive_for_a_claim_list record
                        if (receiveListItem?.finish) {
                            initialSelectedItems.add(sendId); // And it's marked as finished, so check it
                        }
                    }
                });

                setSelectedItems(initialSelectedItems);
                setReceiveListIdMap(initialReceiveListIdMap);
                setSavedItems(initialSavedItems);

                const formattedRowData = payload.send_for_claim_items.map((item: SendForClaimItem) => {
                    const sendId = item.send_for_a_claim_list_id;
                    const receiveId = initialReceiveListIdMap.get(sendId) || null; // From map
                    const isSelected = initialSelectedItems.has(sendId); // From selection set

                    // Determine if checkbox should be disabled
                    // Disabled if: item is finished AND (finish_by_receipt_doc exists AND it's different from current doc)
                    const isFinishedByAnotherDoc = 
                        item.receive_for_a_claim_list?.finish &&
                        item.receive_for_a_claim_list?.finish_by_receipt_doc &&
                        item.receive_for_a_claim_list?.finish_by_receipt_doc !== payload.receive_for_a_claim_doc;

                    return {
                        className: '',
                        cells: [
                            { value: item.master_repair_name, className: '' },
                            { value: payload.receipt_doc || '-', className: '' },
                            {
                                value: isSelected && item.receive_for_a_claim_list?.finish_by_receipt_doc
                                    ? (item.receive_for_a_claim_list?.finish_by_receipt_doc === payload.receive_for_a_claim_doc ? "-" : item.receive_for_a_claim_list?.finish_by_receipt_doc)
                                    : "-",
                                className: 'text-center'
                            },
                            {
                                value: { isChecked: isSelected },
                                disabled: isFinishedByAnotherDoc,
                                className: ''
                            },
                        ],
                        data: {
                            id: sendId,
                            receive_for_a_claim_list_id: receiveId
                        },
                    };
                });
                setRowData(formattedRowData);
            } else {
                setError("ไม่พบข้อมูลที่ต้องการ");
                setPayloadData(null);
                setRowData([]);
                setSelectedItems(new Set());
                setReceiveListIdMap(new Map());
                setSavedItems(new Set());
            }
        } catch (err) {
            console.error("Error in fetchData:", err);
            setError("เกิดข้อผิดพลาดในการดึงข้อมูล");
            setPayloadData(null);
            setRowData([]);
            setSelectedItems(new Set());
            setReceiveListIdMap(new Map());
            setSavedItems(new Set());
        } finally {
            setLoading(false);
        }
    };


    useEffect(() => {
        fetchData();
    }, [receiveForAClaimId, sendForAClaimId]);


    const handleCheckboxChange = ({ checked, rowData: row }: { checked: boolean; rowData: any }) => {
        const sendId = row?.data?.id; 

        if (!sendId) {
            console.error("No valid send_for_a_claim_list_id found for the row");
            return;
        }

        setSelectedItems(prev => {
            const newSet = new Set(prev);
            if (checked) {
                newSet.add(sendId);
            } else {
                newSet.delete(sendId);
            }
            return newSet;
        });

        setRowData(prev => prev.map(item => {
            if (item.data.id === sendId) {
                return {
                    ...item,
                    cells: item.cells.map((cell: any, idx: number) => {
                        if (idx === 3) { 
                            return { ...cell, value: { isChecked: checked } };
                        }
                        return cell;
                    })
                };
            }
            return item;
        }));
    };

    const handleClaimDateChange = async (value: string) => {
        if (!receiveForAClaimId) {
            showToast("ไม่พบข้อมูล ID ที่ต้องการ", false);
            return;
        }
    
        try {
            setLoading(true);
            const dateObject = new Date(value);
            const day = dateObject.getDate().toString().padStart(2, '0');
            const month = (dateObject.getMonth() + 1).toString().padStart(2, '0');
            const year = dateObject.getFullYear();
            const formattedDate = `${day}/${month}/${year}`;
            
            const updateResponse = await updateReceiveForAClaimDate(
                receiveForAClaimId,
                { claim_date: formattedDate }
            );
            
            if (updateResponse.success) {
                showToast("อัพเดตวันที่รับเคลมสำเร็จ", true);
                setClaimDate(value); 
                if (payloadData) {
                    setPayloadData({ ...payloadData, claim_date: formattedDate });
                }
            } else {
                showToast("เกิดข้อผิดพลาดในการอัพเดตวันที่รับเคลม", false);
            }
        } catch (err) {
            showToast("เกิดข้อผิดพลาดในการอัพเดตวันที่รับเคลม", false);
        } finally {
            setLoading(false);
        }
    };
    
    const handleSubmit = async () => {
        if (!receiveForAClaimId || !payloadData) { // Removed rowData check as it's derived
            showToast("ไม่พบข้อมูลที่ต้องการบันทึก", false);
            return;
        }

        setIsSubmitting(true);
        const itemsToCreatePromises: Promise<any>[] = [];
        const itemsToDeletePromises: Promise<any>[] = [];

        // --- Handle Creations ---
        for (const selectedSendId of selectedItems) {
            const existingReceiveId = receiveListIdMap.get(selectedSendId);
            if (!existingReceiveId) { // If it's selected and doesn't have an existing receive list ID
                const originalItem = payloadData.send_for_claim_items.find(
                    (item) => item.send_for_a_claim_list_id === selectedSendId
                );

                if (originalItem) {
                    const createPayload: PayLoadTypePayloadCreateReceiveForAClaimList = {
                        receive_for_a_claim_id: receiveForAClaimId,
                        send_for_a_claim_list_id: originalItem.send_for_a_claim_list_id,
                        repair_receipt_id: originalItem.repair_receipt_id,
                        master_repair_id: originalItem.master_repair_id,
                        finish_by_receipt_doc: payloadData.receive_for_a_claim_doc, // New items are finished by current doc
                        finish: true,
                        price: originalItem.price,
                        remark: originalItem.remark,
                    };
                    itemsToCreatePromises.push(createReceiveForAClaimList(createPayload));
                } else {
                    console.warn(`Could not find original data for send_for_a_claim_list_id: ${selectedSendId} to create.`);
                }
            }
        }

        // --- Handle Deletions ---
        for (const savedSendId of savedItems) { // Iterate over items that had a receive_for_a_claim_list_id on load
            if (!selectedItems.has(savedSendId)) { // If a previously saved item is now UNCHECKED
                const receiveListIdToDelete = receiveListIdMap.get(savedSendId);
                if (receiveListIdToDelete) {
                    // Check if the checkbox for this item was disabled in the UI
                    // This prevents deleting items locked by another document
                    const rowConfig = rowData.find(r => r.data.id === savedSendId);
                    const isCheckboxDisabled = rowConfig?.cells[3]?.disabled;

                    if (!isCheckboxDisabled) {
                        itemsToDeletePromises.push(deleteReceiveForAClaimList(receiveListIdToDelete));
                    } else {
                        console.warn(`Skipping deletion for ${savedSendId} (receive_for_a_claim_list_id: ${receiveListIdToDelete}) as its checkbox is disabled.`);
                    }
                } else {
                    console.warn(`Attempted to delete ${savedSendId}, but no receive_for_a_claim_list_id found in map.`);
                }
            }
        }

        if (itemsToCreatePromises.length === 0 && itemsToDeletePromises.length === 0) {
            showToast("ไม่มีการเปลี่ยนแปลงข้อมูล", true);
            await new Promise(ressole => setTimeout(ressole, 500));
            setIsSubmitting(false);
            return;
        }

        try {
        const delayPromise = new Promise(resolve => setTimeout(resolve, 500));

        const apiWorkPromise = (async () => {
            const creationResults = await Promise.allSettled(itemsToCreatePromises);
            const deletionResults = await Promise.allSettled(itemsToDeletePromises);

            let successfulCreations = 0;
            let failedCreations = 0;
            creationResults.forEach(result => {
                if (result.status === 'fulfilled' && result.value.success) successfulCreations++;
                else failedCreations++;
            });

            let successfulDeletions = 0;
            let failedDeletions = 0;
            deletionResults.forEach(result => {
                if (result.status === 'fulfilled' && result.value.success) successfulDeletions++;
                else failedDeletions++;
            });

            let toastMessage = "";
            let overallSuccess = (failedCreations === 0 && failedDeletions === 0);

            if (itemsToCreatePromises.length > 0) toastMessage += `สร้าง: ${successfulCreations} สำเร็จ `;
            if (itemsToDeletePromises.length > 0) toastMessage += `ลบ: ${successfulDeletions} สำเร็จ`;
            
            showToast(toastMessage.trim() || "บันทึกข้อมูลสำเร็จ", overallSuccess);
        })();

        await Promise.all([apiWorkPromise, delayPromise]);

    } catch (error) { 
        showToast("เกิดข้อผิดพลาดร้ายแรงระหว่างการบันทึกข้อมูล", false);
        console.error("Overall handleSubmit error:", error);
    } finally {
        await fetchData(); 
        setIsSubmitting(false); 
    }
};

    const handleDelete = () => {
        if (!receiveForAClaimId) {
            showToast("ไม่พบ ID ของรายการที่จะลบ", false);
            return;
        }
        setIsDeleteDialogOpen(true);
    };

    const handleDeleteConfirm = async () => {
        if (!receiveForAClaimId) {
            showToast("ไม่พบ ID ของรายการที่จะลบ", false);
            setIsDeleteDialogOpen(false);
            return;
        }

        setIsDeleting(true);
        setIsDeleteDialogOpen(false);

        try {
            const response = await deleteReceiveForAClaim(receiveForAClaimId);
            if (response && response.success) {
                showToast("ลบข้อมูลสำเร็จ", true);
                navigate("/receive-a-claim"); 
            } else {
                showToast(response?.message || "เกิดข้อผิดพลาดในการลบข้อมูล", false);
            }
        } catch (error: any) {
            const errorMessage = error.response?.data?.responseObject || error.message || "เกิดข้อผิดพลาดในการเชื่อมต่อ";
            showToast(`ลบข้อมูลไม่สำเร็จ: ${errorMessage}`, false);
        } finally {
            setIsDeleting(false);
        }
    };

    if (loading && !payloadData) { // Show loading only on initial load or if payloadData is not yet set
        return <BoxLoadingData minHeight="100vh" />;
    }

    if (error) {
        return <div className="p-4 text-red-500 text-center">{error}</div>;
    }

    return (
        <>
            <SupplierComponent
                headers={headers}
                rowData={rowData}
                inputs={[
                    {
                        id: "claim_date",
                        type: "date",
                        label: "วันที่รับเคลม",
                        placeholder: "",
                        value: claimDate,
                        defaultValue: claimDate,
                        onChange: handleClaimDateChange,
                        // isLoading: loading, // Pass loading state if input should be disabled during date update
                    },
                    {
                        id: "receive_for_a_claim_doc",
                        label: "เลขที่ใบรับเคลม",
                        placeholder: "เลขที่ใบรับเคลม",
                        value: payloadData?.receive_for_a_claim_doc || "",
                        onChange: (value) => console.log(value),
                        disabled: true,
                    },
                    {
                        id: "send_for_a_claim_doc",
                        label: "เลขที่ใบส่งเคลม",
                        placeholder: "เลขที่ใบส่งเคลม",
                        value: payloadData?.send_for_a_claim_doc || "",
                        onChange: (value) => console.log(value),
                        disabled: true,
                    },
                    {
                        id: "supplier_delivery_note_doc",
                        label: "เลขที่ใบรับซ่อม ซับพลายเออร์",
                        placeholder: "เลขที่ใบรับซ่อม ซับพลายเออร์",
                        value: payloadData?.supplier_delivery_note_doc || "",
                        onChange: (value) => console.log(value),
                        disabled: true,
                    },
                    {
                        id: "receipt_doc",
                        label: "เลขที่ใบส่ง Supplier",
                        placeholder: "เลขที่ใบส่ง Supplier",
                        value: payloadData?.receipt_doc || "",
                        onChange: (value) => console.log(value),
                        disabled: true,
                    },
                    {
                        id: "supplier_name",
                        label: "ชื่อร้านค้า",
                        placeholder: "ชื่อร้านค้า",
                        value: payloadData?.supplier_name || "",
                        onChange: (value) => console.log(value),
                        disabled: true,
                    },
                ]}
                onCheckBoxChange={handleCheckboxChange}
                onSubmit={handleSubmit}
                onDelete={handleDelete}
                checkboxLabel="รับเคลม"
                checkboxColumnIndex={3}
                showDeleteButton={true}
                isSubmitting={isSubmitting}
            />
            <DialogComponent
                isOpen={isDeleteDialogOpen}
                onClose={() => setIsDeleteDialogOpen(false)}
                title="ยืนยันการลบ"
                onConfirm={handleDeleteConfirm}
                confirmText="ยืนยัน"
                cancelText="ยกเลิก"
            >
                <p>
                    คุณแน่ใจหรือไม่ว่าต้องการลบรายการรับเคลมนี้? <br />
                    เลขที่ใบรับเคลม: <span className="text-red-500">{payloadData?.receive_for_a_claim_doc || "-"}</span>
                    <br />
                    เลขที่ใบส่งเคลม: <span className="text-red-500">{payloadData?.send_for_a_claim_doc || "-"}</span>
                    <br />
                    ชื่อร้านค้า: <span className="text-red-500">{payloadData?.supplier_name || "-"}</span>
                </p>
            </DialogComponent>
        </>
    );
};

export default FormCreateGetSupplier;