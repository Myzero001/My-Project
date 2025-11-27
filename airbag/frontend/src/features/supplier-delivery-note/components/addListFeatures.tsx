import { useState, useEffect } from "react";
import { Table, Flex, Box } from "@radix-ui/themes";
import InputAction from "@/components/customs/input/input.main.component";
import { PayLoadCreatSupplierDeliveryNoteList } from "@/types/requests/request.supplier-delivery-note-list";
import { useForm } from "react-hook-form";
import { useParams, useSearchParams } from "react-router-dom";
import { getRepairReciptSelect, getSupplierDeliveryNoteById } from "@/services/supplier-delivery-note.service.";
import { useToast } from "@/components/customs/alert/toast.main.component";
import { TypeSupplierDeliveryNote } from "@/types/response/response.supplier-delivery-note";
import MasterSelectComponent from "@/components/customs/select/select.main.component";
import { getRepairReceiptListRepairByRepairReceiptId } from "@/services/repair.receipt.list.repair.service";
import CheckboxMainComponent from "@/components/customs/checkboxs/checkbox.main.component";
import Buttons from "@/components/customs/button/button.main.component";
import { getBySDNandRRidSelect, submitSupplierDeliveryNoteList } from "@/services/supplier-delivery-note-list.service";

interface Props {
    repairReceiptId?: string | undefined | null;
    onSubmitSuccess?: () => void;
}

// Interface สำหรับรายการซ่อมแต่ละชิ้น
interface RepairListItem {
    sdnID: string;
    disable: boolean;

    status: boolean; // สถานะ (true = ซ่อม, false = ไม่ซ่อม)
    idRepairList: string; // รหัสรายการซ่อม
    receiptListName: string; // ชื่อรายการซ่อม
    price: number; // ราคา
    qty: number; // จำนวน
    total: number; // ราคา * จำนวน
}

// Interface สำหรับใบรับซ่อม
interface RepairReceipt {
    id: string; // รหัสใบรับซ่อม
    repairList: RepairListItem[]; // รายการซ่อมที่เกี่ยวข้อง
}


