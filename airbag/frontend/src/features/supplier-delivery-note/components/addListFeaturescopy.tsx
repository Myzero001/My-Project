import { useState, useEffect } from "react";
import MasterSelectComponent from "@/components/customs/select/select.main.component";
import { getRepairReciptSelect } from "@/services/supplier-delivery-note.service.";
import { getRepairReceiptListRepairByRepairReceiptId } from "@/services/repair.receipt.list.repair.service";
import { Table, Flex, Box, Text } from "@radix-ui/themes";
import InputAction from "@/components/customs/input/input.main.component";
import { useForm } from "react-hook-form";
import { PayLoadCreatSupplierDeliveryNoteList } from "@/types/requests/request.supplier-delivery-note-list";
import { getSupplierDeliveryNoteById, updateSupplierDeliveryNote, deleteSupplierDeliveryNote } from "@/services/supplier-delivery-note.service."
import { createSupplierDeliveryNoteList } from "@/services/supplier-delivery-note-list.service";
import { useParams } from "react-router-dom";
import { TypeSupplierDeliveryNote } from "@/types/response/response.supplier-delivery-note";
import { useToast } from "@/components/customs/alert/toast.main.component";
import Buttons from "@/components/customs/button/button.main.component";
import CheckboxMainComponent from "@/components/customs/checkboxs/checkbox.main.component";
import { repairReceiptListRepair } from "@/types/response/response.repair_receipt_list_repair";
import { getBySDNandRRidSelect, deleteSupplierDeliveryNoteList, updateSupplierDeliveryNoteList } from "@/services/supplier-delivery-note-list.service";
import { TypeSDNandRRidSelect } from "@/types/response/response.supplier-delivery-note-list";
import DialogComponent from "@/components/customs/dialog/dialog.main.component";

interface Props {
    repairReceiptId: string | undefined | null;
}

