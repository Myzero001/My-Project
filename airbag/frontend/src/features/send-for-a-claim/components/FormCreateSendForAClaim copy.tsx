import React, { useState, useEffect } from "react";
import { Table, Flex, Box, Text, Grid } from "@radix-ui/themes";
import InputAction from "@/components/customs/input/input.main.component";
import { useForm } from "react-hook-form";
import { useToast } from "@/components/customs/alert/toast.main.component";
import Buttons from "@/components/customs/button/button.main.component";
import CheckboxMainComponent from "@/components/customs/checkboxs/checkbox.main.component";
import InputDatePicker from "@/components/customs/input/input.datePicker";
import { PayLoadCreatSendForAClaim } from "@/types/requests/request.send-for-a-claim"
import { CreateSendForAClaimSchema } from "@/features/send-for-a-claim/schemas/SendForAClaimCreate";
import { zodResolver } from "@hookform/resolvers/zod";
import { BoxLoadingData } from "@/components/customs/boxLoading/BoxLoadingData";
import { useLocation } from "react-router-dom";
import { getSendForAClaimById, getSupplierRepairReceiptListBySupplierRepairReceiptID, updateSendForAClaim } from "@/services/send-for-a-claim.service";
import { TypeSendForAClaimAll } from "@/types/response/response.send-for-a-claim";
import dayjs from "dayjs";
import { createSendForAClaimList, updateSendForAClaimList, deleteSendForAClaimList, getSendForAClaimListAll } from "@/services/send-for-a-claim-list.service";
import DialogComponent from "@/components/customs/dialog/dialog.main.component";
import { PayLoadCreatSendForAClaimList, PayLoadUpdateSendForAClaimList } from "@/types/requests/request.send-for-a-claim-list";
import { set } from "date-fns";
//เหลือวันที่ ช่อง รายการ    
const FormCreateSendForAClaim = () => {
    const {
        handleSubmit,
        formState: { errors },
        watch,
        setValue,
        register,
        control,
    } = useForm<PayLoadCreatSendForAClaim>({
        resolver: zodResolver(CreateSendForAClaimSchema),
        defaultValues: {

        },
    });
    const [data, setData] = useState<any[]>([]);
    const [sendForAClaimData, setSendForAClaimData] = useState<TypeSendForAClaimAll>();                                                                   //ข้อมูลที่จะแสดงในตาราง
    const location = useLocation();
    const SendForAClaimID = location.state?.send_for_a_claim_id;
    const { showToast } = useToast();

    const [priceState, setPriceState] = useState<{ [key: string]: number }>({});
    const [reMarkState, setReMarkState] = useState<{ [key: string]: string }>({});

    const [newIds, setNewIds] = useState<string[]>([]); // เก็บ UUID ที่ไม่ตรงเงื่อนไข (ยังไม่ได้บันทึก) ms_repair_id
    const [newSDNIds, setNewSDNIds] = useState<string[]>([]); // เก็บ UUID ที่ไม่ตรงเงื่อนไข (ยังไม่ได้บันทึก) 
    const [newRPIds, setNewRPIds] = useState<string[]>([]); // เก็บ UUID ที่ไม่ตรงเงื่อนไข (ยังไม่ได้บันทึก) 

    const [existingIds, setExistingIds] = useState<string[]>([]); // เก็บ UUID ที่ตรงเงื่อนไข (บันทึกแล้ว)                  ms_repair_id
    const [existingSDNListIds, setExistingSDNListIds] = useState<string[]>([]); // เก็บ UUID ที่ตรงเงื่อนไข (บันทึกแล้ว)    ที่มี ms_repair_id อยู่ใน ms_send_for_a_claim_list


    const [isConfirmDeleteDialogOpen, setIsConfirmDeleteDialogOpen] = useState(false);
    const [haveInListId, setHaveInListId] = useState("");

    //delete
    const [msRepair, setMsRepair] = useState<string[]>([])


    const headers = [
        { label: "ใบรับซ่อม", colSpan: 1, className: "w-2/12" },
        { label: "รายการซ่อม", colSpan: 1, className: "w-4/12" },
        { label: "เลขที่ใบส่งเคลม", colSpan: 1, className: "w-4/12" },
        { label: "ส่งเคลม", colSpan: 1, className: "w-1/12" },
        { label: "หมายเหตุ", colSpan: 1, className: "w-2/12" },
        { label: "ราคา", colSpan: 1, className: "w-2/12" },
    ];
    const fetchSendForAClaimData = async () => {
        if (!SendForAClaimID) return;

        try {
            const response = await getSendForAClaimById(SendForAClaimID);
            if (!response?.responseObject) return;

            const SFAC = response.responseObject;
            setSendForAClaimData(SFAC);

            setValue("send_for_a_claim_id", SFAC.send_for_a_claim_id ?? "");
            setValue("send_for_a_claim_doc", SFAC.send_for_a_claim_doc ?? "");
            setValue("supplier_repair_receipt_id", SFAC.supplier_repair_receipt_id ?? "");

            setValue("claim_date", SFAC.claim_date ? dayjs(SFAC.claim_date).format('YYYY-MM-DD') : undefined);
            setValue("due_date", response.responseObject?.due_date
                ? dayjs(response.responseObject?.due_date).format("YYYY-MM-DD")
                : undefined);

            setValue("addr_number", SFAC.addr_number ?? "");
            setValue("addr_alley", SFAC.addr_alley ?? "");
            setValue("addr_street", SFAC.addr_street ?? "");
            setValue("addr_subdistrict", SFAC.addr_subdistrict ?? "");
            setValue("addr_district", SFAC.addr_district ?? "");
            setValue("addr_province", SFAC.addr_province ?? "");
            setValue("addr_postcode", SFAC.addr_postcode ?? "");
            setValue("contact_name", SFAC.contact_name ?? "");
            setValue("contact_number", SFAC.contact_number ?? "");

            setValue("supplier_code", SFAC.master_supplier?.supplier_code ?? "");
            setValue("supplier_repair_receipt_doc", SFAC.supplier_repair_receipt?.receipt_doc ?? "");
            setValue("supplier_delivery_note_doc", SFAC.supplier_repair_receipt?.supplier_delivery_note?.supplier_delivery_note_doc ?? "");

        } catch (error) {
            console.error("Error fetching SendForAClaim data:", error);
        }
    };

    useEffect(() => {
        fetchSendForAClaimData();
    }, [SendForAClaimID]);


    const fetchSupplierRepairReceiptData = async () => {
        try {
            if (!sendForAClaimData?.supplier_repair_receipt_id) return;
            setData([]);

            const res1 = await getSupplierRepairReceiptListBySupplierRepairReceiptID(sendForAClaimData.supplier_repair_receipt_id);
            const data = res1.responseObject || [];

            const res2 = await getSendForAClaimListAll();
            const sendForAClaimList = res2.responseObject || [];

            const newPriceState: { [key: string]: number } = {};
            const newReMarkState: { [key: string]: string } = {};

            const newExistingSDNListIds: string[] = []; // ใช้สําหรับเก็บ send_for_a_claim_list_id
            const newExistingIds: string[] = [];    // ใช้สําหรับเก็บ master_repair_id ที่มีใน send_for_a_claim_list

            const newNewIds: string[] = [];     // ใช้สําหรับเก็บ master_repair_id ที่ไม่มีใน send_for_a_claim_list
            const newSNDNewIds: string[] = [];  // ใช้สําหรับเก็บ supplier_delivery_note_id ที่ไม่มีใน send_for_a_claim_list
            const newRPNewIds: string[] = [];   // ใช้สําหรับเก็บ repair_receipt_id ที่ไม่มีใน send_for_a_claim_list

            const formattedData = data.map((item: any) => {
                const relatedData = sendForAClaimList.find((sfc: any) => {
                    return (
                        sfc.supplier_delivery_note_id === item.supplier_delivery_note_id &&
                        sfc.repair_receipt_id === item.repair_receipt_id &&
                        sfc.master_repair_id === item.master_repair_id
                    );
                });


                if (relatedData) {
                    // ถ้ามี match ใน claim list
                    setMsRepair([item.master_repair.master_repair_name, item.price]);
                    newPriceState[relatedData.send_for_a_claim_list_id] = relatedData.price;
                    newReMarkState[relatedData.send_for_a_claim_list_id] = relatedData.remark;

                    newExistingSDNListIds.push(relatedData.send_for_a_claim_list_id);
                    newExistingIds.push(relatedData.master_repair_id);
                } else {
                    // ถ้าไม่มี match ให้ใช้ค่าจาก ใบรับซ่อม
                    setNewIds((prev) => prev.includes(item.master_repair_id) ? prev : [...prev, item.master_repair_id]);
                    setNewSDNIds((prev) => prev.includes(item.supplier_delivery_note_id) ? prev : [...prev, item.supplier_delivery_note_id]);
                    setNewRPIds((prev) => prev.includes(item.repair_receipt_id) ? prev : [...prev, item.repair_receipt_id]);
                    // newPriceState[item.master_repair_id] = item.price ?? 0;
                }

                const isChecked = !!relatedData;
                const haveClaimListI = sendForAClaimData.send_for_a_claim_id === relatedData?.send_for_a_claim?.send_for_a_claim_id;
                return {
                    cells: [
                        { value: item.supplier_repair_receipt.receipt_doc, className: "text-center w-1/12" },
                        { value: item.master_repair.master_repair_name, className: "text-left w-[25%]" },
                        { value: relatedData?.send_for_a_claim?.send_for_a_claim_doc, className: "text-center w-[25%]" },
                        {
                            value: (
                                <Box className="w-full flex justify-center">
                                    <CheckboxMainComponent
                                        defaultChecked={isChecked}
                                        onChange={(checked: boolean) => {  //rercidมัม      เคลมไอดี                                     snd                            rprc                           rp                      
                                            handleCheckboxChange(checked, item.id, relatedData?.send_for_a_claim_list_id, item.supplier_delivery_note_id, item.repair_receipt_id, item.master_repair_id);
                                        }}
                                    />
                                </Box>
                            ),
                            className: "text-center w-1/12",
                        },
                        {
                            value: (
                                <Box className="w-full flex justify-center">
                                    <InputAction
                                        placeholder="ระบุหมายเหตุ"
                                        classNameInput="text-left "
                                        value={reMarkState[item.master_repair_id] !== undefined
                                            ? String(reMarkState[item.master_repair_id])
                                            : relatedData?.remark !== undefined
                                                ? relatedData.remark
                                                : ""}
                                        onChange={(e) => {
                                            const newValue = e.target.value;
                                            handleRemarkChange(relatedData.remark, newValue);
                                        }}
                                    // disabled={haveClaimListI}
                                    />
                                </Box>
                            ),
                            className: "text-center w-2/12",
                        },
                        {
                            value: (
                                <Box className="w-full flex justify-center">
                                    <InputAction
                                        value={priceState[item.master_repair_id] !== undefined
                                            ? String(priceState[item.master_repair_id])
                                            : relatedData?.price !== undefined
                                                ? String(relatedData.price)
                                                : String(0)}
                                        placeholder="ราคา"
                                        classNameInput="text-right pr-2"
                                        // value={priceState[item.master_repair_id] !== undefined ? String(priceState[item.master_repair_id]) : String(item.price)}
                                        onChange={(e) => {
                                            const newValue = Number(e.target.value); // แปลงค่าจาก string เป็น number
                                            handlePriceChange(item.master_repair_id, newValue);
                                        }}
                                    // disabled={haveClaimListI}
                                    />
                                </Box>
                            ),
                            className: "text-center w-[13%]",
                        },
                    ],
                };
            });
            setExistingIds(newExistingIds);
            setExistingSDNListIds(newExistingSDNListIds);

            setNewIds(newNewIds);
            setNewRPIds(newSNDNewIds);
            setNewSDNIds(newRPNewIds);

            setData(formattedData);
        } catch (error) {
            console.error("Error fetching data:", error);
            setData([]); // Clear data in case of error
        }
    };
    const handlePriceChange = (id: string, newValue: number) => {
        setPriceState((prev) => {
            const updatedState = {
                ...prev,
                [id]: newValue
            };
            return updatedState;
        });
    }
    const handleRemarkChange = (id: string, newValue: string) => {
        setReMarkState((prev) => {
            const updatedState = {
                ...prev,
                [id]: newValue
            };
            return updatedState;
        });
    }
    const handleCheckboxChange = (checked: boolean, idItem: string, claimId: any, sdnIds: any, rprcIds: any, rpIds: any) => {
        if (checked) {
            //เอาไปสร้างรายการใหม่
            setNewIds((prev) => prev.includes(idItem) ? prev : [...prev, rpIds]);
            setNewSDNIds((prev) => prev.includes(idItem) ? prev : [...prev, sdnIds]);
            setNewRPIds((prev) => prev.includes(idItem) ? prev : [...prev, rprcIds]);
            //เอา ms repair id ไปอัพเดท
            setExistingIds((prev) => prev.filter(id => id !== idItem));
            // setExistingSDNListIds((prev) => prev.includes(claimId) ? prev : [...prev, claimId]);
        } else {
            setNewIds((prev) => prev.filter(id => id !== idItem));
            if (claimId !== undefined) {
                //ลบ
                setHaveInListId(claimId);
                setIsConfirmDeleteDialogOpen(true);
            }
        }
    };
    const handleCancelDelete = () => {
        setIsConfirmDeleteDialogOpen(false);
        fetchSupplierRepairReceiptData();

    };
    const handleConfirmDelete = () => {
        try {
            deleteSendForAClaimList(haveInListId).then(() => {
                setIsConfirmDeleteDialogOpen(false);
                showToast("ลบรายการใบส่งเคลมเรียบร้อยแล้ว", true);
                fetchSupplierRepairReceiptData();
                setExistingIds((prevSelected) =>
                    prevSelected.filter(id => id !== haveInListId)
                );
            })
        } catch (error) {
            showToast("เกิดข้อผิดพลาด", false);
            fetchSupplierRepairReceiptData();
        }
    };
    useEffect(() => {
        fetchSupplierRepairReceiptData();
    }, [sendForAClaimData?.supplier_repair_receipt_id]);

    useEffect(() => {
        // console.log("อัปเดต priceState:", priceState);
    }, [priceState]); // รันทุกครั้งที่ priceState เปลี่ยนแปลง

    const onSubmitHandler = async (payload: PayLoadCreatSendForAClaim) => {
        if (!SendForAClaimID) {
            showToast("ไม่สามารถสร้างรายการใบส่งเคลมได้", false);
            return;
        }
        if (newIds.length === 0 && existingIds.length === 0) {
            showToast("กรุณาเลือกรายการส่งเคลม", false);
            return;
        }
        try {
            if (newIds.length > 0) {
                const createPayloads: PayLoadCreatSendForAClaimList[] = newIds.map((masterRepairId, index) => ({
                    send_for_a_claim_id: SendForAClaimID || "",
                    supplier_delivery_note_id: newSDNIds[index] || "",
                    repair_receipt_id: newRPIds[index] || "",
                    master_repair_id: masterRepairId,
                    remark: reMarkState[masterRepairId] || "",
                    price: priceState[masterRepairId] || 0,
                }));
                await Promise.all(createPayloads.map(payload => createSendForAClaimList(payload)));
                fetchSupplierRepairReceiptData();
            }
            if (existingSDNListIds.length > 0 && existingSDNListIds.length === existingIds.length) {
                const updatePayloads: PayLoadUpdateSendForAClaimList[] = existingIds.map((masterRepairId, index) => ({
                    send_for_a_claim_list_id: existingSDNListIds[index],
                    remark: reMarkState[masterRepairId] || "",
                    price: priceState[masterRepairId] || 0,
                }));
                await Promise.all(updatePayloads.map(payload => updateSendForAClaimList(payload)));
                fetchSupplierRepairReceiptData();
            }
            await updateSendForAClaim({
                send_for_a_claim_id: SendForAClaimID,
                claim_date: payload.claim_date ?? undefined,
                due_date: payload.due_date ?? undefined,
                addr_number: payload.addr_number ?? "",
                addr_alley: payload.addr_alley ?? "",
                addr_street: payload.addr_street ?? "",
                addr_subdistrict: payload.addr_subdistrict ?? "",
                addr_district: payload.addr_district ?? "",
                addr_province: payload.addr_province ?? "",
                addr_postcode: payload.addr_postcode ?? "",
                contact_name: payload.contact_name ?? "",
                contact_number: payload.contact_number ?? "",
            });
            showToast("บันทึกข้อมูลรายการส่งเคลมเรียบร้อย", true);
        } catch (error) {
            showToast("เกิดข้อผิดพลาด กรุณาลองใหม่", false);
        }
    };


    return (
        <>
            <form onSubmit={handleSubmit(onSubmitHandler)}
                className="flex flex-col gap-3 w-full mt-4 bg-white rounded-md p-6"
            >
                {!data ? (
                    <BoxLoadingData minHeight="100vh" />
                ) : (
                    <>
                        <Grid
                            columns={{ initial: "1", md: "2", sm: "2", lg: "3", xl: "3" }}
                            gap="3"
                            rows="repeat(2, auto)"
                            width="auto"
                        >
                            <InputAction
                                id={"เลขที่ใบส่งเคลม"}
                                label={"เลขที่ใบส่งเคลม"}
                                placeholder={"เลขที่ใบส่งเคลม"}
                                defaultValue={sendForAClaimData?.send_for_a_claim_doc ? sendForAClaimData.send_for_a_claim_doc : ""}
                                value={sendForAClaimData?.send_for_a_claim_doc ?? ""}
                                classNameInput="w-full"
                                size="2"
                                disabled={true}
                            />
                            <InputDatePicker
                                id={"วันที่ส่งเคลม"}
                                labelName={"วันที่ส่งเคลม"}
                                // disabled={true}
                                onchange={(date) =>
                                    date &&
                                    setValue("claim_date", dayjs(date).format("YYYY-MM-DD"))
                                }
                                defaultDate={watch("claim_date") ? dayjs(watch("claim_date")).toDate() : undefined}
                            />
                            <InputDatePicker
                                id="วันที่ครบกำหนด"
                                labelName={"วันที่ครบกำหนด"}
                                onchange={(date) => {
                                    if (date) {
                                        setValue("due_date", dayjs(date).format("YYYY-MM-DD"));
                                    }
                                }}

                                defaultDate={watch("due_date") ? dayjs(watch("due_date")).toDate() : undefined}
                            />
                        </Grid>
                        <Grid
                            columns={{ initial: "1", md: "2", sm: "2", lg: "3", xl: "3" }}
                            gap="3"
                            rows="repeat(2, auto)"

                            width="auto"
                        >
                            <InputAction
                                id={"เลขที่ใบรับซ่อมซัพพลายเออร์"}
                                label={"เลขที่ใบรับซ่อมซัพพลายเออร์"}
                                placeholder={"เลขที่ใบรับซ่อมซัพพลายเออร์"}
                                defaultValue={watch("supplier_repair_receipt_doc") ? String(watch("supplier_repair_receipt_doc")) : ""}
                                value={watch("supplier_repair_receipt_doc") ? String(watch("supplier_repair_receipt_doc")) : ""}
                                classNameInput="w-full"
                                size="2"
                                disabled={true}
                            />
                            <InputAction
                                id={"เลขที่ใบส่งซัพพลายเออร์"}
                                label={"เลขที่ใบส่งซัพพลายเออร์"}
                                placeholder={"เลขที่ใบส่งซัพพลายเออร์"}
                                defaultValue={watch("supplier_delivery_note_doc") ? String(watch("supplier_delivery_note_doc")) : ""}
                                value={watch("supplier_delivery_note_doc") ? String(watch("supplier_delivery_note_doc")) : ""}
                                classNameInput="w-full"
                                size="2"
                                disabled={true}
                            />
                        </Grid>
                        <Grid
                            columns={{ initial: "1", md: "2", sm: "2", lg: "3", xl: "3" }}
                            gap="3"
                            rows="repeat(2, auto)"

                            width="auto"
                        >
                            <InputAction
                                id={"ชื่อร้านค้า"}
                                label={"ชื่อร้านค้า"}
                                placeholder={"ชื่อร้านค้า"}
                                defaultValue={watch("supplier_code") ? watch("supplier_code") : ""}
                                value={watch("supplier_code") ?? ""}
                                classNameInput="w-full"
                                size="2"
                                className="col-span-2"
                                disabled={true}
                            />

                        </Grid>
                        <Grid
                            columns={{ initial: "1", md: "2", sm: "2", lg: "4", xl: "4" }}
                            gap="3"
                            rows="repeat(2, auto)"
                            width="auto"
                        >
                            <InputAction
                                label="ที่อยู่ เลขที่"
                                placeholder="เลขที่"
                                defaultValue={watch("addr_number") ? watch("addr_number") : ""}
                                value={watch("addr_number") ?? ""}
                                classNameInput="w-full"
                                onChange={(e) => { setValue("addr_number", e.target.value) }}
                                size="2"
                            />
                            <InputAction
                                label="ซอย"
                                placeholder="ซอย"
                                defaultValue={watch("addr_alley") ? watch("addr_alley") : ""}
                                // placeholder={watch("addr_alley") === "" ? "ซอย" : watch("addr_alley")}
                                value={watch("addr_alley") ?? ""}
                                classNameInput="w-full"
                                onChange={(e) => { setValue("addr_alley", e.target.value) }}
                                size="2"
                            />
                            <InputAction
                                label="ถนน"
                                placeholder="ถนน"
                                defaultValue={watch("addr_street") ? watch("addr_street") : ""}
                                // placeholder={watch("addr_street") === "" ? "ถนน" : watch("addr_street")}
                                value={watch("addr_street") ?? ""}
                                classNameInput="w-full"
                                onChange={(e) => { setValue("addr_street", e.target.value) }}
                                size="2"
                            />
                            <InputAction
                                label="ตําบล/แขวง"
                                placeholder="ตําบล/แขวง"
                                defaultValue={watch("addr_subdistrict") ? watch("addr_subdistrict") : ""}
                                // placeholder={watch("addr_subdistrict") === "" ? "ตําบล/แขวง" : watch("addr_subdistrict")}
                                value={watch("addr_subdistrict") ?? ""}
                                classNameInput="w-full"
                                onChange={(e) => { setValue("addr_subdistrict", e.target.value) }}
                                size="2"
                            />
                        </Grid>
                        <Grid
                            columns={{ initial: "1", md: "2", sm: "2", lg: "4", xl: "4" }}
                            gap="3"
                            rows="repeat(2, auto)"

                            width="auto"
                        >
                            <InputAction
                                label="อําเภอ/เขต"
                                placeholder="อําเภอ/เขต"
                                defaultValue={watch("addr_district") ? watch("addr_district") : ""}
                                // placeholder={watch("addr_district") === "" ? "อําเภอ/เขต" : watch("addr_district")}
                                value={watch("addr_district") ?? ""}
                                classNameInput="w-full"
                                onChange={(e) => { setValue("addr_district", e.target.value) }}
                                size="2"
                            />
                            <InputAction
                                label="จังหวัด"
                                placeholder="จังหวัด"
                                defaultValue={watch("addr_province") ? watch("addr_province") : ""}
                                // placeholder={watch("addr_province") === "" ? "จังหวัด" : watch("addr_province")}
                                value={watch("addr_province") ?? ""}
                                classNameInput="w-full"
                                onChange={(e) => { setValue("addr_province", e.target.value) }}
                                size="2"
                            />
                            <InputAction
                                label="รหัสไปรษณีย์"
                                placeholder="รหัสไปรษณีย์"
                                defaultValue={watch("addr_postcode") ? watch("addr_postcode") : ""}
                                // placeholder={watch("addr_postcode") === "" ? "รหัสไปรษณีย์" : watch("addr_postcode")}
                                type="tel"
                                value={watch("addr_postcode") ?? ""}
                                classNameInput="w-full"
                                onChange={(e) => { setValue("addr_postcode", e.target.value) }}
                                size="2"
                                maxLength={5}
                            />
                        </Grid>
                        <Grid
                            columns={{ initial: "1", md: "2", sm: "2", lg: "3", xl: "3" }}
                            gap="3"
                            rows="repeat(2, auto)"
                            width="auto"
                        >
                            <InputAction
                                label="ชื่อผู้ติดต่อ"
                                defaultValue={watch("contact_name") ? watch("contact_name") : ""}
                                placeholder="ชื่อผู้ติดต่อ"
                                value={watch("contact_name") ?? ""}
                                classNameInput="w-full"
                                onChange={(e) => { setValue("contact_name", e.target.value) }}
                                size="2"
                                require="true"
                                errorMessage={errors.contact_name?.message}
                            />
                            <InputAction
                                label="เบอร์โทรติดต่อ"
                                defaultValue={watch("contact_number") ? watch("contact_number") : ""}
                                placeholder="เบอร์โทรติดต่อ"
                                value={watch("contact_number") ?? ""}
                                classNameInput="w-full"
                                onChange={(e) => { setValue("contact_number", e.target.value) }}
                                size="2"
                                require="true"
                                type="tel"
                                maxLength={10}
                                errorMessage={errors.contact_number?.message}
                            />
                        </Grid>
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
                                        {/* <Table.Row className="bg-gray-200 font-bold">
                                            <Table.Cell colSpan={3} className="text-center"></Table.Cell>
                                            <Table.Cell className="text-center">
                                                {totalQuantity.toLocaleString("th-TH")}
                                            </Table.Cell>
                                            <Table.Cell className="text-right">
                                                {totalAmount.toFixed(2)
                                                // {/* // .toLocaleString("th-TH")
                                    }
                                            </Table.Cell>
                                        </Table.Row> */}
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
                                คุณแน่ใจหรือไม่ว่าต้องการลบรายการส่งเคลมนี้? <br />
                                ใบส่งซ่อม :{" "}
                                <span className="text-red-500">
                                    {watch("supplier_delivery_note_doc")} <br />
                                </span>
                                ใบรับซ่อม :{" "}
                                <span className="text-red-500">
                                    {watch("supplier_repair_receipt_doc")} <br />
                                </span>
                                รายการซ่อม :{" "}
                                <span className="text-red-500">
                                    {msRepair[0]}<br />
                                </span> ราคา :{" "}
                                <span className="text-red-500">
                                    {msRepair[1]} </span>บาท<br />

                            </p>
                        </DialogComponent>
                    </>
                )}
            </form>
        </>
    );
};
export default FormCreateSendForAClaim;
