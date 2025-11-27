import { Flex, Grid, Text } from "@radix-ui/themes";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CreateSupplierDeliveryNoteSchema } from "@/features/supplier-delivery-note/schemas/SupplierDeliveryNoteCreate";
import InputDatePicker from "@/components/customs/input/input.datePicker";
import InputAction from "@/components/customs/input/input.main.component";
import InputTextareaFormManage from "@/components/customs/input/inputTextareaFormManage";
import Buttons from "@/components/customs/button/button.main.component";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getSupplierDeliveryNoteById, updateSupplierDeliveryNote, deleteSupplierDeliveryNote } from "@/services/supplier-delivery-note.service."
import { BoxLoadingData } from "@/components/customs/boxLoading/BoxLoadingData";
import dayjs from "dayjs";
import { useToast } from "@/components/customs/alert/toast.main.component";
import DialogComponent from "@/components/customs/dialog/dialog.main.component";
import { useNavigate } from "react-router-dom";
import { TypeSupplierDeliveryNote } from "@/types/response/response.supplier-delivery-note";
import { PayLoadCreatSupplierDeliveryNote } from "@/types/requests/request.supplier-delivery-note";
import { useSearchParams } from "react-router-dom";


export default function SupplierDeliveryNoteCreateFeatures() {
    const [supplierData, setSuplierData] = useState<TypeSupplierDeliveryNote>();
    const { showToast } = useToast();
    const navigate = useNavigate();
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState<boolean>(false);
    const { sndId } = useParams();

    const disableField =
        supplierData?.status === "success";

    const {
        handleSubmit,
        formState: { errors },
        watch,
        setValue,
        register,
        control,
    } = useForm<PayLoadCreatSupplierDeliveryNote>({
        resolver: zodResolver(CreateSupplierDeliveryNoteSchema), // ใช้ schema ตรวจสอบ
        defaultValues: {
            payment_terms: "เงินสด", // ค่าเริ่มต้น
            payment_terms_day: 0,

        },
    });
    const onSubmitHandler = async (payload: PayLoadCreatSupplierDeliveryNote) => {
        
        if (!sndId) {
            showToast("บันทึกข้อมูลร้านค้าไม่สำเร็จ: ไม่มีรหัสร้านค้า", false);
            return;
        }
        
        updateSupplierDeliveryNote({
            supplier_delivery_note_id: sndId,
            supplier_id: payload.supplier_id ?? "",
            supplier_delivery_note_doc: payload.supplier_delivery_note_doc ?? "",
            date_of_submission: payload.date_of_submission ?? undefined,
            due_date: payload.due_date ?? undefined,
            status: payload.status ?? "ยังไม่ส่ง",
            contact_name: payload.contact_name ?? "",
            contact_number: payload.contact_number ?? "",
            addr_number: payload.addr_number ?? "",
            addr_alley: payload.addr_alley ?? "",
            addr_street: payload.addr_street ?? "",
            addr_subdistrict: payload.addr_subdistrict ?? "",
            addr_district: payload.addr_district ?? "",
            addr_province: payload.addr_province ?? "",
            addr_postcode: payload.addr_postcode ?? "",
            payment_terms: payload.payment_terms ?? "เงินสด",
            payment_terms_day: payload.payment_terms_day ?? 0,
            remark: payload.remark ?? "",
        })
            .then(() => {
                showToast("บันทึกข้อมูลร้านค้าสำเร็จ", true);
                fetchMSSupplierById();
                // handleClickToNavigate();
            })
            .catch(() => {
                showToast("บันทึกข้อมูลร้านค้าไม่สำเร็จ", false);
            });
    };


    const fetchMSSupplierById = () => {
        if (sndId) {
            getSupplierDeliveryNoteById(sndId)
                .then((res) => {
                    if (res.responseObject) {
                        const supplier = res.responseObject;
                        setSuplierData(supplier);
                        setValue("supplier_id", supplier.master_supplier?.supplier_id ?? "");
                        setValue("supplier_delivery_note_doc", supplier.supplier_delivery_note_doc ?? "");
                        setValue("supplier_code", supplier.master_supplier?.supplier_code ?? "");
                        setValue("status", supplier.status ?? "ยังไม่ส่ง");
                        setValue("contact_name", supplier.contact_name ?? "");
                        setValue("contact_number", supplier.contact_number ?? "");
                        setValue("addr_number", supplier.addr_number ?? "");
                        setValue("addr_alley", supplier.addr_alley ?? "");
                        setValue("addr_street", supplier.addr_street ?? "");
                        setValue("addr_subdistrict", supplier.addr_subdistrict ?? "");
                        setValue("addr_district", supplier.addr_district ?? "");
                        setValue("addr_province", supplier.addr_province ?? "");
                        setValue("addr_postcode", supplier.addr_postcode ?? "");
                        setValue("payment_terms", supplier.payment_terms ?? "เงินสด");
                        setValue("payment_terms_day", supplier.payment_terms_day ?? 0);
                        setValue("remark", supplier.remark ?? "");
                        setValue(
                            "due_date",
                            supplier.due_date
                                ? dayjs(supplier.due_date).format('YYYY-MM-DD')  // แปลงเป็น string
                                // : dayjs().format('YYYY-MM-DD')  // แปลงวันที่ปัจจุบันเป็น string
                                : undefined
                        );
                        setValue(
                            "date_of_submission",
                            supplier.date_of_submission
                                ? dayjs(supplier.date_of_submission).format('YYYY-MM-DD')  // แปลงเป็น string
                                // : dayjs().format('YYYY-MM-DD')  // แปลงวันที่ปัจจุบันเป็น string
                                : undefined

                        );

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




    const handleDeleteConfirm = async () => {
        if (!sndId) {
            showToast("กรุณาระบุรายการร้านค้าที่ต้องการลบ", false);
            return;
        }
        try {

            const response = await deleteSupplierDeliveryNote(sndId);

            if (response.statusCode === 200) {
                showToast("ลบรายการใบส่งซัพพลายเออร์เรียบร้อยแล้ว", true);
                setIsDeleteDialogOpen(false);  // ปิด Dialog ลบ
                fetchMSSupplierById();
                handleClickToNavigate();
            } else if (response.message === "supplier delevery note list have in supplier delevery note") {
                showToast("ไม่สามารถลบรายการนี้ได้ มีรายการซ่อมอยู่ในใบส่งซัพพลายเออร์นี้", false);
            } else if (response.message === "supplier delevery note  have in supplier repair receipt") {
                showToast("ไม่สามารถลบรายการนี้ได้ ใบส่งซัพพลายเออร์นี้มีอยู่ในใบรับซ่อมซับพลายเออร์", false);
            } else {
                showToast("ไม่สามารถลบรายการใบส่งซัพพลายเออร์ได้", false);
            }
        } catch (error) {
            showToast("ไม่สามารถลบรายการใบส่งซัพพลายเออร์ได้", false);
        }
    };

    useEffect(() => {
        if (sndId) {
            fetchMSSupplierById();
        }
    }, [sndId]);
    const handleDeleteClose = () => {
        setIsDeleteDialogOpen(false);
    };
    const handleDeleteOpen = () => {
        // setCreateMasterSupplierCodeName("");
        setIsDeleteDialogOpen(true);
    };
    const handleClickToNavigate = () => {
        // setSearchParams({ tab: "home" });
        navigate("/supplier-delivery-note");
    };

    const paymentTermsDay = watch("payment_terms_day") ?? 0;

    // ใช้ useEffect เพื่อตรวจสอบ payment_terms_day
    useEffect(() => {

        if (paymentTermsDay > 0) {
            setValue("payment_terms", "เครดิต");
        }
    }, [paymentTermsDay, setValue]);

    return (
        <>
            <form onSubmit={handleSubmit(onSubmitHandler, (errors) => {
    console.log("Form validation errors", errors);
  })}
                className="flex flex-col gap-3 w-full mt-4 bg-white rounded-md p-6"
            >
                {!supplierData ? (
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
                                id={"เลขที่ใบส่งซับพลายเออร์"}
                                label="เลขที่ใบส่งซับพลายเออร์"
                                defaultValue={watch("supplier_delivery_note_doc") ? watch("supplier_delivery_note_doc") : ""}
                                placeholder="เลขที่ใบส่งซับพลายเออร์"
                                value={watch("supplier_delivery_note_doc") ?? ""}
                                classNameInput="w-full"
                                onChange={(e) => { setValue("supplier_delivery_note_doc", e.target.value) }}
                                size="2"
                                disabled
                            />
                            <InputAction
                                id={"รหัสร้านค้า"}
                                label="รหัสร้านค้า"
                                placeholder={supplierData.master_supplier?.supplier_code ? supplierData.master_supplier.supplier_code : "-"}
                                defaultValue={supplierData?.master_supplier?.supplier_code ? supplierData.master_supplier.supplier_code : ""}
                                value={supplierData?.master_supplier?.supplier_code ?? ""}
                                className="col-span-2"
                                size="2"
                                disabled={true}
                            />
                        </Grid>
                        <Grid
                            columns={{ initial: "1", md: "2", sm: "3", lg: "3", xl: "3" }}
                            gap="3"
                            rows="repeat(2, auto)"
                            width="auto"
                        >
                            <InputDatePicker
                                id="วันที่ส่งซับพลายเออร์"
                                labelName={"วันที่ส่งซับพลายเออร์"}
                                onchange={(date) =>
                                    date &&
                                    setValue("date_of_submission", dayjs(date).format("YYYY-MM-DD"))
                                } defaultDate={watch("date_of_submission") ? dayjs(watch("date_of_submission")).toDate() : undefined}  // แปลงเป็น Date
                                disabled={disableField}
                                nextFields={{down: "วันที่ครบกำหนด"}}
                            />

                            <InputDatePicker
                                id="วันที่ครบกำหนด"
                                labelName={"วันที่ครบกำหนด"}
                                onchange={(date) =>
                                    date &&
                                    setValue("due_date", dayjs(date).format("YYYY-MM-DD"))
                                } defaultDate={watch("due_date") ? dayjs(watch("due_date")).toDate() : undefined}  // แปลงเป็น Date
                                disabled={disableField}
                                nextFields={{up: "วันที่ส่งซับพลายเออร์",down: "addr_number"}}
                            />
                        </Grid>

                        <Grid
                            columns={{ initial: "1", md: "2", sm: "2", lg: "4", xl: "4" }}
                            gap="3"
                            rows="repeat(2, auto)"
                            width="auto"
                        >
                            <InputAction
                                id="addr_number"
                                label="ที่อยู่ เลขที่"
                                placeholder="เลขที่"
                                defaultValue={watch("addr_number") ? watch("addr_number") : ""}
                                value={watch("addr_number") ?? ""}
                                classNameInput="w-full"
                                onChange={(e) => { setValue("addr_number", e.target.value) }}
                                size="2"
                                disabled={disableField}
                                nextFields={{up: "วันที่ครบกำหนด",down: "addr_alley"}}
                            />
                            <InputAction
                                id="addr_alley"
                                label="ซอย"
                                placeholder="ซอย"
                                defaultValue={watch("addr_alley") ? watch("addr_alley") : ""}
                                // placeholder={watch("addr_alley") === "" ? "ซอย" : watch("addr_alley")}
                                value={watch("addr_alley") ?? ""}
                                classNameInput="w-full"
                                onChange={(e) => { setValue("addr_alley", e.target.value) }}
                                size="2"
                                disabled={disableField}
                                nextFields={{up: "addr_number" , down: "addr_street"}}
                            />
                            <InputAction
                                id="addr_street"
                                label="ถนน"
                                placeholder="ถนน"
                                defaultValue={watch("addr_street") ? watch("addr_street") : ""}
                                // placeholder={watch("addr_street") === "" ? "ถนน" : watch("addr_street")}
                                value={watch("addr_street") ?? ""}
                                classNameInput="w-full"
                                onChange={(e) => { setValue("addr_street", e.target.value) }}
                                size="2"
                                disabled={disableField}
                                nextFields={{up: "addr_alley" , down: "addr_subdistrict"}}
                            />
                            <InputAction
                                id="addr_subdistrict"
                                label="ตําบล/แขวง"
                                placeholder="ตําบล/แขวง"
                                defaultValue={watch("addr_subdistrict") ? watch("addr_subdistrict") : ""}
                                // placeholder={watch("addr_subdistrict") === "" ? "ตําบล/แขวง" : watch("addr_subdistrict")}
                                value={watch("addr_subdistrict") ?? ""}
                                classNameInput="w-full"
                                onChange={(e) => { setValue("addr_subdistrict", e.target.value) }}
                                size="2"
                                disabled={disableField}
                                nextFields={{up: "addr_street" , down: "addr_district"}}
                            />
                        </Grid>
                        <Grid
                            columns={{ initial: "1", md: "2", sm: "2", lg: "4", xl: "4" }}
                            gap="3"
                            rows="repeat(2, auto)"

                            width="auto"
                        >
                            <InputAction
                                id="addr_district"
                                label="อําเภอ/เขต"
                                placeholder="อําเภอ/เขต"
                                defaultValue={watch("addr_district") ? watch("addr_district") : ""}
                                // placeholder={watch("addr_district") === "" ? "อําเภอ/เขต" : watch("addr_district")}
                                value={watch("addr_district") ?? ""}
                                classNameInput="w-full"
                                onChange={(e) => { setValue("addr_district", e.target.value) }}
                                size="2"
                                disabled={disableField}
                                nextFields={{up: "addr_subdistrict" , down: "addr_province"}}
                            />
                            <InputAction
                                id="addr_province"
                                label="จังหวัด"
                                placeholder="จังหวัด"
                                defaultValue={watch("addr_province") ? watch("addr_province") : ""}
                                // placeholder={watch("addr_province") === "" ? "จังหวัด" : watch("addr_province")}
                                value={watch("addr_province") ?? ""}
                                classNameInput="w-full"
                                onChange={(e) => { setValue("addr_province", e.target.value) }}
                                size="2"
                                disabled={disableField}
                                nextFields={{up: "addr_district" , down: "addr_postcode"}}
                            />
                            <InputAction
                                id="addr_postcode"
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
                                disabled={disableField}
                                nextFields={{up: "addr_province" , down: "contact_name"}}
                            />
                        </Grid>
                        <Grid
                            columns={{ initial: "1", md: "2", sm: "2", lg: "3", xl: "3" }}
                            gap="3"
                            rows="repeat(2, auto)"
                            width="auto"
                        >
                            <InputAction
                                id="contact_name"
                                label="ชื่อผู้ติดต่อ"
                                defaultValue={watch("contact_name") ? watch("contact_name") : ""}
                                placeholder="ชื่อผู้ติดต่อ"
                                value={watch("contact_name") ?? ""}
                                classNameInput="w-full"
                                onChange={(e) => { setValue("contact_name", e.target.value) }}
                                size="2"
                                require="true"
                                disabled={disableField}
                                errorMessage={errors.contact_name?.message}
                                nextFields={{up: "addr_number" , down: "contact_number"}}
                            />
                            <InputAction
                                id="contact_number"
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
                                disabled={disableField}
                                errorMessage={errors.contact_number?.message}
                                nextFields={{up: "contact_name" , down: "text"}}
                            />
                        </Grid>
                        <Grid
                            columns={{
                                initial: "1", md: "repeat(8, auto)", sm: "repeat(8, auto)", lg: "repeat(8, auto)", xl: "repeat(8, auto)"
                                // \md: "repeat(8, auto)", // หน้าจอขนาดกลางขึ้นไป: 8 คอลัมน์
                            }}
                            rows="repeat( auto)"

                            gap="3" // ระยะห่างระหว่างแต่ละคอลัมน์
                            className="items-center"
                            width="100%"
                        >
                            {/* เงื่อนไขการชำระเงิน */}
                            <Text>เงื่อนไขการชำระเงิน</Text>

                            {/* เงินสด */}
                            <div className="flex items-center space-x-2 w-full">
                                <input
                                    type="radio"
                                    value="เงินสด"
                                    className="rounded"
                                    checked={watch("payment_terms") === "เงินสด"}
                                    {...register("payment_terms")}
                                    onChange={() => {
                                        setValue("payment_terms", "เงินสด");
                                        setValue("payment_terms_day", 0); // ตั้งค่าให้ว่างเมื่อเลือก "เงินสด"
                                    }}
                                    disabled={disableField}
                                />
                                <span>เงินสด</span>
                            </div>

                            {/* เครดิต */}
                            <div className="flex items-center space-x-2 w-full">
                                <input
                                    type="radio"
                                    value="เครดิต"
                                    className="rounded"
                                    checked={watch("payment_terms") === "เครดิต"}
                                    {...register("payment_terms")}
                                    onChange={() => {
                                        setValue("payment_terms", "เครดิต");
                                        setValue("payment_terms_day", 1); // ตั้งค่าเริ่มต้นเป็น 1 วันเมื่อเลือก "เครดิต"
                                    }}
                                    disabled={disableField}
                                />
                                <span>เครดิต</span>

                                <Controller
                                    name="payment_terms_day"
                                    control={control}
                                    render={({ field }) => (
                                        <input
                                            type="number"
                                            placeholder={
                                                watch("payment_terms") === "เงินสด" || !field.value
                                                    ? "จำนวนวัน"
                                                    : String(field.value)
                                            }
                                            value={
                                                watch("payment_terms") === "เงินสด" ? "" : field.value ?? 0 // กำหนดค่าให้เหมาะสม
                                            }
                                            onChange={(e) => {
                                                const value = e.target.value.replace(/\D/g, ""); // กรองเฉพาะตัวเลข
                                                const numericValue = value ? Number(value) : 0;
                                                if (numericValue <= 366) {
                                                    field.onChange(numericValue);
                                                } else {
                                                    field.onChange(366);
                                                }
                                            }}
                                            disabled={watch("payment_terms") === "เงินสด" || disableField}
                                            className="border w-24 p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent rounded-sm"
                                        />
                                    )}
                                />

                                <span>วัน</span>
                            </div>



                        </Grid>
                        <InputTextareaFormManage
                            id="text"
                            name={"หมายเหตุ"}
                            placeholder="หมายเหตุ"
                            register={{ ...register("remark") }}
                            // msgError={errors.remark?.message}
                            showLabel
                            disabled={disableField}
                            nextFields={{up: "contact_number" , down: "del"}}
                        />

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
                                รหัสร้านค้า <span className="text-red-500">{supplierData?.supplier_delivery_note_doc || "-"}</span>
                                <br />
                                ชื่อร้านค้า <span className="text-red-500">{supplierData?.master_supplier?.supplier_code || "-"}</span>
                                <br />
                                ประเภทกิจการ <span className="text-red-500">{supplierData?.contact_name || "-"}</span>
                            </p>
                        </DialogComponent>

                        {supplierData.status !== "success" && (
                            <Flex
                                gap="4"
                                justify="end"
                                className="f"
                                direction={{
                                    initial: "column",
                                    xs: "column",
                                    sm: "row",   // สำหรับขนาดหน้าจอ sm ขึ้นไปจะเป็น row
                                    md: "row",
                                    lg: "row",
                                    xl: "row",
                                }}
                            >
                                {/* ปุ่มลบข้อมูล */}
                                <Buttons
                                    id="del"
                                    type="button"
                                    btnType="delete"
                                    onClick={handleDeleteOpen}
                                    className="w-[100px] max-sm:w-full"
                                    nextFields={{up: "text" , down: "submit"}}
                                >
                                    ลบข้อมูล
                                </Buttons>

                                {/* ปุ่มบันทึกข้อมูล */}
                                <Buttons
                                    id="submit"
                                    type="submit"
                                    btnType="submit"
                                    className="w-[100px] max-sm:w-full"
                                    nextFields={{up: "del" }}
                                >
                                    บันทึกข้อมูล
                                </Buttons>
                            </Flex>
                        )}

                    </>
                )}
            </form >
        </>
    );
};