export default function SupplierDeliveryNoteAddListFeatures({ repairReceiptId, onSubmitSuccess }: Props) {
    const { sndId } = useParams();
    const { showToast } = useToast();

    const [supplierData, setSuplierData] = useState<TypeSupplierDeliveryNote>();
    const [error, setError] = useState<string | undefined>(undefined);
    const [selectedOption, setSelectedOption] = useState<string | null>(null);                                          // option ของ select
    const [optionName, setOptionName] = useState<string | null>(null);                                                  // ชื่อ optionที่เลือก ของ select  
    const [repairReceipt, setRepairReceipt] = useState<RepairReceipt | null>(null);                                     // ชุดข้อมูลสำหรับสร้างรายการส่งซ่อม
    const totalQty = repairReceipt?.repairList.reduce((sum, item) => sum + (isNaN(item.qty) ? 0 : item.qty), 0) || 0;
    const totalPrice = repairReceipt?.repairList.reduce((sum, item) => sum + (isNaN(item.total) ? 0 : item.total), 0) || 0;

    const [searchParams, setSearchParams] = useSearchParams();

    const {
        formState: { errors },
        watch,
        setValue,
    } = useForm<PayLoadCreatSupplierDeliveryNoteList>({
        defaultValues: {
            supplier_delivery_note_doc: "",
        },
    });

    const fetchMSSupplierById = () => {
        if (sndId) {
            getSupplierDeliveryNoteById(sndId)
                .then((res) => {
                    if (res.responseObject) {
                        const supplier = res.responseObject;
                        setSuplierData(supplier);
                        setValue("supplier_delivery_note_doc", supplier.supplier_delivery_note_doc ?? "");
                    } else {
                        // console.error("No responseObject found in response:", res);
                    }
                })
                .catch((err) => {
                    showToast("Error fetching supplier: " + err.message, false);
                });
        }
    };


    useEffect(() => {
        if (repairReceiptId) {
            setSelectedOption(repairReceiptId);
        }
    }, [repairReceiptId]);

    // ดึงข้อมูลเลขที่ใบส่งซับพลายเออร์
    useEffect(() => {
        fetchMSSupplierById();
    }, []);

    // ดึงข้อมูลในตาราง
    const fetchData = () => {
        if (selectedOption && sndId) {
            setRepairReceipt(null);
            Promise.all([
                getBySDNandRRidSelect(selectedOption),
                getRepairReceiptListRepairByRepairReceiptId(selectedOption),
            ])
                .then(([response2, response]) => {
                    const previousData = response2.responseObject || [];
                    const repairReceiptList = response.responseObject || [];


                    // ฟังก์ชันค้นหาราคาและจำนวนจากข้อมูลเดิม
                    const findPreviousItem = (idRepairList: string) =>
                        previousData.find((prevItem: any) =>
                            prevItem.master_repair_id === idRepairList &&
                            prevItem.repair_receipt_id === selectedOption
                        );

                    const repairReceiptData: RepairReceipt = {
                        id: selectedOption || "",
                        repairList: repairReceiptList.map((item: any) => {
                            const previousItem = findPreviousItem(
                                item.master_repair_id
                            );
                            const isSameSdnId = previousItem?.supplier_delivery_note_id === sndId;

                            return {
                                sdnID: previousItem?.supplier_delivery_note_id ?? "",
                                disable: previousItem ? !isSameSdnId : false, // ถ้ามีข้อมูลเดิม แต่ sdnID ไม่ตรงกัน ให้ disable
                                status: !!previousItem,
                                idRepairList: item.master_repair.master_repair_id || "",
                                receiptListName: item.master_repair.master_repair_name,
                                price: previousItem ? previousItem.price : item.price ?? 0, // ถ้ามีข้อมูลเก่าให้ใช้
                                qty: previousItem ? previousItem.quantity : 1, // ถ้ามีข้อมูลเก่าให้ใช้
                                total: (previousItem ? previousItem.price * previousItem.quantity : item.price ?? 0 * 1),
                            };
                        }),
                    };

                    setRepairReceipt(repairReceiptData);
                })
                .catch((error) => {
                    console.error("Error fetching data:", error);
                });

        }
    };

    // ฟังก์ชันอัปเดตค่า price, qty และ total
    const updateRepairList = (id: string, field: "price" | "qty", value: number) => {
        if (!repairReceipt) return;

        const sanitizedValue = isNaN(value) || value < 0 ? 0 : value; // ตรวจสอบค่า NaN และค่าติดลบ
        const updatedList = repairReceipt.repairList.map((item) => {
            if (item.idRepairList === id) {
                const updatedItem = {
                    ...item,
                    [field]: sanitizedValue,
                };
                return { ...updatedItem, total: updatedItem.price * updatedItem.qty };
            }
            return item;
        });

        setRepairReceipt({ ...repairReceipt, repairList: updatedList });
    };
    // ฟังก์ชันอัปเดตค่า status
    const updateRepairListStatus = (id: string, field: "status", value: boolean) => {
        if (!repairReceipt) return;

        const updatedList = repairReceipt.repairList.map((item) => {
            if (item.idRepairList === id) {
                const updatedItem = {
                    ...item,
                    [field]: value,
                };
                return { ...updatedItem };
            }
            return item;
        });

        setRepairReceipt({ ...repairReceipt, repairList: updatedList });
    };

    // เรียกใช้ fetchData ทุกครั้งที่มีการเลือกใบรับซ่อม
    useEffect(() => {
        if (selectedOption) {
            fetchData();
        } else {
            setRepairReceipt(null);
        }

    }, [selectedOption]);

    const headers = [
        { label: "เลือก", colSpan: 1, className: "w-1/12" },
        { label: "รายการซ่อม", colSpan: 1, className: "w-5/12" },
        { label: "ราคา", colSpan: 1, className: "w-2/12" },
        { label: "จำนวน", colSpan: 1, className: "w-2/12" },
        { label: "รวม", colSpan: 1, className: "w-2/12" },
    ];

    // ส่งข้อมูลเพื่อสร้าง
    const onSubmit = async () => {
        if (!repairReceipt) {
            showToast("ไม่มีข้อมูลใบรับซ่อม", false);
            return;
        }

        // คัดกรองเฉพาะรายการที่ `statue: true`
        // const selectedItems = repairReceipt.repairList.filter(item => item.status === true);
        const selectedItems = repairReceipt.repairList;
        const selectedItemsisTrue = repairReceipt.repairList.filter(item => item.status === true);

        // if (selectedItemsisTrue.length === 0) {
        //     showToast("กรุณาเลือกอย่างน้อยหนึ่งรายการ", false);
        //     return;
        // }
        const payload = {
            supplier_delivery_note_id: supplierData?.supplier_delivery_note_id ?? "",
            repair_receipt_id: repairReceipt.id,
            repairList: selectedItems
                .filter(item => item.disable === false)
                .map(item => ({
                    status: item.status,
                    id_repair_list: item.idRepairList,
                    price: isNaN(item.price) ? 0 : item.price, // ป้องกัน NaN
                    qty: isNaN(item.qty) ? 0 : item.qty,       // ป้องกัน NaN
                    total: isNaN(item.total) ? 0 : item.total  // ป้องกัน NaN
                })),
        };

        try {
            submitSupplierDeliveryNoteList(payload).then((res) => {
                const count = res?.responseObject;
                if (res?.responseObject === null || res?.responseObject === undefined) {
                    showToast("บันทึกข้อมูลเรียบร้อย", true);
                    onSubmitSuccess?.(); // เปลี่ยนแท็บ
                } else {
                    showToast(`ไม่สามารถลบได้ มีรายการซ่อม ${count} รายการรับซ่อมซัพพลายเออร์แล้ว`, false);
                    fetchData();
                }
            });

        } catch (error) {
            showToast("เกิดข้อผิดพลาด", false);
            fetchData();
        }
    };

    return (
        <Box className="w-full mt-4 bg-white border-0 rounded-md relative overflow-visible p-6">
            <Flex className="w-full " gap="2" wrap="wrap">
                <InputAction
                    placeholder={"เลขที่ใบส่งซับพลายเออร์"}
                    label="เลขที่ใบส่งซับพลายเออร์"
                    value={watch("supplier_delivery_note_doc") as string}
                    onChange={(event) => event.target.value}
                    disabled={true} size={"2"}
                    defaultValue={""}
                    classNameInput="w-full  min-w-[200px]"
                />
                <MasterSelectComponent
                    label="ใบรับซ่อม"
                    onChange={(option) => {
                        const value = option ? String(option.value) : undefined;
                        const label = option ? String(option.label) : undefined;
                        if (value !== undefined && label !== undefined) {
                            setSelectedOption(value);
                            setOptionName(label);
                            setError(undefined);
                        } else {
                            setSelectedOption(null);
                            setError("กรุณาเลือกใบรับซ่อม");
                        }
                    }}
                    defaultValue={
                        selectedOption
                            ? { value: selectedOption, label: selectedOption } // ถ้ามี selectedOption ให้ใช้ค่า
                            : null
                    }
                    valueKey="id"
                    labelKey="repair_receipt_doc"
                    placeholder="กรุณาเลือก..."
                    className="text-left w-1/3 min-w-[200px]"
                    fetchDataFromGetAPI={getRepairReciptSelect}
                // errorMessage={error}
                />
            </Flex>

            {/* ตาราง */}
            <Table.Root className="mt-3 bg-[#fefffe] rounded-md overflow-hidden">
                <Table.Header className="sticky top-0 z-0 rounded-t-md">
                    <Table.Row className="text-center bg-main text-white sticky top-0 z-10">
                        {headers.map((header, index) => (
                            <Table.ColumnHeaderCell
                                key={index}
                                colSpan={header.colSpan}
                                className={`${index === 0 ? "rounded-tl-md" : ""}${index === headers.length - 1 ? "rounded-tr-md" : ""} h-7`}
                            >
                                {header.label}
                            </Table.ColumnHeaderCell>
                        ))}
                    </Table.Row>
                </Table.Header>
                <Table.Body>
                    {repairReceipt?.repairList.length ? (
                        repairReceipt.repairList.map((item) => (
                            <Table.Row key={item.idRepairList} className="hover:bg-gray-100">
                                {/* Checkbox */}
                                <Table.Cell className="text-center w-1/12">
                                    <Box className="w-full flex justify-center">
                                        <CheckboxMainComponent
                                            defaultChecked={item.status}
                                            onChange={(checked: boolean) => {
                                                updateRepairListStatus(item.idRepairList, "status", checked);
                                            }}
                                            disabled={item.disable}
                                        />
                                    </Box>
                                </Table.Cell>

                                {/* รายการซ่อม */}
                                <Table.Cell className="text-left w-5/12">{item.receiptListName || "-"}</Table.Cell>

                                {/* ราคา */}
                                <Table.Cell className="text-right w-2/12">
                                    <Box className="w-full flex justify-center">
                                        <InputAction
                                            value={String(item.price)}
                                            onChange={(e) => updateRepairList(item.idRepairList, "price", Number(e.target.value))}
                                            classNameInput="text-right pr-2"
                                            disabled={item.disable}
                                        />
                                    </Box>
                                </Table.Cell>

                                {/* จำนวน */}
                                <Table.Cell className="text-right w-2/12">
                                    <Box className="w-full flex justify-center">
                                        <InputAction
                                            value={String(item.qty)}
                                            onChange={(e) => updateRepairList(item.idRepairList, "qty", Number(e.target.value))}
                                            classNameInput="text-right pr-2"
                                            disabled={item.disable}
                                        />
                                    </Box>
                                </Table.Cell>

                                {/* รวมราคา */}
                                <Table.Cell className="text-right w-2/12">{item.total.toFixed(2)}</Table.Cell>
                            </Table.Row>
                        )).concat(
                            <Table.Row className="bg-gray-200 font-bold">
                                <Table.Cell colSpan={2} className="text-right">รวมทั้งหมด</Table.Cell>
                                <Table.Cell className="text-right"></Table.Cell> {/* ช่องว่าง */}
                                <Table.Cell className="text-right">{totalQty}</Table.Cell>
                                <Table.Cell className="text-right">{totalPrice.toFixed(2)}</Table.Cell>
                            </Table.Row>
                        )
                    ) : (
                        <Table.Row>
                            <Table.Cell colSpan={headers.length} className="text-center h-64 align-middle">
                                No Data Found
                            </Table.Cell>
                        </Table.Row>
                    )}
                </Table.Body>
            </Table.Root>
            {/* button */}
            <Flex className="w-full mt-6" justify={"end"} gap="4" wrap="wrap">
                <Buttons btnType="submit"
                    onClick={onSubmit}
                    className="w-[100px] max-sm:w-full mt-0">
                    บันทึกข้อมูล
                </Buttons>
            </Flex>
        </Box>
    );
}
