import { useState, useEffect } from "react";
import { PayloadListResponse } from "@/types/response/response.supplier-repair-receipt-list";
import { useNavigate, useParams } from "react-router-dom";
import { useToast } from "@/components/customs/alert/toast.main.component";
import DialogComponent from "@/components/customs/dialog/dialog.main.component";
import { useSearchParams } from "react-router-dom";
import { 
    getPayloadListForSupplierRepairReceipt, 
    updateFinishStatus,
    updateSupplierRepairReceiptList,
    updateRepairDate,
} from "@/services/supplier-repair-receipt.service-list";
import { UpdateRepairDateRequest } from "@/types/requests/request.supplier-repair-receipt-list";
import { Flex, Grid } from "@radix-ui/themes";
import InputAction from "@/components/customs/input/input.main.component";
import InputDatePicker from "@/components/customs/input/input.datePicker";
import { BoxLoadingData } from "@/components/customs/boxLoading/BoxLoadingData";
import { useForm } from "react-hook-form";
import dayjs from "dayjs";
import Buttons from "@/components/customs/button/button.main.component";
import MasterTableFeature from "@/components/customs/display/master.main.component";

const SupplierRepairReceiptFormFeatures = () => {
    const [isLoading, setIsLoading] = useState(true);
    const [formData, setFormData] = useState<PayloadListResponse | null>(null);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState<boolean>(false);
    const [mainId, setMainId] = useState<string>('');
    const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set());
    const [savedItems, setSavedItems] = useState<Set<string>>(new Set());
    const [pendingChanges, setPendingChanges] = useState<Map<string, boolean>>(new Map());
    const { showToast } = useToast();
    const navigate = useNavigate();
    const { id } = useParams();
    const { register, watch, setValue, handleSubmit } = useForm();
    const [searchParams, setSearchParams] = useSearchParams();

    useEffect(() => {
        const fetchPayloadData = async () => {
            if (id) {
                setIsLoading(true);
                try {
                    const response = await getPayloadListForSupplierRepairReceipt(id);
                    if (response.statusCode === 200 && response.responseObject) {
                        if (response.responseObject[0]) {
                            setFormData(response.responseObject[0]);
                            setMainId(response.responseObject[0].id);
                            setValue('receipt_doc', response.responseObject[0].receipt_doc);
                            setValue('supplier_name', response.responseObject[0].supplier_name);
                            setValue('repair_date_supplier_repair_receipt', response.responseObject[0].repair_date_supplier_repair_receipt);
                            setValue('supplier_delivery_note_doc', response.responseObject[0].supplier_delivery_note_doc);

                            const finishedItems = new Set(
                                response.responseObject[0].repair_items
                                    ?.filter(item => item.finish)
                                    .map(item => item.supplier_repair_receipt_lists_id)
                            );
                            setSelectedItems(finishedItems);
                            setSavedItems(finishedItems);
                        }
                    }
                } catch (error) {
                    showToast("ไม่สามารถดึงข้อมูลได้", false);
                    console.error("Error fetching payload data:", error);
                } finally {
                    setIsLoading(false);
                }
            }
        };

        fetchPayloadData();
    }, [id, setValue]);

    const handleItemSelection = (checked: boolean, item: any) => {
        if (!savedItems.has(item.id)) {
            setSelectedItems(prev => {
                const newSet = new Set(prev);
                if (checked) {
                    newSet.add(item.id);
                } else {
                    newSet.delete(item.id);
                }
                return newSet;
            });

            setPendingChanges(prev => {
                const newChanges = new Map(prev);
                newChanges.set(item.id, checked);
                return newChanges;
            });
        }
    };

    const onSubmit = async (data: any) => {
        if (!mainId) return;
        
        setIsLoading(true);
        try {
            const updatePromises = Array.from(pendingChanges.entries()).map(([itemId, checked]) =>
                updateFinishStatus(itemId, { finish: checked })
            );

            await Promise.all(updatePromises);

            setSavedItems(prev => {
                const newSavedItems = new Set(prev);
                pendingChanges.forEach((checked, itemId) => {
                    if (checked) {
                        newSavedItems.add(itemId);
                    }
                });
                return newSavedItems;
            });

            setPendingChanges(new Map());

            const currentRepairDate = formData?.repair_date_supplier_repair_receipt;
            const updatedRepairDate = data.repair_date_supplier_repair_receipt;

            if (currentRepairDate !== updatedRepairDate) {
                const updateData: UpdateRepairDateRequest = {
                    id: mainId,
                    repair_date_supplier_repair_receipt: updatedRepairDate,
                };
                
                const response = await updateRepairDate(updateData);
                
                if (response.statusCode !== 200) {
                    throw new Error("Failed to update repair date");
                }
            }

            showToast("บันทึกข้อมูลสำเร็จ", true);
            navigate("/supplier-repair-receipt");
        } catch (error) {
            showToast("เกิดข้อผิดพลาดในการบันทึกข้อมูล", false);
            console.error("Error saving changes:", error);
            
            if (formData?.repair_items) {
                const originalFinishedItems = new Set(
                    formData.repair_items
                        .filter(item => item.finish)
                        .map(item => item.supplier_repair_receipt_lists_id)
                );
                setSelectedItems(originalFinishedItems);
            }
        } finally {
            setIsLoading(false);
        }
    };    

    const handleDeleteConfirm = async () => {
        setIsDeleteDialogOpen(false);
        showToast("ลบข้อมูลสำเร็จ", true);
        handleClickToNavigate();
    };

    const handleDeleteClose = () => {
        setIsDeleteDialogOpen(false);
        handleClickToNavigate();
    };

    const handleClickToNavigate = () => {
        setSearchParams({ tab: "addSupplier" });
    };

    if (isLoading) {
        return <BoxLoadingData minHeight="100vh" />;
    }

    if (!formData) {
        return null;
    }

    const disableField = formData.status === "success";

    const tableHeaders = [
        { label: "ใบรับซ่อม", className: "w-32" },
        { label: "รายการ" },
        { label: "ใบรับซ่อมซับพลายเออร์", className: "w-32" },
        { label: "เลือก", className: "w-16" },
    ];

    const tableRowData = formData.repair_items?.map(item => ({
        className: "",
        cells: [
            { value: item.repair_receipt_doc || "-" },
            { value: item.master_repair_name },
            {
                value: selectedItems.has(item.supplier_repair_receipt_lists_id) ? item.receipt_doc : "-",
                className: selectedItems.has(item.supplier_repair_receipt_lists_id) ? "" : "text-gray-300"
            },
            savedItems.has(item.supplier_repair_receipt_lists_id) 
                ? { value: " ", type: "text", className: "text-green-500 font-bold text-center" }
                : {
                    value: selectedItems.has(item.supplier_repair_receipt_lists_id),
                    type: "checkbox",
                    data: item,
                    disable: disableField,
                },
        ],
        data: item,
    })) || [];

    const hasUnsavedChanges = pendingChanges.size > 0;

    return (
        <>
            <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-3 w-full mt-4 bg-white rounded-md p-6">
                <Grid
                    columns={{ initial: "1", md: "2", sm: "2", lg: "3", xl: "3" }}
                    gap="3"
                    rows="repeat(2, auto)"
                    width="auto"
                >
                    <InputAction
                        id="receipt_doc"
                        label="เลขที่ใบรับซ่อม"
                        defaultValue={watch("receipt_doc") || ""}
                        value={watch("receipt_doc") || ""}
                        classNameInput="w-full"
                        size="2"
                        disabled
                    />
                    <InputAction
                        id="supplier_delivery_note_doc"
                        label="เลขที่ใบส่งซ่อม"
                        defaultValue={watch("supplier_delivery_note_doc") || ""}
                        value={watch("supplier_delivery_note_doc") || ""}
                        classNameInput="w-full"
                        size="2"
                        disabled
                    />
                    <InputAction
                        id="supplier_name"
                        label="รหัสร้านค้า"
                        defaultValue={watch("supplier_name") || ""}
                        value={watch("supplier_name") || ""}
                        className="col-span-2"
                        size="2"
                        disabled
                    />
                </Grid>

                <Grid
                    columns={{ initial: "1", md: "2", sm: "2", lg: "3", xl: "3" }}
                    gap="3"
                    rows="repeat(2, auto)"
                    width="auto"
                >
                    <InputDatePicker
                        id="repair_date"
                        labelName="วันที่รับซ่อม"
                        onchange={(date) =>
                            date && setValue("repair_date_supplier_repair_receipt", dayjs(date).format("YYYY-MM-DD"))
                        }
                        defaultDate={
                            watch("repair_date_supplier_repair_receipt")
                                ? dayjs(watch("repair_date_supplier_repair_receipt")).toDate()
                                : undefined
                        }
                        disabled={disableField}
                    />
                </Grid>

                <MasterTableFeature
                    title=""
                    headers={tableHeaders}
                    rowData={tableRowData}
                    inputs={[]}
                    hideTitle={false}
                    hideTitleBtn={true}
                    hidePagination={true}
                    onChangeValueCellItem={handleItemSelection}
                />

                {formData.status !== "success" && (
                    <Flex
                        gap="4"
                        justify="end"
                        direction={{
                            initial: "column",
                            xs: "column",
                            sm: "row",
                            md: "row",
                            lg: "row",
                            xl: "row",
                        }}
                    >
                        <Buttons
                            type="submit"
                            btnType="submit"
                            className="w-[100px] max-sm:w-full"
                        >
                            บันทึกข้อมูล {hasUnsavedChanges}
                        </Buttons>
                    </Flex>
                )}
            </form>

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
                    เลขที่ใบรับซ่อม <span className="text-red-500">{formData?.receipt_doc || "-"}</span>
                    <br />
                    เลขที่ใบส่งซ่อม <span className="text-red-500">{formData?.supplier_delivery_note_doc || "-"}</span>
                    <br />
                    รหัสร้านค้า <span className="text-red-500">{formData?.supplier_name || "-"}</span>
                </p>
            </DialogComponent>
        </>
    );
};

export default SupplierRepairReceiptFormFeatures;