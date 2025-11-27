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
import { createSendForAClaimList, updateSendForAClaimList, deleteSendForAClaimList, getSendForAClaimListAll, submitSendForAClaimList } from "@/services/send-for-a-claim-list.service";
import DialogComponent from "@/components/customs/dialog/dialog.main.component";
import { PayLoadCreatSendForAClaimList, PayLoadUpdateSendForAClaimList, PayloadSubmit, repairReceiptIDAndRepairIDList } from "@/types/requests/request.send-for-a-claim-list";
import InputTextareaFormManage from "@/components/customs/input/inputTextareaFormManage";
import { useNavigate } from "react-router-dom";
import { deleteSendForAClaim } from "@/services/send-for-a-claim.service";
/// disable
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
    const [data, setData] = useState<PayloadSubmit | null>(null);
    const [repairReceipt, setRepairReceipt] = useState<PayloadSubmit | null>(null);                                     // ชุดข้อมูลสำหรับสร้างรายการส่งซ่อม
    const navigate = useNavigate();


    const [sendForAClaimData, setSendForAClaimData] = useState<TypeSendForAClaimAll>();                                                                   //ข้อมูลที่จะแสดงในตาราง
    const location = useLocation();
    const SendForAClaimID = location.state?.send_for_a_claim_id;
    const { showToast } = useToast();
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState<boolean>(false);

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
                ? dayjs(response.responseObject?.due_date).format('YYYY-MM-D')
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
            setValue("remark", SFAC.remark ?? "");

            setValue("supplier_code", SFAC.master_supplier?.supplier_code ?? "");
            setValue("supplier_repair_receipt_doc", SFAC.supplier_repair_receipt?.receipt_doc ?? "");
            setValue("supplier_delivery_note_doc", SFAC.supplier_repair_receipt?.supplier_delivery_note?.supplier_delivery_note_doc ?? "");
            setValue("supplier_delivery_note_id", SFAC.supplier_repair_receipt?.supplier_delivery_note.supplier_delivery_note_id ?? "");
        } catch (error) {
            console.error("Error fetching SendForAClaim data:", error);
        }
    };

    const SDN_ID = watch("supplier_delivery_note_id");
    useEffect(() => {
        fetchSendForAClaimData();
    }, [SendForAClaimID]);

    const fetchSupplierRepairReceiptData = async () => {
        try {
            if (!sendForAClaimData?.supplier_repair_receipt_id) return;
            Promise.all([
                getSupplierRepairReceiptListBySupplierRepairReceiptID(sendForAClaimData.supplier_repair_receipt_id),
                getSendForAClaimListAll(),
            ])
                .then(([res1, res2]) => {
                    const repairReceiptList = res1.responseObject || [];
                    const sendForAClaimList = res2.responseObject || [];

                    // ฟังก์ชันค้นหาข้อมูลก่อนหน้า

                    const findPreviousItem = (supplier_delivery_note_id: string, idRepairList: string, repairReceiptId: string) =>
                        sendForAClaimList.find((prevItem: any) =>
                            prevItem.supplier_delivery_note_id === supplier_delivery_note_id &&
                            prevItem.master_repair_id === idRepairList &&
                            prevItem.repair_receipt_id === repairReceiptId
                        );
                    const formattedData: PayloadSubmit = {
                        send_for_a_claim_id: SendForAClaimID,
                        supplier_delivery_note_id: SDN_ID || "",
                        repairReceiptIDAndRepairIDList: (repairReceiptList || []).map((item: any) => {
                            const previousItem = findPreviousItem(
                                item.supplier_delivery_note_id,
                                item.master_repair_id,
                                item.repair_receipt_id
                            );

                            const disabled = previousItem
                                ? previousItem.send_for_a_claim_id !== SendForAClaimID
                                : false;

                            return {
                                disabled,
                                supplier_repair_receipt_list_id: item.id,
                                repair_receipt_id: item.repair_receipt_id,
                                master_repair_id: item.master_repair_id,
                                price: previousItem?.price ?? 0,
                                remark: previousItem?.remark ?? "",
                                checked: !!previousItem,

                                supplier_repair_receipt_doc: item?.supplier_repair_receipt?.receipt_doc ?? "",
                                supplier_delivery_doc: item?.supplier_delivery_note?.supplier_delivery_note_doc ?? "",
                                send_for_a_claim_doc: previousItem?.send_for_a_claim?.send_for_a_claim_doc ?? "",

                                master_repair_name: item?.master_repair?.master_repair_name ?? "",
                                repair_receipt_doc: item?.master_repair_receipt?.repair_receipt_doc ?? "",
                            };
                        }),

                    };
                    setData(formattedData);
                });
        } catch (error) {
            // console.error("Error fetching data:", error);
            // setData(); // ล้างข้อมูลในกรณีเกิดข้อผิดพลาด
        }
    };

    useEffect(() => {
        fetchSupplierRepairReceiptData();
    }, [sendForAClaimData?.supplier_repair_receipt_id]);

    const onSubmitHandler = async (payload: PayLoadCreatSendForAClaim) => {

        if (!SendForAClaimID) {
            showToast("ไม่สามารถสร้างรายการใบส่งเคลมได้", false);
            return;
        }
        if (!data) {
            showToast("ไม่สามารถสร้างรายการใบส่งเคลมได้", false);
            return;
        }
        const selectedItems = data.repairReceiptIDAndRepairIDList;
        const filteredItems = selectedItems.filter(item => !item.disabled);

        if (filteredItems.length === 0) {
            showToast("กรุณาเลือกอย่างน้อยหนึ่งรายการ", false);
            return;
        }
        // ตรวจสอบทุกรายการที่เลือก
        // for (const item of selectedItems) {
        //     if ((item.remark ?? "") === "" || (item.price ?? 0) === 0) {
        //         showToast("กรุณาใส่ราคาและหมายเหตุให้ครบถ้วน", false);
        //         return;
        //     }
        // }

        const PayloadSubmits: PayloadSubmit = {
            send_for_a_claim_id: SendForAClaimID,
            supplier_delivery_note_id: SDN_ID || "",
            repairReceiptIDAndRepairIDList: filteredItems.map(item => ({
                supplier_repair_receipt_list_id: item.supplier_repair_receipt_list_id,
                repair_receipt_id: item.repair_receipt_id,
                master_repair_id: item.master_repair_id,
                remark: item.remark ?? "",
                price: isNaN(item.price ?? 0) ? 0 : (item.price ?? 0),
                checked: Boolean(item.checked),
            })),
        };

        try {
            const response = await submitSendForAClaimList(PayloadSubmits);
            const count = response?.responseObject;
            if (response?.responseObject === null || response?.responseObject === undefined) {
                showToast("บันทึกข้อมูลเรียบร้อย", true);
            } else {
                showToast(`ไม่สามารถลบได้ มีรายการซ่อม ${count} รายการรับเคลมแล้ว`, false);
                fetchSupplierRepairReceiptData();
                fetchSendForAClaimData();
                setTimeout(() => {
                    window.location.reload();
                }, 2500); 
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
                remark: payload.remark ?? "",
            });
            // showToast("บันทึกข้อมูลรายการส่งเคลมเรียบร้อย", true);
            fetchSupplierRepairReceiptData();
        } catch (error: any) {
            if (error?.response?.message === "Send for a claim list have in receive for a claim") {
                showToast("ไม่สามารถลบรายการ มีรายการอยู่ใบรับเคลมแล้ว", false);
            }
            showToast("เกิดข้อผิดพลาด กรุณาลองใหม่", false);
        }
    };
    const updatePriceList = (id: string, field: "price", value: number) => {
        if (!data) return;
        const sanitizedValue = isNaN(value) || value < 0 ? 0 : value; // ตรวจสอบค่า NaN และค่าติดลบ
        const updatedList = data?.repairReceiptIDAndRepairIDList.map((item) => {
            if (item.supplier_repair_receipt_list_id === id) {
                const updatedItem = {
                    ...item,
                    [field]: sanitizedValue,
                };
                return { ...updatedItem };
            }
            return item;
        });
        setData({ ...data, repairReceiptIDAndRepairIDList: updatedList });
    };
    const updateRemarkList = (id: string, field: "remark", value: string) => {
        if (!data) return;
        const updatedList = data?.repairReceiptIDAndRepairIDList.map((item) => {
            if (item.supplier_repair_receipt_list_id === id) {
                const updatedItem = {
                    ...item,
                    [field]: value,
                };
                return { ...updatedItem };
            }
            return item;
        });
        setData({ ...data, repairReceiptIDAndRepairIDList: updatedList });
    };
    // ฟังก์ชันอัปเดตค่า status
    const updateStatus = (id: string, field: "checked", value: boolean) => {
        if (!data) return;

        const updatedList = data?.repairReceiptIDAndRepairIDList.map((item) => {
            if (item.supplier_repair_receipt_list_id === id) {
                const updatedItem = {
                    ...item,
                    [field]: value,
                };
                return { ...updatedItem };
            }
            return item;
        });

        setData({ ...data, repairReceiptIDAndRepairIDList: updatedList });
    };

    const handleDeleteOpen = () => {
        setIsDeleteDialogOpen(true);
    };

    const handleDeleteClose = () => {
        setIsDeleteDialogOpen(false);
    };

    const handleClickToNavigate = () => {
        navigate("/send-for-a-claim");
    };

    const handleDeleteConfirm = async () => {
        if (!SendForAClaimID) {
            showToast("กรุณาระบุรายการใบส่งเคลมที่ต้องการลบ", false);
            return;
        }

        try {
            const response = await deleteSendForAClaim(data?.send_for_a_claim_id ?? "");
            if (response.statusCode === 200) {
                showToast("ลบรายการใบส่งเคลมเรียบร้อยแล้ว", true);
                setIsDeleteDialogOpen(false);  // ปิด Dialog ลบ
                fetchSendForAClaimData();
                handleClickToNavigate();
            } else if (response.message === "send for a claim list have send for a claim") {
                showToast("ไม่สามารถลบรายการนี้ได้ มีรายการซ่อมอยู่ในใบส่งเคลมนี้", false);
            } else if (response.message === "send for a claim have in receive for a claim") {
                showToast("ไม่สามารถลบรายการนี้ได้ ใบส่งซัพพลายเออร์นี้มีอยู่ในใบรับเคลม", false);
            } else {
                showToast("ไม่สามารถลบรายการใบส่งซัพพลายเออร์ได้", false);
            }
        } catch (error) {
            showToast("ไม่สามารถลบรายการใบส่งซัพพลายเออร์ได้", false);
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
                                onchange={(date) =>
                                    date &&
                                    setValue("due_date", dayjs(date).format("YYYY-MM-DD"))
                                } defaultDate={watch("due_date") ? dayjs(watch("due_date")).toDate() : undefined}  // แปลงเป็น Date
                            // disabled={disableField}
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
                        <InputTextareaFormManage
                            name={"หมายเหตุ"}
                            placeholder="หมายเหตุ"
                            register={{ ...register("remark") }}
                            // msgError={errors.remark?.message}
                            showLabel

                        />
                        {/* ตาราง */}
                        <Table.Root className="mt-3 bg-[#fefffe] rounded-md overflow-hidden">
                            <Table.Header className="sticky top-0 z-0 rounded-t-md">
                                <Table.Row className="text-center bg-main text-white sticky top-0 z-10">
                                    {headers.map((header, index) => (
                                        <Table.ColumnHeaderCell
                                            key={index}
                                            colSpan={header.colSpan}
                                            className={`whitespace-nowrap ${index === 0 ? "rounded-tl-md" : ""}${index === headers.length - 1 ? "rounded-tr-md" : ""} h-7`}
                                        >
                                            {header.label}
                                        </Table.ColumnHeaderCell>
                                    ))}
                                </Table.Row>
                            </Table.Header>
                            <Table.Body>
                                {data?.repairReceiptIDAndRepairIDList.length ? (
                                    data?.repairReceiptIDAndRepairIDList.map((item, index) => (
                                        <Table.Row key={item.supplier_repair_receipt_list_id} className="hover:bg-gray-100">
                                            <Table.Cell className="text-center w-1/12">
                                                {data.repairReceiptIDAndRepairIDList.findIndex(r => r.repair_receipt_doc === item.repair_receipt_doc) === index
                                                    ? item.repair_receipt_doc || "-"
                                                    : " "}
                                            </Table.Cell>
                                            {/* รายการซ่อม */}
                                            <Table.Cell className="text-left w-2/12">{item.master_repair_name || "-"}</Table.Cell>
                                            {/* เลขใบส่งเคลม */}
                                            <Table.Cell className="text-center w-1/12">{!item.disabled ? "" : item.send_for_a_claim_doc}</Table.Cell>
                                            {/* Checkbox */}
                                            <Table.Cell className="text-center w-1/12">
                                                <Box className="w-full flex justify-center">
                                                    <CheckboxMainComponent
                                                        defaultChecked={item.checked}
                                                        onChange={(checked: boolean) => {
                                                            updateStatus(item.supplier_repair_receipt_list_id, "checked", checked);
                                                        }}
                                                        disabled={item.disabled}
                                                    />
                                                </Box>
                                            </Table.Cell>
                                            {/* หมายเหตุ */}
                                            <Table.Cell className="text-right w-3/12">
                                                <Box className="w-full flex justify-center">
                                                    <InputAction
                                                        value={item.remark || ""}
                                                        placeholder="หมายเหตุ"
                                                        onChange={(e) =>
                                                            updateRemarkList(item.supplier_repair_receipt_list_id, "remark", e.target.value)
                                                        }
                                                        classNameInput="text-left w-12/12 "
                                                        disabled={item.disabled}
                                                    />
                                                </Box>
                                            </Table.Cell>
                                            {/* ราคา */}
                                            <Table.Cell className="text-right w-2/12">
                                                <Box className="w-full flex justify-center">
                                                    <InputAction
                                                        value={String(item.price)}
                                                        onChange={(e) => updatePriceList(item.supplier_repair_receipt_list_id, "price", Number(e.target.value))}
                                                        classNameInput="text-right pr-2"
                                                        disabled={item.disabled}
                                                    />
                                                </Box>
                                            </Table.Cell>

                                        </Table.Row>
                                    ))
                                ) : (
                                    <Table.Row>
                                        <Table.Cell colSpan={headers.length} className="text-center h-64 align-middle">
                                            No Data Found
                                        </Table.Cell>
                                    </Table.Row>
                                )}
                            </Table.Body>
                        </Table.Root>
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
                                {/* รหัสร้านค้า <span className="text-red-500">{data.|| "-"}</span>
                                <br />
                                <br />
                                ประเภทกิจการ <span className="text-red-500">{supplierData?.contact_name || "-"}</span> */}
                            </p>
                        </DialogComponent>
                        {/* button */}
                        <Flex className="w-full mt-6" justify={"end"} gap="4" wrap="wrap">
                            <Buttons
                                type="button"
                                btnType="delete"
                                onClick={handleDeleteOpen}
                                className="w-[100px] max-sm:w-full"
                            >
                                ลบข้อมูล
                            </Buttons>

                            <Buttons btnType="submit"
                                className="w-[100px] max-sm:w-full mt-0">
                                บันทึกข้อมูล
                            </Buttons>

                        </Flex>

                    </>
                )}
            </form>
        </>
    );
};
export default FormCreateSendForAClaim;
