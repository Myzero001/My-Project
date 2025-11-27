import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useToast } from "@/components/customs/alert/toast.main.component";
import { useForm } from "react-hook-form";
import dayjs from "dayjs";
import SupplierComponent from "@/components/customs/display/master.supplier.components";
import { BoxLoadingData } from "@/components/customs/boxLoading/BoxLoadingData";
import {
    getPayloadListForSupplierRepairReceipt,
    updateFinishStatus,
    createSupplierRepairReceiptList,
    updateRepairDate,
    deleteSupplierRepairReceiptList,
} from "@/services/supplier-repair-receipt.service-list";
import { deleteSupplierRepairReceipt } from "@/services/supplier-repair-receipt.service";
import {
    PayloadListResponse,
    DeliveryNoteRepairItem
} from "@/types/response/response.supplier-repair-receipt-list";
import DialogComponent from "@/components/customs/dialog/dialog.main.component";
import { CreateSupplierRepairReceiptListRequest } from "@/types/requests/request.supplier-repair-receipt-list";

const FormCreateGetSupplier = () => {
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [formData, setFormData] = useState<PayloadListResponse | null>(null);
    const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set());
    const [savedItems, setSavedItems] = useState<Set<string>>(new Set());
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const { showToast } = useToast();
    const navigate = useNavigate();
    const {
        supplier_repair_receipt_id = '', // This is the primary ID for this form/page
        supplier_delivery_note_id = ''
      } = useParams<{
        supplier_repair_receipt_id: string;
        supplier_delivery_note_id: string;
      }>();
    const { register, watch, setValue, handleSubmit } = useForm();

    const headers = [
        { label: "ใบรับซ่อม", className: "w-1/12 text-center" },
        { label: "รายการ", className: "w-4/12" },
        { label: "สถานะบนใบรับซ่อมอื่น", className: "w-2/12 text-center" },
    ];

    const fetchData = async () => {
        if (!supplier_repair_receipt_id || !supplier_delivery_note_id) {
            showToast("ข้อมูล ID ไม่ครบถ้วน", false);
            setIsLoading(false);
            setFormData(null);
            return;
        }
        setIsLoading(true);
        try {
            // getPayloadListForSupplierRepairReceipt uses supplier_repair_receipt_id from params
            const response = await getPayloadListForSupplierRepairReceipt(supplier_repair_receipt_id, supplier_delivery_note_id);
            if (response.statusCode === 200 && response.responseObject?.[0]) {
                const dataFromApi = response.responseObject[0];
                if (dataFromApi.id !== supplier_repair_receipt_id) {
                    console.warn(`Mismatch: API returned ID ${dataFromApi.id} but page parameter ID is ${supplier_repair_receipt_id}. Using page parameter ID as the owner.`);
                }
                // The primary ID for this form context should be supplier_repair_receipt_id from useParams
                const formOwnerReceiptId = supplier_repair_receipt_id;
           

                if (dataFromApi.delivery_note_repair_items && dataFromApi.delivery_note_repair_items.length > 0) {
                    dataFromApi.delivery_note_repair_items.sort((a, b) => {
                        const docA = a.repair_receipt_doc || '';
                        const docB = b.repair_receipt_doc || '';
                        if (docA !== docB) return docB.localeCompare(docA);
                        const nameA = a.master_repair_name || '';
                        const nameB = b.master_repair_name || '';
                        return nameA.localeCompare(nameB);
                    });
                }

                setFormData(dataFromApi);
                setValue('receipt_doc', dataFromApi.receipt_doc || '');
                setValue('supplier_name', dataFromApi.supplier_name || '');
                setValue('supplier_code', dataFromApi.supplier_code || '');

                const repairDate = dataFromApi.repair_date_supplier_repair_receipt || dataFromApi.date_of_submission;
                setValue('repair_date_supplier_repair_receipt', repairDate ? dayjs(repairDate).format('YYYY-MM-DD') : '');
                setValue('supplier_delivery_note_doc', dataFromApi.supplier_delivery_note_doc || '');

                const initialSelected = new Set<string>();
                const initialSaved = new Set<string>();

                dataFromApi.delivery_note_repair_items?.forEach(item => {
                    const listRecord = item.supplier_repair_receipt_list;
                    const deliveryNoteItemId = item.supplier_delivery_note_repair_receipt_list_id;

                    if (listRecord?.finish) {
                        // An item is "saved" by this form if its supplier_repair_receipt_id in DB matches the formOwnerReceiptId
                        const isActuallyLinkedToThisFormReceipt = listRecord.supplier_repair_receipt_id === formOwnerReceiptId;
                        // An item is "effectively linked" by doc if its finish_by_receipt_doc matches this form's receipt_doc
                        const isEffectivelyLinkedByMatchingDoc = listRecord.finish_by_receipt_doc === dataFromApi.receipt_doc; // Use dataFromApi.receipt_doc for this check

                        if (isActuallyLinkedToThisFormReceipt) {
                            initialSelected.add(deliveryNoteItemId);
                            initialSaved.add(deliveryNoteItemId);
                            
                        } else if (isEffectivelyLinkedByMatchingDoc) {
                            // If it's finished by a matching document number (but different srr_id),
                            // it should be selected (editable per previous rules), but not "saved" by this specific srr_id yet.
                            initialSelected.add(deliveryNoteItemId);
                        }
                    }
                });
                setSelectedItems(initialSelected);
                setSavedItems(initialSaved);
            } else {
                 showToast("ไม่พบข้อมูลที่ตรงกัน", false);
                 setFormData(null);
            }
        } catch (error) {
            showToast("ไม่สามารถดึงข้อมูลได้", false);
            setFormData(null);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [supplier_repair_receipt_id, supplier_delivery_note_id]);

    const handleCheckboxChange = ({ checked, rowData: row }: { checked: boolean; rowData: any }) => {
        const deliveryNoteItemId = row?.data?.supplier_delivery_note_repair_receipt_list_id;
        if (!deliveryNoteItemId) {
            console.error("No valid supplier_delivery_note_repair_receipt_list_id found for the row");
            return;
        }
        setSelectedItems(prev => {
            const newSet = new Set(prev);
            if (checked) newSet.add(deliveryNoteItemId);
            else newSet.delete(deliveryNoteItemId);
            return newSet;
        });
    };

    const handleFormSubmit = async () => {
        const currentFormDataState = formData; // Use the state formData
        // The primary ID for operations should be the one from useParams, as this defines the context of the page.
        const currentSupplierRepairReceiptIdForOperations = supplier_repair_receipt_id;
        const currentReceiptDocVal = currentFormDataState?.receipt_doc || "";

        if (!currentSupplierRepairReceiptIdForOperations || !currentFormDataState) {
            showToast("ไม่พบข้อมูลที่ต้องการบันทึก (ID หรือ form data ขาดหาย)", false);
            return;
        }

        setIsSaving(true);
        let saveError = false;

        try {
            const repairDateValue = watch("repair_date_supplier_repair_receipt");
            const formattedDate = formatDateToYYYYMMDD(repairDateValue);
            const originalDate = currentFormDataState.repair_date_supplier_repair_receipt ? dayjs(currentFormDataState.repair_date_supplier_repair_receipt).format('YYYY-MM-DD') : null;

            if (formattedDate && formattedDate !== originalDate) {
                const updateDatePayload = { id: currentSupplierRepairReceiptIdForOperations, repair_date_supplier_repair_receipt: formattedDate };
                try {
                    const response = await updateRepairDate(updateDatePayload);
                    if (!response.success) throw new Error(response.message || "Failed to update repair date");
                    // Optimistically update local state, or rely on fetchData to refresh
                    setFormData(prev => prev ? { ...prev, repair_date_supplier_repair_receipt: formattedDate } : null);
                } catch (error) {
                    showToast(`Error updating repair date: ${error instanceof Error ? error.message : String(error)}`, false);
                    saveError = true;
                }
            } else if (repairDateValue && !formattedDate) {
                showToast("รูปแบบวันที่ไม่ถูกต้อง (ต้องเป็น YYYY-MM-DD)", false);
                setIsSaving(false);
                return;
            }

            const actionPromises: Promise<any>[] = [];

            currentFormDataState.delivery_note_repair_items.forEach(item => {
                const deliveryNoteItemId = item.supplier_delivery_note_repair_receipt_list_id;
                const isSelectedNow = selectedItems.has(deliveryNoteItemId);
                // wasSavedByThisReceiptId checks if the item's srr_id was *already* linked to *this form's srr_id* (from useParams)
                // This state comes from `savedItems` which is populated by `fetchData`.
                const wasSavedByThisReceiptId = savedItems.has(deliveryNoteItemId);

                const existingListRecord = item.supplier_repair_receipt_list;
                // isAlreadyLinkedToThisReceiptIdInDb checks if the DB record's srr_id currently points to this form's srr_id.
                const isAlreadyLinkedToThisReceiptIdInDb = existingListRecord?.supplier_repair_receipt_id === currentSupplierRepairReceiptIdForOperations;


                if (isSelectedNow) {
                    if (!existingListRecord) {
                        if (!item.master_repair_receipt_id || !item.master_repair_id || !deliveryNoteItemId) {
                            // console.warn(`Skipping creation for item (${item.master_repair_name}) due to missing required IDs.`);
                            showToast(`ข้ามการสร้างรายการ "${item.master_repair_name}" เนื่องจากข้อมูล ID ไม่ครบถ้วน`, false);
                        } else {
                            const createPayload: CreateSupplierRepairReceiptListRequest = {
                                supplier_repair_receipt_id: currentSupplierRepairReceiptIdForOperations, // Link to this form's SRR ID
                                supplier_delivery_note_id: supplier_delivery_note_id,
                                supplier_delivery_note_repair_receipt_list_id: deliveryNoteItemId,
                                repair_receipt_id: item.master_repair_receipt_id,
                                master_repair_id: item.master_repair_id,
                                price: item.price,
                                quantity: item.quantity,
                                status: item.status || "pending",
                            };
                            actionPromises.push(
                                createSupplierRepairReceiptList(createPayload).then(response => {
                                    if (response.success && response.responseObject?.id) {
                                        const newId = response.responseObject.id;
                                        // After creation, explicitly set finish status and associate with this SRR ID and DOC
                                        const finishPayload = { finish: true, finish_by_receipt_doc: currentReceiptDocVal, supplier_repair_receipt_id: currentSupplierRepairReceiptIdForOperations };
                                        return updateFinishStatus(newId, finishPayload);
                                    } else if (!response.success) {
                                        throw new Error(response.message || `Failed to create item ${item.master_repair_name}`);
                                    }
                                    return response;
                                })
                            );
                        }
                    } else { // existingListRecord exists
                        // Check if it needs to be updated (e.g., was linked to another doc, or was finish:false)
                        const needsUpdate = !existingListRecord.finish ||
                                            existingListRecord.supplier_repair_receipt_id !== currentSupplierRepairReceiptIdForOperations ||
                                            existingListRecord.finish_by_receipt_doc !== currentReceiptDocVal;

                        if (needsUpdate) {
                             // If it's already linked to this srr_id OR linked by a matching doc number (and thus editable)
                            const canBeClaimed = isAlreadyLinkedToThisReceiptIdInDb || (existingListRecord.finish_by_receipt_doc === currentReceiptDocVal);

                            if (canBeClaimed) {
                                const payload = { finish: true, finish_by_receipt_doc: currentReceiptDocVal, supplier_repair_receipt_id: currentSupplierRepairReceiptIdForOperations };
                                actionPromises.push(updateFinishStatus(existingListRecord.id, payload));
                            } else {
                                 console.warn(`  WARNING: Item ${deliveryNoteItemId} (${item.master_repair_name}) is finished by a non-matching doc (${existingListRecord.finish_by_receipt_doc}). UI should prevent selection.`);
                            }
                        } 
                    }
                } else { // Item is being un-ticked (!isSelectedNow)
                    if (existingListRecord && existingListRecord.id) {
                        // An item should be deleted if:
                        // 1. It *was* saved by this receipt ID (wasSavedByThisReceiptId is true, meaning its srr_id in DB matched this form's srr_id on last fetch)
                        // OR
                        // 2. It was not directly saved by this srr_id, BUT it was finished, linked by a matching document (making it editable),
                        //    and its srr_id in DB currently points to this form's srr_id (meaning we "claimed" it in a previous save).
                        //    This second case might be redundant if `wasSavedByThisReceiptId` correctly reflects the "claimed" state.

                        // Simpler: If it was considered "saved by this receipt" (its srr_id in DB matched this form's srr_id in the last fetch)
                        // and now it's unselected, it should be deleted.
                        const shouldDelete = wasSavedByThisReceiptId;


                        if (shouldDelete) {
                            actionPromises.push(deleteSupplierRepairReceiptList(existingListRecord.id));
                        }
                    } else {
                        console.log(`  Action: NO DELETION (No existingListRecord or existingListRecord.id when unchecking).`);
                    }
                }
            });

            if (actionPromises.length > 0) {
                const results = await Promise.allSettled(actionPromises);
                results.forEach((result, index) => {
                    if (result.status === 'rejected') {
                        // console.error(`Action failed for item #${index}:`, result.reason);
                        saveError = true;
                        const reason = result.reason instanceof Error ? result.reason.message : String(result.reason);
                         showToast(`เกิดข้อผิดพลาด: ${reason}`, false);
                    } else if (result.status === 'fulfilled' && result.value && !result.value.success) {
                        // console.warn(`API call reported failure for item #${index}:`, result.value?.message);
                        saveError = true;
                        showToast(`เกิดข้อผิดพลาด: ${result.value?.message || 'Unknown API Error'}`, false);
                    }
                });
            }

            if (!saveError) {
                showToast("บันทึกข้อมูลสำเร็จ", true);
                await fetchData();
            } else {
                showToast("มีข้อมูลในใบส่งเคลมเเล้ว", false);
                await fetchData(); // Fetch data even on error to reflect current DB state
            }

        } catch (error) {
            showToast("เกิดข้อผิดพลาดร้ายแรงในการบันทึกข้อมูล", false);
            saveError = true;
        } finally {
            setIsSaving(false);
        }
    };

    const handleDelete = () => {
        if (!supplier_repair_receipt_id) {
            showToast("ไม่พบ ID ของรายการที่จะลบ", false);
            return;
        }
        setIsDeleteDialogOpen(true);
    };

    const handleDeleteConfirm = async () => {
        if (!supplier_repair_receipt_id) {
            showToast("ไม่พบ ID ของรายการที่จะลบ", false);
            setIsDeleteDialogOpen(false);
            return;
        }
        setIsDeleting(true);
        setIsDeleteDialogOpen(false);
        try {
            const response = await deleteSupplierRepairReceipt(supplier_repair_receipt_id);
            if (response && response.success) {
                showToast("ลบข้อมูลสำเร็จ", true);
                navigate("/get-supplier");
            } else {
                const apiMessage = response?.message || "ไม่สามารถลบข้อมูลได้";
                 const detailedMessage = apiMessage.includes("constraint")
                    ? "ไม่สามารถลบข้อมูลได้ เนื่องจากมีการใช้งานในส่วนอื่นแล้ว"
                    : apiMessage;
                showToast(detailedMessage, false);
            }
        } catch (error: any) {
            const errorMessage = error.response?.data?.responseObject || error.response?.data?.message || error.message || "เกิดข้อผิดพลาดในการเชื่อมต่อ";
            showToast(`ลบข้อมูลไม่สำเร็จ: ${errorMessage}`, false);
        } finally {
            setIsDeleting(false);
        }
    };

    const formatDateToYYYYMMDD = (date: string | Date | null | undefined): string | null => {
        if (!date) return null;
        const d = dayjs(date);
        return d.isValid() ? d.format('YYYY-MM-DD') : null;
    };

    if (isLoading) {
        return <BoxLoadingData minHeight="100vh" />;
    }

    if (!formData) {
        return (
            <div className="flex justify-center items-center h-screen">
                <p className="text-red-500">ไม่สามารถโหลดข้อมูลได้ หรือไม่พบข้อมูลสำหรับ ID ที่ระบุ</p>
            </div>
        );
    }

    const currentReceiptDocForForm = formData.receipt_doc;
    // The formOwnerReceiptId should be consistent with what's used in fetchData and handleFormSubmit
    const formOwnerReceiptIdForDisplay = supplier_repair_receipt_id;

    const rowData = formData.delivery_note_repair_items?.map((item) => {
        const listRecord = item.supplier_repair_receipt_list;
        const deliveryNoteItemId = item.supplier_delivery_note_repair_receipt_list_id;

        let isDisabled = false;
        let displayOtherReceiptDoc = "-";
        let initialCheckedStateBasedOnDb = false;

        if (listRecord && listRecord.finish) {
            const itemFinishingDoc = listRecord.finish_by_receipt_doc;
            // Is the item linked to *this specific form's supplier_repair_receipt_id*?
            const isFinishedByThisSpecificFormReceiptId = listRecord.supplier_repair_receipt_id === formOwnerReceiptIdForDisplay;

            if (isFinishedByThisSpecificFormReceiptId) {
                initialCheckedStateBasedOnDb = true;
                isDisabled = false;
                displayOtherReceiptDoc = "-";
            } else { // Finished by another srr_id
                if (currentReceiptDocForForm === itemFinishingDoc) { // But the doc number matches
                    initialCheckedStateBasedOnDb = true;
                    isDisabled = false;
                    displayOtherReceiptDoc = "-";
                } else { // Doc number does not match
                    initialCheckedStateBasedOnDb = true;
                    isDisabled = true;
                    displayOtherReceiptDoc = itemFinishingDoc || "N/A";
                }
            }
        } else {
            initialCheckedStateBasedOnDb = false;
            isDisabled = false;
            displayOtherReceiptDoc = "-";
        }

        const finalVisualCheckedState = isDisabled
            ? initialCheckedStateBasedOnDb
            : selectedItems.has(deliveryNoteItemId);

        return {
            className: '',
            cells: [
                { value: item.repair_receipt_doc || "-", className: 'text-center' },
                { value: item.master_repair_name || "-", className: '' },
                { value: displayOtherReceiptDoc, className: 'text-center' },
                {
                    value: { isChecked: finalVisualCheckedState },
                    disabled: isDisabled,
                    className: ''
                },
            ],
            data: item,
        };
    }) || [];

    const inputs = [
        {
            id: "repair_date_supplier_repair_receipt",
            type: "date" as const,
            label: "วันที่รับซ่อม supplier",
            defaultValue: formData?.repair_date_supplier_repair_receipt ? dayjs(formData.repair_date_supplier_repair_receipt).format('YYYY-MM-DD') : '',
            value: watch("repair_date_supplier_repair_receipt") || "",
            onChange: (value: string) => setValue("repair_date_supplier_repair_receipt", value),
            disabled: isSaving || isDeleting
        },
        { id: "receipt_doc_supplier", type: "text" as const, label: "เลขที่ใบรับซ่อมซับพลายเออร์", value: watch("receipt_doc") || "", onChange: () => {}, disabled: true },
        { id: "supplier_delivery_note", type: "text" as const, label: "เลขที่ใบส่งซ่อมซับพลายเออร์", value: watch("supplier_delivery_note_doc") || "", onChange: () => {}, disabled: true },
        { id: "supplier_name", type: "text" as const, label: "ชื่อร้านค้า", value: watch("supplier_name") || "", onChange: () => {}, disabled: true },
        { id: "supplier_code", type: "text" as const, label: "รหัสร้านค้า", value: watch("supplier_code") || "", onChange: () => {}, disabled: true }
    ];

    return (
        <>
             {isSaving && <BoxLoadingData />}
            <SupplierComponent
                headers={headers}
                rowData={rowData}
                inputs={inputs}
                onCheckBoxChange={handleCheckboxChange}
                onSubmit={handleSubmit(handleFormSubmit)}
                onDelete={handleDelete}
                checkboxLabel="รับซ่อม"
                checkboxColumnIndex={3}
                showDeleteButton={true}
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
                    คุณแน่ใจหรือไม่ว่าต้องการลบรายการนี้? <br />
                    เลขที่ใบรับซ่อม <span className="font-semibold text-red-500">{formData?.receipt_doc || "-"}</span>
                    <br />
                    เลขที่ใบส่งซ่อม <span className="font-semibold text-red-500">{formData?.supplier_delivery_note_doc || "-"}</span>
                    <br />
                    ชื่อร้านค้า <span className="font-semibold text-red-500">{formData?.supplier_name || "-"}</span>
                </p>
            </DialogComponent>
        </>
    );
};

export default FormCreateGetSupplier;