export default function SupplierDeliveryNoteAddListFeatures2({ repairReceiptId }: Props) {
    // console.log("repairReceiptId mี่ส่งมา", repairReceiptId);

    const [supplierData, setSuplierData] = useState<TypeSupplierDeliveryNote>();
    const { sndId } = useParams();
    const { showToast } = useToast();

    const [isConfirmDeleteDialogOpen, setIsConfirmDeleteDialogOpen] = useState(false);
    const [error, setError] = useState<string | undefined>(undefined);

    const [data, setData] = useState<any[]>([]);                                                                        //ข้อมูลที่จะแสดงในตาราง
    const [msRepairName, setMsRepairName] = useState<string | undefined>(undefined);                                    // ชื่อ ของ รายการซ่อม
    const [selectedOption, setSelectedOption] = useState<string | null>(null);                                          // option ของ select
    const [optionName, setOptionName] = useState<string | null>(null);                                                  // ชื่อ optionที่เลือก ของ select                        
    const [repairReceiptData, setRepairReceiptData] = useState<repairReceiptListRepair[] | undefined>(undefined);     // ข้อมูลใบรับซ่อม
    const [sDNRepairReceiptData, setSDNRepairReceiptData] = useState<TypeSDNandRRidSelect[] | undefined>(undefined);  // ข้อมูลใบส่งซ่อม

    const [price, setPrice] = useState<number>(0);
    const [itquantity, setQuantity] = useState<number>(0);

    const [priceState, setPriceState] = useState<{ [key: string]: number }>({});
    const [quantityState, setQuantityState] = useState<{ [key: string]: number }>({});

    const [haveSDNListId, setHaveSDNListId] = useState("");     //ไอดี รายการในใบส่งซ่อมเพื่อลบ

    // คำนวณแถวสุดท้าย
    const [totalQuantity, setTotalQuantity] = useState(0);
    const [totalAmount, setTotalAmount] = useState(0);

    const [total, setTotal] = useState(0);

    //----------
    const [existingIds, setExistingIds] = useState<string[]>([]); // เก็บ UUID ที่ตรงเงื่อนไข (บันทึกแล้ว)                  ms_repair_id
    const [existingSDNListIds, setExistingSDNListIds] = useState<string[]>([]); // เก็บ UUID ที่ตรงเงื่อนไข (บันทึกแล้ว)    SDNList_id

    const [newIds, setNewIds] = useState<string[]>([]); // เก็บ UUID ที่ไม่ตรงเงื่อนไข (ยังไม่ได้บันทึก) ms_repair_id

    const {
        handleSubmit,
        formState: { errors },
        watch,
        setValue,
        register,
        control,
    } = useForm<PayLoadCreatSupplierDeliveryNoteList>({
        defaultValues: {
            supplier_delivery_note_doc: "",
        },
    });
    useEffect(() => {
        if (repairReceiptId) {
            setSelectedOption(repairReceiptId);
        }
    }, [repairReceiptId]);

    useEffect(() => {
        console.log("อัปเดต priceState:", priceState);
    }, [priceState]); // รันทุกครั้งที่ priceState เปลี่ยนแปลง
    

    const fetchData = () => {
        if (selectedOption && sndId) {
            setData([]);

            getRepairReceiptListRepairByRepairReceiptId(selectedOption) //ใบรับซ่อม
                .then((response) => {
                    const RepairReceiptListRepair = response.responseObject || [];
                    // console.log("RepairReceiptListRepair:", RepairReceiptListRepair);
                    setRepairReceiptData(RepairReceiptListRepair);

                    getBySDNandRRidSelect(selectedOption , sndId).then((response2) => {  //ใบส่งซ่อม ถ้ามี
                        const SDNandRRidSelect = response2.responseObject || [];
                        // console.log("SDNandRRidSelect:", SDNandRRidSelect);
                        setSDNRepairReceiptData(SDNandRRidSelect);

                        const newPriceState: { [key: string]: number } = {};
                        const newQuantityState: { [key: string]: number } = {};

                        const newExistingSDNListIds: string[] = [];
                        const newExistingIds: string[] = [];
                        const newNewIds: string[] = [];

                        // const formattedData = RepairReceiptListRepair.map((item) => {
                        //     const relatedData = SDNandRRidSelect.find((sdn) => {
                        //         const isMatch =
                        //             sdn.supplier_delivery_note_id === sndId &&
                        //             sdn.master_repair_id === item.master_repair_id &&
                        //             sdn.repair_receipt_id === item.master_repair_receipt_id;
                        //         if (isMatch) {
                        //             // set
                        //             // set
                        //             setMsRepairName(item.master_repair?.master_repair_name);
                        //             newExistingIds.push(sdn.master_repair_id);
                        //             newExistingSDNListIds.push(sdn.supplier_delivery_note_repair_receipt_list_id);

                        //             newPriceState[sdn.master_repair_id] = sdn.price ?? item.price;
                        //             newQuantityState[sdn.master_repair_id] = sdn.quantity ?? 1;
                        //             return true;
                        //         }

                        //         return false;
                        //     });
                        //     if (!relatedData) {
                        //         setNewIds((prev) => [...prev, item.master_repair_id]); // เก็บ UUID ที่ยังไม่ได้บันทึกใน SDNList
                        //     }
                        //     const isChecked = relatedData ? true : false;
                        //     // const isDisabled = newIds.includes(item.master_repair.master_repair_id) ? false : true; // Disable if ID is in newIds
                        //     console.log("isChecked:", isChecked);
                        const formattedData = RepairReceiptListRepair.map((item) => {
                            const relatedData = SDNandRRidSelect.find((sdn) => {
                                return (
                                    sdn.supplier_delivery_note_id === sndId &&
                                    sdn.master_repair_id === item.master_repair_id &&
                                    sdn.repair_receipt_id === item.master_repair_receipt_id
                                );
                            });

                            if (relatedData) {
                                // ถ้ามี match ใน SDNandRRidSelect
                                setMsRepairName(item.master_repair?.master_repair_name);
                                newExistingIds.push(relatedData.master_repair_id);
                                newExistingSDNListIds.push(relatedData.supplier_delivery_note_repair_receipt_list_id);

                                newPriceState[relatedData.master_repair_id] = relatedData.price ?? item.price;
                                newQuantityState[relatedData.master_repair_id] = relatedData.quantity ?? 1;
                            } else {
                                // ถ้าไม่มี match ให้ใช้ค่าจาก formattedData
                                setNewIds((prev) => [...prev, item.master_repair_id]); // เก็บ UUID ที่ยังไม่ได้บันทึกใน SDNList

                                newPriceState[item.master_repair_id] = item.price ?? 0;
                                newQuantityState[item.master_repair_id] = 1; // ตั้งค่าเป็น 1 ตามค่า default
                            }

                            const isChecked = !!relatedData;
                            console.log("isChecked:", isChecked);
                            return {
                                className: "",
                                cells: [
                                    {
                                        value:
                                            <Box className="w-full flex justify-center">
                                                <CheckboxMainComponent
                                                    defaultChecked={isChecked}
                                                    onChange={(checked: boolean) => {
                                                        // console.log("นี่เป็น master_repair_id ที่กำลังเลือก", item.master_repair.master_repair_id, checked);
                                                        handleCheckboxChange(checked, item.master_repair.master_repair_id, relatedData?.supplier_delivery_note_repair_receipt_list_id);
                                                    }}
                                                />
                                            </Box>
                                        , className: "text-center w-1/12",
                                    },
                                    {
                                        value: item.master_repair.master_repair_name || "-",
                                        className: "text-left w-5/12",
                                    },
                                    {
                                        value:
                                            <Box className="w-full flex justify-center">
                                                    <InputAction
                                                        value={priceState[item.master_repair_id] !== undefined ? String(priceState[item.master_repair_id]) : String(item.price)}
                                                        // value={priceState[item.master_repair_id] !== undefined ? String(priceState[item.master_repair_id]) : String(item.price)}
                                                        onChange={(e) => {
                                                            const newValue = Number(e.target.value); // แปลงค่าจาก string เป็น number
                                                            console.log("ค่าที่พิมพ์:", item.master_repair_id, newValue); // ตรวจสอบค่าที่พิมพ์
                                                            handlePriceChange(item.master_repair_id, newValue);
                                                        }}
                                                    />  

                                                {/* <InputAction
                                                    value={priceState[repairId] !== undefined ? priceState[repairId] : item.price}
                                                    placeholder="ราคา"
                                                    classNameInput="text-right pr-2"
                                                    onChange={(e) => handlePriceChange(repairId, Number(e.target.value))}
                                                    onBlur={() => saveDataToDatabase(repairId)}  // บันทึกเมื่อออกจากช่อง
                                                /> */}
                                            </Box>
                                        ,
                                        className: "text-right w-2/12",
                                    },
                                    {
                                        value:
                                            <Box className="w-full flex justify-center">
                                                <InputAction
                                                    value={String(itquantity)}
                                                    placeholder="จำนวน"
                                                    classNameInput="text-center "
                                                    onChange={(e) => setPrice(Number(e.target.value))}
                                                />
                                            </Box>
                                        ,
                                        className: "text-right w-2/12",
                                    },

                                    {
                                        // value: (item.price * itquantity).toFixed(2) || "-", // รวมราคา (ราคา * จำนวน)
                                        value: total.toFixed(2) || "-", // รวมราคา (ราคา * จำนวน)
                                        className: "text-right w-2/12",
                                    },
                                ],
                            };
                        });
                        // setPriceState(newPriceState);
                        // setQuantityState(newQuantityState);

                        setExistingIds(newExistingIds);
                        setExistingSDNListIds(newExistingSDNListIds);
                        setNewIds(newNewIds);
                        setData(formattedData);
                    });
                })
                .catch((error) => {
                    console.error("Error fetching data:", error);
                });
        }
    };
    useEffect(() => {
        setTotal(price * itquantity);
    }, [price, itquantity]);
    const handlePriceChange = (repairId: string, newValue: number) => {
        console.log(`repairId: ${repairId}, ก่อนอัปเดต: ${priceState[repairId]}`);

        setPriceState((prev) => {
            const updatedState = {
                ...prev,
                [repairId]: newValue
            };
            return updatedState;
        });

        // ตรวจสอบค่าหลัง State อัปเดต (Async)
        // setTimeout(() => {
        //     console.log(`repairId: ${repairId}, ตรวจสอบค่าล่าสุด: ${priceState[repairId]}`);
        // }, 100);
    };

    const saveDataToDatabase = (repairId: string) => {
        const price = priceState[repairId] ?? 0;
        console.log(`Saving price ${price} for repairId ${repairId}`);
        // เรียก API หรือบันทึกข้อมูลลงฐานข้อมูลที่นี่
    };

    useEffect(() => {
        console.log("ค่าปัจจุบันของ newIds:", newIds);
    }, [newIds]);
    useEffect(() => {
        console.log("ค่าปัจจุบันของ existingIds:", existingIds);
    }, [existingIds]);
    const handleCheckboxChange = (checked: boolean, masterRepairId: string, item: any) => {
        if (checked) {
            //เอาไปสร้างรายการใหม่
            setNewIds((prev) => prev.includes(masterRepairId) ? prev : [...prev, masterRepairId]);
            //เอา ms repair id ไปอัพเดท
            setExistingIds((prev) => prev.filter(id => id !== masterRepairId));
            setExistingSDNListIds((prev) => prev.includes(item) ? prev : [...prev, item]);
        } else {
            setNewIds((prev) => prev.filter(id => id !== masterRepairId));
            if (item !== undefined) {
                setHaveSDNListId(item);
                setIsConfirmDeleteDialogOpen(true);
            }
        }
    };
    const onSubmit = async () => {
        if (!sndId) {
            console.error("Supplier delivery note ID is required.");
            return;
        }
        if (!selectedOption) {
            showToast("กรุณาเลือกใบรับซ่อมและรายการซ่อมที่ต้องการ", false);
            return;
        }
        if (newIds.length === 0 && existingIds.length === 0) {
            showToast("กรุณาเลือกรายการซ่อม", false);
            return;
        }
        try {
            if (newIds.length > 0) {
                const createPayloads = newIds.map((masterRepairId) => ({
                    supplier_delivery_note_id: sndId || "",
                    repair_receipt_id: selectedOption || "",
                    master_repair_id: masterRepairId,
                    price: price || 0,
                    quantity: itquantity || 0,
                    total_price: (price) * (itquantity),
                    status: "pending",
                }));
                await Promise.all(createPayloads.map(payload => createSupplierDeliveryNoteList(payload)));
                fetchData();
            }
            if (existingSDNListIds.length > 0 && existingSDNListIds.length === existingIds.length) {
                const updatePayloads = existingIds.map((masterRepairId, index) => ({
                    supplier_delivery_note_repair_receipt_list_id: existingSDNListIds[index], // ดึงค่าไอดีที่ตรงกัน
                    supplier_delivery_note_id: sndId || "",
                    repair_receipt_id: selectedOption || "",
                    master_repair_id: masterRepairId,
                    price: price || 0,
                    quantity: itquantity || 0,
                    total_price: (price) * (itquantity),
                    status: "pending",
                }));
                await Promise.all(updatePayloads.map(payload => updateSupplierDeliveryNoteList(payload)));
                fetchData();
            }
            showToast("บันทึกข้อมูลเรียบร้อย", true);
        } catch (error) {
            showToast("เกิดข้อผิดพลาด กรุณาลองใหม่", false);
        }
    };
    const handleCancelDelete = () => {
        setIsConfirmDeleteDialogOpen(false);
        fetchData();

    };
    const handleConfirmDelete = () => {
        try {
            deleteSupplierDeliveryNoteList(haveSDNListId).then(() => {
                setIsConfirmDeleteDialogOpen(false);
                showToast("ลบรายการส่งซัพพลายเออร์เรียบร้อยแล้ว", true);
                fetchData();
                setExistingIds((prevSelected) =>
                    prevSelected.filter(id => id !== haveSDNListId)
                );
            })
        } catch (error) {
            console.error("Error:", error);
            showToast("เกิดข้อผิดพลาด", false);
            fetchData();
        }
    };
    // useEffect(() => {
    //     const total = data.reduce((sum, row) => {
    //         const quantityCell = row.cells[4];
    //         return sum + (quantityCell && !isNaN(parseFloat(quantityCell.value)) ? parseFloat(quantityCell.value) : 0);
    //     }, 0); 

    //     setRowTotal(total);
    // }, [data]);
    // useEffect(() => {
    //     const quantityTotal = data.reduce((total, row) => {
    //         const quantityCell = row.cells[3];
    //         return total + (quantityCell && !isNaN(parseFloat(quantityCell.value)) ? parseFloat(quantityCell.value) : 0);
    //     }, 0);

    //     const amountTotal = data.reduce((total, row) => {
    //         const quantityCell = row.cells[4];
    //         return total + (quantityCell && !isNaN(parseFloat(quantityCell.value)) ? parseFloat(quantityCell.value) : 0);
    //     }, 0);

    //     setTotalQuantity(quantityTotal);
    //     setTotalAmount(amountTotal);
    // }, [data]);
    useEffect(() => {
        if (selectedOption) {
            fetchData();
        } else {
            setData([]);
        }

    }, [selectedOption]);
    const fetchMSSupplierById = () => {
        if (sndId) {
            getSupplierDeliveryNoteById(sndId)
                .then((res) => {
                    if (res.responseObject) {
                        const supplier = res.responseObject;
                        // console.log("res", supplier);
                        setSuplierData(supplier);
                        setValue("supplier_delivery_note_doc", supplier.supplier_delivery_note_doc ?? "");
                    } else {
                        console.error("No responseObject found in response:", res);
                    }
                })
                .catch((err) => {
                    showToast("Error fetching supplier: " + err.message, false);
                    console.error("Error fetching supplier by ID:", err);
                });
        }
    };
    useEffect(() => {
        fetchMSSupplierById();
    }, []);
    const headers = [
        { label: "เลือก", colSpan: 1, className: "w-1/12" },
        { label: "รายการซ่อม", colSpan: 1, className: "w-5/12" },
        { label: "ราคา", colSpan: 1, className: "w-2/12" },
        { label: "จำนวน", colSpan: 1, className: "w-2/12" },
        { label: "รวม", colSpan: 1, className: "w-2/12" },
    ];
    // console.log(errors);
    return (
        <Box className="w-full mt-4 bg-white border-0 rounded-md relative overflow-visible p-6">
            <Flex className="w-full " gap="2" wrap="wrap">
                <InputAction
                    placeholder={"เลขที่ใบส่งซับพลายเออร์"}
                    label="เลขที่ใบส่งซับพลายเออร์"
                    value={watch("supplier_delivery_note_doc") as string}
                    onChange={(event) => console.log(event.target.value)}
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
                    {data.length > 0 ? (
                        <>
                            {data.map((row, rowIndex) => (
                                <Table.Row
                                    key={rowIndex}
                                    className={`hover:bg-gray-100 ${row.className || ""}`}
                                >
                                    {row.cells.map((cell: any, cellIndex: number) => (
                                        <Table.Cell
                                            key={cellIndex}
                                            className={cell.className}
                                        >
                                            {cell.value}
                                        </Table.Cell>
                                    ))}
                                </Table.Row>
                            ))}
                            {/* แถวสำหรับแสดง จำนวน + ราคารวม */}
                            <Table.Row className="bg-gray-200 font-bold">
                                <Table.Cell colSpan={3} className="text-center"></Table.Cell>
                                <Table.Cell className="text-center">
                                    {totalQuantity.toLocaleString("th-TH")}
                                </Table.Cell>
                                <Table.Cell className="text-right">
                                    {totalAmount.toFixed(2)
                                        // .toLocaleString("th-TH")
                                    }
                                </Table.Cell>
                            </Table.Row>
                        </>
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
            {/* ลบ */}
            <DialogComponent
                isOpen={isConfirmDeleteDialogOpen}
                onClose={handleCancelDelete}
                title="ยืนยันการลบ"
                onConfirm={handleConfirmDelete}
                confirmText="ยืนยัน"
                cancelText="ยกเลิก"
            >
                <p>
                    คุณแน่ใจหรือไม่ว่าต้องการลบรายการซ่อมนี้? <br />
                    {/* ใบรับซ่อม :{" "}
                    <span className="text-red-500">
                        {watch("supplier_delivery_note_doc")} <br />
                    </span> */}
                    ใบรับซ่อม :{" "}
                    <span className="text-red-500">
                        {optionName} <br />
                    </span>
                    รายการซ่อม :{" "}
                    <span className="text-red-500">
                        {msRepairName}
                    </span>
                </p>
            </DialogComponent>
        </Box >
    );
}
